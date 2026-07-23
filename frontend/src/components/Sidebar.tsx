import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  runInvestigation,
  simulateHealthy,
  simulateSlow,
  simulateToolFailure,
  simulateHallucination,
  simulateTokenSpike,
  generateDemoInvestigations,
} from "../services/api";
import type { Investigation } from "../types/investigation";
import toast from "react-hot-toast";
import api from "../services/api";



interface SidebarProps {

  investigations: Investigation[];

  setInvestigations: React.Dispatch<
    React.SetStateAction<Investigation[]>
  >;

  selectedCase: Investigation | null;

  setSelectedCase: (
    item: Investigation | null
  ) => void;

  isInvestigating: boolean;

  setIsInvestigating: React.Dispatch<
    React.SetStateAction<boolean>
  >;


  selectedCompareCases: Investigation[];

  setSelectedCompareCases: React.Dispatch<
    React.SetStateAction<Investigation[]>
  >;

  handleCompare:()=>void;

}



export default function Sidebar({

  investigations,

  setInvestigations,

  selectedCase,

  setSelectedCase,

  setIsInvestigating,

  selectedCompareCases,

  setSelectedCompareCases,

  handleCompare,

}: SidebarProps) {

  const [loading,setLoading] = useState(false);

  const [filter,setFilter] = useState("All");

  const [search,setSearch] = useState("");




  useEffect(()=>{


    loadInvestigations();


    const interval=setInterval(()=>{

      loadInvestigations(true);

    },5000);



    return ()=>clearInterval(interval);


  },[]);





  const loadInvestigations = async(
    silent=false
  )=>{


    try{


      const response =
        await api.get("/investigations");


      const data=response.data;



      if(
        silent &&
        data.length > investigations.length
      ){

        toast.success(
          "New AI investigation detected!"
        );

      }



      setInvestigations(data);

      // Preserve current selection when the case list refreshes.
      // Do not auto-select a case on load, so details only open when the user chooses one.

    }
    catch(error){

      console.error(error);

    }


  };







  const createCase = async()=>{


    if(loading)
      return;



    setLoading(true);

    setIsInvestigating(true);



    toast.loading(
      "Running AI investigation...",
      {
        id:"investigation"
      }
    );



    try{


      const result =
        await runInvestigation();



      console.log(
        "Investigation Result:",
        result
      );

      const refreshed = await api.get("/investigations");
      const updatedInvestigations = refreshed.data;
      setInvestigations(updatedInvestigations);
      setSelectedCompareCases([]);
      if (Array.isArray(updatedInvestigations) && updatedInvestigations.length > 0) {
        setSelectedCase(updatedInvestigations[updatedInvestigations.length - 1]);
      } else {
        setSelectedCase(result);
      }


      toast.success(
        "Investigation completed",
        {
          id:"investigation"
        }
      );



    }
    catch(error){


      console.error(error);



      toast.error(
        "Investigation failed",
        {
          id:"investigation"
        }
      );


    }
    finally{


      setLoading(false);

      setIsInvestigating(false);


    }

  };

  const runSimulation = async (
  type:
    | "healthy"
    | "slow"
    | "tool"
    | "hallucination"
    | "token"
) => {
  if (loading) return;

  setLoading(true);
  setIsInvestigating(true);

  toast.loading("Running AI Simulation...", {
    id: "simulation",
  });

  try {
    let result;

    switch (type) {
      case "healthy":
        result = await simulateHealthy();
        break;

      case "slow":
        result = await simulateSlow();
        break;

      case "tool":
        result = await simulateToolFailure();
        break;

      case "hallucination":
        result = await simulateHallucination();
        break;

      case "token":
        result = await simulateTokenSpike();
        break;
    }

    // Replace server + client state so simulations don't accumulate old cases
    const apiSvc = await import("../services/api");
    const resetResp = await apiSvc.resetInvestigations(result);
    setInvestigations(resetResp);
    setSelectedCompareCases([]);
    if (Array.isArray(resetResp) && resetResp.length > 0) {
      setSelectedCase(resetResp[0]);
    } else {
      setSelectedCase(result);
    }

    toast.success("Simulation Completed", {
      id: "simulation",
    });
  } catch (err) {
    console.error(err);
 
    toast.error("Simulation Failed", {
      id: "simulation",
    });
  } finally {
    setLoading(false);
    setIsInvestigating(false);
  }
};

const generateDemoData = async () => {
 if (loading) return;

 setLoading(true);
 setIsInvestigating(true);

 toast.loading("Generating demo investigations...", {
   id: "demo-data",
 });

 try {
   const result = await generateDemoInvestigations();

   // The server returns the demo set (simulate/demo-data replaces server list). Use that response directly.
   if (Array.isArray(result)) {
     setInvestigations(result);
     setSelectedCompareCases([]);
     if (result.length > 0) setSelectedCase(result[0]);
   }

   toast.success("Demo investigations generated", {
     id: "demo-data",
   });
 } catch (err) {
   console.error(err);
   toast.error("Failed to generate demo data", {
     id: "demo-data",
   });
 } finally {
   setLoading(false);
   setIsInvestigating(false);
 }
};
 
 const toggleCompare = (
item: Investigation
)=>{


const exists =
selectedCompareCases.find(
x=>x.case_id===item.case_id
);


if(exists){

setSelectedCompareCases(
selectedCompareCases.filter(
x=>x.case_id!==item.case_id
)
);


}
else{


if(selectedCompareCases.length >=2){

toast.error(
"Only 2 cases can be compared"
);

return;

}


setSelectedCompareCases([
...selectedCompareCases,
item
]);


}


};







  const filteredInvestigations =
    investigations.filter(item=>{


      const searchMatch =
        item.case_id
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );



      let filterMatch=true;



      switch(filter){


        case "Healthy":

          filterMatch =
            item.tool_status==="Healthy";

          break;



        case "Slow Tool":

          filterMatch =
            item.tool_status==="Slow";

          break;



        case "Needs Review":

          filterMatch =
            item.confidence < 90;

          break;



        case "High Severity":

          filterMatch =
            item.tool_status==="Slow"
            ||
            item.confidence < 90;

          break;


        default:

          filterMatch=true;

      }



      return searchMatch && filterMatch;


    });







return (

<div className="h-full p-6 bg-[#0F172A] text-white">



<div className="flex justify-between items-center mb-6">


<div>

<h2 className="text-2xl font-bold">
Investigation Cases
</h2>


<p className="text-gray-400 text-sm">
AI Agent Execution History
</p>


</div>




<button

onClick={createCase}



disabled={loading}

className="
bg-blue-600
hover:bg-blue-700
disabled:bg-blue-400
px-4
py-2
rounded-xl
"

>

{
loading
?
"Investigating..."
:
"+ New"
}


</button>


</div>

<div className="grid grid-cols-2 gap-2 mt-4 mb-6">

  <button
    onClick={(e) => {
  e.stopPropagation();
  runSimulation("healthy");
}}
    className="bg-green-600 hover:bg-green-700 rounded-xl py-2"
  >
    ✅ Healthy
  </button>

  <button
    onClick={(e) => {
  e.stopPropagation();
  runSimulation("slow");
}}
    className="bg-yellow-600 hover:bg-yellow-700 rounded-xl py-2"
  >
    🐢 Slow API
  </button>

  <button
    onClick={(e) => {
  e.stopPropagation();
  runSimulation("tool");
}}
    className="bg-red-600 hover:bg-red-700 rounded-xl py-2"
  >
    ❌ Tool Failure
  </button>

  <button
    onClick={(e) => {
  e.stopPropagation();
  runSimulation("hallucination");
}}
    className="bg-purple-600 hover:bg-purple-700 rounded-xl py-2"
  >
    🤖 Hallucination
  </button>

  <button
    onClick={(e) => {
  e.stopPropagation();
  runSimulation("token");
}}
    className="col-span-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl py-2"
  >
    🔥 Token Spike
  </button>

<button
  onClick={(e) => {
    e.stopPropagation();
    generateDemoData();
  }}
  className="col-span-2 bg-violet-600 hover:bg-violet-700 rounded-xl py-2"
>
  🧪 Generate 50 Investigations
</button>

</div>





<input

type="text"

placeholder="🔍 Search CASE ID..."

value={search}

onChange={
(e)=>setSearch(e.target.value)
}

className="
w-full
mb-4
px-4
py-3
rounded-xl
bg-[#151C31]
border
border-gray-700
outline-none
"

/>





<div className="flex flex-wrap gap-2 mb-5">



<button

className="
flex-1
bg-[#1B2644]
rounded-xl
py-2
"

onClick={()=>{

const blob=new Blob(
[
JSON.stringify(
investigations,
null,
2
)
],
{
type:"application/json"
}
);


const url=
URL.createObjectURL(blob);


const a=document.createElement("a");

a.href=url;

a.download=
"ghosttrace-investigations.json";

a.click();


}}

>

📄 JSON

</button>





<button

className="
flex-1
bg-green-700
rounded-xl
py-2
"

onClick={()=>{


const csv=[
[
"Case ID",
"Status",
"Confidence",
"Latency",
"Tokens",
"Model",
"Tool"
].join(","),


...investigations.map(item=>

[
item.case_id,
item.status,
item.confidence,
item.latency,
item.total_tokens,
item.model,
item.tool

].join(",")

)

].join("\n");



const blob=new Blob(
[csv],
{
type:"text/csv"
}
);



const url=
URL.createObjectURL(blob);



const a=document.createElement("a");

a.href=url;

a.download=
"ghosttrace.csv";

a.click();


}}

>

📊 CSV

</button>







<button

className="
flex-1
bg-red-700
rounded-xl
py-2
"

onClick={()=>{


const pdf=new jsPDF();


pdf.text(
"GhostTrace AI Report",
20,
20
);


let y=40;


investigations.forEach(item=>{


pdf.text(
`Case: ${item.case_id}`,
20,
y
);

y+=10;


pdf.text(
`Confidence: ${item.confidence}%`,
20,
y
);


y+=10;


pdf.text(
`Latency: ${item.latency}`,
20,
y
);


y+=15;


});


pdf.save(
"ghosttrace-report.pdf"
);


}}

>

📑 PDF

</button>



</div>







<div className="flex flex-wrap gap-2 mb-5">


{
[
"All",
"Healthy",
"Slow Tool",
"Needs Review",
"High Severity"

].map(item=>(


<button

key={item}

onClick={()=>setFilter(item)}

className={`
px-3
py-1
rounded-full
text-sm

${
filter===item
?
"bg-blue-600"
:
"bg-[#1B2644]"
}

`}

>

{item}

</button>


))

}


</div>



<button

onClick={handleCompare}

disabled={
selectedCompareCases.length!==2
}

className="
w-full
bg-purple-700
disabled:bg-gray-600
py-3
rounded-xl
font-bold
mb-5
"

>

⚖️ Compare Selected Cases

({selectedCompareCases.length}/2)

</button>






<div className="space-y-5">


{
filteredInvestigations.map(item=>(


<div

key={item.session_id}

onClick={()=>setSelectedCase(item)}

className={`

rounded-2xl
p-5
cursor-pointer
border

${
selectedCase?.case_id===item.case_id

?

"border-blue-500 bg-[#1B2644]"

:

"border-gray-700 bg-[#151C31]"

}

`}

>



<div className="flex justify-between">


<div>

<div className="flex items-center gap-2">


<input

type="checkbox"

checked={
selectedCompareCases.some(
x=>x.case_id===item.case_id
)
}

onChange={(e)=>{

e.stopPropagation();

toggleCompare(item);

}}

/>


<h3 className="font-bold">

{item.case_id}

</h3>


</div>


<div className="mt-1">

  {item.incident === "healthy" && (
    <span className="text-green-400 text-sm">
      🟢 Healthy
    </span>
  )}

  {item.incident === "slow_api" && (
    <span className="text-yellow-400 text-sm">
      🐢 Slow API
    </span>
  )}

  {item.incident === "vector_failure" && (
    <span className="text-red-400 text-sm">
      ❌ Tool Failure
    </span>
  )}

  {item.incident === "hallucination" && (
    <span className="text-purple-400 text-sm">
      🤖 Hallucination
    </span>
  )}

  {item.incident === "token_spike" && (
    <span className="text-cyan-400 text-sm">
      🔥 Token Spike
    </span>
  )}

</div>


</div>



<div className="text-blue-400 font-bold">

{item.confidence}%

</div>



</div>






<div className="grid grid-cols-2 gap-3 mt-4 text-sm">


<div>
Latency
<br/>
{item.latency}
</div>



<div>
Tokens
<br/>
{item.total_tokens}
</div>



<div>
Model
<br/>
{item.model}
</div>



<div>
Cost
<br/>
${item.token_cost}
</div>


</div>





</div>


))

}



</div>






</div>


);


}