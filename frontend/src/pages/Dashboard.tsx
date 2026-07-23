import { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import Investigation from "../components/Investigation";
import RootCauseAnalysis from "../components/RootCauseAnalysis";
import TelemetryCards from "../components/TelemetryCards";
import InvestigationLoader from "../components/InvestigationLoader";
import AnalyticsChart from "../components/AnalyticsChart";
import AIHealthScore from "../components/AIHealthScore";
import AICopilot from "../components/AICopilot";
import ExecutiveReport from "../components/ExecutiveReport";

import type { Investigation as InvestigationType } from "../types/investigation";

import CaseComparison from "../components/CaseComparison";

import { compareCases } from "../services/api";


export default function Dashboard() {


  const [investigations, setInvestigations] =
    useState<InvestigationType[]>([]);



  const [selectedCase, setSelectedCase] =
    useState<InvestigationType | null>(null);



  const [selectedCompareCases, setSelectedCompareCases] =
    useState<InvestigationType[]>([]);



  const [comparison, setComparison] =
    useState<any>(null);



  const [isInvestigating, setIsInvestigating] =
    useState(false);





  // Compare selected investigations

  const handleCompare = async () => {


    if(selectedCompareCases.length !== 2){

      alert(
        "Select exactly two investigations"
      );

      return;

    }



    try {

const result =
        await compareCases(
          selectedCompareCases[0].case_id,
selectedCompareCases[1].case_id
        );


      setComparison(result);


    }
    catch(error){

      console.log(
        "Comparison failed",
        error
      );

    }


  };




  return (

    <div className="min-h-screen bg-[#0B1020] text-white">


      <Header />



      {/* Live Monitoring */}

      <div className="px-6 pt-4 flex items-center gap-3">


        <div className="flex items-center gap-2 text-green-400 text-sm">

          <span
            className="
            w-2
            h-2
            rounded-full
            bg-green-400
            animate-pulse
            "
          />

          Live Monitoring

        </div>


        <span className="text-gray-500 text-sm">

          Connected to SigNoz

        </span>


      </div>





      <div className="px-6 pt-4">

        <AIHealthScore
          investigations={investigations}
        />

      </div>





      <div className="px-6 pt-4">

        <TelemetryCards
          investigations={investigations}
        />

      </div>






      <div className="px-6 pt-5 h-[330px]">


        <AnalyticsChart
          investigations={investigations}
        />


      </div>





      {/* Comparison Panel */}

      {
        comparison && (

          <div className="px-6 pt-5">

            <CaseComparison
              comparison={comparison}
            />

          </div>

        )
      }






      {/* Workspace */}

      <div
        className="
        grid
        grid-cols-12
        mt-5
        mx-6
        h-[calc(100vh-700px)]
        min-h-[450px]
        rounded-2xl
        overflow-hidden
        border
        border-gray-800
        bg-[#111827]
        "
      >





        {/* Sidebar */}

        <div
          className="
          col-span-3
          border-r
          border-gray-800
          overflow-y-auto
          "
        >


         <Sidebar

  investigations={investigations}

  setInvestigations={setInvestigations}

  selectedCase={selectedCase}

  setSelectedCase={setSelectedCase}

  isInvestigating={isInvestigating}

  setIsInvestigating={setIsInvestigating}


  selectedCompareCases={selectedCompareCases}

  setSelectedCompareCases={setSelectedCompareCases}

  handleCompare={handleCompare}

/>


        </div>








        {/* Timeline */}

        <div
          className="
          col-span-5
          border-r
          border-gray-800
          overflow-y-auto
          "
        >


          {
            isInvestigating ?

            <InvestigationLoader />

            :

            <Timeline
              investigation={selectedCase}
            />

          }


        </div>








        {/* Right Panel */}

        <div
          className="
          col-span-4
          overflow-y-auto
          p-4
          space-y-5
          "
        >



          
          <Investigation
  investigation={selectedCase}
/>

<RootCauseAnalysis
  investigation={selectedCase}
/>

<ExecutiveReport
  investigation={selectedCase}
/>

<AICopilot
  investigation={selectedCase}
/>





          



        </div>





      </div>



    </div>

  );

}