interface Props{

    comparison:any;

}


export default function CaseComparison({
    comparison
}:Props){


if(!comparison)
return null;



return (

<div className="
bg-[#111827]
border
border-gray-700
rounded-2xl
p-5
space-y-5
">


<h2 className="
text-xl
font-bold
">

⚖️ AI Case Comparison

</h2>




<div className="
grid
grid-cols-2
gap-4
">


<div className="
bg-[#151C31]
p-4
rounded-xl
">


<h3 className="font-bold">

{comparison.case1.case_id}

</h3>


<p>
Latency:
<b>
 {comparison.case1.latency}
</b>
</p>


<p>
Confidence:
<b>
 {comparison.case1.confidence}%
</b>
</p>


<p>
Tokens:
<b>
 {comparison.case1.total_tokens}
</b>
</p>


<p>
Cost:
<b>
${comparison.case1.token_cost}
</b>
</p>



</div>






<div className="
bg-[#151C31]
p-4
rounded-xl
">


<h3 className="font-bold">

{comparison.case2.case_id}

</h3>


<p>
Latency:
<b>
 {comparison.case2.latency}
</b>
</p>


<p>
Confidence:
<b>
 {comparison.case2.confidence}%
</b>
</p>


<p>
Tokens:
<b>
 {comparison.case2.total_tokens}
</b>
</p>


<p>
Cost:
<b>
${comparison.case2.token_cost}
</b>
</p>



</div>



</div>





<div className="
bg-blue-900/30
rounded-xl
p-4
">


<h3 className="font-bold">
🧠 AI Analysis
</h3>


<p>
{comparison.summary}
</p>


</div>




</div>

)

}