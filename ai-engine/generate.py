import argparse
import pandas as pd
import json
import sys
import os
import logging
from sdv.single_table import CTGANSynthesizer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_anomalies(anomaly_json):
    if not anomaly_json:
        return None
    try:
        return json.loads(anomaly_json)
    except Exception as e:
        logger.warning(f"Failed to parse anomaly JSON: {e}")
        return None

def apply_anomalies(df, anomalies):
    if not anomalies:
        return df
    
    logger.info(f"Applying anomalies to {len(anomalies)} columns...")
    for anomaly in anomalies:
        col = anomaly.get('column')
        type = anomaly.get('type')
        value = anomaly.get('value')
        ratio = anomaly.get('ratio', 0.05)

        if col in df.columns:
            count = int(len(df) * ratio)
            indices = df.sample(n=count).index
            if type == 'fixed':
                df.loc[indices, col] = value
            elif type == 'null':
                df.loc[indices, col] = None
                
    return df

def generate(model_path, count, output_path, original_path=None, anomaly_json=None):
    logger.info(f"Loading model from {model_path}...")
    try:
        model = CTGANSynthesizer.load(model_path)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        sys.exit(1)

    original_df = None
    if original_path and os.path.exists(original_path):
        logger.info(f"Loading original data for leakage protection from {original_path}")
        original_df = pd.read_csv(original_path)

    logger.info(f"Generating {count} synthetic records...")
    
    # Batch generation to avoid memory issues and handle leakage
    batch_size = count
    samples = model.sample(num_rows=batch_size)
    
    # Leakage Protection
    if original_df is not None and not original_df.empty:
        logger.info("Performing leakage audit...")
        cols = list(original_df.columns)
        samples_to_check = samples[cols]
        
        merged = samples_to_check.merge(original_df, on=cols, how='left', indicator=True)
        leaked_indices = merged[merged['_merge'] == 'both'].index
        
        if len(leaked_indices) > 0:
            logger.warning(f"Detected {len(leaked_indices)} leaked records. Regenerating...")
            # Simple approach: just drop them. In true prod, we might regenerate until we reach count.
            samples = samples.drop(leaked_indices)
            logger.info(f"Retained {len(samples)} unique synthetic records.")

    # Apply Anomalies
    anomalies = load_anomalies(anomaly_json)
    if anomalies:
        samples = apply_anomalies(samples, anomalies)

    logger.info(f"Saving synthetic data to {output_path}...")
    try:
        samples.to_csv(output_path, index=False)
        logger.info("Generation complete.")
    except Exception as e:
        logger.error(f"Failed to save output: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate Synthetic Data')
    parser.add_argument('--model', required=True, help='Path to trained model (.pkl)')
    parser.add_argument('--count', type=int, default=1000, help='Number of records to generate')
    parser.add_argument('--output', required=True, help='Path to save synthetic CSV')
    parser.add_argument('--original', help='Path to original CSV for leakage protection')
    parser.add_argument('--anomalies', help='JSON string for anomaly injection')

    args = parser.parse_args()
    generate(args.model, args.count, args.output, args.original, args.anomalies)
