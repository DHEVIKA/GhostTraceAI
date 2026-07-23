import { useEffect, useState } from "react";

const steps = [
  {
    icon: "🧠",
    title: "Planner",
    message: "Analyzing user request...",
  },
  {
    icon: "📚",
    title: "Memory Search",
    message: "Searching vector database...",
  },
  {
    icon: "🛠",
    title: "Knowledge API",
    message: "Calling external tools...",
  },
  {
    icon: "🤖",
    title: "Gemini Analysis",
    message: "Generating AI reasoning...",
  },
  {
    icon: "✅",
    title: "Validator",
    message: "Validating response...",
  },
];

export default function InvestigationLoader() {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    setVisibleSteps(0);

    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= steps.length) {
          clearInterval(interval);
          return prev;
        }

        return prev + 1;
      });
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col justify-center px-8">

      <div className="bg-[#151C31] border border-blue-900 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold mb-2">
          AI Investigation
        </h2>

        <p className="text-gray-400 mb-8">
          Initializing investigation pipeline...
        </p>

        <div className="space-y-6">

          {steps.slice(0, visibleSteps).map((step, index) => (

            <div key={index}>

              <div className="flex items-center gap-4">

                <div className="text-3xl">
                  {step.icon}
                </div>

                <div className="flex-1">

                  <div className="flex justify-between items-center">

                    <h3 className="font-semibold text-lg">
                      {step.title}
                    </h3>

                    <span className="text-green-400 font-semibold">
                      ✓
                    </span>

                  </div>

                  <p className="text-gray-400 text-sm mt-1">
                    {step.message}
                  </p>

                </div>

              </div>

              {index !== visibleSteps - 1 && (
                <div className="ml-4 mt-3 mb-1 text-blue-400 text-xl">
                  ↓
                </div>
              )}

            </div>

          ))}

        </div>

        <div className="mt-10 border-t border-gray-700 pt-6">

          {visibleSteps < steps.length ? (

            <div className="flex items-center gap-3">

              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              <span className="text-blue-400 font-medium">
                Investigating AI workflow...
              </span>

            </div>

          ) : (

            <div className="flex items-center gap-3">

              <span className="text-2xl">🎯</span>

              <span className="text-green-400 font-semibold">
                Investigation completed successfully.
              </span>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}