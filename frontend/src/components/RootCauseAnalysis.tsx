import type { Investigation } from "../types/investigation";


interface Props {
  investigation: Investigation | null;
}



export default function RootCauseAnalysis({
  investigation
}: Props) {


  if (!investigation) {

    return (

      <div
        className="
        bg-[#151C31]
        border
        border-gray-700
        rounded-2xl
        p-6
        text-gray-400
        "
      >

        🧠 Select an investigation to generate AI diagnosis.

      </div>

    );

  }




  const timeline =
    investigation.timeline || [];



  const slowStep =
    timeline.find(
      (step:any)=>
        step.status === "Slow"
        ||
        step.status === "slow"
    );




  const detectedIssue =
    slowStep

    ?

    `${slowStep.step} introduced abnormal latency.`

    :

    "AI execution completed without critical latency issues.";





  const affectedComponent =
    slowStep
    ?
    slowStep.step
    :
    "No component requires attention";



  const severity =

    slowStep

    ?

    "HIGH"

    :

    investigation.confidence < 90

    ?

    "MEDIUM"

    :

    "LOW";





  const evidence = [

    slowStep

    ?

    `⚠ ${slowStep.step} exceeded latency threshold`

    :

    "✅ All execution steps completed normally",


    `🎯 Confidence score: ${investigation.confidence}%`,


    `⏱ Total latency: ${investigation.latency}`,


    `🔤 Tokens processed: ${investigation.total_tokens}`

  ];





  const recommendations = slowStep

    ?

    [
      "Enable retrieval cache",
      "Reduce duplicate tool requests",
      "Optimize external API latency"
    ]

    :

    [
      "Continue monitoring latency",
      "Track token consumption",
      "Maintain current configuration"
    ];





  return (

    <div
      className="
      bg-[#151C31]
      border
      border-gray-700
      rounded-2xl
      p-6
      "
    >



      <h2
        className="
        text-xl
        font-bold
        mb-5
        "
      >

        🧠 AI Root Cause Analysis

      </h2>





      <div className="space-y-5">





        <div>

          <p className="text-gray-400 text-sm">

            Detection

          </p>


          <p className="font-semibold">

            {detectedIssue}

          </p>


        </div>







        <div>

          <p className="text-gray-400 text-sm">

            Affected Component

          </p>


          <p className="text-blue-400 font-semibold">

            {affectedComponent}

          </p>


        </div>








        <div>

          <p className="text-gray-400 text-sm">

            Severity

          </p>


          <p
            className={`
            font-bold

            ${
              severity==="HIGH"

              ?

              "text-red-400"

              :

              severity==="MEDIUM"

              ?

              "text-yellow-400"

              :

              "text-green-400"

            }
            `}
          >

            {severity}

          </p>


        </div>









        <div>


          <p className="text-gray-400 text-sm mb-2">

            Evidence

          </p>



          <div className="space-y-2">


          {
            evidence.map(
              (item,index)=>(

                <p
                  key={index}
                  className="text-sm"
                >

                  {item}

                </p>

              )

            )
          }


          </div>



        </div>









        <div>


          <p className="text-gray-400 text-sm mb-2">

            AI Recommendations

          </p>



          <div className="space-y-2">


          {
            recommendations.map(
              (item,index)=>(

                <p
                  key={index}
                  className="
                  text-green-400
                  text-sm
                  "
                >

                  ✓ {item}

                </p>

              )

            )
          }


          </div>



        </div>





        <div
          className="
          border-t
          border-gray-700
          pt-4
          "
        >


          <p className="text-gray-400 text-sm">

            AI Confidence

          </p>


          <p className="text-2xl font-bold">

            {investigation.confidence}%

          </p>



        </div>





      </div>



    </div>

  );

}