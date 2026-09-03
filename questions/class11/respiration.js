const QUESTIONS = [

{
 id:"resp-001",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"ETS",

 question:"The ultimate electron acceptor of respiration in an aerobic organism is:",

 options:[
   "Cytochrome",
   "Oxygen",
   "Hydrogen",
   "Glucose"
 ],

 answer:1,

 explanation:
 "Oxygen acts as the final electron/hydrogen acceptor at the terminal stage of aerobic respiration and is reduced to water."
},

{
 id:"resp-002",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Glycolysis",

 question:"Phosphorylation of glucose during glycolysis is catalysed by:",

 options:[
   "Phosphoglucomutase",
   "Phosphoglucoisomerase",
   "Hexokinase",
   "Phosphorylase"
 ],

 answer:2,

 explanation:
 "Hexokinase catalyses phosphorylation of glucose to glucose-6-phosphate."
},

{
 id:"resp-003",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Pyruvate",

 question:"Under aerobic conditions pyruvate is converted into:",

 options:[
   "Lactic acid",
   "Ethanol",
   "Acetyl-CoA + CO₂",
   "Glucose"
 ],

 answer:2,

 explanation:
 "Pyruvate undergoes oxidative decarboxylation to form acetyl-CoA, releasing CO₂ and producing NADH."
},

{
 id:"resp-004",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"ETS",

 question:"Electron Transport System is located in the mitochondrial:",

 options:[
   "Outer membrane",
   "Intermembrane space",
   "Inner membrane",
   "Matrix"
 ],

 answer:2,

 explanation:
 "The components of the electron transport system are located on the inner mitochondrial membrane."
},

{
 id:"resp-005",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Plant respiration",

 question:"Which generally exhibits a very high rate of respiration?",

 options:[
   "A dry seed",
   "A germinating seed",
   "A dead leaf",
   "A mature woody stem"
 ],

 answer:1,

 explanation:
 "Germinating seeds have intense metabolic activity and therefore a high respiratory rate."
},

{
 id:"resp-006",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Concept",

 question:"Which statement is correct?",

 options:[
   "Pyruvate is formed in mitochondria.",
   "Fermentation involves complete oxidation of glucose.",
   "Oxygen is vital as the terminal electron/hydrogen acceptor.",
   "Glycolysis occurs only when oxygen is present."
 ],

 answer:2,

 explanation:
 "Glycolysis occurs in the cytoplasm and can occur without oxygen. Fermentation is incomplete oxidation. Oxygen accepts electrons/hydrogen at the terminal stage of aerobic respiration."
},

{
 id:"resp-007",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Mitochondria",

 question:"The 'powerhouse' description of mitochondria is primarily related to their ability to:",

 options:[
   "Synthesise ATP",
   "Store DNA",
   "Make ribosomes",
   "Digest proteins"
 ],

 answer:0,

 explanation:
 "Mitochondria are major sites of aerobic respiration and ATP generation."
},

{
 id:"resp-008",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Oxidative phosphorylation",

 question:"Oxidative phosphorylation refers to:",

 options:[
   "Formation of glucose using ATP",
   "ATP formation coupled to oxidation of reduced coenzymes through ETS",
   "Breakdown of ATP",
   "Conversion of pyruvate to lactate"
 ],

 answer:1,

 explanation:
 "Oxidative phosphorylation couples electron transfer through the respiratory chain with ATP synthesis."
},

{
 id:"resp-009",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Glycolysis",

 question:"One molecule of glucose entering glycolysis produces:",

 options:[
   "One pyruvate",
   "Two pyruvates",
   "Three pyruvates",
   "Six pyruvates"
 ],

 answer:1,

 explanation:
 "The six-carbon glucose molecule is split into two three-carbon pyruvate molecules."
},

{
 id:"resp-010",
 class:11,
 chapter:"respiration",
 source:"NCERT Exemplar",
 topic:"Krebs cycle",

 question:"Which reaction involves substrate-level phosphorylation in the TCA cycle?",

 options:[
   "Citrate → Isocitrate",
   "Succinate → Fumarate",
   "Succinyl-CoA → Succinate",
   "Malate → Oxaloacetate"
 ],

 answer:2,

 explanation:
 "Conversion of succinyl-CoA to succinate produces GTP. GTP can subsequently form ATP."
},

{
 id:"resp-011",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"Glycolysis",

 question:"Why can glycolysis occur in cells without mitochondria?",

 options:[
   "It occurs in the cytoplasm.",
   "It occurs in the nucleus.",
   "It requires chloroplasts.",
   "It requires the mitochondrial matrix."
 ],

 answer:0,

 explanation:
 "Glycolysis takes place in the cytoplasm, so it does not require mitochondria."
},

{
 id:"resp-012",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"RQ",

 question:"The respiratory quotient for carbohydrates is generally:",

 options:[
   "0.7",
   "0.9",
   "1.0",
   "2.0"
 ],

 answer:2,

 explanation:
 "For carbohydrates, the volume of CO₂ evolved equals the volume of O₂ consumed, giving RQ = 1."
},

{
 id:"resp-013",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"RQ",

 question:"The respiratory quotient of fats is generally:",

 options:[
   "Less than 1",
   "Exactly 1",
   "Greater than 2",
   "Infinite"
 ],

 answer:0,

 explanation:
 "Fats generally have an RQ below 1. NCERT gives about 0.7 for tripalmitin."
},

{
 id:"resp-014",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"Amphibolic",

 question:"The respiratory pathway is called amphibolic because it:",

 options:[
   "Occurs only anaerobically",
   "Participates in both catabolic and anabolic processes",
   "Produces only CO₂",
   "Occurs only in mitochondria"
 ],

 answer:1,

 explanation:
 "Respiratory intermediates can be used for breakdown to release energy and can also be withdrawn as precursors for biosynthesis."
},

{
 id:"resp-015",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"Chemiosmosis",

 question:"In mitochondrial ATP synthase, the F₀ component primarily:",

 options:[
   "Acts as the proton channel",
   "Carries oxygen",
   "Produces glucose",
   "Breaks down pyruvate"
 ],

 answer:0,

 explanation:
 "F₀ forms the membrane channel through which protons move. F₁ contains the catalytic portion associated with ATP synthesis."
},

{
 id:"resp-016",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"Balance sheet",

 question:"The theoretical net ATP gain per glucose given in the NCERT balance sheet is:",

 options:[
   "2",
   "18",
   "36",
   "38"
 ],

 answer:3,

 explanation:
 "NCERT presents 38 ATP as the theoretical net gain under the stated assumptions, while noting that these assumptions are not completely valid in living systems."
},

{
 id:"resp-017",
 class:11,
 chapter:"respiration",
 source:"NCERT application",
 topic:"Respiration",

 question:"Why is respiration described as an amphibolic pathway rather than simply a catabolic pathway?",

 options:[
   "Respiratory intermediates also serve as substrates for biosynthetic pathways.",
   "It occurs only in animals.",
   "It never produces ATP.",
   "It only synthesises carbohydrates."
 ],

 answer:0,

 explanation:
 "Respiratory intermediates are not merely breakdown products. They can be diverted into pathways for synthesis of other biomolecules."
}

];
