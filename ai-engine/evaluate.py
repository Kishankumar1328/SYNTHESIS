import argparse
import pandas as pd
import numpy as np
import json
import sys
import logging
from sdv.evaluation.single_table import evaluate_quality
from sdv.single_table import CTGANSynthesizer, TVAESynthesizer, GaussianCopulaSynthesizer, CopulaGANSynthesizer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def evaluate_model(model_path, original_data_path, sample_count=1000):
    """
    Evaluate synthetic data quality against original data.
    Returns a comprehensive quality report.
    """
    logger.info(f"Loading original data from {original_data_path}...")
    try:
        real_data = pd.read_csv(original_data_path)
    except Exception as e:
        logger.error(f"Error reading original CSV: {e}")
        sys.exit(1)

    logger.info(f"Loading model from {model_path}...")
    try:
        # Dynamically load the correct synthesizer type
        if 'tvae' in model_path.lower():
            model = TVAESynthesizer.load(model_path)
        elif 'copulagan' in model_path.lower():
            model = CopulaGANSynthesizer.load(model_path)
        elif 'gaussian' in model_path.lower():
            model = GaussianCopulaSynthesizer.load(model_path)
        else:
            model = CTGANSynthesizer.load(model_path)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        sys.exit(1)

    logger.info(f"Generating {sample_count} synthetic samples for evaluation...")
    try:
        synthetic_data = model.sample(num_rows=sample_count)
    except Exception as e:
        logger.error(f"Failed to generate samples: {e}")
        sys.exit(1)

    logger.info("Evaluating synthetic data quality...")
    try:
        # SDV's built-in quality evaluation
        quality_report = evaluate_quality(real_data, synthetic_data, model.metadata)
        
        # Extract key metrics
        overall_score = quality_report.get_score()
        column_shapes = quality_report.get_details(property_name='Column Shapes')
        column_pair_trends = quality_report.get_details(property_name='Column Pair Trends')
        
        # Custom statistical comparison
        custom_metrics = {
            "mean_absolute_error": {},
            "correlation_similarity": 0.0
        }
        
        # Compare means for numerical columns
        numerical_cols = real_data.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            if col in synthetic_data.columns:
                real_mean = real_data[col].mean()
                synth_mean = synthetic_data[col].mean()
                mae = abs(real_mean - synth_mean)
                custom_metrics["mean_absolute_error"][col] = round(mae, 4)
        
        # Correlation matrix similarity
        if len(numerical_cols) > 1:
            real_corr = real_data[numerical_cols].corr()
            synth_corr = synthetic_data[numerical_cols].corr()
            corr_diff = np.abs(real_corr - synth_corr).mean().mean()
            custom_metrics["correlation_similarity"] = round(1 - corr_diff, 4)
        
        result = {
            "overall_quality_score": round(overall_score, 4),
            "column_shapes_score": round(column_shapes['Score'].mean(), 4) if not column_shapes.empty else 0,
            "column_pair_trends_score": round(column_pair_trends['Score'].mean(), 4) if not column_pair_trends.empty else 0,
            "custom_metrics": custom_metrics,
            "sample_count": sample_count
        }
        
        logger.info(f"Evaluation complete. Overall Quality Score: {result['overall_quality_score']}")
        return result
        
    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Evaluate Synthetic Data Quality')
    parser.add_argument('--model', required=True, help='Path to trained model (.pkl)')
    parser.add_argument('--original', required=True, help='Path to original CSV data')
    parser.add_argument('--samples', type=int, default=1000, help='Number of samples to generate for evaluation')

    args = parser.parse_args()
    
    result = evaluate_model(args.model, args.original, args.samples)
    print(json.dumps(result))
