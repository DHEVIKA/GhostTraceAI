import type { Investigation } from "../types/investigation";

interface Props {
  investigations: Investigation[];
}

export default function AIHealthScore({
  investigations,
}: Props) {
  if (investigations.length === 0) {
    return (
      <div className="bg-[#151C31] rounded-2xl border border-gray-700 p-6 mb-5">
        <h2 className="text-xl font-bold mb-4">
          🧠 AI Health Score
        </h2>

        <div className="flex items-center justify-center h-32 text-gray-400">
          No investigations available
        </div>
      </div>
    );
  }

  // Latest investigation
  const latest = investigations[0];

  let score = 100;

  // Incident-based health deductions
  switch (latest.incident) {
    case "vector_failure":
      score -= 40;
      break;
    case "hallucination":
      score -= 30;
      break;
    case "slow_api":
      score -= 20;
      break;
    case "token_spike":
      score -= 15;
      break;
    default:
      break;
  }

  if (latest.tool_status === "Slow") {
    score -= 10;
  }

  if (latest.confidence < 90) {
    score -= 15;
  }

  if (latest.total_tokens > 2000) {
    score -= 10;
  }

  const latency = parseFloat(
    latest.latency.replace(" s", "")
  );

  if (!Number.isNaN(latency) && latency > 2) {
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let status = "Healthy";
  let color = "text-green-400";
  let ring = "border-green-500";

  if (score < 90 && score >= 70) {
    status = "Monitor";
    color = "text-yellow-400";
    ring = "border-yellow-500";
  }

  if (score < 70) {
    status = "Critical";
    color = "text-red-400";
    ring = "border-red-500";
  }

  return (
    <div className="bg-[#151C31] rounded-2xl border border-gray-700 p-6 mb-5">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            🧠 AI Health Score
          </h2>

          <p className="text-gray-400 mt-1">
            Overall AI system health based on the latest investigation.
          </p>

        </div>

        <div
          className={`
            w-28
            h-28
            rounded-full
            border-4
            ${ring}
            flex
            flex-col
            items-center
            justify-center
          `}
        >
          <span className={`text-3xl font-bold ${color}`}>
            {score}
          </span>

          <span className="text-xs text-gray-400">
            /100
          </span>
        </div>

      </div>

      <div className="grid grid-cols-5 gap-4 mt-8">

        <div className="bg-[#0B1020] rounded-xl p-4">
          <div className="text-gray-400 text-sm">
            Status
          </div>

          <div className={`font-bold mt-2 ${color}`}>
            {status}
          </div>
        </div>

        <div className="bg-[#0B1020] rounded-xl p-4">
          <div className="text-gray-400 text-sm">
            Model
          </div>

          <div className="font-semibold mt-2">
            {latest.model}
          </div>
        </div>

        <div className="bg-[#0B1020] rounded-xl p-4">
          <div className="text-gray-400 text-sm">
            Latency
          </div>

          <div className="font-semibold mt-2">
            {latest.latency}
          </div>
        </div>

        <div className="bg-[#0B1020] rounded-xl p-4">
          <div className="text-gray-400 text-sm">
            Confidence
          </div>

          <div className="font-semibold mt-2">
            {latest.confidence}%
          </div>
        </div>

        <div className="bg-[#0B1020] rounded-xl p-4">
          <div className="text-gray-400 text-sm">
            Tokens
          </div>

          <div className="font-semibold mt-2">
            {latest.total_tokens}
          </div>
        </div>

      </div>
    </div>
  );
}