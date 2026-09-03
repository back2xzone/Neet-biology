/* =========================================================
   NEET BIOLOGY APP ENGINE
========================================================= */


/* ================= DATA ================= */

const CHAPTERS = {

11:[
["1","The Living World","living-world"],
["2","Biological Classification","biological-classification"],
["3","Plant Kingdom","plant-kingdom"],
["4","Animal Kingdom","animal-kingdom"],
["5","Morphology of Flowering Plants","morphology"],
["6","Anatomy of Flowering Plants","anatomy"],
["7","Structural Organisation in Animals","structural-animals"],
["8","Cell: The Unit of Life","cell"],
["9","Biomolecules","biomolecules"],
["10","Cell Cycle and Cell Division","cell-cycle"],
["11","Photosynthesis in Higher Plants","photosynthesis"],
["12","Respiration in Plants","respiration"],
["13","Plant Growth and Development","plant-growth"],
["14","Breathing and Exchange of Gases","breathing"],
["15","Body Fluids and Circulation","body-fluids"],
["16","Excretory Products and their Elimination","excretion"],
["17","Locomotion and Movement","locomotion"],
["18","Neural Control and Coordination","neural"],
["19","Chemical Coordination and Integration","endocrine"]
],

12:[
["1","Sexual Reproduction in Flowering Plants","flowering-reproduction"],
["2","Human Reproduction","human-reproduction"],
["3","Reproductive Health","reproductive-health"],
["4","Principles of Inheritance and Variation","inheritance"],
["5","Molecular Basis of Inheritance","molecular-inheritance"],
["6","Evolution","evolution"],
["7","Human Health and Disease","human-health"],
["8","Microbes in Human Welfare","microbes"],
["9","Biotechnology: Principles and Processes","biotech-principles"],
["10","Biotechnology and its Applications","biotech-applications"],
["11","Organisms and Populations","organisms-populations"],
["12","Ecosystem","ecosystem"],
["13","Biodiversity and Conservation","biodiversity"]
]

};


/* ================= STATE ================= */

let currentClass=11;
let currentChapter=null;

let quiz=[];
let quizIndex=0;
let quizScore=0;
let quizStart=0;
let timerInterval=null;
let questionTimes=[];
let wrongThisRun=[];

let calendarDate=new Date();


let state=JSON.parse(
 localStorage.getItem("NEET_BIOLOGY_STATE")
 ||
 '{"attempts":[],"wrong":[]}'
);


/* ================= NAVIGATION ================= */

function show(id){

 document.querySelectorAll(".screen")
 .forEach(x=>x.classList.remove("active"));

 document.getElementById(id)
 .classList.add("active");

 window.scrollTo(0,0);

}


function home(){

 stopTimer();

 updateDashboard();

 renderCalendar();

 show("home");

}


function openClass(cls){

 currentClass=cls;

 document.getElementById("classTitle").textContent=
 "Class "+cls+" Biology";

 document.getElementById("classSubtitle").textContent=
 cls===11
 ?"19 chapters • NCERT-first practice"
 :"13 chapters • NCERT-first practice";

 renderChapters();

 show("chapters");

}


function backToChapters(){

 renderChapters();

 show("chapters");

}


function renderChapters(){

 const box=document.getElementById("chapterList");

 box.innerHTML="";

 CHAPTERS[currentClass].forEach(c=>{

   const num=c[0];
   const name=c[1];
   const id=c[2];

   const qs=QUESTIONS.filter(
     q=>q.class===currentClass &&
     q.chapter===id
   );

   const div=document.createElement("div");

   div.className="chapter";

   div.onclick=()=>openChapter(id,name,num);

   div.innerHTML=`

     <div class="chapter-top">

       <div>

         <div class="number">
           Chapter ${num}
         </div>

         <h3>${name}</h3>

       </div>

       <div class="arrow">›</div>

     </div>

     <div class="count ${qs.length?"ready":""}">
       ${qs.length
       ?qs.length+" questions"
       :"No questions yet"}
     </div>

   `;

   box.appendChild(div);

 });

}


function openChapter(id,name,num){

 currentChapter=id;

 document.getElementById("chapterNumber").textContent=
 "CHAPTER "+num;

 document.getElementById("chapterTitle").textContent=
 name;

 const qs=QUESTIONS.filter(
   q=>q.class===currentClass &&
   q.chapter===id
 );

 document.getElementById("chapterQuestions").textContent=
 qs.length;

 const stats=getChapterStats(currentClass,id);

 document.getElementById("chapterAccuracy").textContent=
 stats.accuracy;

 document.getElementById("chapterTime").textContent=
 stats.avgTime;

 document.getElementById("chapterWrong").textContent=
 stats.wrong;

 document.getElementById("chapterStatus").textContent=
 qs.length
 ?"This chapter is ready for practice."
 :"Question bank not added yet.";

 show("chapter");

}


/* ================= PRACTICE ================= */

function startChapterPractice(){

 let pool=QUESTIONS.filter(
   q=>q.class===currentClass &&
   q.chapter===currentChapter
 );

 const mode=document.getElementById("practiceMode").value;

 if(mode==="ncert")
   pool=pool.filter(q=>q.source==="NCERT");

 if(mode==="exemplar")
   pool=pool.filter(q=>q.source==="NCERT Exemplar");

 if(mode==="pyq")
   pool=pool.filter(q=>q.source==="NEET PYQ");

 if(mode==="wrong")
   pool=pool.filter(q=>state.wrong.includes(q.id));


 if(!pool.length){

   alert("There are no questions in this category yet.");

   return;

 }


 pool=[...pool].sort(
   ()=>Math.random()-.5
 );


 const requested=
 document.getElementById("questionCount").value;


 const n=
 requested==="all"
 ?pool.length
 :Math.min(+requested,pool.length);


 quiz=pool.slice(0,n);

 quizIndex=0;
 quizScore=0;
 questionTimes=[];
 wrongThisRun=[];

 show("quiz");

 renderQuestion();

}


/* ================= TIMER ================= */

function startTimer(){

 quizStart=Date.now();

 timerInterval=setInterval(()=>{

   const seconds=
   Math.floor((Date.now()-quizStart)/1000);

   document.getElementById("timer").textContent=
   formatTime(seconds);

 },250);

}


function stopTimer(){

 if(timerInterval){

   clearInterval(timerInterval);

   timerInterval=null;

 }

}


function formatTime(seconds){

 const min=Math.floor(seconds/60);

 const sec=seconds%60;

 return String(min).padStart(2,"0")
 +":"
 +String(sec).padStart(2,"0");

}


/* ================= QUESTIONS ================= */

function renderQuestion(){

 stopTimer();

 const q=quiz[quizIndex];

 document.getElementById("quizMeta").textContent=
 `Question ${quizIndex+1} of ${quiz.length} • ${q.topic}`;

 document.getElementById("quizSource").textContent=
 q.source;

 document.getElementById("quizQuestion").textContent=
 q.question;

 const letters=["A","B","C","D"];

 document.getElementById("quizOptions").innerHTML=
 q.options.map((o,i)=>`

 <button
 class="option"
 onclick="answerQuestion(${i})">

 <span class="letter">
 ${letters[i]}
 </span>

 <span>${o}</span>

 </button>

 `).join("");

 document.getElementById("quizFeedback").innerHTML="";

 document.getElementById("nextButton").style.display="none";

 document.getElementById("timer").textContent="00:00";

 startTimer();

}


function answerQuestion(choice){

 if(
 document.querySelector(".option.correct") ||
 document.querySelector(".option.wrong")
 )return;


 stopTimer();


 const q=quiz[quizIndex];

 const timeTaken=
 Math.round((Date.now()-quizStart)/1000);


 questionTimes.push(timeTaken);


 const correct=
 choice===q.answer;


 if(correct){

   quizScore++;

 }else{

   if(!state.wrong.includes(q.id))
     state.wrong.push(q.id);

   wrongThisRun.push(q);

 }


 state.attempts.push({

   id:q.id,

   class:q.class,

   chapter:q.chapter,

   topic:q.topic,

   source:q.source,

   correct:correct,

   time:timeTaken,

   date:getDateKey(new Date())

 });


 saveState();


 document.querySelectorAll(".option")
 .forEach((button,index)=>{

   button.style.pointerEvents="none";

   if(index===q.answer)
     button.classList.add("correct");

   if(index===choice && !correct)
     button.classList.add("wrong");

 });


 document.getElementById("quizFeedback").innerHTML=`

 <div class="feedback ${correct?"good":"bad"}">

 <b>${correct?"Correct":"Incorrect"}</b>

 <br>

 ${correct
 ?"Good. Keep the reasoning."
 :"Correct answer: "+String.fromCharCode(65+q.answer)}

 </div>

 <div class="explain">

 <b>Why:</b> ${q.explanation}

 </div>

 `;


 const next=document.getElementById("nextButton");

 next.style.display="block";

 next.textContent=
 quizIndex===quiz.length-1
 ?"See Results"
 :"Next";

}


function nextQuestion(){

 if(quizIndex<quiz.length-1){

   quizIndex++;

   renderQuestion();

 }else{

   showResults();

 }

}


function exitQuiz(){

 stopTimer();

 showChapter();

}


/* ================= RESULTS ================= */

function showResults(){

 const totalTime=
 questionTimes.reduce((a,b)=>a+b,0);

 const accuracy=
 Math.round(
 quizScore/quiz.length*100
 );


 document.getElementById("resultScore").textContent=
 quizScore+"/"+quiz.length;

 document.getElementById("resultAccuracy").textContent=
 accuracy+"%";

 document.getElementById("resultTime").textContent=
 formatDuration(totalTime);

 document.getElementById("resultAvg").textContent=
 formatSeconds(
 Math.round(totalTime/quiz.length)
 );


 document.getElementById("resultTitle").textContent=
 accuracy>=85
 ?"Strong performance."
 :"Useful diagnostic.";


 document.getElementById("resultText").textContent=
 accuracy>=85
 ?"Accuracy is solid. Keep revisiting mistakes."
 :"Your mistakes identify what deserves another look in NCERT.";


 updateDashboard();

 show("results");

}


function redoWrong(){

 document.getElementById("practiceMode").value="wrong";

 startChapterPractice();

}


/* ================= DASHBOARD ================= */

function updateDashboard(){

 const attempts=state.attempts;

 const today=
 attempts.filter(
   x=>x.date===getDateKey(new Date())
 );

 const week=
 attempts.filter(
   x=>withinDays(x.date,7)
 );

 const month=
 attempts.filter(
   x=>withinDays(x.date,30)
 );


 document.getElementById("todayQuestions").textContent=
 today.length;

 document.getElementById("todayAccuracy").textContent=
 getAccuracy(today);

 document.getElementById("todayTime").textContent=
 formatDuration(
   today.reduce((a,b)=>a+b.time,0)
 );

 document.getElementById("todayAvg").textContent=
 today.length
 ?formatSeconds(
   Math.round(
     today.reduce((a,b)=>a+b.time,0)
     /today.length
   )
 )
 :"—";


 document.getElementById("weekQuestions").textContent=
 week.length;

 document.getElementById("monthQuestions").textContent=
 month.length;

 document.getElementById("allQuestions").textContent=
 attempts.length;

 document.getElementById("allAccuracy").textContent=
 getAccuracy(attempts);


 renderWeakTopics();

}


function getAccuracy(arr){

 if(!arr.length)return "—";

 return Math.round(
   arr.filter(x=>x.correct).length
   /arr.length*100
 )+"%";

}


/* ================= WEAK TOPICS ================= */

function renderWeakTopics(){

 const box=document.getElementById("weakTopics");

 const groups={};


 state.attempts.forEach(a=>{

   const key=
   a.class+"|"+a.chapter+"|"+a.topic;

   if(!groups[key]){

     groups[key]={
       class:a.class,
       chapter:a.chapter,
       topic:a.topic,
       attempts:0,
       correct:0,
       wrong:0,
       totalTime:0
     };

   }

   const g=groups[key];

   g.attempts++;

   if(a.correct)
     g.correct++;
   else
     g.wrong++;

   g.totalTime+=a.time;

 });


 const data=
 Object.values(groups)
 .map(g=>{

   g.accuracy=
   Math.round(
     g.correct/g.attempts*100
   );

   g.avgTime=
   Math.round(
     g.totalTime/g.attempts
   );

   /*
     Weakness score:
     - low accuracy matters most
     - repeated wrong answers matter
     - slow solving adds a smaller signal
   */

   g.weakness=
     (100-g.accuracy)
     +(g.wrong*3)
     +(g.avgTime>60?10:0);

   return g;

 })
 .filter(g=>g.attempts>=2)
 .sort((a,b)=>b.weakness-a.weakness)
 .slice(0,5);


 if(!data.length){

   box.innerHTML=`

   <div class="card empty">

     Weak topics will appear here after you've
     attempted questions.

   </div>

   `;

   return;

 }


 box.innerHTML=data.map(g=>`

 <div class="weak-card">

   <div class="weak-top">

     <div class="weak-name">
       ${g.topic}
     </div>

     <div class="weak-score">
       ${g.accuracy}%
     </div>

   </div>

   <div class="weak-details">

     ${g.wrong} wrong •
     ${g.attempts} attempts •
     ${formatSeconds(g.avgTime)} average

   </div>

 </div>

 `).join("");

}


/* ================= CHAPTER STATS ================= */

function getChapterStats(cls,chapter){

 const a=
 state.attempts.filter(
   x=>x.class===cls &&
   x.chapter===chapter
 );


 if(!a.length){

   return{
     accuracy:"—",
     avgTime:"—",
     wrong:0
   };

 }


 return{

   accuracy:getAccuracy(a),

   avgTime:formatSeconds(
     Math.round(
       a.reduce((x,y)=>x+y.time,0)
       /a.length
     )
   ),

   wrong:a.filter(x=>!x.correct).length

 };

}


/* ================= CALENDAR ================= */

function renderCalendar(){

 const year=calendarDate.getFullYear();

 const month=calendarDate.getMonth();

 const first=
 new Date(year,month,1);

 const days=
 new Date(year,month+1,0).getDate();

 document.getElementById("calendarTitle").textContent=
 first.toLocaleString("en-US",{
   month:"long",
   year:"numeric"
 });


 const box=document.getElementById("calendar");

 box.innerHTML="";


 for(let i=0;i<first.getDay();i++){

   const empty=document.createElement("div");

   empty.className="day empty";

   box.appendChild(empty);

 }


 for(let day=1;day<=days;day++){

   const d=
   new Date(year,month,day);

   const key=getDateKey(d);

   const count=
   state.attempts.filter(
     x=>x.date===key
   ).length;


   const div=document.createElement("div");

   div.className="day";


   if(
   d.toDateString()===
   new Date().toDateString()
   )
   div.classList.add("today");


   if(count>=1)
     div.classList.add("active-1");

   if(count>=20)
     div.classList.add("active-2");

   if(count>=50)
     div.classList.add("active-3");


   div.innerHTML=`

   <div class="day-number">
     ${day}
   </div>

   <div class="day-count">
     ${count?count+" Q":""}
   </div>

   `;


   box.appendChild(div);

 }

}


function previousMonth(){

 calendarDate.setMonth(
   calendarDate.getMonth()-1
 );

 renderCalendar();

}


function nextMonth(){

 calendarDate.setMonth(
   calendarDate.getMonth()+1
 );

 renderCalendar();

}


/* ================= HELPERS ================= */

function getDateKey(date){

 return date.getFullYear()
 +"-"
 +String(date.getMonth()+1).padStart(2,"0")
 +"-"
 +String(date.getDate()).padStart(2,"0");

}


function withinDays(dateKey,days){

 const date=
 new Date(dateKey+"T00:00:00");

 const now=
 new Date();

 const diff=
 (new Date(
   now.getFullYear(),
   now.getMonth(),
   now.getDate()
 )-date)/(1000*60*60*24);

 return diff>=0 && diff<days;

}


function formatSeconds(seconds){

 if(seconds<60)
   return seconds+"s";

 const min=Math.floor(seconds/60);

 const sec=seconds%60;

 return min+"m "+sec+"s";

}


function formatDuration(seconds){

 if(!seconds)return "0m";

 const hours=Math.floor(seconds/3600);

 const min=Math.floor(
   (seconds%3600)/60
 );

 if(hours)
   return hours+"h "+min+"m";

 return min+"m";

}


function saveState(){

 localStorage.setItem(
   "NEET_BIOLOGY_STATE",
   JSON.stringify(state)
 );

}


/* ================= START ================= */

updateDashboard();

renderCalendar();
