import argparse
import pandas as pd
import sys
import logging
from sdv.metadata import SingleTableMetadata
from sdv.single_table import CTGANSynthesizer, TVAESynthesizer, GaussianCopulaSynthesizer, CopulaGANSynthesizer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def train_model(data_path, output_path, algorithm='CTGAN', epochs=300, batch_size=500, 
                learning_rate=0.0002, discriminator_steps=1, generator_dim=None, 
                discriminator_dim=None):
    logger.info(f"Loading data from {data_path}...")
    try:
        data = pd.read_csv(data_path)
    except Exception as e:
        logger.error(f"Error reading CSV: {e}")
        sys.exit(1)

    logger.info("Detecting metadata...")
    try:
        metadata = SingleTableMetadata()
        metadata.detect_from_dataframe(data)
        
        # Privacy & PII Protection Layer
        # Rule: Replace all sensitive attributes with fully synthetic values
        pii_patterns = {
            'email': 'email',
            'mail': 'email',
            'phone': 'phone_number',
            'tel': 'phone_number',
            'ssn': 'ssn',
            'social': 'ssn',
            'card': 'credit_card_number',
            'credit': 'credit_card_number',
            'iban': 'iban',
            'address': 'address',
            'city': 'city',
            'country': 'country',
            'name': 'person_name',
            'first_name': 'first_name',
            'last_name': 'last_name',
            # CPS Specific Identifiers
            'ip_address': 'ip_address',
            'mac_address': 'mac_address',
            'gps': 'latitude',
            'lat': 'latitude',
            'lon': 'longitude',
            'uuid': 'uuid',
            'serial': 'id',
            'vin': 'id'
        }
        
        # Extended detection: Scan first few rows to detect PII even if names are obfuscated
        import re
        ip_regex = re.compile(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')
        mac_regex = re.compile(r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
        email_regex = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        
        logger.info("Applying Privacy-Safe Configuration...")
        for col in metadata.columns:
            col_lower = col.lower()
            detected_type = None
            
            # 1. Name-based detection
            for pattern, sdtype in pii_patterns.items():
                if pattern in col_lower and metadata.columns[col]['sdtype'] not in ['numerical', 'datetime']:
                    detected_type = sdtype
                    break
            
            # 2. Content-based detection (if name-based failed)
            if not detected_type and metadata.columns[col]['sdtype'] == 'categorical':
                sample_values = data[col].dropna().head(10).astype(str).tolist()
                for val in sample_values:
                    if ip_regex.match(val):
                        detected_type = 'ip_address'
                        break
                    elif mac_regex.match(val):
                        detected_type = 'mac_address'
                        break
                    elif email_regex.match(val):
                        detected_type = 'email'
                        break
            
            if detected_type:
                logger.info(f"  - Flagged '{col}' as PII ({detected_type}). Will generate fully synthetic values.")
                try:
                    metadata.update_column(column_name=col, sdtype=detected_type)
                except Exception as meta_err:
                    logger.warning(f"    Could not auto-configure PII for {col}: {meta_err}")

    except Exception as e:
        logger.error(f"Metadata detection failed: {e}")
        sys.exit(1)
    
    logger.info(f"Initializing {algorithm} model with optimized hyperparameters...")
    try:
        if algorithm == 'TVAE':
            # TVAE Hyperparameters
            model = TVAESynthesizer(
                metadata, 
                epochs=epochs,
                batch_size=batch_size,
                compress_dims=(128, 128) if not generator_dim else tuple(map(int, generator_dim.split(','))),
                decompress_dims=(128, 128) if not discriminator_dim else tuple(map(int, discriminator_dim.split(',')))
            )
        elif algorithm == 'GaussianCopula':
            # GaussianCopula doesn't use epochs
            model = GaussianCopulaSynthesizer(metadata)
        elif algorithm == 'CopulaGAN':
            # CopulaGAN Hyperparameters
            model = CopulaGANSynthesizer(
                metadata, 
                epochs=epochs,
                batch_size=batch_size,
                discriminator_steps=discriminator_steps,
                generator_lr=learning_rate,
                discriminator_lr=learning_rate
            )
        else: # CTGAN (Default)
            # CTGAN Hyperparameters - Most Important for Fine-Tuning
            model = CTGANSynthesizer(
                metadata, 
                epochs=epochs,
                batch_size=batch_size,
                discriminator_steps=discriminator_steps,
                generator_lr=learning_rate,
                discriminator_lr=learning_rate,
                generator_dim=tuple(map(int, generator_dim.split(','))) if generator_dim else (256, 256),
                discriminator_dim=tuple(map(int, discriminator_dim.split(','))) if discriminator_dim else (256, 256),
                verbose=False
            )
            
        logger.info(f"Training {algorithm} model (Epochs: {epochs}, Batch: {batch_size}, LR: {learning_rate})...")
        model.fit(data)
    except Exception as e:
        logger.error(f"Model fitting failed: {e}")
        sys.exit(1)

    logger.info(f"Saving model to {output_path}...")
    try:
        model.save(output_path)
        logger.info("Training complete and model saved.")
    except Exception as e:
        logger.error(f"Failed to save model: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train Synthetic Data Model with Hyperparameter Optimization')
    parser.add_argument('--data', required=True, help='Path to input CSV file')
    parser.add_argument('--output', required=True, help='Path to save trained model (.pkl)')
    parser.add_argument('--algorithm', default='CTGAN', choices=['CTGAN', 'TVAE', 'GaussianCopula', 'CopulaGAN'], help='Algorithm to use')
    
    # Hyperparameters for Fine-Tuning
    parser.add_argument('--epochs', type=int, default=300, help='Number of training epochs (higher = better quality, slower)')
    parser.add_argument('--batch_size', type=int, default=500, help='Batch size (lower = more stable, slower)')
    parser.add_argument('--learning_rate', type=float, default=0.0002, help='Learning rate (0.0001-0.001)')
    parser.add_argument('--discriminator_steps', type=int, default=1, help='Discriminator steps per generator step')
    parser.add_argument('--generator_dim', type=str, help='Generator dimensions (e.g., "256,256" or "512,512")')
    parser.add_argument('--discriminator_dim', type=str, help='Discriminator dimensions (e.g., "256,256")')

    args = parser.parse_args()
    train_model(
        args.data, 
        args.output, 
        args.algorithm, 
        args.epochs, 
        args.batch_size,
        args.learning_rate,
        args.discriminator_steps,
        args.generator_dim,
        args.discriminator_dim
    )
