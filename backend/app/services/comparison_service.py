from typing import Dict


def compare_investigations(
    case1: Dict,
    case2: Dict
):

    # =============================
    # Metric Extraction
    # =============================

    latency1 = float(
        case1["latency"].replace(" s", "")
    )

    latency2 = float(
        case2["latency"].replace(" s", "")
    )


    latency_diff = latency2 - latency1


    token_diff = (
        case2["total_tokens"]
        -
        case1["total_tokens"]
    )


    confidence_diff = (
        case2["confidence"]
        -
        case1["confidence"]
    )


    cost_diff = (
        case2["token_cost"]
        -
        case1["token_cost"]
    )


    # =============================
    # AI Investigation Intelligence
    # =============================

    insights = []

    recommendations = []


    # -----------------------------
    # Latency Intelligence
    # -----------------------------

    if latency_diff < 0:

        improvement = (
            abs(latency_diff)
            /
            latency1
        ) * 100


        insights.append(
            f"⚡ {case2['case_id']} is faster by "
            f"{abs(latency_diff):.2f}s "
            f"({improvement:.1f}% improvement)."
        )


        recommendations.append(
            "Maintain current execution path for better response speed."
        )


    else:

        insights.append(
            f"🐢 {case2['case_id']} latency increased by "
            f"{latency_diff:.2f}s."
        )


        recommendations.append(
            "Optimize slow tools and enable retrieval caching."
        )



    # -----------------------------
    # Token Intelligence
    # -----------------------------

    if token_diff > 0:

        insights.append(
            f"💰 Token consumption increased by "
            f"{token_diff} tokens."
        )


        recommendations.append(
            "Optimize prompts to reduce AI execution cost."
        )


    else:

        insights.append(
            f"📉 Token usage reduced by "
            f"{abs(token_diff)} tokens."
        )



    # -----------------------------
    # Confidence Intelligence
    # -----------------------------

    if confidence_diff > 0:

        insights.append(
            f"🎯 AI confidence improved by "
            f"{confidence_diff:.2f}%."
        )


    else:

        insights.append(
            f"⚠ AI confidence dropped by "
            f"{abs(confidence_diff):.2f}%."
        )


        recommendations.append(
            "Improve retrieval quality and validation rules."
        )



    # -----------------------------
    # Cost Intelligence
    # -----------------------------

    if cost_diff > 0:

        insights.append(
            f"💸 Execution cost increased by "
            f"${cost_diff:.6f}."
        )

    else:

        insights.append(
            f"💵 Cost reduced by "
            f"${abs(cost_diff):.6f}."
        )



    # -----------------------------
    # Tool Analysis
    # -----------------------------

    if case2.get("tool_status") != "Healthy":


        insights.append(
            f"🛠 {case2['tool']} reported "
            f"{case2['tool_status']}."
        )


        recommendations.append(
            f"Investigate {case2['tool']} reliability."
        )



    # =============================
    # Winner Detection
    # =============================

    score1 = (
        case1["confidence"]
        -
        latency1
        -
        case1["token_cost"] * 1000
    )


    score2 = (
        case2["confidence"]
        -
        latency2
        -
        case2["token_cost"] * 1000
    )


    if score2 > score1:

        winner = case2["case_id"]

    else:

        winner = case1["case_id"]



    # =============================
    # AI Summary
    # =============================

    summary = (

        f"GhostTrace AI analysis shows "
        f"{winner} performed better overall. "

        f"{case2['case_id']} compared with "
        f"{case1['case_id']} showed "

    )


    if latency_diff < 0:

        summary += (
            f"improved latency, "
        )

    else:

        summary += (
            f"higher latency, "
        )


    if confidence_diff > 0:

        summary += (
            f"better confidence, "
        )

    else:

        summary += (
            f"lower confidence, "
        )


    summary += (

        f"with {case2['tool']} being "
        f"the primary execution component analyzed."

    )



    return {


        "case1": case1,


        "case2": case2,


        "winner": winner,


        "analysis": {


            "latency_difference":
                round(latency_diff,3),


            "token_difference":
                token_diff,


            "confidence_difference":
                round(confidence_diff,2),


            "cost_difference":
                round(cost_diff,6)

        },


        "ai_insights": insights,


        "recommendations": recommendations,


        "summary": summary

    }