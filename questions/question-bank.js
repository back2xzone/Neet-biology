window.QUESTION_BANK = [];

const QUESTION_FILES = [

  // CLASS 11
  "questions/class11/Living-world.js",
  "questions/class11/Biological-classification.js",
  "questions/class11/Plant-kingdom.js",
  "questions/class11/Animal-kingdom.js",
  "questions/class11/Morphology-in-flowering-plants.js",
  "questions/class11/Anatomy-in-flowering-plants.js",
  "questions/class11/Structural-organisation-in-animals.js",
  "questions/class11/Cell.js",
  "questions/class11/Biomolecules.js",
  "questions/class11/Cell-cycle.js",
  "questions/class11/Photosynthesis.js",
  "questions/class11/respiration.js",
  "questions/class11/Plant-growth.js",
  "questions/class11/Breathing-and-exchange-of-gases.js",
  "questions/class11/Blood-circulation.js",
  "questions/class11/Excretory-system.js",
  "questions/class11/Locomotion-and-movements.js",
  "questions/class11/Neural-control-and-coordination.js",
  "questions/class11/Chemical-coordination.js",

  // CLASS 12
  "questions/class12/Biodiversity.js",
  "questions/class12/Biotechnology-applications.js",
  "questions/class12/Biotechnology-principles.js",
  "questions/class12/Ecosystem.js",
  "questions/class12/Evolution.js",
  "questions/class12/Human-health.js",
  "questions/class12/Human-reproduction.js",
  "questions/class12/Microbes-in-human-welfare.js",
  "questions/class12/Molecular-basis-of-inheritance.js",
  "questions/class12/Organisms-and-population.js",
  "questions/class12/Principles-of-inheritance.js",
  "questions/class12/Reproductive-health.js",
  "questions/class12/Sexual-reproduction-in-flowering-plants.js"
];

window.questionBankReady = Promise.all(
  QUESTION_FILES.map(path => {

    return new Promise((resolve, reject) => {

      const script = document.createElement("script");

      script.src = path;

      script.onload = resolve;

      script.onerror = () => {
        console.error("Failed to load:", path);
        reject(path);
      };

      document.head.appendChild(script);

    });

  })
)
.then(() => {

  window.QUESTIONS = window.QUESTION_BANK;

  console.log(
    "Question bank loaded:",
    window.QUESTIONS.length
  );

})
.catch(error => {

  console.error(
    "Some question files failed to load:",
    error
  );

  window.QUESTIONS = window.QUESTION_BANK;

});
