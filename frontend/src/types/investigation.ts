export interface TimelineStep {
  step: string;
  icon: string;
  status: string;
  timestamp?: string;

  duration?: string;
  latency?: string;
  documents?: number;
  tokens?: number;
  cost?: number;
  confidence?: number;
}

export interface Investigation {
  case_id: string;
  incident: string;
  session_id: string;
  trace_id: string;

  status: string;
  confidence: number;

  latency: string;

  total_tokens: number;
  input_tokens: number;
  output_tokens: number;

  token_cost: number;

  model: string;

  tool: string;
  tool_status: string;

  created_at: string;

  timeline: TimelineStep[];
}