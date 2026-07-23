from app.models.investigation import InvestigationCase


def generate_report(investigation: dict):

    tool_status = investigation["tool_status"]
    confidence = investigation["confidence"]
    latency = float(investigation["latency"].replace(" s", ""))
    tokens = investigation["total_tokens"]

    # ---------------- Root Cause ----------------

    if tool_status == "Slow":
        root_cause = (
            "Knowledge API introduced abnormal latency during execution."
        )
        severity = "HIGH"
        business_impact = (
            "Estimated response delay increased by approximately 30% "
            "due to slow external tool execution."
        )

    elif confidence < 90:
        root_cause = (
            "AI validator detected low confidence in generated response."
        )
        severity = "MEDIUM"
        business_impact = (
            "Response quality may require manual verification."
        )

    elif tokens > 900:
        root_cause = (
            "Large token consumption detected."
        )
        severity = "MEDIUM"
        business_impact = (
            "Higher inference cost due to large prompt context."
        )

    elif latency > 2:
        root_cause = (
            "Overall workflow latency exceeded expected threshold."
        )
        severity = "MEDIUM"
        business_impact = (
            "Users may experience slower response times."
        )

    else:
        root_cause = (
            "No abnormal behaviour detected during investigation."
        )
        severity = "LOW"
        business_impact = (
            "Current workflow is operating within acceptable latency limits."
        )

    # ---------------- Recommendations ----------------

    recommendations = [
        "Enable Retrieval Cache",
        "Reduce duplicate Knowledge API requests",
        "Optimize vector search latency",
        "Monitor token usage continuously",
    ]

    return {
        "case_id": investigation["case_id"],
        "status": investigation["status"],
        "confidence": confidence,
        "severity": severity,
        "business_impact": business_impact,
        "root_cause": root_cause,
        "recommendations": recommendations,
    }