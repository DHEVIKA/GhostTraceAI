import {
  Activity,
  Server,
  Cpu,
  Network,
  Workflow,
  ExternalLink,
  Boxes,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { openSigNozUrl } from "../utils/sigNoz";

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1020]/95 backdrop-blur-xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="px-8 py-5 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-start gap-5">

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-cyan-500 blur-xl opacity-30" />

            <div
              className="
                relative
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-3xl
                bg-gradient-to-br
                from-cyan-500
                via-blue-500
                to-indigo-600
                shadow-xl
                shadow-cyan-500/30
              "
            >
              <Activity size={28} className="text-white" />
            </div>
          </div>

          <div>

            <div className="flex items-center gap-3">

              <h1
                className="
                  text-4xl
                  font-extrabold
                  tracking-tight
                  bg-gradient-to-r
                  from-cyan-300
                  via-white
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                GhostTrace AI
              </h1>

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                v1.0
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-400">
              Enterprise AI Investigation & Observability Platform
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300">
                Browser
              </span>

              <span className="text-slate-500">→</span>

              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-300">
                FastAPI
              </span>

              <span className="text-slate-500">→</span>

              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-orange-300">
                OpenTelemetry
              </span>

              <span className="text-slate-500">→</span>

              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-green-300">
                OTLP :4317
              </span>

              <span className="text-slate-500">→</span>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                SigNoz
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* Navigation */}

          <Link
            to="/"
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
              location.pathname === "/"
                ? "bg-cyan-600"
                : "bg-[#151C31] hover:bg-slate-700"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/executive-report"
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
              location.pathname === "/executive-report"
                ? "bg-violet-600"
                : "bg-[#151C31] hover:bg-slate-700"
            }`}
          >
            <FileText size={18} />
            Executive Report
          </Link>

          {/* Deployment */}

          <div className="rounded-2xl border border-slate-700 bg-[#151C31] px-5 py-3">
            <div className="flex items-center gap-3">
              <Server size={20} className="text-blue-400" />
              <div>
                <p className="text-xs text-slate-500">Deployment</p>
                <p className="text-sm font-semibold text-white">
                  Self Hosted
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry */}

          <div className="rounded-2xl border border-slate-700 bg-[#151C31] px-5 py-3">
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-orange-400" />
              <div>
                <p className="text-xs text-slate-500">Telemetry</p>
                <p className="text-sm font-semibold text-white">
                  OpenTelemetry
                </p>
              </div>
            </div>
          </div>

          {/* SigNoz */}

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3">
            <div className="flex items-center gap-3">

              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>

              <div>
                <p className="text-xs text-green-300">
                  Live Collector
                </p>

                <p className="text-sm font-semibold text-white">
                  SigNoz Connected
                </p>
              </div>

            </div>
          </div>

          {/* AI */}

          <div className="rounded-2xl border border-slate-700 bg-[#151C31] px-5 py-3">
            <div className="flex items-center gap-3">
              <Workflow size={20} className="text-violet-400" />
              <div>
                <p className="text-xs text-slate-500">AI Model</p>
                <p className="text-sm font-semibold text-white">
                  Gemini 2.5 Flash
                </p>
              </div>
            </div>
          </div>

          {/* Architecture */}

          <Link
            to="/architecture"
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition ${
              location.pathname === "/architecture"
                ? "bg-cyan-600"
                : "bg-[#151C31] hover:bg-slate-700"
            }`}
          >
            <Network size={18} />
            Architecture
          </Link>

          {/* SigNoz */}

          <button
            onClick={() => openSigNozUrl("home")}
            className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-700 transition"
          >
            <ExternalLink size={18} />
            Open SigNoz
          </button>

          {/* Build */}

          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#151C31] px-4 py-3">
            <Boxes size={18} className="text-cyan-400" />
            <span className="text-sm font-semibold">
              Build 1.0
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}