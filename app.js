/* =========================================================
   NEET BIOLOGY APP ENGINE
   Navigation + Practice + Timer + Analytics
   + Wrong Questions System
========================================================= */


/* ================= DATA ================= */

const CHAPTERS = {

  11: [
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

  12: [
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

let currentClass = 11;
let currentChapter = null;
let currentChapterName = "";
let currentChapterNumber = "";

let quiz = [];
let quizIndex = 0;
let quizScore = 0;
let quizStart = 0;

let timerInterval = null;

let questionTimes = [];
let wrongThisRun = [];

let calendarDate = new Date();


/* =========================================================
   STORAGE
========================================================= */

let state = null;

try {

  state = JSON.parse(
    localStorage.getItem("NEET_BIOLOGY_STATE")
  );

} catch(error) {

  console.error(
    "Could not read saved state:",
    error
  );

}


if(!state || typeof state !== "object"){

  state = {};

}


if(!Array.isArray(state.attempts)){

  state.attempts = [];

}


if(!Array.isArray(state.wrong)){

  state.wrong = [];

}


/* ================= SAVE STATE ================= */

function saveState(){

  try {

    localStorage.setItem(
      "NEET_BIOLOGY_STATE",
      JSON.stringify(state)
    );

  } catch(error) {

    console.error(
      "Could not save state:",
      error
    );

  }

}


/* =========================================================
   NAVIGATION
========================================================= */

function show(id){

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove("active");

    });


  const target =
    document.getElementById(id);


  if(!target){

    console.error(
      "Navigation error: screen not found:",
      id
    );

    return;

  }


  target.classList.add("active");

  window.scrollTo(0,0);

}


/* ================= HOME ================= */

function goHome(){

  stopTimer();

  updateDashboard();

  renderCalendar();

  renderWrongQuestions();

  show("home");

}


function home(){

  goHome();

}


/* =========================================================
   CLASS NAVIGATION
========================================================= */

function openClass(cls){

  currentClass =
    Number(cls);


  const title =
    document.getElementById(
      "classTitle"
    );


  const subtitle =
    document.getElementById(
      "classSubtitle"
    );


  if(title){

    title.textContent =
      "Class " +
      currentClass +
      " Biology";

  }


  if(subtitle){

    subtitle.textContent =
      currentClass === 11
      ? "19 chapters • NCERT-first practice"
      : "13 chapters • NCERT-first practice";

  }


  renderChapters();

  show("chapters");

}


/* =========================================================
   CHAPTER NAVIGATION
========================================================= */

function backToChapters(){

  renderChapters();

  show("chapters");

}


function renderChapters(){

  const box =
    document.getElementById(
      "chapterList"
    );


  if(!box){

    console.error(
      "chapterList element not found."
    );

    return;

  }


  box.innerHTML = "";


  const chapters =
    CHAPTERS[currentClass] || [];


  chapters.forEach(c => {

    const num = c[0];
    const name = c[1];
    const id = c[2];


    const qs =
      getChapterQuestions(
        currentClass,
        id
      );


    const div =
      document.createElement("div");


    div.className =
      "chapter";


    div.addEventListener(
      "click",
      function(){

        openChapterPage(
          id,
          name,
          num
        );

      }
    );


    div.innerHTML = `

      <div class="chapter-top">

        <div>

          <div class="number">
            Chapter ${num}
          </div>

          <h3>${escapeHTML(name)}</h3>

        </div>

        <div class="arrow">
          ›
        </div>

      </div>

      <div class="count ${qs.length ? "ready" : ""}">

        ${
          qs.length
          ? qs.length + " questions"
          : "No questions yet"
        }

      </div>

    `;


    box.appendChild(div);

  });

}


/* =========================================================
   CHAPTER PAGE
========================================================= */

function openChapterPage(
  id,
  name,
  num
){

  currentChapter = id;
  currentChapterName = name;
  currentChapterNumber = num;


  const number =
    document.getElementById(
      "chapterNumber"
    );


  const title =
    document.getElementById(
      "chapterTitle"
    );


  if(number){

    number.textContent =
      "CHAPTER " + num;

  }


  if(title){

    title.textContent =
      name;

  }


  const qs =
    getChapterQuestions(
      currentClass,
      currentChapter
    );


  const chapterQuestions =
    document.getElementById(
      "chapterQuestions"
    );


  if(chapterQuestions){

    chapterQuestions.textContent =
      qs.length;

  }


  const stats =
    getChapterStats(
      currentClass,
      currentChapter
    );


  const chapterAccuracy =
    document.getElementById(
      "chapterAccuracy"
    );


  if(chapterAccuracy){

    chapterAccuracy.textContent =
      stats.accuracy;

  }


  const chapterTime =
    document.getElementById(
      "chapterTime"
    );


  if(chapterTime){

    chapterTime.textContent =
      stats.avgTime;

  }


  const chapterWrong =
    document.getElementById(
      "chapterWrong"
    );


  if(chapterWrong){

    chapterWrong.textContent =
      stats.wrong;

  }


  const status =
    document.getElementById(
      "chapterStatus"
    );


  if(status){

    status.textContent =
      qs.length
      ? "This chapter is ready for practice."
      : "Question bank not added yet.";

  }


  show("chapter");

}


/* ================= RESULTS → CHAPTER ================= */

function showChapter(){

  stopTimer();


  if(!currentChapter){

    backToChapters();

    return;

  }


  openChapterPage(
    currentChapter,
    currentChapterName,
    currentChapterNumber
  );

}


/* =========================================================
   QUESTION HELPERS
========================================================= */

function getChapterQuestions(
  cls,
  chapter
){

  if(
    typeof QUESTIONS === "undefined" ||
    !Array.isArray(QUESTIONS)
  ){

    console.error(
      "QUESTIONS array is unavailable."
    );

    return [];

  }


  return QUESTIONS.filter(q => {

    return (
      Number(q.class) === Number(cls) &&
      String(q.chapter) === String(chapter)
    );

  });

}


/* =========================================================
   PRACTICE
========================================================= */

function startChapterPractice(){

  let pool =
    getChapterQuestions(
      currentClass,
      currentChapter
    );


  const modeElement =
    document.getElementById(
      "practiceMode"
    );


  const mode =
    modeElement
    ? modeElement.value
    : "all";


  if(mode === "ncert"){

    pool =
      pool.filter(
        q =>
          String(q.source).toLowerCase()
          === "ncert"
      );

  }


  if(mode === "exemplar"){

    pool =
      pool.filter(
        q =>
          String(q.source).toLowerCase()
          === "ncert exemplar"
      );

  }


  if(mode === "pyq"){

    pool =
      pool.filter(
        q =>
          String(q.source).toLowerCase()
          === "neet pyq"
      );

  }


  if(mode === "wrong"){

    pool =
      pool.filter(
        q =>
          state.wrong.some(
            id =>
              String(id) === String(q.id)
          )
      );

  }


  if(!pool.length){

    alert(
      "There are no questions in this category yet."
    );

    return;

  }


  shuffle(pool);


  const requestedElement =
    document.getElementById(
      "questionCount"
    );


  const requested =
    requestedElement
    ? requestedElement.value
    : "10";


  const n =
    requested === "all"
    ? pool.length
    : Math.min(
        Number(requested),
        pool.length
      );


  quiz =
    pool.slice(0,n);


  quizIndex = 0;
  quizScore = 0;

  questionTimes = [];
  wrongThisRun = [];


  show("quiz");

  renderQuestion();

}


/* =========================================================
   PRACTICE ALL WRONG QUESTIONS
========================================================= */

function startAllWrongPractice(){

  if(
    typeof QUESTIONS === "undefined" ||
    !Array.isArray(QUESTIONS)
  ){

    alert(
      "Question bank is unavailable."
    );

    return;

  }


  const pool =
    QUESTIONS.filter(
      q =>
        state.wrong.some(
          id =>
            String(id) === String(q.id)
        )
    );


  if(!pool.length){

    alert(
      "Your wrong-question bank is empty."
    );

    return;

  }


  shuffle(pool);


  const n =
    Math.min(
      50,
      pool.length
    );


  quiz =
    pool.slice(0,n);


  quizIndex = 0;
  quizScore = 0;

  questionTimes = [];
  wrongThisRun = [];


  show("quiz");

  renderQuestion();

}


/*
   Compatibility alias for older code/buttons.
*/

function startWrongPractice(){

  startAllWrongPractice();

}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array){

  for(
    let i = array.length - 1;
    i > 0;
    i--
  ){

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      array[i],
      array[j]
    ] =
    [
      array[j],
      array[i]
    ];

  }

}


/* =========================================================
   TIMER
========================================================= */

function startTimer(){

  stopTimer();

  quizStart =
    Date.now();


  timerInterval =
    setInterval(() => {

      const seconds =
        Math.floor(
          (
            Date.now() -
            quizStart
          ) / 1000
        );


      const timer =
        document.getElementById(
          "timer"
        );


      if(timer){

        timer.textContent =
          formatTime(seconds);

      }

    },250);

}


function stopTimer(){

  if(timerInterval){

    clearInterval(
      timerInterval
    );

    timerInterval = null;

  }

}


function formatTime(seconds){

  const min =
    Math.floor(
      seconds / 60
    );


  const sec =
    seconds % 60;


  return (
    String(min).padStart(2,"0")
    +
    ":"
    +
    String(sec).padStart(2,"0")
  );

}


/* =========================================================
   QUESTIONS
========================================================= */

function renderQuestion(){

  stopTimer();


  const q =
    quiz[quizIndex];


  if(!q){

    console.error(
      "Question not found:",
      quizIndex
    );

    return;

  }


  const meta =
    document.getElementById(
      "quizMeta"
    );


  if(meta){

    meta.textContent =
      `Question ${
        quizIndex + 1
      } of ${
        quiz.length
      } • ${
        q.topic || ""
      }`;

  }


  const source =
    document.getElementById(
      "quizSource"
    );


  if(source){

    source.textContent =
      q.source || "";

  }


  const question =
    document.getElementById(
      "quizQuestion"
    );


  if(question){

    question.textContent =
      q.question || "";

  }


  const letters =
    ["A","B","C","D"];


  const options =
    document.getElementById(
      "quizOptions"
    );


  if(options){

    options.innerHTML =
      Array.isArray(q.options)
      ? q.options.map(
          (o,i) => `

            <button
              class="option"
              onclick="answerQuestion(${i})">

              <span class="letter">
                ${letters[i] || ""}
              </span>

              <span>
                ${escapeHTML(String(o))}
              </span>

            </button>

          `
        ).join("")
      : "";

  }


  const feedback =
    document.getElementById(
      "quizFeedback"
    );


  if(feedback){

    feedback.innerHTML =
      "";

  }


  const next =
    document.getElementById(
      "nextButton"
    );


  if(next){

    next.style.display =
      "none";

  }


  const timer =
    document.getElementById(
      "timer"
    );


  if(timer){

    timer.textContent =
      "00:00";

  }


  startTimer();

}


/* =========================================================
   ANSWER
========================================================= */

function answerQuestion(choice){

  if(
    document.querySelector(
      ".option.correct"
    ) ||
    document.querySelector(
      ".option.wrong"
    )
  ){

    return;

  }


  stopTimer();


  const q =
    quiz[quizIndex];


  if(!q){

    return;

  }


  const timeTaken =
    Math.round(
      (
        Date.now() -
        quizStart
      ) / 1000
    );


  questionTimes.push(
    timeTaken
  );


  const correct =
    Number(choice) === Number(q.answer);


  if(correct){

    quizScore++;


    const wrongIndex =
      state.wrong.findIndex(
        id =>
          String(id) ===
          String(q.id)
      );


    if(wrongIndex !== -1){

      state.wrong.splice(
        wrongIndex,
        1
      );

    }

  }else{

    const alreadyWrong =
      state.wrong.some(
        id =>
          String(id) ===
          String(q.id)
      );


    if(!alreadyWrong){

      state.wrong.push(
        q.id
      );

    }


    wrongThisRun.push(q);

  }


  state.attempts.push({

    id: q.id,

    class: q.class,

    chapter: q.chapter,

    topic: q.topic,

    source: q.source,

    correct: correct,

    time: timeTaken,

    date:
      getDateKey(
        new Date()
      )

  });


  saveState();


  document
    .querySelectorAll(".option")
    .forEach(
      (button,index) => {

        button.style.pointerEvents =
          "none";


        if(
          Number(index) ===
          Number(q.answer)
        ){

          button.classList.add(
            "correct"
          );

        }


        if(
          Number(index) ===
          Number(choice) &&
          !correct
        ){

          button.classList.add(
            "wrong"
          );

        }

      }
    );


  const correctLetter =
    String.fromCharCode(
      65 + Number(q.answer)
    );


  const feedback =
    document.getElementById(
      "quizFeedback"
    );


  if(feedback){

    feedback.innerHTML = `

      <div class="feedback ${
        correct
        ? "good"
        : "bad"
      }">

        <b>
          ${
            correct
            ? "Correct"
            : "Incorrect"
          }
        </b>

        <br>

        ${
          correct
          ? "Good. Keep the reasoning."
          : "Correct answer: " +
            correctLetter
        }

      </div>

      <div class="explain">

        <b>Why:</b>
        ${
          escapeHTML(
            String(
              q.explanation ||
              "No explanation available."
            )
          )
        }

      </div>

    `;

  }


  const next =
    document.getElementById(
      "nextButton"
    );


  if(next){

    next.style.display =
      "block";


    next.textContent =
      quizIndex ===
      quiz.length - 1
      ? "See Results"
      : "Next";

  }

}


/* =========================================================
   NEXT
========================================================= */

function nextQuestion(){

  if(
    quizIndex <
    quiz.length - 1
  ){

    quizIndex++;

    renderQuestion();

  }else{

    showResults();

  }

}


/* =========================================================
   EXIT
========================================================= */

function exitQuiz(){

  stopTimer();

  showChapter();

}


/* =========================================================
   RESULTS
========================================================= */

function showResults(){

  stopTimer();


  const totalTime =
    questionTimes.reduce(
      (a,b) =>
        a + b,
      0
    );


  const accuracy =
    quiz.length
    ? Math.round(
        (
          quizScore /
          quiz.length
        ) * 100
      )
    : 0;


  const score =
    document.getElementById(
      "resultScore"
    );


  if(score){

    score.textContent =
      quizScore +
      "/" +
      quiz.length;

  }


  const resultAccuracy =
    document.getElementById(
      "resultAccuracy"
    );


  if(resultAccuracy){

    resultAccuracy.textContent =
      accuracy + "%";

  }


  const resultTime =
    document.getElementById(
      "resultTime"
    );


  if(resultTime){

    resultTime.textContent =
      formatDuration(
        totalTime
      );

  }


  const resultAvg =
    document.getElementById(
      "resultAvg"
    );


  if(resultAvg){

    resultAvg.textContent =
      formatSeconds(
        quiz.length
        ? Math.round(
            totalTime /
            quiz.length
          )
        : 0
      );

  }


  const resultTitle =
    document.getElementById(
      "resultTitle"
    );


  if(resultTitle){

    resultTitle.textContent =
      accuracy >= 85
      ? "Strong performance."
      : "Useful diagnostic.";

  }


  const resultText =
    document.getElementById(
      "resultText"
    );


  if(resultText){

    resultText.textContent =
      accuracy >= 85
      ? "Accuracy is solid. Keep revisiting mistakes."
      : "Your mistakes identify what deserves another look in NCERT.";

  }


  updateDashboard();

  renderWrongQuestions();

  show("results");

}


/* =========================================================
   REDO WRONG
========================================================= */

function redoWrong(){

  const mode =
    document.getElementById(
      "practiceMode"
    );


  if(mode){

    mode.value =
      "wrong";

  }


  const wrongPool =
    getChapterQuestions(
      currentClass,
      currentChapter
    ).filter(
      q =>
        state.wrong.some(
          id =>
            String(id) ===
            String(q.id)
        )
    );


  if(!wrongPool.length){

    alert(
      "There are no wrong questions to redo in this chapter."
    );

    return;

  }


  startChapterPractice();

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard(){

  const attempts =
    Array.isArray(state.attempts)
    ? state.attempts
    : [];


  const today =
    attempts.filter(
      x =>
        x.date ===
        getDateKey(
          new Date()
        )
    );


  const week =
    attempts.filter(
      x =>
        withinDays(
          x.date,
          7
        )
    );


  const month =
    attempts.filter(
      x =>
        withinDays(
          x.date,
          30
        )
    );


  const todayQuestions =
    document.getElementById(
      "todayQuestions"
    );


  if(todayQuestions){

    todayQuestions.textContent =
      today.length;

  }


  const todayAccuracy =
    document.getElementById(
      "todayAccuracy"
    );


  if(todayAccuracy){

    todayAccuracy.textContent =
      getAccuracy(today);

  }


  const todayTime =
    document.getElementById(
      "todayTime"
    );


  if(todayTime){

    todayTime.textContent =
      formatDuration(
        today.reduce(
          (a,b) =>
            a +
            (
              Number(b.time) ||
              0
            ),
          0
        )
      );

  }


  const todayAvg =
    document.getElementById(
      "todayAvg"
    );


  if(todayAvg){

    todayAvg.textContent =
      today.length
      ? formatSeconds(
          Math.round(
            today.reduce(
              (a,b) =>
                a +
                (
                  Number(b.time) ||
                  0
                ),
              0
            )
            /
            today.length
          )
        )
      : "—";

  }


  const weekQuestions =
    document.getElementById(
      "weekQuestions"
    );


  if(weekQuestions){

    weekQuestions.textContent =
      week.length;

  }


  const monthQuestions =
    document.getElementById(
      "monthQuestions"
    );


  if(monthQuestions){

    monthQuestions.textContent =
      month.length;

  }


  const allQuestions =
    document.getElementById(
      "allQuestions"
    );


  if(allQuestions){

    allQuestions.textContent =
      attempts.length;

  }


  const allAccuracy =
    document.getElementById(
      "allAccuracy"
    );


  if(allAccuracy){

    allAccuracy.textContent =
      getAccuracy(attempts);

  }


  renderWeakTopics();

  renderWrongQuestions();

}


/* =========================================================
   ACCURACY
========================================================= */

function getAccuracy(arr){

  if(
    !Array.isArray(arr) ||
    !arr.length
  ){

    return "—";

  }


  return Math.round(
    arr.filter(
      x =>
        x.correct
    ).length
    /
    arr.length
    *
    100
  ) + "%";

}


/* =========================================================
   WEAK TOPICS
========================================================= */

function renderWeakTopics(){

  const box =
    document.getElementById(
      "weakTopics"
    );


  if(!box){

    return;

  }


  const groups = {};


  state.attempts.forEach(a => {

    const key =
      a.class +
      "|" +
      a.chapter +
      "|" +
      a.topic;


    if(!groups[key]){

      groups[key] = {

        class: a.class,

        chapter: a.chapter,

        topic: a.topic,

        attempts: 0,

        correct: 0,

        wrong: 0,

        totalTime: 0

      };

    }


    const g =
      groups[key];


    g.attempts++;


    if(a.correct){

      g.correct++;

    }else{

      g.wrong++;

    }


    g.totalTime +=
      Number(a.time) || 0;

  });


  const data =
    Object.values(groups)
    .map(g => {

      g.accuracy =
        Math.round(
          g.correct /
          g.attempts *
          100
        );


      g.avgTime =
        Math.round(
          g.totalTime /
          g.attempts
        );


      g.weakness =
        (100 - g.accuracy)
        +
        (g.wrong * 3)
        +
        (
          g.avgTime > 60
          ? 10
          : 0
        );


      return g;

    })
    .filter(
      g =>
        g.attempts >= 2
    )
    .sort(
      (a,b) =>
        b.weakness -
        a.weakness
    )
    .slice(0,5);


  if(!data.length){

    box.innerHTML = `

      <div class="card empty">

        Weak topics will appear here
        after you've attempted questions.

      </div>

    `;

    return;

  }


  box.innerHTML =
    data.map(g => `

      <div class="weak-card">

        <div class="weak-top">

          <div class="weak-name">
            ${escapeHTML(
              String(g.topic || "General")
            )}
          </div>

          <div class="weak-score">
            ${g.accuracy}%
          </div>

        </div>

        <div class="weak-details">

          ${g.wrong} wrong •
          ${g.attempts} attempts •
          ${formatSeconds(g.avgTime)}
          average

        </div>

      </div>

    `).join("");

}


/* =========================================================
   WRONG QUESTIONS HOME SECTION
========================================================= */

function renderWrongQuestions(){

  const section =
    document.getElementById(
      "wrongQuestions"
    );


  /*
     The HTML already contains the Wrong Questions
     section, so we use that existing container.
  */

  if(!section){

    return;

  }


  const wrongIds =
    Array.from(
      new Set(
        state.wrong.map(
          id => String(id)
        )
      )
    );


  let wrongQuestions = [];


  if(
    typeof QUESTIONS !== "undefined" &&
    Array.isArray(QUESTIONS)
  ){

    wrongQuestions =
      QUESTIONS.filter(
        q =>
          wrongIds.includes(
            String(q.id)
          )
      );

  }


  if(!wrongQuestions.length){

    section.innerHTML = `

      <div class="wrong-empty">

        Your wrong-question bank is empty.

        <br>

        Questions you answer incorrectly
        will appear here for revision.

      </div>

    `;

    return;

  }


  const displayed =
    wrongQuestions.slice(
      0,
      10
    );


  section.innerHTML =
    displayed.map(
      (q,index) => `

        <div
          class="wrong-card"
          onclick="openWrongQuestion('${escapeJS(q.id)}')">

          <div class="wrong-question">

            ${index + 1}.
            ${escapeHTML(
              truncateText(
                String(q.question || ""),
                120
              )
            )}

          </div>

          <div class="wrong-topic">

            Class ${q.class}
            •
            ${escapeHTML(
              getChapterName(
                q.class,
                q.chapter
              )
            )}
            •
            ${escapeHTML(
              String(
                q.topic ||
                "General"
              )
            )}

          </div>

          <div class="wrong-source">

            ${escapeHTML(
              String(
                q.source ||
                ""
              )
            )}

          </div>

        </div>

      `
    ).join("");


  if(wrongQuestions.length > 10){

    section.innerHTML += `

      <div class="card">

        <p class="note">

          Showing 10 of
          ${wrongQuestions.length}
          wrong questions.

        </p>

        <button
          class="secondary full"
          onclick="startAllWrongPractice()">

          Practice Full Wrong Bank

        </button>

      </div>

    `;

  }

}


/* =========================================================
   OPEN INDIVIDUAL WRONG QUESTION
========================================================= */

function openWrongQuestion(id){

  if(
    typeof QUESTIONS === "undefined" ||
    !Array.isArray(QUESTIONS)
  ){

    alert(
      "Question bank is unavailable."
    );

    return;

  }


  const q =
    QUESTIONS.find(
      question =>
        String(question.id) ===
        String(id)
    );


  if(!q){

    alert(
      "Question could not be found."
    );

    return;

  }


  currentClass =
    Number(q.class);


  currentChapter =
    q.chapter;


  const chapterInfo =
    findChapter(
      currentClass,
      currentChapter
    );


  if(!chapterInfo){

    alert(
      "Chapter information could not be found."
    );

    return;

  }


  currentChapterName =
    chapterInfo[1];


  currentChapterNumber =
    chapterInfo[0];


  openChapterPage(
    currentChapter,
    currentChapterName,
    currentChapterNumber
  );


  const mode =
    document.getElementById(
      "practiceMode"
    );


  if(mode){

    mode.value =
      "wrong";

  }

}


/* =========================================================
   FIND CHAPTER
========================================================= */

function findChapter(
  cls,
  chapterId
){

  const chapters =
    CHAPTERS[
      Number(cls)
    ] || [];


  return chapters.find(
    c =>
      String(c[2]) ===
      String(chapterId)
  );

}


function getChapterName(
  cls,
  chapterId
){

  const chapter =
    findChapter(
      cls,
      chapterId
    );


  return chapter
    ? chapter[1]
    : chapterId;

}


/* =========================================================
   CHAPTER STATS
========================================================= */

function getChapterStats(
  cls,
  chapter
){

  const a =
    state.attempts.filter(
      x =>
        Number(x.class) ===
          Number(cls)
        &&
        String(x.chapter) ===
          String(chapter)
    );


  if(!a.length){

    return {

      accuracy: "—",

      avgTime: "—",

      wrong: 0

    };

  }


  return {

    accuracy:
      getAccuracy(a),


    avgTime:
      formatSeconds(
        Math.round(
          a.reduce(
            (x,y) =>
              x +
              (
                Number(y.time) ||
                0
              ),
            0
          )
          /
          a.length
        )
      ),


    wrong:
      a.filter(
        x =>
          !x.correct
      ).length

  };

}


/* =========================================================
   CALENDAR
========================================================= */

function renderCalendar(){

  const title =
    document.getElementById(
      "calendarTitle"
    );


  const box =
    document.getElementById(
      "calendar"
    );


  if(!title || !box){

    return;

  }


  const year =
    calendarDate.getFullYear();


  const month =
    calendarDate.getMonth();


  const first =
    new Date(
      year,
      month,
      1
    );


  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  title.textContent =
    first.toLocaleString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );


  box.innerHTML = "";


  for(
    let i = 0;
    i < first.getDay();
    i++
  ){

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "day empty";


    box.appendChild(
      empty
    );

  }


  for(
    let day = 1;
    day <= days;
    day++
  ){

    const d =
      new Date(
        year,
        month,
        day
      );


    const key =
      getDateKey(d);


    const count =
      state.attempts.filter(
        x =>
          x.date === key
      ).length;


    const div =
      document.createElement(
        "div"
      );


    div.className =
      "day";


    if(
      d.toDateString() ===
      new Date().toDateString()
    ){

      div.classList.add(
        "today"
      );

    }


    if(count >= 1){

      div.classList.add(
        "active-1"
      );

    }


    if(count >= 20){

      div.classList.add(
        "active-2"
      );

    }


    if(count >= 50){

      div.classList.add(
        "active-3"
      );

    }


    div.innerHTML = `

      <div class="day-number">
        ${day}
      </div>

      <div class="day-count">
        ${count ? count + " Q" : ""}
      </div>

    `;


    box.appendChild(
      div
    );

  }

}


/* =========================================================
   CALENDAR NAVIGATION
========================================================= */

function previousMonth(){

  calendarDate.setMonth(
    calendarDate.getMonth() - 1
  );


  renderCalendar();

}


function nextMonth(){

  calendarDate.setMonth(
    calendarDate.getMonth() + 1
  );


  renderCalendar();

}


/* =========================================================
   DATE HELPERS
========================================================= */

function getDateKey(date){

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return (
    year +
    "-" +
    month +
    "-" +
    day
  );

}


function withinDays(
  dateString,
  days
){

  if(!dateString){

    return false;

  }


  const parts =
    String(
      dateString
    ).split("-");


  if(parts.length !== 3){

    return false;

  }


  const date =
    new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );


  if(
    Number.isNaN(
      date.getTime()
    )
  ){

    return false;

  }


  const now =
    new Date();


  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );


  const difference =
    today.getTime() -
    date.getTime();


  const dayMs =
    24 * 60 * 60 * 1000;


  return (
    difference >= 0 &&
    difference <
      days * dayMs
  );

}


/* =========================================================
   FORMAT HELPERS
========================================================= */

function formatDuration(seconds){

  seconds =
    Math.max(
      0,
      Number(seconds) || 0
    );


  if(seconds < 60){

    return (
      Math.round(seconds) +
      "s"
    );

  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  const remaining =
    Math.round(
      seconds % 60
    );


  if(minutes < 60){

    return (
      minutes +
      "m " +
      remaining +
      "s"
    );

  }


  const hours =
    Math.floor(
      minutes / 60
    );


  const mins =
    minutes % 60;


  return (
    hours +
    "h " +
    mins +
    "m"
  );

}


function formatSeconds(seconds){

  seconds =
    Math.max(
      0,
      Number(seconds) || 0
    );


  if(seconds < 60){

    return (
      Math.round(seconds) +
      "s"
    );

  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  const remaining =
    Math.round(
      seconds % 60
    );


  return (
    minutes +
    "m " +
    remaining +
    "s"
  );

}


/* =========================================================
   SECURITY / TEXT HELPERS
========================================================= */

function escapeHTML(value){

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeJS(value){

  return String(value)
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /'/g,
      "\\'"
    )
    .replace(
      /\r/g,
      "\\r"
    )
    .replace(
      /\n/g,
      "\\n"
    );

}


function truncateText(
  text,
  maxLength
){

  text =
    String(text || "");


  if(
    text.length <=
    maxLength
  ){

    return text;

  }


  return (
    text.slice(
      0,
      maxLength
    ) +
    "…"
  );

}


/* =========================================================
   INITIALIZE APP
========================================================= */

function initializeApp(){

  updateDashboard();

  renderCalendar();

  renderWrongQuestions();

}


/*
   The script is loaded at the bottom of index.html,
   but DOMContentLoaded makes initialization safe
   even if script placement changes later.
*/

if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

}else{

  initializeApp();

}
