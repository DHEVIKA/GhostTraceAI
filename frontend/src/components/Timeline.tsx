import type { Investigation } from "../types/investigation";
import useReplay from "../hooks/useReplay";

interface TimelineProps {
  investigation: Investigation | null;
}


const getStatusStyle = (status: string) => {

  switch (status) {

    case "Slow":
      return {
        icon: "🟡",
        style:
          "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
      };


    case "Failed":
      return {
        icon: "🔴",
        style:
          "bg-red-500/20 text-red-400 border-red-500/40",
      };


    default:
      return {
        icon: "🟢",
        style:
          "bg-green-500/20 text-green-400 border-green-500/40",
      };

  }

};



export default function Timeline({
  investigation,
}: TimelineProps) {


  const visibleSteps = useReplay(
    investigation ? investigation.timeline.length : 0
  );



  if (!investigation) {

    return (
      <div className="p-6">

        <h2 className="text-2xl font-bold mb-6">
          Replay Timeline
        </h2>


        <div className="bg-[#151C31] rounded-2xl p-6 text-gray-400">

          Select an investigation to replay the AI workflow.

        </div>


      </div>
    );

  }



  return (

    <div className="h-full overflow-y-auto p-6">


      <h2 className="text-2xl font-bold mb-6">
        AI Investigation Replay
      </h2>



      <div className="space-y-5">


        {investigation.timeline
          .slice(0, visibleSteps)
          .map((step, index) => {


            const statusBadge =
              getStatusStyle(step.status);



            return (

              <div key={index}>


                <div
                  className={`rounded-2xl border p-5 transition-all duration-500 ${
                    step.status === "Slow"
                      ? "border-yellow-500 bg-yellow-950/20"
                      : step.status === "Failed"
                      ? "border-red-500 bg-red-950/20"
                      : "border-gray-700 bg-[#151C31]"
                  }`}
                >



                  <div className="flex justify-between items-center">


                    <div className="flex items-center gap-4">


                      <div className="text-3xl">

                        {step.icon}

                      </div>



                      <div>


                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-bold text-lg">
                            {step.step}
                          </h3>

                          {step.timestamp && (
                            <span className="text-xs text-slate-400">
                              {step.timestamp}
                            </span>
                          )}
                        </div>

                        <span
                          className={`
                          inline-flex items-center
                          mt-2
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-semibold
                          border
                          ${statusBadge.style}
                          `}
                        >

                          {statusBadge.icon} {step.status}

                        </span>


                      </div>


                    </div>





                    <div className="text-right">


                      {step.duration && (

                        <div className="text-sm text-gray-400">

                          {step.duration}

                        </div>

                      )}



                      {step.latency && (

                        <div className="text-yellow-400 font-semibold">

                          {step.latency}

                        </div>

                      )}


                    </div>


                  </div>





                  <div className="grid grid-cols-2 gap-4 mt-5 text-sm">



                    {step.documents && (

                      <div>

                        <span className="text-gray-400">
                          Documents
                        </span>


                        <div className="font-semibold">

                          {step.documents}

                        </div>

                      </div>

                    )}




                    {step.tokens && (

                      <div>

                        <span className="text-gray-400">
                          Tokens
                        </span>


                        <div className="font-semibold">

                          {step.tokens}

                        </div>


                      </div>

                    )}




                    {step.cost !== undefined && (

                      <div>

                        <span className="text-gray-400">
                          Cost
                        </span>


                        <div className="font-semibold">

                          ${step.cost}

                        </div>


                      </div>

                    )}





                    {step.confidence && (

                      <div>

                        <span className="text-gray-400">
                          Confidence
                        </span>


                        <div className="font-semibold text-blue-400">

                          {step.confidence}%

                        </div>


                      </div>

                    )}



                  </div>



                </div>





                {index !== visibleSteps - 1 && (

                  <div className="flex justify-center py-2 text-blue-400 text-2xl">

                    ↓

                  </div>

                )}



              </div>

            );


          })}



      </div>


    </div>

  );

}