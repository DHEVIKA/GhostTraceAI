import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import AnalyticsChart from "../components/AnalyticsChart";
import api from "../services/api";
import type { Investigation } from "../types/investigation";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export default function ExecutiveReport() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInvestigations();
  }, []);

  const loadInvestigations = async () => {
    try {
      const res = await api.get("/investigations");
      setInvestigations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const total = investigations.length;

  const avgConfidence =
    total === 0
      ? 0
      : (
          investigations.reduce(
            (sum, item) => sum + item.confidence,
            0
          ) / total
        ).toFixed(1);

  const avgLatency =
    total === 0
      ? 0
      : (
          investigations.reduce(
            (sum, item) =>
              sum +
              parseFloat(
                item.latency.replace(" s", "")
              ),
            0
          ) / total
        ).toFixed(2);

  const avgTokens =
    total === 0
      ? 0
      : Math.round(
          investigations.reduce(
            (sum, item) =>
              sum + item.total_tokens,
            0
          ) / total
        );

  const avgCost =
    total === 0
      ? 0
      : (
          investigations.reduce(
            (sum, item) =>
              sum +
              Number(item.token_cost),
            0
          ) / total
        ).toFixed(6);

  const topInvestigations = [...investigations]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);

  const health =
    Number(avgConfidence) >= 95
      ? "Excellent"
      : Number(avgConfidence) >= 90
      ? "Healthy"
      : Number(avgConfidence) >= 80
      ? "Needs Review"
      : "Critical";
    const generatePDF = async () => {
  if (!reportRef.current) return;

  try {
    const dataUrl = await toPng(reportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0B1020",
    });

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(dataUrl);

    const imgWidth = pdfWidth;
    const imgHeight =
      (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      dataUrl,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pdfHeight;
    }

    pdf.save("GhostTrace-Executive-Report.pdf");
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};
  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <Header />

      <div
  ref={reportRef}
  className="p-8 space-y-8 bg-[#0B1020]"
>

        <div className="flex items-center justify-between">

  <div>

    <h1 className="text-4xl font-bold">
      📊 Executive AI Report
    </h1>

    <p className="text-gray-400 mt-2">
      Enterprise AI Observability Dashboard
    </p>

  </div>

  <button
    onClick={generatePDF}
    className="
      bg-cyan-600
      hover:bg-cyan-700
      px-6
      py-3
      rounded-xl
      font-semibold
      transition
    "
  >
    📄 Download Report
  </button>

</div>

        {/* KPI Cards */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

            <p className="text-gray-400 text-sm">
              Investigations
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {total}
            </h2>

          </div>

          <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

            <p className="text-gray-400 text-sm">
              Avg Confidence
            </p>

            <h2 className="text-4xl font-bold mt-3 text-cyan-400">
              {avgConfidence}%
            </h2>

          </div>

          <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

            <p className="text-gray-400 text-sm">
              Avg Latency
            </p>

            <h2 className="text-4xl font-bold mt-3 text-orange-400">
              {avgLatency}s
            </h2>

          </div>

          <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

            <p className="text-gray-400 text-sm">
              AI Health
            </p>

            <h2 className="text-3xl font-bold mt-3 text-green-400">
              {health}
            </h2>

          </div>

        </div>

        {/* Extra Stats */}

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

            <p className="text-gray-400 text-sm">
              Average Tokens
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {avgTokens}
            </h2>

          </div>

          <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

            <p className="text-gray-400 text-sm">
              Average Cost
            </p>

            <h2 className="text-4xl font-bold mt-3">
              ${avgCost}
            </h2>

          </div>

        </div>

        {/* Analytics */}

        <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">

          <h2 className="text-2xl font-bold mb-5">
            📈 AI Analytics
          </h2>

          <div className="h-[420px]">
            <AnalyticsChart
              investigations={investigations}
            />
          </div>

        </div>

        {/* Executive Summary */}

        <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">
 
          <h2 className="text-2xl font-bold mb-5">
            🧠 Executive Summary
          </h2>
 
          <ul className="space-y-3 text-gray-300">
 
            <li>
              • Total AI investigations executed: <b>{total}</b>
            </li>
 
            <li>
              • Average confidence across all investigations is{" "}
              <b>{avgConfidence}%</b>.
            </li>
 
            <li>
              • Mean end-to-end latency is{" "}
              <b>{avgLatency} seconds</b>.
            </li>
 
            <li>
              • Average token usage per investigation is{" "}
              <b>{avgTokens}</b>.
            </li>
 
            <li>
              • Estimated average AI inference cost is{" "}
              <b>${avgCost}</b>.
            </li>
 
            <li>
              • Overall system health is currently{" "}
              <span className="text-green-400 font-semibold">
                {health}
              </span>.
            </li>
 
          </ul>
 
        </div>
 
        <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">
 
          <h2 className="text-2xl font-bold mb-5">
            📋 Investigation Snapshot
          </h2>
 
          <div className="overflow-hidden rounded-2xl border border-slate-700">
            <table className="min-w-full text-left text-sm text-gray-200">
              <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Trace ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Latency</th>
                  <th className="px-4 py-3">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#111827]">
                {topInvestigations.map((item) => (
                  <tr key={item.case_id}>
                    <td className="px-4 py-4 font-medium text-white">
                      {item.trace_id}
                    </td>
                    <td className="px-4 py-4 text-cyan-300 capitalize">
                      {item.status}
                    </td>
                    <td className="px-4 py-4">{item.confidence}%</td>
                    <td className="px-4 py-4">{item.latency}</td>
                    <td className="px-4 py-4 text-slate-300">
                      {item.tool_status === "Healthy"
                        ? "No action needed"
                        : item.tool_status === "Slow"
                        ? "Investigate latency source"
                        : "Review AI reasoning"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
        </div>
 
        <div className="bg-[#151C31] rounded-2xl p-6 border border-slate-700">
 
          <h2 className="text-2xl font-bold mb-5">
            ✅ Recommendations
          </h2>
 
          <p className="text-gray-300 leading-7">
            GhostTrace AI analyzed today&apos;s investigations and found that platform health is stable, with a small portion of requests requiring manual review due to confidence dips. Continue to strengthen trace correlation, tune token cache sizing, and monitor cost per request. If any investigation shows failed or slow behavior, prioritize trace-level diagnostics and increase vector cache capacity.
          </p>
 
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-700">
              <h3 className="font-semibold text-white">Immediate Action</h3>
              <p className="text-slate-400 mt-2">Increase vector cache size and monitor token usage to reduce latency spikes and operating cost.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-700">
              <h3 className="font-semibold text-white">Ongoing Monitoring</h3>
              <p className="text-slate-400 mt-2">Track SigNoz error rates, request timings, and AI confidence scores for early detection of regressions.</p>
            </div>
          </div>
 
        </div>
 
        <div className="text-center text-sm text-slate-500">
          <p>GhostTrace AI Executive Report &bull; Generated from live investigation data</p>
          <p>For internal use only. Review SigNoz dashboards for trace-level detail.</p>
        </div>
 
      </div>
    </div>
  );
}