import { useEffect, useState } from "react";
import api from "../services/api";
import type { Investigation as InvestigationType } from "../types/investigation";
import toast from "react-hot-toast";
import { openSigNozUrl } from "../utils/sigNoz";

interface InvestigationProps {
  investigation: InvestigationType | null;
}

interface InvestigationReport {
  case_id: string;
  status: string;
  confidence: number;
  severity: string;
  business_impact: string;
  root_cause: string;
  recommendations: string[];
  trace_id?: string;
}

export default function Investigation({
  investigation,
}: InvestigationProps) {

  const [report, setReport] = useState<InvestigationReport | null>(null);


  useEffect(() => {

    if (!investigation) return;

    const loadReport = async () => {

      try {

        const response = await api.get(
          `/investigation/${investigation.case_id}`
        );

        setReport(response.data);

      } catch (err) {

        console.error(err);

      }

    };

    loadReport();

  }, [investigation]);



  if (!investigation) {

    return (
      <div className="p-6">

        <h2 className="text-2xl font-bold mb-6">
          AI Investigation Summary
        </h2>

        <div className="bg-[#151C31] rounded-2xl p-6 text-gray-400">
          Select an investigation to generate the AI report.
        </div>

      </div>
    );

  }



  if (!report) {

    return (
      <div className="p-6 text-gray-400">
        Loading AI report...
      </div>
    );

  }



  const isHigh = report.severity === "HIGH";



  const getSeverityStyle = (severity: string) => {

    switch (severity) {

      case "HIGH":

        return {
          icon: "🔴",
          style:
            "bg-red-500/20 text-red-400 border-red-500/40",
        };


      case "MEDIUM":

        return {
          icon: "🟡",
          style:
            "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
        };


      default:

        return {
          icon: "🟢",
          style:
            "bg-green-500/20 text-green-400 border-green-500/40",
        };

    }

  };



  const severityBadge = getSeverityStyle(
    report.severity
  );



  const copyTrace = async () => {
    if (!investigation.trace_id) {
      toast.error("Trace ID not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        investigation.trace_id
      );
      toast.success("Trace ID copied!");
    } catch {
      toast.error("Failed to copy Trace ID");
    }
  };

  const openSigNozLink = (action: "trace" | "logs" | "waterfall" | "metrics") => {
    if (!investigation.trace_id) {
      toast.error("Trace ID not available");
      return;
    }

    const url = openSigNozUrl(action, investigation.trace_id);
    console.debug("Opening SigNoz URL:", url);
    toast.success("Opening SigNoz");
  };



  return (

    <div className="h-full overflow-y-auto p-6">


      <h2 className="text-2xl font-bold mb-6">
        AI Investigation Summary
      </h2>



      <div className="bg-[#151C31] rounded-2xl p-6 space-y-6">



        {/* Primary Issue */}

        <div>

          <h3 className="text-lg font-semibold mb-2">
            Primary Issue
          </h3>


          <p className={
            isHigh
              ? "text-red-400"
              : "text-green-400"
          }>

            {report.root_cause}

          </p>


        </div>




        {/* Severity */}

        <div>

          <h3 className="text-lg font-semibold mb-2">
            Severity
          </h3>


          <span
            className={`
              inline-flex items-center
              px-4 py-2
              rounded-full
              text-sm
              font-semibold
              border
              ${severityBadge.style}
            `}
          >

            {severityBadge.icon} {report.severity}

          </span>


        </div>





        {/* Business Impact */}

        <div>

          <h3 className="text-lg font-semibold mb-2">
            Business Impact
          </h3>


          <p className="text-gray-300">
            {report.business_impact}
          </p>


        </div>





        {/* Trace ID */}

<div>

  <h3 className="text-lg font-semibold mb-2">
    🔗 SigNoz Trace
  </h3>

  <div className="bg-[#0B1020] rounded-xl border border-gray-700 p-4">

    <p className="text-xs text-gray-500 mb-2">
      Inspect the complete distributed trace inside SigNoz.
    </p>

    <div className="bg-[#151C31] rounded-lg p-3 text-sm text-blue-300 break-all mb-4">
      {investigation.trace_id}
    </div>

    <div className="grid grid-cols-2 gap-3">

      <button
        onClick={copyTrace}
        className="
          flex-1
          bg-blue-600
          hover:bg-blue-700
          py-2
          rounded-xl
          transition
        "
      >
        📋 Copy Trace ID
      </button>

      <button
        onClick={() => openSigNozLink("trace")}
        className="
          flex-1
          bg-green-600
          hover:bg-green-700
          py-2
          rounded-xl
          transition
        "
      >
        View Full Trace
      </button>

      
    <button
  onClick={() => openSigNozLink("waterfall")}
  className="
    col-span-2
    bg-orange-600
    hover:bg-orange-700
    py-2
    rounded-xl
    transition
  "
>
        View Span Waterfall
      </button>

      <button
        onClick={() => openSigNozLink("metrics")}
        className="
          col-span-2
          bg-cyan-600
          hover:bg-cyan-700
          py-2
          rounded-xl
          transition
        "
      >
        View Metrics
      </button>

    </div>

  </div>

</div>





        {/* Evidence */}

        <div>

          <h3 className="text-lg font-semibold mb-2">
            Investigation Evidence
          </h3>


          <ul className="space-y-2 text-sm">

            <li>
              ✅ Planner completed successfully
            </li>


            <li>
              ✅ Memory Search executed normally
            </li>


            <li>
              {
                investigation.tool_status === "Slow"
                ? "⚠ Knowledge API exceeded latency threshold"
                : "✅ Knowledge API executed normally"
              }
            </li>


            <li>
              ✅ Gemini model completed inference
            </li>


            <li>
              {
                investigation.confidence < 90
                ? "⚠ Validator requested manual review"
                : "✅ Validator approved the response"
              }
            </li>


          </ul>


        </div>





        {/* Recommendations */}

        <div>

          <h3 className="text-lg font-semibold mb-2">
            AI Recommendations
          </h3>


          <ul className="list-disc ml-5 space-y-2 text-sm">

            {
              report.recommendations.map((item) => (

                <li key={item}>
                  {item}
                </li>

              ))
            }

          </ul>


        </div>





        {/* Confidence */}

        <div className="border-t border-gray-700 pt-5">


          <div className="flex justify-between items-center">


            <span className="text-gray-400">
              AI Confidence
            </span>


            <span className="text-3xl font-bold text-blue-400">
              {report.confidence}%
            </span>


          </div>


        </div>



      </div>


    </div>

  );

}