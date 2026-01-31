import argparse
import pandas as pd
import json
import sys
import numpy as np
import logging

logging.basicConfig(level=logging.ERROR, format='%(message)s')
logger = logging.getLogger(__name__)

def calculate_stats(data_path):
    try:
        # Try default reading
        try:
            df = pd.read_csv(data_path)
        except UnicodeDecodeError:
            # Fallback to latin1 if utf-8 fails
            df = pd.read_csv(data_path, encoding='latin1')
        except pd.errors.ParserError:
             # Fallback to python engine for smarter separator detection
            df = pd.read_csv(data_path, sep=None, engine='python')
            
    except Exception as e:
        # Return error as JSON so frontend can display it nicely
        return {"error": f"Failed to parse CSV: {str(e)}"}

    # Top-level metrics
    stats = {
        "rowCount": len(df),
        "columnCount": len(df.columns),
        "columns": []
    }

    for col in df.columns:
        col_series = df[col]
        null_count = int(col_series.isnull().sum())
        unique_count = int(col_series.nunique())
        
        col_info = {
            "name": col,
            "type": str(col_series.dtype),
            "nullPercentage": round((null_count / len(df)) * 100, 2) if len(df) > 0 else 0,
            "uniqueCount": unique_count
        }

        # Distribution logic
        # For object/categorical or low unique counts
        if col_series.dtype == 'object' or unique_count < 20:
            top_values = col_series.value_counts().head(15)
            col_info["distribution"] = {
                "labels": [str(x) for x in top_values.index],
                "values": [int(x) for x in top_values.values]
            }
        # For numerical
        elif pd.api.types.is_numeric_dtype(col_series):
            clean_series = col_series.dropna()
            if not clean_series.empty:
                col_info["stats"] = {
                    "min": float(clean_series.min()),
                    "max": float(clean_series.max()),
                    "mean": float(clean_series.mean()),
                    "median": float(clean_series.median())
                }
                # Use numpy for histogram
                hist, bins = np.histogram(clean_series, bins=10)
                col_info["distribution"] = {
                    "labels": [f"{round(bins[i], 2)}-{round(bins[i+1], 2)}" for i in range(len(hist))],
                    "values": [int(x) for x in hist]
                }

        stats["columns"].append(col_info)

    # Correlation Matrix (Numerical only)
    try:
        num_df = df.select_dtypes(include=[np.number])
        if not num_df.empty and len(num_df.columns) > 1:
            # Handle cases with no variance
            corr = num_df.corr().fillna(0).round(2)
            stats["correlation"] = {
                "columns": list(corr.columns),
                "values": corr.values.tolist()
            }
    except Exception as e:
        # Correlation failure shouldn't stop the whole report
        logger.warning(f"Correlation calculation failed: {e}")

    # Data Sampling for Scatter Plots (max 200 points)
    try:
        sample_size = min(len(df), 200)
        sample_df = df.sample(n=sample_size).fillna("null")
        stats["sample"] = sample_df.to_dict(orient='records')
    except Exception as e:
        logger.warning(f"Data sampling failed: {e}")

    # Improved role detection for BI visuals
    stats["metadata"] = {
        "datetimeCols": [c for c in df.columns if 'date' in c.lower() or 'time' in c.lower() or 'year' in c.lower()],
        "geoCols": {
            "lat": next((c for c in df.columns if c.lower() in ['lat', 'latitude']), None),
            "lng": next((c for c in df.columns if c.lower() in ['lng', 'longitude', 'long']), None),
            "city": next((c for c in df.columns if any(k in c.lower() for k in ['city', 'location', 'town', 'country', 'region', 'state', 'land'])), None)
        },
        "categoricalCols": [c for c in df.columns if df[c].dtype == 'object' or df[c].nunique() < 20],
        "numericalCols": [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
    }

    return stats

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True)
    args = parser.parse_args()
    
    result = calculate_stats(args.data)
    # Ensure only JSON is printed to stdout for Java to parse
    print(json.dumps(result))
