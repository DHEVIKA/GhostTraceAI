from typing import Dict, List


def generate_executive_report(investigations: List[Dict]):
    total = len(investigations)
    healthy = 0
    manual_review = 0
    latency_bottleneck = 0
    issues = []

    for investigation in investigations:
        confidence = investigation.get("confidence", 0)
        latency = float(
            investigation.get("latency", "0 s").replace(" s", "")
        )
        tool_status = investigation.get("tool_status", "Healthy")

        if confidence >= 90 and latency <= 2 and tool_status == "Healthy":
            healthy += 1

        if confidence < 90:
            manual_review += 1

        if latency > 2:
            latency_bottleneck += 1

        if tool_status != "Healthy":
            issues.append(
                f"{investigation.get('case_id')} has tool status {tool_status}."
            )

    success_message = (
        "Most requests completed successfully."
        if healthy >= total * 0.6
        else "Several requests experienced operational issues."
    )

    manual_review_message = (
        f"{manual_review} investigation{'s' if manual_review != 1 else ''} required manual review because confidence dropped below threshold."
        if manual_review > 0
        else "No investigations required manual review."
    )

    latency_message = (
        "No latency bottlenecks detected."
        if latency_bottleneck == 0
        else f"{latency_bottleneck} investigation{'s' if latency_bottleneck != 1 else ''} showed latency bottlenecks."
    )

    health_score = int(
        max(
            0,
            min(
                100,
                100
                - manual_review * 5
                - latency_bottleneck * 10
                - len(issues) * 8,
            )
        )
    )

    overall_health = (
        "Stable"
        if health_score >= 85
        else "Degraded"
        if health_score >= 70
        else "At Risk"
    )

    risk_level = (
        "Low"
        if health_score >= 90
        else "Medium"
        if health_score >= 75
        else "High"
    )

    if manual_review > 0:
        root_cause = (
            "AI confidence dropped below operational threshold on one or more investigations."
        )
    elif latency_bottleneck > 0:
        root_cause = (
            "Some traces exceeded expected latency thresholds."
        )
    elif issues:
        root_cause = issues[0]
    else:
        root_cause = (
            "The AI investigation pipeline remains stable with no major incidents."
        )

    recommendations = []
    recommendations.append("Increase vector cache size and monitor token usage.")
    if latency_bottleneck > 0:
        recommendations.append(
            "Investigate slow tool operations and optimize retrieval latency."
        )
    if manual_review > 0:
        recommendations.append(
            "Review low-confidence cases and improve validation safeguards."
        )
    if not recommendations:
        recommendations.append("Continue monitoring and keep SigNoz instrumentation active.")

    summary_lines = [
        "GhostTrace AI analyzed today's investigations.",
        success_message,
        manual_review_message,
        latency_message,
        f"Overall platform health remains {overall_health.lower()}.",
        "Recommendation: " + ", ".join(recommendations[:2]) + ".",
    ]

    summary = "\n\n".join(summary_lines)

    return {
        "health_score": health_score,
        "overall_health": overall_health,
        "risk_level": risk_level,
        "root_cause": root_cause,
        "business_impact": [
            success_message,
            manual_review_message,
            latency_message,
        ],
        "recommendations": recommendations,
        "summary": summary,
    }
