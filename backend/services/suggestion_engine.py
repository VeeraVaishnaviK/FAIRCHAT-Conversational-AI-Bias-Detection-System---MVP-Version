"""
Suggestion engine for bias mitigation.

Generates actionable, plain-English suggestions based on
bias analysis results.
"""


def generate_suggestions(analysis_result: dict) -> list:
    """
    Generate a list of actionable suggestions based on analysis results.
    Returns a list of suggestion strings.
    """
    suggestions = []
    bias_level = analysis_result.get("bias_level", "Low")
    imbalance_details = analysis_result.get("imbalance_details", [])
    parity_details = analysis_result.get("parity_details", [])
    affected_features = analysis_result.get("affected_features", [])

    # --- Imbalance-based suggestions ---
    imbalanced_cols = [r for r in imbalance_details if r.get("imbalanced")]

    for col_info in imbalanced_cols:
        col = col_info["column"]
        ratio = col_info["imbalance_ratio"]
        counts = col_info.get("group_counts", {})

        if ratio < 0.2:
            # Severe imbalance
            suggestions.append(
                f"🔴 **Severe imbalance in '{col}'**: The minority group is severely "
                f"underrepresented (ratio: {ratio:.2f}). Consider collecting more data "
                f"for underrepresented groups, or apply SMOTE (Synthetic Minority "
                f"Oversampling) to balance the dataset."
            )
        else:
            # Moderate imbalance
            suggestions.append(
                f"🟡 **Moderate imbalance in '{col}'**: Some groups are underrepresented "
                f"(ratio: {ratio:.2f}). Consider using stratified sampling or applying "
                f"class weights during model training to account for the imbalance."
            )

    # --- Parity-based suggestions ---
    disparate_cols = [r for r in parity_details if r.get("has_disparity")]

    for par_info in disparate_cols:
        col = par_info["sensitive_column"]
        gap = par_info["parity_gap"]
        favored = par_info.get("most_favored_group", "N/A")
        disfavored = par_info.get("least_favored_group", "N/A")

        if gap > 0.3:
            suggestions.append(
                f"🔴 **High outcome disparity in '{col}'**: '{favored}' receives "
                f"positive outcomes {gap:.0%} more often than '{disfavored}'. "
                f"Consider removing '{col}' as a feature, or apply fairness-aware "
                f"algorithms like Reweighing or Calibrated Equalized Odds."
            )
        elif gap > 0.1:
            suggestions.append(
                f"🟡 **Moderate outcome disparity in '{col}'**: There is a {gap:.0%} gap "
                f"in positive outcomes between '{favored}' and '{disfavored}'. "
                f"Consider applying post-processing calibration or threshold adjustment "
                f"to equalize outcomes across groups."
            )

    # --- General suggestions based on bias level ---
    if bias_level == "High":
        suggestions.append(
            "🔴 **Overall recommendation**: Your dataset shows significant bias. "
            "Before training any model, consider:\n"
            "  1. Auditing your data collection process for systematic exclusion\n"
            "  2. Using fairness-aware preprocessing (e.g., reweighing samples)\n"
            "  3. Implementing post-hoc fairness corrections on model outputs"
        )
    elif bias_level == "Medium":
        suggestions.append(
            "🟡 **Overall recommendation**: Your dataset shows moderate bias. "
            "Consider applying fairness constraints during model training and "
            "monitoring outcomes across demographic groups after deployment."
        )
    else:
        if not suggestions:
            suggestions.append(
                "🟢 **Good news**: Your dataset appears relatively balanced and fair. "
                "Continue monitoring for bias as new data is collected, and consider "
                "periodic fairness audits."
            )

    # --- Always-applicable suggestions ---
    if affected_features:
        features_str = ", ".join([f"'{f}'" for f in affected_features])
        suggestions.append(
            f"📊 **Feature review**: Pay special attention to {features_str} — "
            f"these features show signs of bias. Consider whether they are truly "
            f"necessary for your use case, or if proxy features could be used instead."
        )

    suggestions.append(
        "📋 **Best practice**: Document your fairness analysis and the steps taken "
        "to mitigate bias. This creates accountability and helps future audits."
    )

    return suggestions
