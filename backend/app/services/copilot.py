from typing import Dict, List


def generate_copilot_answer(
    investigation: Dict,
    question: str,
    history: List
) -> str:


    question = question.lower()


    latency = investigation.get("latency", "Unknown")
    confidence = investigation.get("confidence", 0)
    tool = investigation.get("tool", "Unknown")
    tool_status = investigation.get("tool_status", "Unknown")
    model = investigation.get("model", "Unknown")
    tokens = investigation.get("total_tokens", 0)
    cost = investigation.get("token_cost", 0)


    # ==========================
    # MEMORY BASED ANSWERS
    # ==========================

    if question in [
        "why",
        "why?",
        "explain",
        "why did this happen"
    ]:

        return (
            f"Based on the previous investigation context, "
            f"the main factor was the {tool}. "
            f"Its current status is {tool_status} "
            f"with latency {latency}. "
            f"The investigation confidence is {confidence}%."
        )


    if "fix" in question or "improve" in question:

        return (
            "Recommended improvements:\n"
            "1. Enable retrieval caching\n"
            "2. Reduce duplicate knowledge requests\n"
            "3. Optimize retrieval latency\n"
            "4. Monitor token usage"
        )


    # ==========================
    # NORMAL QUESTIONS
    # ==========================


    if "latency" in question or "slow" in question:

        return (
            f"Latency was {latency}. "
            f"The tool '{tool}' had status "
            f"'{tool_status}'."
        )


    if "root cause" in question:

        return (
            f"The investigation indicates "
            f"{tool} was the main dependency analyzed."
        )


    if "summary" in question or "summarize" in question:

        return (
            f"Case {investigation['case_id']} "
            f"completed using {model}. "
            f"Confidence was {confidence}%."
        )


    if "confidence" in question:

        return (
            f"The AI confidence score is {confidence}%."
        )


    if "cost" in question:

        return (
            f"Estimated inference cost is ${cost}."
        )


    if "token" in question:

        return (
            f"The model consumed {tokens} tokens."
        )


    return (
        "I can help analyze this investigation. "
        "Ask about latency, root cause, fixes, "
        "confidence, tokens, or cost."
    )