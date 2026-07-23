import React, { useState } from "react";
import Header from "../components/Header";
import {
  Activity,
  Layers,
  Server,
  Zap,
  ExternalLink,
  Bot,
  ArrowRight,
  Maximize2,
  Sparkles,
} from "lucide-react";

export default function Architecture() {
  const [activeTab, setActiveTab] = useState<"poster" | "interactive">("poster");

  const agents = [
    {
      name: "Planner Agent",
      role: "Workflow Decomposition",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300",
      badge: "Blue",
      desc: "Initializes trace context, case IDs, and decomposes user request into sub-tasks.",
    },
    {
      name: "Knowledge Agent",
      role: "VectorDB & Context Retrieval",
      color: "from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300",
      badge: "Cyan",
      desc: "Queries vector memory store, retrieves documentation snippets and context vectors.",
    },
    {
      name: "Guardian Agent",
      role: "Tool Execution & Safety",
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300",
      badge: "Purple",
      desc: "Executes tool APIs, measures latency, checks safety guardrails, and isolates errors.",
    },
    {
      name: "Validator Agent",
      role: "Confidence Scoring",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-300",
      badge: "Green",
      desc: "Evaluates LLM response confidence, detects hallucinations, assigns severity score.",
    },
    {
      name: "Summarizer Agent",
      role: "Executive Synthesis",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
      badge: "Orange",
      desc: "Synthesizes final root cause analysis, token usage breakdown, and executive reports.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090B14] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* TOP BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0D1527] via-[#111A33] to-[#0D1527] p-8 shadow-2xl shadow-cyan-500/10">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles size={14} />
                ENTERPRISE SYSTEM ARCHITECTURE
              </div>

              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                GhostTrace AI Platform Architecture
              </h1>

              <p className="mt-2 text-slate-400 max-w-2xl text-sm leading-relaxed">
                OpenTelemetry-native AI Observability & Investigation Engine. Engineered for sub-second trace correlation, high-throughput OTLP telemetry streaming, and automated root cause analysis.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("poster")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === "poster"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-[#161F38] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Maximize2 size={16} />
                Infographic Poster
              </button>

              <button
                onClick={() => setActiveTab("interactive")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  activeTab === "interactive"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-[#161F38] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Layers size={16} />
                Interactive Flow
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: HIGH-RES INFOGRAPHIC POSTER */}
        {activeTab === "poster" && (
          <div className="space-y-6">
            <div className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-[#0E1528] p-3 shadow-2xl">
              <img
                src="/ghosttrace_architecture_poster.png"
                alt="GhostTrace AI Enterprise Architecture Infographic Poster"
                className="w-full h-auto rounded-2xl object-cover transition-transform duration-300"
              />
              <div className="absolute top-6 right-6">
                <a
                  href="/ghosttrace_architecture_poster.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2 hover:bg-black transition"
                >
                  <ExternalLink size={14} />
                  Open Full Resolution Poster
                </a>
              </div>
            </div>

            {/* KEY ARCHITECTURAL METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-[#121A2F]/80 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 text-cyan-400">
                  <Activity size={20} />
                  <span className="text-xs font-semibold text-slate-400">Telemetry Protocol</span>
                </div>
                <p className="mt-2 text-xl font-bold text-white">OTLP Dual Receiver</p>
                <p className="text-xs text-slate-400 mt-1">HTTP :4318 & gRPC :4317</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#121A2F]/80 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 text-purple-400">
                  <Bot size={20} />
                  <span className="text-xs font-semibold text-slate-400">AI LLM Model</span>
                </div>
                <p className="mt-2 text-xl font-bold text-white">Gemini 2.5 Flash</p>
                <p className="text-xs text-slate-400 mt-1">Token & Cost Tracking</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#121A2F]/80 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 text-green-400">
                  <Server size={20} />
                  <span className="text-xs font-semibold text-slate-400">Observability Backend</span>
                </div>
                <p className="mt-2 text-xl font-bold text-white">SigNoz + ClickHouse</p>
                <p className="text-xs text-slate-400 mt-1">Live Traces & Logs Index</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#121A2F]/80 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 text-orange-400">
                  <Zap size={20} />
                  <span className="text-xs font-semibold text-slate-400">Incident Resolution</span>
                </div>
                <p className="mt-2 text-xl font-bold text-white">90% Faster Analysis</p>
                <p className="text-xs text-slate-400 mt-1">Automated Root Cause</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE ARCHITECTURE PIPELINE */}
        {activeTab === "interactive" && (
          <div className="space-y-8">
            {/* AI AGENTS PIPELINE */}
            <div className="rounded-3xl border border-slate-800 bg-[#0E1528] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="text-cyan-400" size={24} />
                  <h2 className="text-xl font-bold text-white">GhostTrace AI Multi-Agent Workflow</h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">5 Autonomous Sequential Agents</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {agents.map((agent, index) => (
                  <div
                    key={agent.name}
                    className={`relative rounded-2xl border bg-gradient-to-b p-5 space-y-3 shadow-lg transition-transform hover:-translate-y-1 ${agent.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                        Step 0{index + 1}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white">{agent.name}</h3>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{agent.role}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{agent.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FULL DATA PIPELINE FLOW */}
            <div className="rounded-3xl border border-slate-800 bg-[#0E1528] p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Activity className="text-green-400" size={24} />
                End-to-End OTLP Data Flow
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
                {[
                  { name: "React Frontend", sub: "Vite Dashboard", color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
                  { name: "FastAPI Backend", sub: "Python REST API", color: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
                  { name: "GhostTrace AI Engine", sub: "Gemini 2.5 Flash", color: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
                  { name: "OpenTelemetry SDK", sub: "Traces, Logs, Metrics", color: "bg-orange-500/20 border-orange-500/40 text-orange-300" },
                  { name: "OTLP Collector", sub: "Port 4317 / 4318", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300" },
                  { name: "SigNoz & ClickHouse", sub: "Observability Index", color: "bg-green-500/20 border-green-500/40 text-green-300" },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.name}>
                    <div className={`flex-1 rounded-2xl border p-4 text-center space-y-1 ${step.color}`}>
                      <p className="font-bold text-sm text-white">{step.name}</p>
                      <p className="text-xs text-slate-400">{step.sub}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="text-slate-600 hidden md:block shrink-0" size={18} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
