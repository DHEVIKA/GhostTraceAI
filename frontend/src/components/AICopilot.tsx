import { useState } from "react";
import api from "../services/api";
import type { Investigation } from "../types/investigation";

interface Props {
  investigation: Investigation | null;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AICopilot({
  investigation,
}: Props) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Hi! I'm GhostTrace AI Copilot.\n\nAsk me anything about the selected investigation.",
    },
  ]);

  const askCopilot = async () => {
    if (!investigation) return;

    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;

    setQuestion("");

    setLoading(true);

    try {
      const response = await api.post("/copilot", {
        case_id: investigation.case_id,
        question: currentQuestion,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.answer,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Unable to contact AI Copilot.",
        },
      ]);
    }

    setLoading(false);
  };

  if (!investigation) {
    return (
      <div className="bg-[#151C31] rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-3">
          🤖 AI Copilot
        </h2>

        <p className="text-gray-400">
          Select an investigation first.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#151C31] rounded-2xl p-6 mt-5">

      <h2 className="text-xl font-bold mb-4">
        🤖 AI Copilot
      </h2>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-4">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-xl p-3 whitespace-pre-wrap ${
              message.role === "assistant"
                ? "bg-[#1E293B]"
                : "bg-blue-600"
            }`}
          >
            <strong>
              {message.role === "assistant"
                ? "Copilot"
                : "You"}
            </strong>

            <div className="mt-1">
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-[#1E293B] rounded-xl p-3">
            🤖 Thinking...
          </div>
        )}

      </div>

      <div className="flex gap-3">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askCopilot();
            }
          }}
          placeholder="Ask about this investigation..."
          className="
            flex-1
            rounded-xl
            bg-[#0B1020]
            border
            border-gray-700
            px-4
            py-3
            outline-none
          "
        />

        <button
          onClick={askCopilot}
          disabled={loading}
          className="
            bg-blue-600
            hover:bg-blue-700
            px-5
            rounded-xl
            disabled:bg-gray-600
          "
        >
          Ask
        </button>

      </div>
    </div>
  );
}