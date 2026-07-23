import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import type { ChartData } from "chart.js";
import type { Investigation } from "../types/investigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  investigations: Investigation[];
}

type Metric = "Latency" | "Confidence" | "Tokens" | "Cost";

export default function AnalyticsChart({
  investigations,
}: Props) {
  const [metric, setMetric] = useState<Metric>("Latency");

  const reversed = [...investigations].reverse();

  const labels = reversed.map((item) => item.case_id);

  const latency = reversed.map((item) => {
    const value = Number(
      item.latency.replace("ms", "").replace("s", "").trim()
    );

    if (item.latency.includes("s")) {
      return value;
    }

    return value / 1000;
  });

  const confidence = reversed.map(
    (item) => item.confidence ?? 0
  );

  const tokens = reversed.map(
    (item) => item.total_tokens ?? 0
  );

  const cost = reversed.map(
    (item) => item.token_cost ?? 0
  );

  const chartConfig = useMemo(() => {
    switch (metric) {
      case "Latency":
        return {
          values: latency,
          label: "Latency (s)",
          color: "#38bdf8",
          bg: "rgba(56,189,248,0.18)",
        };

      case "Confidence":
        return {
          values: confidence,
          label: "Confidence (%)",
          color: "#22c55e",
          bg: "rgba(34,197,94,0.18)",
        };

      case "Tokens":
        return {
          values: tokens,
          label: "Tokens",
          color: "#a855f7",
          bg: "rgba(168,85,247,0.18)",
        };

      case "Cost":
        return {
          values: cost,
          label: "Cost ($)",
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.18)",
        };
    }
  }, [metric, latency, confidence, tokens, cost]);

  const average =
    chartConfig.values.length > 0
      ? (
          chartConfig.values.reduce((a, b) => a + b, 0) /
          chartConfig.values.length
        ).toFixed(metric === "Cost" ? 6 : 2)
      : "0";

  const maximum =
    chartConfig.values.length > 0
      ? Math.max(...chartConfig.values).toFixed(
          metric === "Cost" ? 6 : 2
        )
      : "0";

  const minimum =
    chartConfig.values.length > 0
      ? Math.min(...chartConfig.values).toFixed(
          metric === "Cost" ? 6 : 2
        )
      : "0";

  const data: ChartData<"line"> = {
    labels,

    datasets: [
      {
        label: chartConfig.label,

        data: chartConfig.values,

        borderColor: chartConfig.color,

        backgroundColor: chartConfig.bg,

        borderWidth: 3,

        pointRadius: 5,

        pointHoverRadius: 7,

        tension: 0.4,

        fill: true,
      },
    ],
  };

  return (
    <div className="bg-[#151C31] rounded-2xl border border-gray-700 p-5 h-full">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold">
          AI Analytics
        </h2>

        <div className="flex gap-2">

          {(
            [
              "Latency",
              "Confidence",
              "Tokens",
              "Cost",
            ] as Metric[]
          ).map((item) => (
            <button
              key={item}
              onClick={() => setMetric(item)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                metric === item
                  ? "bg-blue-600 text-white"
                  : "bg-[#1B2644] text-gray-300 hover:bg-[#24365F]"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      <div className="h-[185px]">

        <Line
          data={data}
          options={{
            responsive: true,

            maintainAspectRatio: false,

            animation: {
              duration: 700,
            },

            plugins: {
              legend: {
                labels: {
                  color: "#fff",
                },
              },
            },

            scales: {
              x: {
                ticks: {
                  color: "#94a3b8",
                },

                grid: {
                  color:
                    "rgba(148,163,184,0.15)",
                },
              },

              y: {
                beginAtZero: true,

                ticks: {
                  color: "#94a3b8",
                },

                grid: {
                  color:
                    "rgba(148,163,184,0.15)",
                },
              },
            },
          }}
        />

      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">

        <div className="bg-[#0F172A] rounded-xl p-3 text-center">

          <p className="text-xs text-gray-400">
            Average
          </p>

          <p className="text-xl font-bold text-cyan-400">
            {average}
          </p>

        </div>

        <div className="bg-[#0F172A] rounded-xl p-3 text-center">

          <p className="text-xs text-gray-400">
            Maximum
          </p>

          <p className="text-xl font-bold text-green-400">
            {maximum}
          </p>

        </div>

        <div className="bg-[#0F172A] rounded-xl p-3 text-center">

          <p className="text-xs text-gray-400">
            Minimum
          </p>

          <p className="text-xl font-bold text-orange-400">
            {minimum}
          </p>

        </div>

      </div>

    </div>
  );
}