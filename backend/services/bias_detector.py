"""
Core bias detection engine.

Performs dataset imbalance checks, demographic parity calculations,
and computes composite fairness scores.
"""

import pandas as pd
import numpy as np
from typing import Optional


def sanitize_for_json(obj):
    """
    Recursively convert numpy types to native Python types for JSON serialisation.
    Fixes numpy.bool_, numpy.int64, numpy.float64 serialisation errors and NaN/Inf.
    """
    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(v) for v in obj]
    elif isinstance(obj, (np.bool_,)):
        return bool(obj)
    elif isinstance(obj, (np.integer,)):
        return int(obj)
    elif isinstance(obj, (np.floating,)):
        val = float(obj)
        if np.isnan(val) or np.isinf(val):
            return 0.0
        return val
    elif isinstance(obj, np.ndarray):
        return [sanitize_for_json(x) for x in obj.tolist()]
    elif isinstance(obj, float):
        if np.isnan(obj) or np.isinf(obj):
            return 0.0
        return obj
    return obj


def detect_categorical_columns(df: pd.DataFrame) -> list:
    """
    Identify categorical columns that could be sensitive attributes.
    Includes object/string columns and low-cardinality integer columns.
    """
    categorical = []
    for col in df.columns:
        if df[col].dtype == "object" or df[col].dtype.name == "category":
            categorical.append(col)
        elif df[col].dtype in ["int64", "int32", "float64"]:
            # Low cardinality numeric columns may be encoded categories
            if df[col].nunique() <= 10:
                categorical.append(col)
    return categorical


def detect_target_column(df: pd.DataFrame) -> Optional[str]:
    """
    Heuristically detect the target/outcome column.
    Looks for binary columns with common names.
    """
    target_keywords = [
        "target", "outcome", "result", "label", "class",
        "approved", "accepted", "hired", "selected", "decision",
        "default", "churn", "survived", "passed", "admitted",
    ]

    # First, look for exact keyword matches
    for col in df.columns:
        col_lower = col.lower().strip()
        if col_lower in target_keywords:
            return col

    # Then, look for columns containing keywords
    for col in df.columns:
        col_lower = col.lower().strip()
        for keyword in target_keywords:
            if keyword in col_lower:
                return col

    # Fallback: last binary column
    for col in reversed(df.columns.tolist()):
        if df[col].nunique() == 2:
            return col

    return None


def check_imbalance(df: pd.DataFrame, column: str) -> dict:
    """
    Check group distribution imbalance for a categorical column.
    Returns imbalance ratio and group counts.
    """
    value_counts = df[column].value_counts()
    total = len(df)

    # Calculate proportions
    proportions = (value_counts / total).to_dict()

    # Imbalance ratio: minority / majority
    if len(value_counts) < 2:
        return {
            "column": column,
            "imbalanced": False,
            "imbalance_ratio": 1.0,
            "group_counts": value_counts.to_dict(),
            "group_proportions": proportions,
        }

    majority = value_counts.iloc[0]
    minority = value_counts.iloc[-1]
    ratio = minority / majority if majority > 0 else 0

    return sanitize_for_json({
        "column": column,
        "imbalanced": bool(ratio < 0.4),  # Flag if minority < 40% of majority
        "imbalance_ratio": round(float(ratio), 4),
        "group_counts": {str(k): int(v) for k, v in value_counts.to_dict().items()},
        "group_proportions": {str(k): round(float(v), 4) for k, v in proportions.items()},
    })


def calculate_demographic_parity(
    df: pd.DataFrame, sensitive_col: str, target_col: str
) -> dict:
    """
    Calculate demographic parity for a sensitive attribute.

    Demographic parity measures whether the positive outcome rate
    is equal across all groups of the sensitive attribute.
    """
    try:
        # Get positive outcome rate for each group
        groups = df.groupby(sensitive_col)[target_col]

        # Handle both numeric and string target columns
        target_values = df[target_col].unique()

        if df[target_col].dtype in ["int64", "int32", "float64"]:
            # Numeric: assume 1 = positive
            positive_rates = groups.mean()
        else:
            # String: assume first value alphabetically or most common = positive
            positive_value = sorted(target_values)[0]
            positive_rates = groups.apply(
                lambda x: (x == positive_value).mean()
            )

        rates_dict = {str(k): round(v, 4) for k, v in positive_rates.items()}

        # Parity gap = max rate - min rate
        max_rate = positive_rates.max()
        min_rate = positive_rates.min()
        parity_gap = max_rate - min_rate

        return sanitize_for_json({
            "sensitive_column": sensitive_col,
            "target_column": target_col,
            "group_positive_rates": rates_dict,
            "parity_gap": round(float(parity_gap), 4),
            "has_disparity": bool(float(parity_gap) > 0.1),
            "most_favored_group": str(positive_rates.idxmax()),
            "least_favored_group": str(positive_rates.idxmin()),
        })

    except Exception as e:
        return {
            "sensitive_column": sensitive_col,
            "target_column": target_col,
            "error": str(e),
            "parity_gap": 0,
            "has_disparity": False,
        }


def calculate_fairness_score(imbalance_results: list, parity_results: list) -> int:
    """
    Calculate a composite fairness score from 0-100.

    Score breakdown:
    - 50 points from dataset balance (imbalance checks)
    - 50 points from outcome fairness (demographic parity)
    """
    # --- Balance score (0-50) ---
    if imbalance_results:
        imbalance_ratios = [r["imbalance_ratio"] for r in imbalance_results]
        avg_ratio = np.mean(imbalance_ratios)
        # Ratio of 1.0 = perfect balance = 50 points
        # Ratio of 0.0 = complete imbalance = 0 points
        balance_score = avg_ratio * 50
    else:
        balance_score = 50  # No categorical columns = assume balanced

    # --- Parity score (0-50) ---
    if parity_results:
        valid_parity = [r for r in parity_results if "error" not in r]
        if valid_parity:
            parity_gaps = [r["parity_gap"] for r in valid_parity]
            avg_gap = np.mean(parity_gaps)
            # Gap of 0.0 = perfect parity = 50 points
            # Gap of 1.0 = complete disparity = 0 points
            parity_score = (1 - avg_gap) * 50
        else:
            parity_score = 50
    else:
        parity_score = 50  # No target column = assume fair

    total = int(round(balance_score + parity_score))
    return max(0, min(100, total))


def determine_bias_level(fairness_score: int) -> str:
    """Classify bias level based on fairness score."""
    if fairness_score >= 70:
        return "Low"
    elif fairness_score >= 40:
        return "Medium"
    else:
        return "High"


def generate_explanation(
    bias_level: str,
    fairness_score: int,
    affected_features: list,
    imbalance_results: list,
    parity_results: list,
) -> str:
    """
    Generate a plain-English explanation of the bias analysis results.
    """
    explanations = []

    if bias_level == "Low":
        explanations.append(
            f"Good news! Your dataset has a fairness score of {fairness_score}/100, "
            f"indicating relatively low bias."
        )
    elif bias_level == "Medium":
        explanations.append(
            f"Your dataset has a fairness score of {fairness_score}/100, "
            f"indicating moderate bias that should be addressed."
        )
    else:
        explanations.append(
            f"Warning: Your dataset has a fairness score of {fairness_score}/100, "
            f"indicating significant bias that needs attention."
        )

    # Add imbalance details
    imbalanced_cols = [r for r in imbalance_results if r["imbalanced"]]
    if imbalanced_cols:
        cols = ", ".join([r["column"] for r in imbalanced_cols])
        explanations.append(
            f"The following features have significant group imbalances: {cols}. "
            f"This means some groups are underrepresented in your data."
        )

    # Add parity details
    disparate_cols = [
        r for r in parity_results if r.get("has_disparity", False)
    ]
    if disparate_cols:
        for r in disparate_cols:
            explanations.append(
                f"For '{r['sensitive_column']}', the group '{r.get('most_favored_group', 'N/A')}' "
                f"has a higher positive outcome rate than '{r.get('least_favored_group', 'N/A')}' "
                f"(gap: {r['parity_gap']:.1%})."
            )

    if not affected_features:
        explanations.append(
            "No significant bias was detected in the categorical features analyzed."
        )

    return " ".join(explanations)


def run_full_analysis(df: pd.DataFrame) -> dict:
    """
    Run the complete bias detection pipeline on a DataFrame.
    Returns a comprehensive analysis result.
    """
    # Step 1: Identify categorical columns
    categorical_cols = detect_categorical_columns(df)

    # Step 2: Detect target column
    target_col = detect_target_column(df)

    # Step 3: Check imbalance for each categorical column
    imbalance_results = []
    for col in categorical_cols:
        if col != target_col:  # Don't check target against itself
            result = check_imbalance(df, col)
            imbalance_results.append(result)

    # Step 4: Calculate demographic parity (if target exists)
    parity_results = []
    if target_col:
        for col in categorical_cols:
            if col != target_col:
                result = calculate_demographic_parity(df, col, target_col)
                parity_results.append(result)

    # Step 5: Identify affected features
    affected_features = list(set(
        [r["column"] for r in imbalance_results if r["imbalanced"]]
        + [r["sensitive_column"] for r in parity_results if r.get("has_disparity", False)]
    ))

    # Step 6: Calculate fairness score
    fairness_score = calculate_fairness_score(imbalance_results, parity_results)

    # Step 7: Determine bias level
    bias_level = determine_bias_level(fairness_score)

    # Step 8: Generate explanation
    explanation = generate_explanation(
        bias_level, fairness_score, affected_features,
        imbalance_results, parity_results,
    )

    return sanitize_for_json({
        "bias_level": bias_level,
        "fairness_score": fairness_score,
        "affected_features": affected_features,
        "explanation": explanation,
        "target_column": target_col,
        "categorical_columns": categorical_cols,
        "imbalance_details": imbalance_results,
        "parity_details": parity_results,
        "dataset_info": {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "column_names": list(df.columns),
        },
    })
