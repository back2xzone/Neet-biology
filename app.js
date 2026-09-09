/* =========================================================
   NEET BIOLOGY APP ENGINE

   Navigation
   Dynamic Question Bank Loading
   Chapter Practice
   Topic-wise Practice
   Timer
   Analytics
   Topic Strength
   Wrong Questions
   Calendar

   Question files are automatically loaded from:

   questions/class11/
   questions/class12/

   Each question file should use:

   export default [
     {
       id: "...",
       class: 11,
       chapter: "15",
       topic: "...",
       source: "NCERT",
       question: "...",
       options: ["...", "...", "...", "..."],
       answer: 0,
       explanation: "..."
     }
   ];
========================================================= */


/* =========================================================
   CHAPTER DATABASE
========================================================= */

const CHAPTERS = {

  11: [

    ["1", "The Living World", "Living-world.js"],
    ["2", "Biological Classification", "Biological-classification.js"],
    ["3", "Plant Kingdom", "Plant-kingdom.js"],
    ["4", "Animal Kingdom", "Animal-kingdom.js"],
    ["5", "Morphology of Flowering Plants", "Morphology-in-flowering-plants.js"],
    ["6", "Anatomy of Flowering Plants", "Anatomy-in-flowering-plants.js"],
    ["7", "Structural Organisation in Animals", "Structural-organisation-in-animals.js"],
    ["8", "Cell: The Unit of Life", "Cell.js"],
    ["9", "Biomolecules", "Biomolecules.js"],
    ["10", "Cell Cycle and Cell Division", "Cell-cycle.js"],
    ["11", "Photosynthesis in Higher Plants", "Photosynthesis.js"],
    ["12", "Respiration in Plants", "respiration.js"],
    ["13", "Plant Growth and Development", "Plant-growth.js"],
    ["14", "Breathing and Exchange of Gases", "Breathing-and-exchange-of-gases.js"],
    ["15", "Body Fluids and Circulation", "Blood-circulation.js"],
    ["16", "Excretory Products and their Elimination", "Excretory-system.js"],
    ["17", "Locomotion and Movement", "Locomotion-and-movements.js"],
    ["18", "Neural Control and Coordination", "Neural-control-and-coordination.js"],
    ["19", "Chemical Coordination and Integration", "Chemical-coordination.js"]

  ],


  12: [

    ["1", "Sexual Reproduction in Flowering Plants", "Sexual-reproduction-in-flowering-plants.js"],
    ["2", "Human Reproduction", "Human-reproduction.js"],
    ["3", "Reproductive Health", "Reproductive-health.js"],
    ["4", "Principles of Inheritance and Variation", "Principles-of-inheritance.js"],
    ["5", "Molecular Basis of Inheritance", "Molecular-basis-of-inheritance.js"],
    ["6", "Evolution", "Evolution.js"],
    ["7", "Human Health and Disease", "Human-health.js"],
    ["8", "Microbes in Human Welfare", "Microbes-in-human-welfare.js"],
    ["9", "Biotechnology: Principles and Processes", "Biotechnology-principles.js"],
    ["10", "Biotechnology and its Applications", "Biotechnology-applications.js"],
    ["11", "Organisms and Populations", "Organisms-and-population.js"],
    ["12", "Ecosystem", "Ecosystem.js"],
    ["13", "Biodiversity and Conservation", "Biodiversity.js"]

  ]

};


/* =========================================================
   QUESTION BANK
========================================================= */

const questionCache = new Map();
const questionLoadErrors = new Set();


/* =========================================================
   STATE
========================================================= */

let currentClass = 11;

let currentChapter = null;
let currentChapterName = "";
let currentChapterNumber = "";
let currentTopic = null;

let quiz = [];
let quizIndex = 0;
let quizScore = 0;

let quizStart = 0;
let timerInterval = null;

let questionTimes = [];
let wrongThisRun = [];

let questionAnswered = false;

let calendarDate = new Date();

let state = null;


/* =========================================================
   LOAD SAVED STATE
========================================================= */

function loadState() {

  try {

    state = JSON.parse(
      localStorage.getItem(
        "NEET_BIOLOGY_STATE"
      )
    );

  } catch(error) {

    console.error(
      "Could not read saved state:",
      error
    );

    state = null;

  }


  if(
    !state ||
    typeof state !== "object"
  ) {

    state = {};

  }


  if(
    !Array.isArray(state.attempts)
  ) {

    state.attempts = [];

  }


  if(
    !Array.isArray(state.wrong)
  ) {

    state.wrong = [];

  }

}


loadState();


/* =========================================================
   SAVE STATE
========================================================= */

function saveState() {

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
   CHAPTER HELPERS
========================================================= */

function findChapter(
  cls,
  chapterId
) {

  const chapters =
    CHAPTERS[
      Number(cls)
    ] || [];


  const target =
    String(
      chapterId ?? ""
    )
    .trim();


  return chapters.find(
    chapter => {

      return (
        String(chapter[0]) === target ||
        String(chapter[2]) === target
      );

    }
  ) || null;

}


function normalizeChapter(
  cls,
  chapterId
) {

  const info =
    findChapter(
      cls,
      chapterId
    );


  if(info) {

    return info[2];

  }


  return String(
    chapterId ?? ""
  );

}


function getChapterName(
  cls,
  chapterId
) {

  const chapter =
    findChapter(
      cls,
      chapterId
    );


  return chapter
    ? chapter[1]
    : String(
        chapterId ?? ""
      );

}


/* =========================================================
   TOPIC HELPERS
========================================================= */


/*
   Normalise topic names for comparison.

   This prevents accidental duplicates such as:

   "Cell Cycle"
   "cell cycle"
   "Cell  Cycle"
   " Cell Cycle "

   from becoming separate cards.

   The displayed name remains the first clean
   version encountered in the question bank.
*/

function normalizeTopic(
  topic
) {

  const value =
    String(
      topic || ""
    )
    .trim()
    .replace(
      /\s+/g,
      " "
    );


  return value || "General";

}


/*
   Internal comparison key.

   Case-insensitive so accidental capitalization
   differences do not create duplicate topic cards.
*/

function getTopicKey(
  topic
) {

  return normalizeTopic(
    topic
  )
  .toLowerCase();

}


/*
   Return all unique topics belonging to a chapter.
*/

function getChapterTopics(
  cls,
  chapterId
) {

  const questions =
    getChapterQuestions(
      cls,
      chapterId
    );


  const topics = [];
  const seen = new Set();


  questions.forEach(
    q => {

      const topic =
        normalizeTopic(
          q.topic
        );


      const key =
        getTopicKey(
          topic
        );


      if(
        !seen.has(key)
      ) {

        seen.add(key);

        topics.push(topic);

      }

    }
  );


  return topics;

}


/*
   Get questions belonging to one topic.
*/

function getTopicQuestions(
  cls,
  chapterId,
  topic
) {

  const targetKey =
    getTopicKey(
      topic
    );


  return getChapterQuestions(
    cls,
    chapterId
  )
  .filter(
    q =>
      getTopicKey(
        q.topic
      ) === targetKey
  );

}


/* =========================================================
   TOPIC ANALYTICS
========================================================= */


/*
   Calculate the strength of a topic.

   Accuracy is the primary factor.

   Speed provides a secondary adjustment.

   Speed score:

   <= 30 sec  = 100
   45 sec     = 90
   60 sec     = 80
   90 sec     = 65
   120 sec    = 50
   >= 180 sec = 35

   Final strength:

   75% accuracy
   25% speed

   This deliberately prevents speed from overpowering
   correctness. A fast person getting questions wrong
   should not magically become "strong".
*/

function calculateSpeedScore(
  avgTime
) {

  const time =
    Number(
      avgTime
    );


  if(
    !Number.isFinite(time) ||
    time <= 0
  ) {

    return null;

  }


  if(time <= 30) {

    return 100;

  }


  if(time <= 45) {

    return (
      100 -
      (
        (time - 30) /
        15
      ) *
      10
    );

  }


  if(time <= 60) {

    return (
      90 -
      (
        (time - 45) /
        15
      ) *
      10
    );

  }


  if(time <= 90) {

    return (
      80 -
      (
        (time - 60) /
        30
      ) *
      15
    );

  }


  if(time <= 120) {

    return (
      65 -
      (
        (time - 90) /
        30
      ) *
      15
    );

  }


  if(time <= 180) {

    return (
      50 -
      (
        (time - 120) /
        60
      ) *
      15
    );

  }


  return 35;

}


/*
   Calculate a single topic's complete statistics.
*/

function getTopicStats(
  cls,
  chapterId,
  topic
) {

  const targetClass =
    Number(cls);


  const targetChapter =
    normalizeChapter(
      targetClass,
      chapterId
    );


  const targetTopic =
    getTopicKey(
      topic
    );


  const attempts =
    state.attempts.filter(
      attempt => {

        return (
          Number(attempt.class) ===
          targetClass &&

          String(
            normalizeChapter(
              targetClass,
              attempt.chapter
            )
          ) ===
          String(
            targetChapter
          ) &&

          getTopicKey(
            attempt.topic
          ) ===
          targetTopic
        );

      }
    );


  if(!attempts.length) {

    return {

      attempts: 0,
      correct: 0,
      wrong: 0,
      accuracy: null,
      avgTime: null,
      speedScore: null,
      strength: null,
      level: "new",
      label: "Not attempted"

    };

  }


  const correct =
    attempts.filter(
      attempt =>
        attempt.correct
    ).length;


  const wrong =
    attempts.length -
    correct;


  const totalTime =
    sumAttemptTime(
      attempts
    );


  const avgTime =
    Math.round(
      totalTime /
      attempts.length
    );


  const accuracy =
    Math.round(
      (
        correct /
        attempts.length
      ) *
      100
    );


  const speedScore =
    calculateSpeedScore(
      avgTime
    );


  /*
     Accuracy carries 75% weight.
     Speed carries 25% weight.
  */

  const strength =
    Math.round(
      (
        accuracy * 0.75
      ) +
      (
        speedScore * 0.25
      )
    );


  let level =
    "developing";


  let label =
    "Developing";


  if(
    strength >= 85
  ) {

    level = "strong";
    label = "Strong";

  } else if(
    strength >= 70
  ) {

    level = "good";
    label = "Good";

  } else if(
    strength >= 50
  ) {

    level = "developing";
    label = "Developing";

  } else {

    level = "weak";
    label = "Weak";

  }


  return {

    attempts,
    correct,
    wrong,
    accuracy,
    avgTime,
    speedScore:
      Math.round(
        speedScore
      ),
    strength,
    level,
    label

  };

}


/*
   Get all topic analytics for one chapter.

   Topics with no attempts are still included because
   they need to appear as normal "new" topic cards.
*/

function getChapterTopicStats(
  cls,
  chapterId
) {

  const questions =
    getChapterQuestions(
      cls,
      chapterId
    );


  const topics =
    new Map();


  questions.forEach(
    q => {

      const displayName =
        normalizeTopic(
          q.topic
        );


      const key =
        getTopicKey(
          displayName
        );


      if(
        !topics.has(key)
      ) {

        topics.set(
          key,
          displayName
        );

      }

    }
  );


  return Array.from(
    topics.values()
  )
  .map(
    topic => {

      return {

        topic,

        ...getTopicStats(
          cls,
          chapterId,
          topic
        )

      };

    }
  );

}


/*
   Get CSS class for a topic strength.
*/

function getTopicStrengthClass(
  stats
) {

  if(
    stats.level === "new"
  ) {

    return "topic-new";

  }


  return (
    `topic-${stats.level}`
  );

}


/* =========================================================
   LOAD ONE CHAPTER
========================================================= */

async function loadChapterQuestions(
  cls,
  file
) {

  const classNumber =
    Number(cls);


  const key =
    `${classNumber}/${file}`;


  if(
    questionCache.has(key)
  ) {

    return questionCache.get(key);

  }


  try {

    const module =
      await import(
        `./questions/class${classNumber}/${file}`
      );


    let questions =
      module.default;


    if(
      !Array.isArray(questions)
    ) {

      questions = [];

    }


    questions =
      questions
        .filter(
          q =>
            q &&
            typeof q === "object"
        )
        .map(
          q => {

            const normalizedClass =
              Number(
                q.class ?? classNumber
              );


            const normalizedChapter =
              normalizeChapter(
                normalizedClass,
                q.chapter
              );


            return {

              ...q,

              class:
                normalizedClass,

              chapter:
                normalizedChapter

            };

          }
        );


    questionCache.set(
      key,
      questions
    );


    questionLoadErrors.delete(
      key
    );


    return questions;

  } catch(error) {

    console.error(
      `Could not load question file: ${file}`,
      error
    );


    questionLoadErrors.add(
      key
    );


    questionCache.set(
      key,
      []
    );


    return [];

  }

}


/* =========================================================
   LOAD ALL QUESTIONS
========================================================= */

async function loadAllQuestions() {

  const jobs = [];


  Object.entries(
    CHAPTERS
  ).forEach(
    ([cls, chapters]) => {

      chapters.forEach(
        chapter => {

          jobs.push(
            loadChapterQuestions(
              cls,
              chapter[2]
            )
          );

        }
      );

    }
  );


  await Promise.all(
    jobs
  );


  validateQuestionIds();

}


/* =========================================================
   GET ALL QUESTIONS
========================================================= */

function getAllQuestions() {

  const all = [];


  questionCache.forEach(
    questions => {

      all.push(
        ...questions
      );

    }
  );


  return all;

}


/* =========================================================
   GET CHAPTER QUESTIONS
========================================================= */

function getChapterQuestions(
  cls,
  chapterId
) {

  const chapter =
    findChapter(
      cls,
      chapterId
    );


  if(!chapter) {

    return [];

  }


  const file =
    chapter[2];


  const key =
    `${Number(cls)}/${file}`;


  return (
    questionCache.get(key) ||
    []
  );

}


/* =========================================================
   VALIDATE QUESTION IDS
========================================================= */

function validateQuestionIds() {

  const seen =
    new Set();


  getAllQuestions()
    .forEach(
      q => {

        if(!q.id) {

          console.warn(
            "Question has no ID:",
            q
          );

          return;

        }


        const id =
          String(q.id);


        if(
          seen.has(id)
        ) {

          console.error(
            "Duplicate question ID:",
            id
          );

        }


        seen.add(id);

      }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function show(id) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      screen => {

        screen.classList.remove(
          "active"
        );

      }
    );


  const target =
    document.getElementById(id);


  if(!target) {

    console.error(
      "Navigation error:",
      id
    );

    return;

  }


  target.classList.add(
    "active"
  );


  window.scrollTo(
    0,
    0
  );

}


/* =========================================================
   HOME
========================================================= */

function goHome() {

  stopTimer();

  currentTopic = null;

  updateDashboard();
  renderCalendar();
  renderWrongQuestions();

  show("home");

}


function home() {

  goHome();

}


/* =========================================================
   CLASS NAVIGATION
========================================================= */

function openClass(cls) {

  currentClass =
    Number(cls);

  currentChapter = null;
  currentTopic = null;


  const title =
    document.getElementById(
      "classTitle"
    );


  const subtitle =
    document.getElementById(
      "classSubtitle"
    );


  if(title) {

    title.textContent =
      `Class ${currentClass} Biology`;

  }


  if(subtitle) {

    const chapterCount =
      (
        CHAPTERS[
          currentClass
        ] || []
      ).length;


    subtitle.textContent =
      `${chapterCount} chapters • NCERT-first practice`;

  }


  renderChapters();

  show("chapters");

}


/* =========================================================
   CHAPTER NAVIGATION
========================================================= */

function backToChapters() {

  currentTopic = null;

  renderChapters();

  show("chapters");

}


/* =========================================================
   RENDER CHAPTERS
========================================================= */

function renderChapters() {

  const box =
    document.getElementById(
      "chapterList"
    );


  if(!box) {

    return;

  }


  box.innerHTML = "";


  const chapters =
    CHAPTERS[
      currentClass
    ] || [];


  chapters.forEach(
    chapter => {

      const num =
        chapter[0];

      const name =
        chapter[1];

      const file =
        chapter[2];


      const qs =
        getChapterQuestions(
          currentClass,
          file
        );


      const div =
        document.createElement(
          "div"
        );


      div.className =
        "chapter";


      div.addEventListener(
        "click",
        () => {

          openChapterPage(
            file,
            name,
            num
          );

        }
      );


      div.innerHTML = `

        <div class="chapter-top">

          <div>

            <div class="number">
              Chapter ${escapeHTML(num)}
            </div>

            <h3>
              ${escapeHTML(name)}
            </h3>

          </div>

          <div class="arrow">
            ›
          </div>

        </div>


        <div
          class="count ${
            qs.length
              ? "ready"
              : ""
          }"
        >

          ${
            qs.length
              ? `${qs.length} questions`
              : questionLoadErrors.has(
                  `${currentClass}/${file}`
                )
                ? "Load error"
                : "No questions yet"
          }

        </div>

      `;


      box.appendChild(
        div
      );

    }
  );

}


/* =========================================================
   RENDER TOPICS
========================================================= */

function renderTopics() {

  const box =
    document.getElementById(
      "topicList"
    );


  if(!box) {

    return;

  }


  box.innerHTML = "";


  if(!currentChapter) {

    return;

  }


  const questions =
    getChapterQuestions(
      currentClass,
      currentChapter
    );


  if(!questions.length) {

    box.innerHTML = `

      <div class="topic-empty">

        No questions have been added to this chapter yet.

      </div>

    `;

    return;

  }


  const topicStats =
    getChapterTopicStats(
      currentClass,
      currentChapter
    );


  /*
     Sort topics:

     1. Strongest / measured topics first
     2. New topics afterwards

     This makes the section useful rather than
     simply reproducing question-bank order.
  */

  topicStats.sort(
    (a, b) => {

      if(
        a.strength === null &&
        b.strength === null
      ) {

        return a.topic.localeCompare(
          b.topic
        );

      }


      if(
        a.strength === null
      ) {

        return 1;

      }


      if(
        b.strength === null
      ) {

        return -1;

      }


      return (
        b.strength -
        a.strength
      );

    }
  );


  topicStats.forEach(
    stats => {

      const count =
        getTopicQuestions(
          currentClass,
          currentChapter,
          stats.topic
        ).length;


      const card =
        document.createElement(
          "div"
        );


      card.className =
        `topic-card ${getTopicStrengthClass(stats)}`;


      card.setAttribute(
        "role",
        "button"
      );


      card.setAttribute(
        "tabindex",
        "0"
      );


      const strengthDisplay =
        stats.strength === null
          ? "—"
          : `${stats.strength}%`;


      const accuracyDisplay =
        stats.accuracy === null
          ? "Not attempted"
          : `${stats.accuracy}%`;


      const timeDisplay =
        stats.avgTime === null
          ? "—"
          : formatSeconds(
              stats.avgTime
            );


      const statusText =
        stats.strength === null
          ? "Not attempted yet"
          : stats.label;


      card.innerHTML = `

        <div class="topic-card-main">

          <div class="topic-heading">

            <div class="topic-status-dot"></div>

            <div>

              <div class="topic-name">
                ${escapeHTML(stats.topic)}
              </div>

              <div class="topic-status">
                ${escapeHTML(statusText)}
              </div>

            </div>

          </div>


          <div class="topic-arrow">
            ›
          </div>

        </div>


        <div class="topic-strength-row">

          <div class="topic-strength">

            <span class="topic-strength-label">
              Strength
            </span>

            <strong>
              ${strengthDisplay}
            </strong>

          </div>


          <div class="topic-progress">

            <div
              class="topic-progress-fill"
              style="width:${stats.strength === null ? 0 : stats.strength}%"
            ></div>

          </div>

        </div>


        <div class="topic-metrics">

          <div class="topic-metric">

            <span>
              Questions
            </span>

            <b>
              ${count}
            </b>

          </div>


          <div class="topic-metric">

            <span>
              Accuracy
            </span>

            <b>
              ${accuracyDisplay}
            </b>

          </div>


          <div class="topic-metric">

            <span>
              Avg. time
            </span>

            <b>
              ${timeDisplay}
            </b>

          </div>


          <div class="topic-metric">

            <span>
              Attempts
            </span>

            <b>
              ${stats.attempts.length}
            </b>

          </div>

        </div>

      `;


      const openTopic =
        () => {

          startTopicPractice(
            stats.topic
          );

        };


      card.addEventListener(
        "click",
        openTopic
      );


      card.addEventListener(
        "keydown",
        event => {

          if(
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            openTopic();

          }

        }
      );


      box.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   CHAPTER PAGE
========================================================= */

async function openChapterPage(
  file,
  name,
  num
) {

  currentChapter =
    file;

  currentChapterName =
    name;

  currentChapterNumber =
    num;

  currentTopic =
    null;


  await loadChapterQuestions(
    currentClass,
    file
  );


  const number =
    document.getElementById(
      "chapterNumber"
    );


  const title =
    document.getElementById(
      "chapterTitle"
    );


  if(number) {

    number.textContent =
      `CHAPTER ${num}`;

  }


  if(title) {

    title.textContent =
      name;

  }


  const qs =
    getChapterQuestions(
      currentClass,
      file
    );


  const chapterQuestions =
    document.getElementById(
      "chapterQuestions"
    );


  if(chapterQuestions) {

    chapterQuestions.textContent =
      qs.length;

  }


  const stats =
    getChapterStats(
      currentClass,
      file
    );


  const chapterAccuracy =
    document.getElementById(
      "chapterAccuracy"
    );


  if(chapterAccuracy) {

    chapterAccuracy.textContent =
      stats.accuracy;

  }


  const chapterTime =
    document.getElementById(
      "chapterTime"
    );


  if(chapterTime) {

    chapterTime.textContent =
      stats.avgTime;

  }


  const chapterWrong =
    document.getElementById(
      "chapterWrong"
    );


  if(chapterWrong) {

    chapterWrong.textContent =
      stats.wrong;

  }


  const status =
    document.getElementById(
      "chapterStatus"
    );


  if(status) {

    const key =
      `${currentClass}/${file}`;


    if(
      questionLoadErrors.has(key)
    ) {

      status.textContent =
        "Question file could not be loaded. Check the filename, capitalization, and file location.";

    } else if(qs.length) {

      status.textContent =
        "This chapter is ready for practice.";

    } else {

      status.textContent =
        "Question bank not added yet.";

    }

  }


  renderTopics();

  show("chapter");

}


/* =========================================================
   RESULTS → CHAPTER
========================================================= */

async function showChapter() {

  stopTimer();


  if(!currentChapter) {

    backToChapters();

    return;

  }


  await openChapterPage(
    currentChapter,
    currentChapterName,
    currentChapterNumber
  );

}


/* =========================================================
   PRACTICE
========================================================= */

async function startChapterPractice(
  topic = null
) {

  if(!currentChapter) {

    alert(
      "Please select a chapter first."
    );

    return;

  }


  await loadChapterQuestions(
    currentClass,
    currentChapter
  );


  let pool =
    getChapterQuestions(
      currentClass,
      currentChapter
    )
    .slice();


  if(topic !== null) {

    const targetTopic =
      getTopicKey(
        topic
      );


    currentTopic =
      normalizeTopic(
        topic
      );


    pool =
      pool.filter(
        q =>
          getTopicKey(
            q.topic
          ) ===
          targetTopic
      );

  } else {

    currentTopic =
      null;

  }


  const modeElement =
    document.getElementById(
      "practiceMode"
    );


  const mode =
    modeElement
      ? modeElement.value
      : "all";


  if(mode === "ncert") {

    pool =
      pool.filter(
        q =>
          normalizeSource(
            q.source
          ) === "ncert"
      );

  }


  if(mode === "exemplar") {

    pool =
      pool.filter(
        q =>
          normalizeSource(
            q.source
          ) === "ncert exemplar"
      );

  }


  if(mode === "pyq") {

    pool =
      pool.filter(
        q =>
          normalizeSource(
            q.source
          ) === "neet pyq"
      );

  }


  if(mode === "wrong") {

    pool =
      pool.filter(
        q =>
          isWrongQuestion(
            q.id
          )
      );

  }


  if(!pool.length) {

    alert(
      topic !== null
        ? `There are no questions available for "${topic}" in this category yet.`
        : "There are no questions in this category yet."
    );

    return;

  }


  shuffle(
    pool
  );


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
          Number(requested) || 10,
          pool.length
        );


  quiz =
    pool.slice(
      0,
      n
    );


  resetQuizState();

  show("quiz");

  renderQuestion();

}


/*
   Topic card entry point.

   Topic practice deliberately starts with "All"
   as the source mode.
*/

function startTopicPractice(
  topic
) {

  const mode =
    document.getElementById(
      "practiceMode"
    );


  if(mode) {

    mode.value =
      "all";

  }


  return startChapterPractice(
    topic
  );

}


/* =========================================================
   ALL WRONG QUESTIONS
========================================================= */

async function startAllWrongPractice() {

  await loadAllQuestions();


  const pool =
    getAllQuestions()
      .filter(
        q =>
          isWrongQuestion(
            q.id
          )
      );


  if(!pool.length) {

    alert(
      "Your wrong-question bank is empty."
    );

    return;

  }


  shuffle(
    pool
  );


  quiz =
    pool.slice(
      0,
      Math.min(
        50,
        pool.length
      )
    );


  currentTopic =
    null;


  resetQuizState();

  show("quiz");

  renderQuestion();

}


function startWrongPractice() {

  return startAllWrongPractice();

}


/* =========================================================
   QUIZ STATE
========================================================= */

function resetQuizState() {

  quizIndex = 0;

  quizScore = 0;

  questionTimes = [];

  wrongThisRun = [];

  questionAnswered = false;

}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

  for(
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
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

function startTimer() {

  stopTimer();


  quizStart =
    Date.now();


  timerInterval =
    setInterval(
      () => {

        const seconds =
          Math.floor(
            (
              Date.now() -
              quizStart
            ) /
            1000
          );


        const timer =
          document.getElementById(
            "timer"
          );


        if(timer) {

          timer.textContent =
            formatTime(
              seconds
            );

        }

      },
      250
    );

}


function stopTimer() {

  if(timerInterval) {

    clearInterval(
      timerInterval
    );

    timerInterval =
      null;

  }

}


function formatTime(seconds) {

  const min =
    Math.floor(
      seconds / 60
    );


  const sec =
    seconds % 60;


  return (
    String(min).padStart(2, "0") +
    ":" +
    String(sec).padStart(2, "0")
  );

}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

  stopTimer();


  const q =
    quiz[
      quizIndex
    ];


  if(!q) {

    console.error(
      "Question not found:",
      quizIndex
    );

    return;

  }


  questionAnswered =
    false;


  const meta =
    document.getElementById(
      "quizMeta"
    );


  if(meta) {

    meta.textContent =
      `Question ${quizIndex + 1} of ${quiz.length} • ${
        q.topic || "General"
      }`;

  }


  const source =
    document.getElementById(
      "quizSource"
    );


  if(source) {

    source.textContent =
      q.source || "";

  }


  const question =
    document.getElementById(
      "quizQuestion"
    );


  if(question) {

    question.textContent =
      q.question || "";

  }


  const letters =
    [
      "A",
      "B",
      "C",
      "D"
    ];


  const options =
    document.getElementById(
      "quizOptions"
    );


  if(options) {

    options.innerHTML =
      Array.isArray(q.options)
        ? q.options
            .map(
              (o, i) => `

                <button
                  class="option"
                  type="button"
                  onclick="answerQuestion(${i})"
                >

                  <span class="letter">
                    ${letters[i] || ""}
                  </span>

                  <span>
                    ${escapeHTML(
                      String(o)
                    )}
                  </span>

                </button>

              `
            )
            .join("")
        : "";

  }


  const feedback =
    document.getElementById(
      "quizFeedback"
    );


  if(feedback) {

    feedback.innerHTML =
      "";

  }


  const next =
    document.getElementById(
      "nextButton"
    );


  if(next) {

    next.style.display =
      "none";

  }


  const timer =
    document.getElementById(
      "timer"
    );


  if(timer) {

    timer.textContent =
      "00:00";

  }


  startTimer();

}


/* =========================================================
   ANSWER QUESTION
========================================================= */

function answerQuestion(
  choice
) {

  if(questionAnswered) {

    return;

  }


  const q =
    quiz[
      quizIndex
    ];


  if(!q) {

    return;

  }


  questionAnswered =
    true;


  stopTimer();


  const timeTaken =
    Math.max(
      0,
      Math.round(
        (
          Date.now() -
          quizStart
        ) /
        1000
      )
    );


  questionTimes.push(
    timeTaken
  );


  const correct =
    Number(choice) ===
    Number(q.answer);


  if(correct) {

    quizScore++;


    removeWrongQuestion(
      q.id
    );

  } else {

    addWrongQuestion(
      q.id
    );


    wrongThisRun.push(
      q
    );

  }


  state.attempts.push({

    id:
      q.id,

    class:
      q.class,

    chapter:
      normalizeChapter(
        q.class,
        q.chapter
      ),

    topic:
      normalizeTopic(
        q.topic
      ),

    source:
      q.source || "",

    correct:
      correct,

    time:
      timeTaken,

    date:
      getDateKey(
        new Date()
      )

  });


  saveState();


  document
    .querySelectorAll(
      ".option"
    )
    .forEach(
      (
        button,
        index
      ) => {

        button.style.pointerEvents =
          "none";


        if(
          Number(index) ===
          Number(q.answer)
        ) {

          button.classList.add(
            "correct"
          );

        }


        if(
          Number(index) ===
          Number(choice) &&
          !correct
        ) {

          button.classList.add(
            "wrong"
          );

        }

      }
    );


  const correctLetter =
    String.fromCharCode(
      65 +
      Number(q.answer)
    );


  const feedback =
    document.getElementById(
      "quizFeedback"
    );


  if(feedback) {

    feedback.innerHTML = `

      <div
        class="feedback ${
          correct
            ? "good"
            : "bad"
        }"
      >

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
            : `Correct answer: ${correctLetter}`
        }

      </div>


      <div class="explain">

        <b>
          Why:
        </b>

        ${escapeHTML(
          String(
            q.explanation ||
            "No explanation available."
          )
        )}

      </div>

    `;

  }


  const next =
    document.getElementById(
      "nextButton"
    );


  if(next) {

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
   NEXT QUESTION
========================================================= */

function nextQuestion() {

  if(!questionAnswered) {

    return;

  }


  if(
    quizIndex <
    quiz.length - 1
  ) {

    quizIndex++;

    renderQuestion();

  } else {

    showResults();

  }

}


/* =========================================================
   EXIT QUIZ
========================================================= */

function exitQuiz() {

  stopTimer();

  showChapter();

}


/* =========================================================
   RESULTS
========================================================= */

function showResults() {

  stopTimer();


  const totalTime =
    questionTimes.reduce(
      (a, b) =>
        a + b,
      0
    );


  const accuracy =
    quiz.length
      ? Math.round(
          (
            quizScore /
            quiz.length
          ) *
          100
        )
      : 0;


  const score =
    document.getElementById(
      "resultScore"
    );


  if(score) {

    score.textContent =
      `${quizScore}/${quiz.length}`;

  }


  const resultAccuracy =
    document.getElementById(
      "resultAccuracy"
    );


  if(resultAccuracy) {

    resultAccuracy.textContent =
      `${accuracy}%`;

  }


  const resultTime =
    document.getElementById(
      "resultTime"
    );


  if(resultTime) {

    resultTime.textContent =
      formatDuration(
        totalTime
      );

  }


  const resultAvg =
    document.getElementById(
      "resultAvg"
    );


  if(resultAvg) {

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


  if(resultTitle) {

    resultTitle.textContent =
      accuracy >= 85
        ? "Strong performance."
        : "Useful diagnostic.";

  }


  const resultText =
    document.getElementById(
      "resultText"
    );


  if(resultText) {

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

function redoWrong() {

  const mode =
    document.getElementById(
      "practiceMode"
    );


  if(mode) {

    mode.value =
      "wrong";

  }


  if(!currentChapter) {

    startAllWrongPractice();

    return;

  }


  const wrongPool =
    getChapterQuestions(
      currentClass,
      currentChapter
    )
    .filter(
      q =>
        isWrongQuestion(
          q.id
        )
    );


  if(!wrongPool.length) {

    alert(
      "There are no wrong questions to redo in this chapter."
    );

    return;

  }


  shuffle(
    wrongPool
  );


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
      ? wrongPool.length
      : Math.min(
          Number(requested) || 10,
          wrongPool.length
        );


  quiz =
    wrongPool.slice(
      0,
      n
    );


  currentTopic =
    null;


  resetQuizState();

  show("quiz");

  renderQuestion();

}


/* =========================================================
   WRONG QUESTION HELPERS
========================================================= */

function isWrongQuestion(id) {

  return state.wrong.some(
    wrongId =>
      String(wrongId) ===
      String(id)
  );

}


function addWrongQuestion(id) {

  if(
    id === undefined ||
    id === null ||
    id === ""
  ) {

    return;

  }


  if(
    !isWrongQuestion(id)
  ) {

    state.wrong.push(
      id
    );

  }

}


function removeWrongQuestion(id) {

  state.wrong =
    state.wrong.filter(
      wrongId =>
        String(wrongId) !==
        String(id)
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  const attempts =
    Array.isArray(
      state.attempts
    )
      ? state.attempts
      : [];


  const todayKey =
    getDateKey(
      new Date()
    );


  const today =
    attempts.filter(
      x =>
        x.date === todayKey
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


  setText(
    "todayQuestions",
    today.length
  );


  setText(
    "todayAccuracy",
    getAccuracy(today)
  );


  setText(
    "todayTime",
    formatDuration(
      sumAttemptTime(today)
    )
  );


  setText(
    "todayAvg",
    today.length
      ? formatSeconds(
          Math.round(
            sumAttemptTime(today) /
            today.length
          )
        )
      : "—"
  );


  setText(
    "weekQuestions",
    week.length
  );


  setText(
    "monthQuestions",
    month.length
  );


  setText(
    "allQuestions",
    attempts.length
  );


  setText(
    "allAccuracy",
    getAccuracy(attempts)
  );


  renderWeakTopics();

  renderWrongQuestions();

}


/* =========================================================
   SMALL DOM HELPER
========================================================= */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if(element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   ACCURACY
========================================================= */

function getAccuracy(arr) {

  if(
    !Array.isArray(arr) ||
    !arr.length
  ) {

    return "—";

  }


  return (
    Math.round(
      (
        arr.filter(
          x =>
            x.correct
        ).length /
        arr.length
      ) *
      100
    ) +
    "%"
  );

}


/* =========================================================
   TIME
========================================================= */

function sumAttemptTime(
  attempts
) {

  return attempts.reduce(
    (total, attempt) =>
      total +
      (
        Number(attempt.time) ||
        0
      ),
    0
  );

}


/* =========================================================
   WEAK / TOPIC STRENGTH DASHBOARD
========================================================= */

function renderWeakTopics() {

  const box =
    document.getElementById(
      "weakTopics"
    );


  if(!box) {

    return;

  }


  const groups =
    new Map();


  state.attempts.forEach(
    attempt => {

      const topic =
        normalizeTopic(
          attempt.topic
        );


      const key =
        [
          Number(attempt.class),
          normalizeChapter(
            attempt.class,
            attempt.chapter
          ),
          getTopicKey(
            topic
          )
        ].join("|");


      if(
        !groups.has(key)
      ) {

        groups.set(
          key,
          {

            class:
              Number(attempt.class),

            chapter:
              attempt.chapter,

            topic,

            attempts:
              0,

            correct:
              0,

            wrong:
              0,

            totalTime:
              0

          }
        );

      }


      const group =
        groups.get(key);


      group.attempts++;


      if(attempt.correct) {

        group.correct++;

      } else {

        group.wrong++;

      }


      group.totalTime +=
        Number(
          attempt.time
        ) || 0;

    }
  );


  const data =
    Array.from(
      groups.values()
    )
    .map(
      group => {

        const accuracy =
          Math.round(
            (
              group.correct /
              group.attempts
            ) *
            100
          );


        const avgTime =
          Math.round(
            group.totalTime /
            group.attempts
          );


        const speedScore =
          calculateSpeedScore(
            avgTime
          );


        const strength =
          Math.round(
            (
              accuracy * 0.75
            ) +
            (
              speedScore * 0.25
            )
          );


        let level =
          "developing";


        let label =
          "Developing";


        if(
          strength >= 85
        ) {

          level = "strong";
          label = "Strong";

        } else if(
          strength >= 70
        ) {

          level = "good";
          label = "Good";

        } else if(
          strength >= 50
        ) {

          level = "developing";
          label = "Developing";

        } else {

          level = "weak";
          label = "Weak";

        }


        return {

          ...group,

          accuracy,

          avgTime,

          speedScore,

          strength,

          level,

          label

        };

      }
    )
    .filter(
      group =>
        group.attempts >= 2
    );


  /*
     Show the weakest topics first.
  */

  data.sort(
    (a, b) =>
      a.strength -
      b.strength
  );


  const displayed =
    data.slice(
      0,
      5
    );


  if(!displayed.length) {

    box.innerHTML = `

      <div class="card empty">

        Topic strength will appear here
        after you've attempted questions.

      </div>

    `;

    return;

  }


  box.innerHTML =
    displayed
      .map(
        group => `

          <div class="weak-card topic-strength-${group.level}">

            <div class="weak-top">

              <div>

                <div class="weak-name">

                  ${escapeHTML(
                    group.topic
                  )}

                </div>

                <div class="weak-label">

                  ${escapeHTML(
                    group.label
                  )}

                </div>

              </div>


              <div class="weak-score">

                ${group.strength}%

              </div>

            </div>


            <div class="weak-progress">

              <div
                class="weak-progress-fill"
                style="width:${group.strength}%"
              ></div>

            </div>


            <div class="weak-details">

              ${group.accuracy}% accuracy •
              ${formatSeconds(
                group.avgTime
              )} average •
              ${group.attempts} attempts

            </div>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   WRONG QUESTIONS
========================================================= */

function renderWrongQuestions() {

  const section =
    document.getElementById(
      "wrongQuestions"
    );


  if(!section) {

    return;

  }


  const wrongIds =
    Array.from(
      new Set(
        state.wrong.map(
          id =>
            String(id)
        )
      )
    );


  const all =
    getAllQuestions();


  const wrongQuestions =
    all.filter(
      q =>
        wrongIds.includes(
          String(q.id)
        )
    );


  if(!wrongQuestions.length) {

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
    displayed
      .map(
        (q, index) => `

          <div
            class="wrong-card"
            onclick="openWrongQuestion('${escapeJS(q.id)}')"
          >

            <div class="wrong-question">

              ${index + 1}.
              ${escapeHTML(
                truncateText(
                  q.question || "",
                  120
                )
              )}

            </div>


            <div class="wrong-topic">

              Class ${escapeHTML(
                String(q.class)
              )}

              •

              ${escapeHTML(
                getChapterName(
                  q.class,
                  q.chapter
                )
              )}

              •

              ${escapeHTML(
                normalizeTopic(
                  q.topic
                )
              )}

            </div>


            <div class="wrong-source">

              ${escapeHTML(
                q.source ||
                ""
              )}

            </div>

          </div>

        `
      )
      .join("");


  if(
    wrongQuestions.length >
    10
  ) {

    section.innerHTML += `

      <div class="card">

        <p class="note">

          Showing 10 of
          ${wrongQuestions.length}
          wrong questions.

        </p>


        <button
          class="secondary full"
          onclick="startAllWrongPractice()"
        >

          Practice Full Wrong Bank

        </button>

      </div>

    `;

  }

}


/* =========================================================
   OPEN INDIVIDUAL WRONG QUESTION
========================================================= */

async function openWrongQuestion(
  id
) {

  await loadAllQuestions();


  const q =
    getAllQuestions()
      .find(
        question =>
          String(
            question.id
          ) ===
          String(id)
      );


  if(!q) {

    alert(
      "Question could not be found."
    );

    return;

  }


  currentClass =
    Number(q.class);


  const chapterInfo =
    findChapter(
      currentClass,
      q.chapter
    );


  if(!chapterInfo) {

    alert(
      "Chapter information could not be found."
    );

    return;

  }


  currentChapter =
    chapterInfo[2];

  currentChapterName =
    chapterInfo[1];

  currentChapterNumber =
    chapterInfo[0];

  currentTopic =
    null;


  await openChapterPage(
    currentChapter,
    currentChapterName,
    currentChapterNumber
  );


  quiz = [q];

  resetQuizState();

  show("quiz");

  renderQuestion();

}


/* =========================================================
   CHAPTER STATS
========================================================= */

function getChapterStats(
  cls,
  chapter
) {

  const chapterInfo =
    findChapter(
      cls,
      chapter
    );


  const chapterFile =
    chapterInfo
      ? chapterInfo[2]
      : String(chapter);


  const attempts =
    state.attempts.filter(
      attempt =>
        Number(attempt.class) ===
        Number(cls) &&
        String(
          normalizeChapter(
            cls,
            attempt.chapter
          )
        ) ===
        String(chapterFile)
    );


  if(!attempts.length) {

    return {

      accuracy:
        "—",

      avgTime:
        "—",

      wrong:
        0

    };

  }


  return {

    accuracy:
      getAccuracy(
        attempts
      ),


    avgTime:
      formatSeconds(
        Math.round(
          sumAttemptTime(
            attempts
          ) /
          attempts.length
        )
      ),


    wrong:
      attempts.filter(
        attempt =>
          !attempt.correct
      ).length

  };

}


/* =========================================================
   CALENDAR
========================================================= */

function renderCalendar() {

  const title =
    document.getElementById(
      "calendarTitle"
    );


  const box =
    document.getElementById(
      "calendar"
    );


  if(
    !title ||
    !box
  ) {

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
        month:
          "long",

        year:
          "numeric"
      }
    );


  box.innerHTML =
    "";


  for(
    let i = 0;
    i < first.getDay();
    i++
  ) {

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
  ) {

    const date =
      new Date(
        year,
        month,
        day
      );


    const key =
      getDateKey(
        date
      );


    const count =
      state.attempts.filter(
        attempt =>
          attempt.date === key
      ).length;


    const div =
      document.createElement(
        "div"
      );


    div.className =
      "day";


    if(
      date.toDateString() ===
      new Date().toDateString()
    ) {

      div.classList.add(
        "today"
      );

    }


    if(count >= 1 && count <= 10) {

  div.classList.add(
    "active-1"
  );

}


if(count >= 11 && count <= 25) {

  div.classList.add(
    "active-2"
  );

}


if(count >= 26 && count <= 50) {

  div.classList.add(
    "active-3"
  );

}


if(count >= 51 && count <= 75) {

  div.classList.add(
    "active-4"
  );

}


if(count >= 76) {

  div.classList.add(
    "active-5"
  );

}


    div.innerHTML = `

      <div class="day-number">
        ${day}
      </div>

      <div class="day-count">
        ${
          count
            ? `${count} Q`
            : ""
        }
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

function previousMonth() {

  calendarDate.setMonth(
    calendarDate.getMonth() - 1
  );


  renderCalendar();

}


function nextMonth() {

  calendarDate.setMonth(
    calendarDate.getMonth() + 1
  );


  renderCalendar();

}


/* =========================================================
   DATE HELPERS
========================================================= */

function getDateKey(
  date
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    )
    .padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    )
    .padStart(
      2,
      "0"
    );


  return (
    `${year}-${month}-${day}`
  );

}


function withinDays(
  dateString,
  days
) {

  if(!dateString) {

    return false;

  }


  const parts =
    String(
      dateString
    ).split("-");


  if(
    parts.length !== 3
  ) {

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
  ) {

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
    24 *
    60 *
    60 *
    1000;


  return (
    difference >= 0 &&
    difference <
    days * dayMs
  );

}


/* =========================================================
   FORMAT HELPERS
========================================================= */

function formatDuration(
  seconds
) {

  seconds =
    Math.max(
      0,
      Number(seconds) || 0
    );


  if(
    seconds < 60
  ) {

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


  if(
    minutes < 60
  ) {

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


function formatSeconds(
  seconds
) {

  seconds =
    Math.max(
      0,
      Number(seconds) || 0
    );


  if(
    seconds < 60
  ) {

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
   SOURCE HELPERS
========================================================= */

function normalizeSource(
  source
) {

  const value =
    String(
      source || ""
    )
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );


  if(
    value === "ncert"
  ) {

    return "ncert";

  }


  if(
    value === "ncert exemplar" ||
    value === "exemplar"
  ) {

    return "ncert exemplar";

  }


  if(
    value === "neet pyq" ||
    value === "neet pyqs" ||
    value === "pyq" ||
    value.startsWith("neet pyq ")
  ) {

    return "neet pyq";

  }


  return value;

}


/* =========================================================
   SECURITY / TEXT HELPERS
========================================================= */

function escapeHTML(
  value
) {

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


function escapeJS(
  value
) {

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
) {

  text =
    String(
      text || ""
    );


  if(
    text.length <=
    maxLength
  ) {

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
   GLOBAL HTML BRIDGE
========================================================= */

Object.assign(
  window,
  {

    show,
    goHome,
    home,

    openClass,
    backToChapters,

    openChapterPage,
    showChapter,

    startChapterPractice,
    startTopicPractice,

    startAllWrongPractice,
    startWrongPractice,

    answerQuestion,
    nextQuestion,

    exitQuiz,

    redoWrong,

    openWrongQuestion,

    previousMonth,
    nextMonth

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeApp() {

  await loadAllQuestions();


  updateDashboard();

  renderCalendar();

  renderWrongQuestions();

}


/* =========================================================
   START
========================================================= */

if(
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

}
