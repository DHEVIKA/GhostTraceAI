import axios from "axios";

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Normal Investigation
// ==============================

export async function runInvestigation() {
  const response = await api.post("/agent", {
    user_query: "Investigate AI latency",
  });

  return response.data;
}

// ==============================
// Simulation APIs
// ==============================

export async function simulateHealthy() {
  const response = await api.post("/simulate/healthy");
  return response.data;
}

export async function simulateSlow() {
  const response = await api.post("/simulate/slow");
  return response.data;
}

export async function simulateToolFailure() {
  const response = await api.post("/simulate/tool-failure");
  return response.data;
}

export async function simulateHallucination() {
  const response = await api.post("/simulate/hallucination");
  return response.data;
}

export async function simulateTokenSpike() {
  const response = await api.post("/simulate/token-spike");
  return response.data;
}

export async function generateDemoInvestigations() {
  const response = await api.post("/simulate/demo-data");
  return response.data;
}

export async function resetInvestigations(payload: any) {
  const response = await api.post("/investigations/reset", payload);
  return response.data;
}

// ==============================
// Investigation History
// ==============================

export async function getInvestigations() {
  const response = await api.get("/investigations");
  return response.data;
}

// ==============================
// Investigation Report
// ==============================

export async function getInvestigationReport(
  case_id: string
) {
  const response = await api.get(
    `/investigation/${case_id}`
  );

  return response.data;
}

// ==============================
// Compare Cases
// ==============================

export async function compareCases(
  case1: string,
  case2: string
) {
  const response = await api.get(
    `/compare/${case1}/${case2}`
  );

  return response.data;
}

// ==============================
// Health Check
// ==============================

export async function checkBackendHealth() {
  const response = await api.get("/");
  return response.data;
}

export default api;