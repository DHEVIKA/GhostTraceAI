import { useEffect, useState } from "react";
import api from "../services/api";
import type { Investigation } from "../types/investigation";

interface Props {
  investigation: Investigation | null;
}

interface ExecutiveReportData {
  health_score: number;
  overall_health: string;
  risk_level: string;
  root_cause: string;
  business_impact: string[];
  recommendations: string[];
  summary: string;
}

export default function ExecutiveReport({
  investigation,
}: Props) {
  const [report, setReport] =
    useState<ExecutiveReportData | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadExecutiveReport();
  }, [investigation]);

  const loadExecutiveReport = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/executive-report`);

      setReport(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!investigation) {
    return (
      <div className="bg-[#151C31] rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-3">
          📋 Executive Investigation Report
        </h2>

        <p className="text-gray-400">
          Select an investigation to generate the executive report.
        </p>
      </div>
    );
  }

  if (loading || !report) {
    return (
      <div className="bg-[#151C31] rounded-2xl p-6 border border-gray-700 animate-pulse">
        Loading Executive Report...
      </div>
    );
  }

  return (
    <div className="bg-[#151C31] rounded-2xl border border-blue-700 p-6 space-y-5">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            📋 Executive Investigation Report
          </h2>

          <p className="text-gray-400 text-sm">
            AI-generated operational assessment
          </p>

        </div>

        <div className="text-center">

          <div className="text-4xl font-bold text-blue-400">
            {report.health_score}
          </div>

          <div className="text-sm text-gray-400">
            Health Score
          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-[#0F172A] rounded-xl p-4">

          <p className="text-gray-400 text-sm">
            Overall Health
          </p>

          <h3 className="text-xl font-bold text-green-400">
            {report.overall_health}
          </h3>

        </div>

        <div className="bg-[#0F172A] rounded-xl p-4">

          <p className="text-gray-400 text-sm">
            Risk Level
          </p>

          <h3 className="text-xl font-bold text-yellow-400">
            {report.risk_level}
          </h3>

        </div>

      </div>

      <div className="bg-[#0F172A] rounded-xl p-4">

        <h3 className="font-semibold mb-2">
          🎯 Root Cause
        </h3>

        <p className="text-gray-300">
          {report.root_cause}
        </p>

      </div>

      <div className="bg-[#0F172A] rounded-xl p-4">

        <h3 className="font-semibold mb-2">
          💼 Business Impact
        </h3>

        <ul className="space-y-2">

          {report.business_impact.map(
            (item, index) => (
              <li key={index}>
                • {item}
              </li>
            )
          )}

        </ul>

      </div>

      <div className="bg-[#0F172A] rounded-xl p-4">

        <h3 className="font-semibold mb-2">
          💡 Recommendations
        </h3>

        <ul className="space-y-2">

          {report.recommendations.map(
            (item, index) => (
              <li key={index}>
                ✓ {item}
              </li>
            )
          )}

        </ul>

      </div>

      <div className="bg-blue-950 border border-blue-700 rounded-xl p-4">

        <h3 className="font-semibold mb-2">
          🤖 Executive Summary
        </h3>

        <div className="space-y-3 text-gray-200 leading-7">
          {report.summary.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      </div>

    </div>
  );
}