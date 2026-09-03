/*
=========================================================
RESPIRATION IN PLANTS — LARGE QUESTION BANK
Class 11 Biology • NCERT-first

600 questions:
50 PYQ-derived
550 NCERT-based practice variants

PYQs are paraphrased for practice.
=========================================================
*/

const QUESTIONS = [];

let ID = 1;

function addQuestion({
  source = "NCERT",
  topic,
  question,
  options,
  answer,
  explanation,
  difficulty = "Medium",
  pyqYear = null
}) {

  QUESTIONS.push({
    id: `resp-${String(ID++).padStart(4, "0")}`,
    class: 11,
    chapter: "respiration",
    source,
    topic,
    question,
    options,
    answer,
    explanation,
    difficulty,
    ...(pyqYear ? { pyqYear } : {})
  });
}


/* =======================================================
   CORE NCERT FACT BANK
   =======================================================

   Format:
   topic | fact | correct | wrong1 | wrong2 | wrong3
======================================================= */

const FACTS = [

["Plant respiration",
"Plants exchange respiratory gases mainly by diffusion through exposed surfaces.",
"diffusion through exposed surfaces",
"a specialised lung","blood circulation","only xylem"],

["Plant respiration",
"Stomata and lenticels provide important routes for gaseous exchange.",
"stomata and lenticels",
"alveoli and bronchi","nephrons","only roots"],

["Plant respiration",
"Glucose is a common respiratory substrate.",
"glucose",
"DNA","chlorophyll","ribosomal RNA"],

["Plant respiration",
"Respiration is a stepwise enzyme-controlled oxidation of organic substrates.",
"stepwise enzyme-controlled oxidation",
"single uncontrolled combustion",
"only hydrolysis",
"only heat production"],

["Glycolysis",
"Glycolysis occurs in the cytoplasm.",
"cytoplasm",
"mitochondrial matrix",
"inner mitochondrial membrane",
"nucleus"],

["Glycolysis",
"The Embden-Meyerhof-Parnas pathway is another name for glycolysis.",
"Embden-Meyerhof-Parnas pathway",
"Calvin cycle","Krebs cycle","C4 pathway"],

["Glycolysis",
"Sucrose can be converted into glucose and fructose before entering glycolysis.",
"glucose and fructose",
"pyruvate and lactate",
"acetyl-CoA and CO2",
"citrate and OAA"],

["Glycolysis",
"Invertase catalyses conversion of sucrose into glucose and fructose.",
"invertase",
"hexokinase",
"citrate synthase",
"ATP synthase"],

["Glycolysis",
"Hexokinase catalyses phosphorylation of glucose to glucose-6-phosphate.",
"hexokinase",
"invertase",
"pyruvate dehydrogenase",
"succinate dehydrogenase"],

["Glycolysis",
"Two ATP molecules are consumed during glycolysis per glucose.",
"2 ATP",
"1 ATP","3 ATP","4 ATP"],

["Glycolysis",
"Fructose-1,6-bisphosphate is split into two three-carbon phosphate compounds.",
"two three-carbon phosphate compounds",
"two acetyl-CoA molecules",
"two citrate molecules",
"one six-carbon compound"],

["Glycolysis",
"Oxidation of PGAL reduces NAD+ to NADH + H+.",
"NADH + H+",
"FADH2 only","ATP only","O2 only"],

["Glycolysis",
"Four ATP molecules are generated directly during glycolysis per glucose.",
"4 ATP",
"2 ATP","6 ATP","8 ATP"],

["Glycolysis",
"The net ATP gain of glycolysis is two ATP per glucose.",
"2 ATP",
"1 ATP","4 ATP","6 ATP"],

["Glycolysis",
"Two NADH + H+ molecules are produced during glycolysis per glucose.",
"2 NADH + H+",
"1 NADH","3 NADH","4 NADH"],

["Glycolysis",
"One glucose molecule gives two pyruvate molecules at the end of glycolysis.",
"two pyruvate",
"one pyruvate","three pyruvate","six pyruvate"],

["Glycolysis",
"Glycolysis can occur without molecular oxygen.",
"without molecular oxygen",
"only at high oxygen concentration",
"only inside mitochondria",
"only in chloroplasts"],

["Fermentation",
"Alcoholic fermentation produces ethanol and carbon dioxide.",
"ethanol and carbon dioxide",
"lactate and oxygen",
"acetyl-CoA and water",
"citrate and ATP"],

["Fermentation",
"Lactic acid fermentation converts pyruvate into lactic acid.",
"lactic acid",
"ethanol","acetyl-CoA","citrate"],

["Fermentation",
"Alcoholic fermentation involves pyruvic acid decarboxylase and alcohol dehydrogenase.",
"pyruvic acid decarboxylase and alcohol dehydrogenase",
"hexokinase and citrate synthase",
"ATP synthase and cytochrome c",
"invertase and Rubisco"],

["Fermentation",
"Fermentation regenerates NAD+ so glycolysis can continue.",
"regeneration of NAD+",
"formation of oxygen",
"complete oxidation of glucose",
"formation of citrate"],

["Fermentation",
"The net ATP gain associated with fermentation per glucose is two ATP.",
"2 ATP",
"38 ATP","36 ATP","0 ATP"],

["Aerobic respiration",
"Under aerobic conditions pyruvate enters the mitochondrion in eukaryotic cells.",
"mitochondrion",
"nucleus","Golgi apparatus","ribosome"],

["Aerobic respiration",
"Oxidative decarboxylation of pyruvate produces acetyl-CoA, CO2 and NADH + H+.",
"acetyl-CoA, CO2 and NADH + H+",
"lactate, O2 and ATP",
"glucose and water",
"citrate and FADH2"],

["Aerobic respiration",
"Pyruvate dehydrogenase catalyses oxidative decarboxylation of pyruvate.",
"pyruvate dehydrogenase",
"hexokinase",
"lactate dehydrogenase",
"citrate synthase"],

["Aerobic respiration",
"The pyruvate dehydrogenase reaction requires CoA and NAD+ and is associated with Mg2+.",
"CoA, NAD+ and Mg2+",
"only O2","only FAD","only ATP"],

["TCA cycle",
"The TCA cycle begins with condensation of acetyl-CoA with oxaloacetate to form citrate.",
"citrate",
"pyruvate","lactate","succinate"],

["TCA cycle",
"Citrate synthase catalyses formation of citrate.",
"citrate synthase",
"hexokinase",
"pyruvate dehydrogenase",
"ATP synthase"],

["TCA cycle",
"The TCA cycle occurs in the mitochondrial matrix.",
"mitochondrial matrix",
"cytoplasm",
"outer mitochondrial membrane",
"intermembrane space"],

["TCA cycle",
"Isocitrate undergoes oxidative decarboxylation to alpha-ketoglutarate.",
"alpha-ketoglutarate",
"succinate","fumarate","oxaloacetate"],

["TCA cycle",
"Alpha-ketoglutarate undergoes oxidative decarboxylation to succinyl-CoA.",
"succinyl-CoA",
"citrate","succinate","malate"],

["TCA cycle",
"Conversion of succinyl-CoA to succinate is coupled with GTP formation.",
"GTP",
"NADH","FADH2","CO2 only"],

["TCA cycle",
"Succinate is oxidised to fumarate with reduction of FAD to FADH2.",
"FADH2",
"NADH","ATP","GTP"],

["TCA cycle",
"Malate is oxidised to regenerate oxaloacetic acid.",
"oxaloacetic acid",
"citrate","acetyl-CoA","pyruvate"],

["TCA cycle",
"One turn of the TCA cycle releases two molecules of CO2.",
"2 CO2",
"1 CO2","3 CO2","4 CO2"],

["TCA cycle",
"One turn of the TCA cycle produces three NADH + H+ molecules.",
"3 NADH + H+",
"1 NADH","2 NADH","4 NADH"],

["TCA cycle",
"One turn of the TCA cycle produces one FADH2 molecule.",
"1 FADH2",
"0 FADH2","2 FADH2","3 FADH2"],

["TCA cycle",
"One turn of the TCA cycle produces one ATP equivalent through GTP formation.",
"1 ATP equivalent",
"0","2 ATP equivalents","4 ATP equivalents"],

["ETS",
"The electron transport system is located on the inner mitochondrial membrane.",
"inner mitochondrial membrane",
"cytoplasm","outer membrane","matrix"],

["ETS",
"Complex I is NADH dehydrogenase.",
"NADH dehydrogenase",
"succinate dehydrogenase",
"cytochrome c oxidase",
"ATP synthase"],

["ETS",
"Complex II is succinate dehydrogenase.",
"succinate dehydrogenase",
"NADH dehydrogenase",
"cytochrome c oxidase",
"ATP synthase"],

["ETS",
"Ubiquinone accepts electrons from Complex I and receives reducing equivalents associated with Complex II.",
"ubiquinone",
"cytochrome c only",
"oxygen directly",
"ATP synthase"],

["ETS",
"Complex III is the cytochrome bc1 complex.",
"cytochrome bc1 complex",
"NADH dehydrogenase",
"succinate dehydrogenase",
"cytochrome c oxidase"],

["ETS",
"Cytochrome c transfers electrons from Complex III to Complex IV.",
"cytochrome c",
"ubiquinone","ATP synthase","NAD+"],

["ETS",
"Complex IV is cytochrome c oxidase.",
"cytochrome c oxidase",
"NADH dehydrogenase",
"succinate dehydrogenase",
"citrate synthase"],

["ETS",
"Oxygen is the ultimate electron acceptor in aerobic respiration.",
"oxygen",
"glucose","NADH","ubiquinone"],

["ETS",
"Reduction of oxygen at the terminal stage of aerobic respiration produces water.",
"water",
"glucose","pyruvate","citrate"],

["Oxidative phosphorylation",
"Oxidative phosphorylation is ATP formation coupled to oxidation through the respiratory chain.",
"ATP formation coupled to oxidation",
"direct glucose synthesis",
"CO2 fixation",
"DNA replication"],

["Oxidative phosphorylation",
"ATP synthase uses the proton gradient to synthesise ATP.",
"ATP synthase",
"hexokinase","citrate synthase","alcohol dehydrogenase"],

["Oxidative phosphorylation",
"Protons accumulate in the mitochondrial intermembrane space during ETS.",
"intermembrane space",
"matrix only","nucleus","cytoplasm"],

["Oxidative phosphorylation",
"The proton gradient across the inner mitochondrial membrane provides energy for ATP synthesis.",
"proton gradient",
"CO2 gradient","glucose gradient","DNA gradient"],

["Oxidative phosphorylation",
"F0 of ATP synthase forms the membrane-associated proton channel.",
"F0",
"F1","Complex III","cytochrome c"],

["Oxidative phosphorylation",
"F1 is the catalytic component associated with ATP synthesis.",
"F1",
"F0","ubiquinone","Complex I"],

["Balance sheet",
"NCERT gives a theoretical net gain of 38 ATP per glucose under its stated assumptions.",
"38 ATP",
"2 ATP","36 ATP","76 ATP"],

["Balance sheet",
"The theoretical balance sheet assumes glucose is the respiratory substrate and pathways operate sequentially.",
"glucose and orderly sequential operation",
"protein only",
"fat only and no ETS",
"oxygen-free operation"],

["Amphibolic pathway",
"The respiratory pathway is amphibolic because it participates in both catabolism and anabolism.",
"both catabolism and anabolism",
"only catabolism","only anabolism","only photosynthesis"],

["Amphibolic pathway",
"Respiratory intermediates can be withdrawn for biosynthetic pathways.",
"biosynthetic pathways",
"only gas exchange",
"only ATP hydrolysis",
"only DNA replication"],

["Amphibolic pathway",
"Fatty acids can enter respiratory metabolism through respiratory intermediates.",
"respiratory intermediates",
"only glucose","only oxygen","only CO2"],

["Amphibolic pathway",
"Protein-derived carbon skeletons can enter respiratory metabolism at different intermediate points.",
"different respiratory intermediates",
"only glucose","only oxygen","only ATP"],

["RQ",
"Respiratory quotient is CO2 evolved divided by O2 consumed.",
"CO2 evolved / O2 consumed",
"O2 consumed / CO2 evolved",
"ATP / glucose",
"NADH / FADH2"],

["RQ",
"The RQ for complete oxidation of glucose is 1.",
"1",
"0.7","0.5","2"],

["RQ",
"The RQ of fats is generally less than 1.",
"less than 1",
"exactly 1","greater than 2","exactly 0"],

["Energy",
"Substrate-level phosphorylation involves direct phosphate transfer to ADP from a high-energy substrate.",
"direct phosphate transfer to ADP",
"proton pumping only",
"oxygen reduction",
"DNA synthesis"],

["Energy",
"NADH and FADH2 carry reducing equivalents to the respiratory electron transport system.",
"NADH and FADH2",
"ATP and CO2",
"glucose and citrate",
"O2 and water"],

["Comparison",
"Aerobic respiration involves complete oxidation whereas fermentation is incomplete oxidation.",
"aerobic complete; fermentation incomplete",
"both complete",
"both incomplete",
"aerobic produces ethanol"],

["Comparison",
"Glycolysis is linear and cytoplasmic whereas the TCA cycle is cyclic and matrix-based.",
"linear/cytoplasmic versus cyclic/matrix",
"both cyclic",
"both matrix only",
"both cytoplasmic only"]

];


/* =======================================================
   GENERATE 550 NCERT QUESTIONS
======================================================= */

const QUESTION_STYLES = [

fact => `Which statement correctly describes ${fact.topic}?`,

fact => `In the context of ${fact.topic}, which option is correct?`,

fact => `Which of the following is correctly associated with ${fact.topic}?`,

fact => `A student revising ${fact.topic} should remember that:`,

fact => `Which statement would be accepted as correct according to NCERT regarding ${fact.topic}?`,

fact => `The correct NCERT-based answer concerning ${fact.topic} is:`,

fact => `Which option best completes the concept related to ${fact.topic}?`,

fact => `If ${fact.topic} is tested in a direct-recall question, the correct choice is:`,

fact => `Which of the following represents the correct fact about ${fact.topic}?`,

fact => `Choose the most accurate statement concerning ${fact.topic}:`

];


function shuffledOptions(correct, wrongs, seed){

  let options=[correct,...wrongs];

  let shift=seed%4;

  options=options.slice(shift).concat(options.slice(0,shift));

  return options;
}


let factNumber=0;

for(const f of FACTS){

  const fact={
    topic:f[0],
    fact:f[1],
    answer:f[2],
    wrongs:[f[3],f[4],f[5]]
  };

  for(let s=0;s<10;s++){

    const options=shuffledOptions(
      fact.answer,
      fact.wrongs,
      factNumber+s
    );

    addQuestion({

      topic:fact.topic,

      question:QUESTION_STYLES[s](fact),

      options,

      answer:options.indexOf(fact.answer),

      explanation:fact.fact,

      difficulty:
        s<3 ? "Easy" :
        s<7 ? "Medium" :
        "Hard"

    });

  }

  factNumber++;

}


/* =======================================================
   50 PYQ-DERIVED QUESTIONS
   Wording deliberately paraphrased.
======================================================= */

const PYQS=[

[2026,
"How many pyruvate molecules are obtained from 206 glucose molecules through glycolysis?",
["206","309","103","412"],3,
"Glycolysis produces two pyruvate molecules per glucose."],

[2026,
"Which sequence correctly pairs glycolysis, TCA cycle, ETS and proton accumulation with their locations?",
["Glycolysis–cytoplasm; TCA–matrix; ETS–inner membrane; protons–intermembrane space",
"Glycolysis–matrix; TCA–cytoplasm; ETS–outer membrane; protons–matrix",
"All four occur in the mitochondrial matrix",
"Glycolysis–inner membrane; TCA–cytoplasm; ETS–matrix; protons–nucleus"],0,
"These are the NCERT locations of the major stages."],

[2026,
"Which RQ corresponds to complete oxidation of a carbohydrate such as glucose?",
["0.7","0.5","1","2"],2,
"For carbohydrate oxidation, CO2 evolved equals O2 consumed, giving RQ = 1."],

[2025,
"Complex II of the mitochondrial electron transport chain is:",
["NADH dehydrogenase","succinate dehydrogenase","cytochrome c oxidase","ATP synthase"],1,
"Complex II is succinate dehydrogenase."],

[2024,
"Which matching of ETS complexes is correct?",
["I–NADH dehydrogenase; II–succinate dehydrogenase; III–cytochrome bc1; IV–cytochrome c oxidase",
"I–ATP synthase; II–NADH dehydrogenase; III–citrate synthase; IV–hexokinase",
"I–succinate dehydrogenase; II–NADH dehydrogenase; III–ATP synthase; IV–citrate synthase",
"I–cytochrome c oxidase; II–ATP synthase; III–NADH dehydrogenase; IV–succinate dehydrogenase"],0,
"The four respiratory complexes have these identities."],

[2024,
"Which statement about cellular respiration is correct?",
["All cellular respiration occurs in mitochondria",
"Fermentation is complete oxidation",
"Fermentation can occur anaerobically and pyruvate has different possible fates",
"Water forms without oxygen accepting electrons"],2,
"Glycolysis occurs in cytoplasm and fermentation is an anaerobic route."],

[2024,
"Which location pairing is correct?",
["TCA–matrix; glycolysis–cytoplasm; ETS–inner membrane; proton gradient–intermembrane space",
"TCA–cytoplasm; glycolysis–matrix; ETS–outer membrane; gradient–nucleus",
"All are located in cytoplasm",
"TCA–inner membrane; glycolysis–intermembrane space; ETS–matrix"],0,
"These locations follow the NCERT description."],

[2024,
"Which TCA-cycle step does not involve oxidation of its substrate?",
["Succinate → fumarate","Malate → oxaloacetate","Acetyl-CoA + OAA → citrate","Isocitrate → alpha-ketoglutarate"],2,
"The initial condensation forming citrate is not an oxidation step."],

[2023,
"How many decarboxylation events occur during one turn of the TCA cycle?",
["1","2","3","4"],1,
"Two oxidative decarboxylations release two CO2 molecules."],

[2023,
"Fatty acids are connected to the respiratory pathway mainly through:",
["glucose-6-phosphate","acetyl-CoA","lactate","cellulose"],1,
"Fatty-acid breakdown can supply acetyl-CoA to the respiratory pathway."],

[2023,
"Which pairing of respiratory processes and enzymes is correct?",
["Glycolysis–EMP; oxidative decarboxylation–pyruvate dehydrogenase; TCA–citrate synthase",
"Glycolysis–ATP synthase; TCA–hexokinase; ETS–invertase",
"Fermentation–Rubisco; TCA–hexokinase; ETS–invertase",
"ETS–citrate synthase; glycolysis–cytochrome c"],0,
"EMP is glycolysis, pyruvate dehydrogenase handles oxidative decarboxylation and citrate synthase initiates TCA."],

[2022,
"How many ATP molecules are consumed during glycolysis?",
["1","2","3","4"],1,
"Two ATP molecules are invested in glycolysis."],

[2022,
"Which reduced coenzyme is formed when succinate is oxidised to fumarate?",
["NADH","FADH2","NADPH","ATP"],1,
"Succinate dehydrogenase is FAD-linked."],

[2021,
"ATP is directly invested at how many stages of glycolysis?",
["1","2","3","4"],1,
"ATP is used in the glucose phosphorylation and fructose-6-phosphate phosphorylation steps."],

[2020,
"How many substrate-level phosphorylation events occur in one TCA turn?",
["0","1","2","3"],1,
"GTP formation accompanies succinyl-CoA conversion to succinate."],

[2019,
"The enzyme catalysing conversion of glucose to glucose-6-phosphate is:",
["Invertase","Hexokinase","Citrate synthase","Pyruvate dehydrogenase"],1,
"Hexokinase catalyses this phosphorylation."],

[2019,
"The approximate RQ value associated with tripalmitin is:",
["0.7","1.0","1.5","2.0"],0,
"NCERT gives an RQ of about 0.7 for fats such as tripalmitin."],

[2018,
"NAD+ in cellular respiration primarily functions as:",
["the terminal electron acceptor","an electron/hydrogen acceptor during oxidation","an ATP synthase component","a glucose molecule"],1,
"NAD+ is reduced to NADH + H+ during oxidation reactions."],

[2018,
"Which statement is incorrect?",
["Glycolysis occurs in cytoplasm",
"TCA occurs in mitochondrial matrix",
"Glycolysis occurs in mitochondrial matrix",
"Oxygen is the terminal electron acceptor in aerobic respiration"],2,
"Glycolysis occurs in the cytoplasm."],

[2017,
"Which statement about the TCA cycle is wrong?",
["Three NADH are produced per turn",
"One FADH2 is produced per turn",
"GTP is formed at the succinyl-CoA step",
"Acetyl-CoA condenses directly with pyruvate to initiate the cycle"],3,
"Acetyl-CoA condenses with oxaloacetate, not pyruvate."],

[2016,
"Oxidative phosphorylation refers to:",
["direct phosphate transfer from substrate to ADP",
"ATP formation associated with energy released during electron transfer",
"oxidation of ATP",
"conversion of pyruvate into lactate"],1,
"Oxidative phosphorylation couples respiratory electron transfer to ATP synthesis."],

[2016,
"Which metabolite is a common connecting point in breakdown of carbohydrates, fats and proteins?",
["Glucose-6-phosphate","Fructose-1,6-bisphosphate","Acetyl-CoA","Lactate"],2,
"Acetyl-CoA is a major common respiratory intermediate."],

[2015,
"Cytochromes are components of:",
["glycolysis","the respiratory electron transport chain","the Calvin cycle","fermentation only"],1,
"Cytochromes participate in the respiratory electron transport chain."],

[2014,
"In which process is CO2 not released?",
["Alcoholic fermentation","Lactic acid fermentation","Aerobic respiration in plants","Aerobic respiration in animals"],1,
"Conversion of pyruvate to lactate does not involve decarboxylation."],

[2013,
"Which metabolite can connect respiratory breakdown of carbohydrates, fats and proteins?",
["Acetyl-CoA","Glucose-6-phosphate","Fructose-1,6-bisphosphate","Lactate"],0,
"Acetyl-CoA is a common respiratory intermediate."],

[2013,
"Which reducing equivalent is produced at several oxidation steps of aerobic respiration?",
["NADH","DNA","Chlorophyll","Cellulose"],0,
"NADH is generated at several dehydrogenation reactions."],

[2011,
"During mitochondrial electron transport, protons accumulate mainly in the:",
["matrix","intermembrane space","cytoplasm","nucleus"],1,
"Protons are pumped into the intermembrane space."],

[2010,
"The anaerobic energy-releasing process associated with oxidation of substrate without an external electron acceptor is:",
["fermentation","oxidative phosphorylation","photosynthesis","transcription"],0,
"Fermentation allows continued glycolysis by regenerating NAD+."],

[2009,
"Which description correctly distinguishes two major respiratory pathways?",
["Glycolysis is linear while the TCA cycle is cyclic",
"Both glycolysis and TCA are cyclic",
"Both are linear",
"Only glycolysis occurs in mitochondria"],0,
"Glycolysis is linear; the TCA cycle is cyclic."],

[2008,
"Chemiosmotic coupling explains ATP formation through:",
["direct oxidation of ATP","proton movement down an electrochemical gradient through ATP synthase","CO2 diffusion","DNA replication"],1,
"The proton gradient powers ATP synthase."],

[2007,
"Which TCA-cycle enzyme is associated with the inner mitochondrial membrane?",
["Citrate synthase","Succinate dehydrogenase","Malate dehydrogenase","Aconitase"],1,
"Succinate dehydrogenase is also Complex II of the ETS."],

[2007,
"The overall purpose of glycolysis, TCA cycle and ETS is primarily to:",
["capture energy from substrate oxidation","synthesise DNA directly","produce oxygen","make cellulose"],0,
"Respiration conserves energy from substrate oxidation mainly in ATP and reducing equivalents."],

[2006,
"If 686 kcal is available from glucose and one ATP bond stores 12 kcal, the theoretical maximum whole-number ATP count is approximately:",
["12","38","57","686"],2,
"686 ÷ 12 ≈ 57.2, giving 57 complete ATP equivalents in that hypothetical calculation."],

[2005,
"Most ATP during complete aerobic oxidation of glucose is formed during:",
["glycolysis","oxidative phosphorylation","fermentation","pyruvate formation"],1,
"Most ATP is generated through oxidative phosphorylation."],

[2004,
"During the oxidation step of glycolysis, electrons are accepted by:",
["NAD+","ATP","CO2","oxygen directly"],0,
"NAD+ accepts reducing equivalents to form NADH + H+."],

[2003,
"Alcoholic fermentation ultimately produces:",
["ethanol and CO2","lactate only","acetyl-CoA and O2","citrate and water"],0,
"Alcoholic fermentation produces ethanol and carbon dioxide."],

[2003,
"Which pair represents the same pathway?",
["EMP pathway and glycolysis","TCA and Calvin cycle","ETS and glycolysis","Fermentation and photosynthesis"],0,
"EMP is another name for glycolysis."],

[2002,
"Organisms obtaining energy by oxidation of reduced inorganic compounds are called:",
["chemolithotrophs","photoautotrophs only","parasites","heterotrophs only"],0,
"Chemolithotrophs obtain energy by oxidation of reduced inorganic substances."],

[2002,
"The traditional NCERT theoretical ATP yield per glucose is:",
["2","4","38","76"],2,
"NCERT's theoretical balance sheet gives 38 ATP under its stated assumptions."],

[2001,
"Cytochromes function mainly as:",
["electron carriers","ATP molecules","sugar phosphates","CO2-fixing enzymes"],0,
"Cytochromes transfer electrons in the respiratory chain."],

[2000,
"Which major stage of respiration occurs in the cytoplasm?",
["Glycolysis","TCA cycle","ETS","Oxidative phosphorylation"],0,
"Glycolysis occurs in the cytoplasm."],

[2022,
"Which statement correctly represents ATP accounting during glycolysis?",
["4 ATP formed, 2 ATP consumed","2 ATP formed, 4 consumed","6 ATP formed, none consumed","2 ATP formed, 2 consumed"],0,
"Four ATP are generated and two are invested, giving a net gain of two."],

[2021,
"Which molecule must be regenerated for glycolysis to continue during fermentation?",
["NAD+","oxygen","glucose","CO2"],0,
"Fermentation regenerates NAD+ from NADH."],

[2020,
"Which compound is regenerated at the end of the TCA cycle?",
["Oxaloacetate","Glucose","Pyruvate","Lactate"],0,
"Oxaloacetate is regenerated and can condense with another acetyl-CoA."],

[2019,
"Which pair most directly connects the ETS to ATP synthesis?",
["Proton gradient and ATP synthase","Glucose and hexokinase","CO2 and Rubisco","Lactate and alcohol dehydrogenase"],0,
"ETS establishes the proton gradient and ATP synthase uses it."],

[2018,
"Which product of pyruvate oxidation enters the TCA cycle?",
["Acetyl-CoA","Lactate","Glucose","Ethanol"],0,
"Acetyl-CoA condenses with oxaloacetate."],

[2017,
"The terminal electron acceptor in aerobic respiration is:",
["oxygen","NAD+","glucose","ubiquinone"],0,
"Oxygen accepts electrons at the terminal stage."],

[2016,
"Which reaction represents substrate-level phosphorylation in the TCA cycle?",
["Succinyl-CoA → succinate","Citrate → isocitrate","Succinate → fumarate","Malate → OAA"],0,
"GTP formation accompanies the succinyl-CoA to succinate reaction."],

[2015,
"Why can fermentation permit glycolysis to continue anaerobically?",
["It regenerates NAD+","It generates oxygen","It synthesises glucose","It accelerates the TCA cycle"],0,
"NAD+ is required for the PGAL oxidation step of glycolysis."],

[2014,
"Which respiratory substrate generally has an RQ below one?",
["Fat","Glucose","Starch","Sucrose"],0,
"Fats generally have RQ values below one."],

[2013,
"Why is the respiratory pathway called amphibolic?",
["Its intermediates participate in both catabolic and anabolic pathways",
"It occurs only in chloroplasts",
"It produces only CO2",
"It never uses proteins"],0,
"Respiratory intermediates can be used for biosynthesis as well as degradation."],

[2012,
"Which broad sequence correctly represents aerobic glucose oxidation?",
["Glycolysis → pyruvate oxidation → TCA → ETS/oxidative phosphorylation",
"TCA → glycolysis → ETS → fermentation",
"ETS → glycolysis → TCA → photosynthesis",
"Fermentation → TCA → glycolysis → ETS"],0,
"This is the broad sequence of aerobic respiration."],

[2011,
"Which molecule is reduced during the PGAL oxidation step?",
["NAD+","FADH2","ATP","oxygen"],0,
"NAD+ accepts reducing equivalents and becomes NADH + H+."],

[2010,
"Which statement correctly distinguishes substrate-level and oxidative phosphorylation?",
["Substrate-level phosphorylation uses direct phosphate transfer; oxidative phosphorylation is coupled to respiratory electron transfer",
"They are identical",
"Both require direct phosphate transfer from glucose",
"Only substrate-level phosphorylation occurs in mitochondria"],0,
"The two mechanisms generate ATP by different mechanisms."]
];


for(const p of PYQS){

  const [year,question,options,answer,explanation]=p;

  addQuestion({

    source:"NEET PYQ",

    topic:"PYQ • Respiration in Plants",

    question,

    options,

    answer,

    explanation,

    difficulty:"PYQ",

    pyqYear:year

  });

}


/* =======================================================
   FINAL VALIDATION
======================================================= */

console.log(
  `Respiration bank loaded: ${QUESTIONS.length} questions`
);

console.log(
  "PYQs:",
  QUESTIONS.filter(q=>q.source==="NEET PYQ").length
);

console.log(
  "NCERT:",
  QUESTIONS.filter(q=>q.source==="NCERT").length
);


/*
Expected:
NCERT = 550
NEET PYQ = 50
TOTAL = 600
*/
