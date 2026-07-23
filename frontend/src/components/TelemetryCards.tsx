import {
  Search,
  Target,
  ShieldCheck,
  TriangleAlert,
  Siren,
  Timer,
  Coins,
  Binary,
  TrendingUp,
} from "lucide-react";

import type { Investigation } from "../types/investigation";

interface Props {
  investigations: Investigation[];
}

export default function TelemetryCards({
  investigations,
}: Props) {
  const total = investigations.length;

  const avgConfidence =
    total === 0
      ? 0
      : Number(
          (
            investigations.reduce(
              (sum, item) => sum + item.confidence,
              0
            ) / total
          ).toFixed(1)
        );

  const healthyCases = investigations.filter(
    (item) => item.tool_status === "Healthy"
  ).length;

  const needsReview = investigations.filter(
    (item) => item.confidence < 90
  ).length;

  const highSeverity = investigations.filter(
    (item) =>
      item.tool_status === "Slow" ||
      item.confidence < 80
  ).length;

  const slowCalls = investigations.filter(
    (item) => item.tool_status === "Slow"
  ).length;

  const avgLatency =
    total === 0
      ? 0
      : (
          investigations.reduce(
            (sum, item) =>
              sum +
              parseFloat(
                item.latency.replace(" s", "").replace("s", "")
              ),
            0
          ) / total
        ).toFixed(2);

  const avgTokens =
    total === 0
      ? 0
      : Math.round(
          investigations.reduce(
            (sum, item) => sum + item.total_tokens,
            0
          ) / total
        );

  const avgCost =
    total === 0
      ? "0.000000"
      : (
          investigations.reduce(
            (sum, item) => sum + item.token_cost,
            0
          ) / total
        ).toFixed(6);

  const cards = [
    {
      title: "Investigations",
      value: total,
      icon: Search,
      color: "text-cyan-400",
    },
    {
      title: "AI Confidence",
      value: `${avgConfidence}%`,
      icon: Target,
      color: "text-green-400",
    },
    {
      title: "Healthy",
      value: healthyCases,
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      title: "Needs Review",
      value: needsReview,
      icon: TriangleAlert,
      color: "text-yellow-400",
    },
    {
      title: "High Severity",
      value: highSeverity,
      icon: Siren,
      color: "text-red-400",
    },
    {
      title: "Slow Calls",
      value: slowCalls,
      icon: Timer,
      color: "text-orange-400",
    },
    {
      title: "Avg Latency",
      value: `${avgLatency} s`,
      icon: Binary,
      color: "text-violet-400",
    },
    {
      title: "Avg Tokens",
      value: avgTokens,
      icon: Binary,
      color: "text-violet-400",
    },
    {
      title: "Avg Cost",
      value: `$${avgCost}`,
      icon: Coins,
      color: "text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              rounded-2xl
              border
              border-slate-800
              bg-gradient-to-br
              from-[#151C31]
              to-[#101827]
              p-5
              transition-all
              duration-300
              hover:border-cyan-500/40
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-cyan-500/10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  {card.value}
                </h2>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-800
                  group-hover:scale-110
                  transition
                "
              >
                <Icon
                  size={24}
                  className={card.color}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs">
              <TrendingUp
                size={14}
                className="text-green-400"
              />

              <span className="text-green-400">
                Live
              </span>

              <span className="text-slate-500">
                Updated from SigNoz
              </span>
            </div>
          </div>
        );
      })}

      {/* Enterprise Summary */}
      <div className="col-span-4 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300">
              AI Observability Summary
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              GhostTrace AI is continuously monitoring agent execution through
              OpenTelemetry and self-hosted SigNoz.
            </h3>
          </div>

          <div className="rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-300 font-semibold">
            LIVE
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400"
            style={{ width: `${Math.min(avgConfidence, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}