type SigNozAction = "home" | "trace" | "logs" | "waterfall" | "metrics";

const DEFAULT_SIGNOZ_URL = "http://localhost:8080";
const SIGNOZ_BASE_KEY = "GHOSTTRACE_SIGNOZ_URL";

function normalizeBaseUrl(raw: string): string {
  const value = raw.trim();
  if (!value) {
    return DEFAULT_SIGNOZ_URL;
  }

  let normalized = value.replace(/\/+$/, "");
  if (normalized.endsWith("/home")) {
    normalized = normalized.slice(0, -5) || "/";
  }

  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith("mailto:")) {
    return normalized;
  }

  if (typeof window !== "undefined") {
    const url = new URL(normalized.startsWith("/") ? normalized : `/${normalized}`, window.location.origin);
    return url.toString().replace(/\/+$/, "");
  }

  return normalized;
}

export function getSigNozBaseUrl(): string {
  const runtimeValue = typeof window !== "undefined" ? window.localStorage.getItem(SIGNOZ_BASE_KEY) : null;
  const envValue = (import.meta.env.VITE_SIGNOZ_URL as string | undefined) || null;
  return normalizeBaseUrl(runtimeValue || envValue || DEFAULT_SIGNOZ_URL);
}

function getTemplateFor(action: Exclude<SigNozAction, "home">, traceId: string) {
  const runtimeKeyMap = {
    trace: "GHOSTTRACE_SIGNOZ_TRACE_PATH",
    logs: "GHOSTTRACE_SIGNOZ_LOGS_PATH",
    waterfall: "GHOSTTRACE_SIGNOZ_WATERFALL_PATH",
    metrics: "GHOSTTRACE_SIGNOZ_METRICS_PATH",
  } as const;

  const envKeyMap = {
    trace: "VITE_SIGNOZ_TRACE_PATH",
    logs: "VITE_SIGNOZ_LOGS_PATH",
    waterfall: "VITE_SIGNOZ_WATERFALL_PATH",
    metrics: "VITE_SIGNOZ_METRICS_PATH",
  } as const;

  const runtimeValue = typeof window !== "undefined" ? window.localStorage.getItem(runtimeKeyMap[action]) : null;
  const envValue = (import.meta.env[envKeyMap[action] as keyof ImportMetaEnv] as string | undefined) || null;

  if (runtimeValue) {
    return runtimeValue.replace(/\{traceId\}|\{trace_id\}|\{id\}/g, traceId);
  }

  if (envValue) {
    return envValue.replace(/\{traceId\}|\{trace_id\}|\{id\}/g, traceId);
  }

  return null;
}

export function buildSigNozUrl(action: SigNozAction, traceId?: string): string {
  if (action === "home") {
    return getSigNozBaseUrl();
  }

  const base = getSigNozBaseUrl();
  const baseUrl = new URL(base.endsWith("/") ? base : `${base}/`);
  const trace = encodeURIComponent(traceId || "");
  const template = getTemplateFor(action, trace);

  if (template) {
    return template.startsWith("http")
      ? template.replace(/\{traceId\}|\{trace_id\}|\{id\}/g, trace)
      : new URL(template.replace(/\{traceId\}|\{trace_id\}|\{id\}/g, trace), baseUrl).toString();
  }

  const compositeQueryObj = {
    queryType: "clickhouse_data",
    clickhouseSource: "logs",
    compositeQuery: {
      queryType: "builder",
      panelType: "list",
      builderQueries: {
        A: {
          dataSource: "logs",
          queryName: "A",
          searchText: `trace_id = '${traceId || ""}'`,
          expression: "A",
          disabled: false
        }
      }
    }
  };
  const doubleEncodedLogsQuery = encodeURIComponent(encodeURIComponent(JSON.stringify(compositeQueryObj)));

  const serviceName =
    (typeof window !== "undefined"
      ? window.localStorage.getItem("GHOSTTRACE_SIGNOZ_SERVICE_NAME")
      : null) ||
    (import.meta.env.VITE_SIGNOZ_SERVICE_NAME as string | undefined) ||
    "ghosttrace-ai";

  const actionCandidates = {
    trace: [
      `trace/${trace}`,
      `traces/${trace}`,
      `#/trace/${trace}`,
      `#/traces/${trace}`,
    ],
    logs: [
      `logs-explorer?compositeQuery=${doubleEncodedLogsQuery}`,
      `logs?traceId=${trace}`,
      `logs?query=traceId:${trace}`,
      `#/search?query=traceId:${trace}`,
    ],
    waterfall: [
      `trace/${trace}`,
      `traces/${trace}`,
      `trace/${trace}/waterfall`,
      `#/trace/${trace}/waterfall`,
    ],
    metrics: [
      `services/${encodeURIComponent(serviceName)}`,
      `services`,
      `dashboards`,
      `dashboard`,
    ],
  } as const;

  const candidates = actionCandidates[action].map((candidate) => {
    return new URL(candidate, baseUrl).toString();
  });

  return candidates[0];
}

export function openSigNozUrl(action: SigNozAction, traceId?: string): string {
  const url = buildSigNozUrl(action, traceId);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
