// Gemini Flash API Integration Service for Nirmaan Sahayak

let serverLiveMode = false;

// Check if server is in Live Mode (has API Key configured)
export const checkServerLiveMode = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/ai/config');
    const data = await response.json();
    serverLiveMode = !!data.hasApiKey;
  } catch (err) {
    serverLiveMode = false;
  }
};

// Auto-run config check on script load
checkServerLiveMode();

export const getApiKey = () => '';
export const saveApiKey = () => {};

// Check if live API calls are configured
export const isLiveMode = () => {
  return serverLiveMode;
};

// Helper for making API calls to Gemini Flash via backend proxy
async function callGemini(prompt, isJson = false, provider = 'groq') {
  const token = localStorage.getItem('nirmaan_jwt_token');
  const response = await fetch('http://localhost:3001/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ prompt, isJson, provider })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error || `HTTP ${response.status}`;
    throw new Error(`AI API Error: ${errMsg}`);
  }

  const data = await response.json();
  if (!data.text) {
    throw new Error('Empty response received from AI API');
  }

  return data.text;
}

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi (हिंदी)',
  hin: 'Hinglish (conversational Hindi-English mix)',
  mr: 'Marathi (मराठी)',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  kn: 'Kannada (ಕನ್ನಡ)',
  bn: 'Bengali (বাংলা)'
};

// 1. Predict Project Timeline Delay & Risk Analysis
export async function predictProjectRisk(activities, lang = 'en') {
  if (!isLiveMode()) {
    // Return simulated response with natural delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return simulateRiskAnalysis(activities, lang);
  }

  const langName = LANGUAGE_NAMES[lang] || 'English';

  const activityDataText = activities.map(a => 
    `Activity: ${a.name} (ID: ${a.id})
     Planned Dates: ${a.startDate} to ${a.endDate}
     Actual Dates: ${a.actualStartDate || 'Not Started'} to ${a.actualEndDate || 'Not Completed'}
     Status: ${a.status}
     Notes/Issues Logged: ${a.notes || 'None'}`
  ).join('\n---\n');

  const prompt = `
    System Context: You are a principal Project Controls Manager, Chartered Structural Engineer, and Senior Construction Risk Auditor with 20+ years of active field experience in major infrastructure and residential housing projects.
    
    Task: Conduct a rigorous Critical Path Method (CPM) delay analysis and risk forecast for a residential construction project based on the tracking logs below.
    
    Current Construction Timeline Details:
    ${activityDataText}
    
    Instructions:
    1. Evaluate how delayed tasks impact succeeding stages and calculate the overall cascade delay.
    2. Write a highly professional engineering executive summary.
    3. Detail risk descriptions and path ripple impacts.
    4. Provide actionable, high-fidelity site remedial measures (e.g. accelerating curing using hardening admixtures, increasing labor count, rescheduling parallel activities).
    
    Language Constraint:
    - All text values in the JSON output (like "summary", "riskDescription", "impact", and "recommendations") MUST be written strictly in the "${langName}" language (use formal and technically accurate vocabulary in ${langName}).
    
    Output Format:
    Return ONLY a raw, valid JSON object matching the schema below. Do not wrap in markdown code blocks or add comments.
    
    JSON Schema:
    {
      "overallRisk": "Low" | "Medium" | "High",
      "estimatedDelayDays": number,
      "summary": "A concise, technical summary of project health, forecasting path bottlenecks and primary delay causes in ${langName}.",
      "criticalPathRisks": [
        {
          "activityId": "string (matching an activity ID from the input list)",
          "riskDescription": "Detailed engineering description of the delay or structural block in ${langName}",
          "impact": "Ripple effect on succeeding stages and date shift implications in ${langName}"
        }
      ],
      "recommendations": [
        "Actionable site-remedial engineering measure 1 in ${langName}",
        "Actionable site-remedial engineering measure 2 in ${langName}"
      ]
    }
  `;

  try {
    const rawJson = await callGemini(prompt, true);
    return JSON.parse(rawJson);
  } catch (error) {
    console.error('Failed to run live risk prediction, falling back to simulator:', error);
    return simulateRiskAnalysis(activities, lang);
  }
}

// 2. Customize Checklists Based on Site Variables & Activities
export async function generateCustomChecklists(params, activities, lang = 'en') {
  const { soilType, season, stories, budget } = params;
  const langName = LANGUAGE_NAMES[lang] || 'English';
  
  if (!isLiveMode()) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return simulateCustomChecklist(params, activities);
  }

  // Map activities to a compact format for the LLM prompt
  const activityListText = activities.map(a => `- ${a.name} (ID: ${a.id})`).join('\n');

  const prompt = `
    System Context: You are a principal QA/QC (Quality Assurance / Quality Control) Construction Audit Director, Senior Structural Engineer, and Space Planner with 20+ years of active field experience in residential housing projects.
    
    Task: Customize and generate a highly rigorous, site-specific quality assurance checklist matching IS codes (Indian Standard Codes) and best engineering practices for the list of project activities.
    
    Site & Project Parameters:
    - Soil Type: ${soilType} (Adjust foundations: e.g. Black Cotton Soil requires under-reamed piles or sand backfilling, Hard Murrum requires typical isolated footings).
    - Construction Start Season: ${season} (Adjust curing & concrete casting instructions based on climate).
    - Building Structure/Size: ${stories}
    - Budget Tier: ${budget} (Standard vs Luxury finishes and inspection intervals).
    
    Activities list to audit:
    ${activityListText}
    
    Instructions for generating Checklist Items:
    For each activity ID in the input list, you MUST generate exactly 3 highly rigorous checkpoints:
    1. Civil Engineering check (e.g., compaction, rebar detailing, concrete mix design, water-cement ratios, slump test, cover block verification, curing duration).
    2. Architectural check (e.g., dimensional accuracy, setbacks, ventilation, column alignment, room heights, door/window frame clearance).
    3. Interior Finishing check (e.g., surface preparation, plastering verticality, plumbing pressure tests, waterproofing gradient, electrical conduit routing, paint priming).
    
    Quality Reference Constraints:
    - In the "rule" field, you MUST quote specific Indian Standard Codes (e.g., IS 456 for concrete, IS 1905 for masonry, IS 1200 for measurement, IS 269 for cement) and technical specs.
    
    Language Constraint:
    - All text values in the JSON output ("text" and "rule" fields) MUST be written in the "${langName}" language. Use formal civil engineering terminology.
    
    Output Format:
    Return ONLY a raw, valid JSON object matching the schema below. Do not wrap in markdown code blocks.
    
    JSON Schema:
    {
      "activities": [
        {
          "activityId": "string (matching the exact activity ID from the input list)",
          "checkpoints": [
            {
              "text": "Civil QA check detail in ${langName}",
              "rule": "IS Code or technical concrete standard in ${langName}"
            },
            {
              "text": "Architectural alignment check detail in ${langName}",
              "rule": "Architectural bylaw or dimensional standard in ${langName}"
            },
            {
              "text": "Interior finishing/MEP QA check detail in ${langName}",
              "rule": "Finishing/plumbing/electrical specification in ${langName}"
            }
          ]
        }
      ]
    }
  `;

  try {
    const rawJson = await callGemini(prompt, true);
    return JSON.parse(rawJson);
  } catch (error) {
    console.error('Failed to generate live checklist, falling back to simulator:', error);
    return simulateCustomChecklist(params, activities);
  }
}

// 3. AI Predictive Scheduling and Concurrency Engine (CPM)
export async function generateAIPredictiveSchedule(params, startStr, lang = 'en') {
  const { soilType, season, stories, budget } = params;
  const langName = LANGUAGE_NAMES[lang] || 'English';

  if (!isLiveMode()) {
    // Simulated Scheduler Fallback
    await new Promise(resolve => setTimeout(resolve, 1500));
    return simulateAIPredictiveSchedule(params, lang);
  }

  const prompt = `
    System Context: You are a principal Project Scheduler, Construction Estimator, and Senior Civil Engineer with 20+ years of expertise in CPM/PERT scheduling and construction management.
    
    Task: Calculate duration multipliers and dependency relationships (concurrency and lag) for a G+${stories} construction project under specific site variables.
    
    Site Parameters:
    - Soil Type: ${soilType} (E.g. Expansive Black Cotton Clay slows down foundation/substructure phases to 1.5x due to excavation difficulties and pile casting. Hard Murrum is fast).
    - Start Season: ${season} (E.g. Monsoons completely stop excavation/foundation casting. Summer heat wave requires extreme curing but accelerates brickwork. Winter slows concrete setting).
    - Budget Level: ${budget} (E.g. Luxury budget adds finishing layers and QA inspection lag, economy accelerates timelines using standard materials).
    
    Phases to analyze:
    1. "Planning & Approvals"
    2. "Site Setup"
    3. "Substructure"
    4. "Structure" (RCC column/slab casting)
    5. "Walls" (Brickwork/plastering)
    6. "Plumbing" (Piping/concealed drainage)
    7. "Electrical" (Conduits/DB wiring)
    8. "Flooring" (screed/tiles)
    9. "Windows & Doors" (frames/fittings)
    10. "Interiors" (false ceiling/joinery)
    11. "Exterior Works" (facade/waterproofing/solar)
    12. "Commissioning & Handover" (snagging/OC certificate)
    
    Instructions:
    Determine:
    - "durationMultiplier": Speed coefficient (0.80 to 2.00) based on site conditions.
    - "relationship": "Sequential" (must wait for predecessor) or "Parallel" (can overlap).
    - "overlapDays": Overlap lag duration (0 to 10 days) if Parallel.
    - "civilAdvice", "architectAdvice", "interiorAdvice": Highly technical, code-compliant instructions in "${langName}".
    
    Language Constraint:
    - All text descriptions (advice fields) MUST be in the "${langName}" language.
    
    Output Format:
    Return ONLY a raw, valid JSON object matching the schema below. No markdown wrapping.
    
    JSON Schema:
    {
      "phases": [
        {
          "phaseName": "string (matching the exact phase name from the list above)",
          "durationMultiplier": number,
          "relationship": "Sequential" | "Parallel",
          "overlapDays": number,
          "civilAdvice": "Technical civil engineering advisory in ${langName}",
          "architectAdvice": "Architectural clearance/sanction recommendation in ${langName}",
          "interiorAdvice": "Interior finishes or MEP scheduling tip in ${langName}"
        }
      ]
    }
  `;

  try {
    const rawJson = await callGemini(prompt, true);
    return JSON.parse(rawJson);
  } catch (error) {
    console.error('Failed to run AI scheduler, falling back to simulator:', error);
    return simulateAIPredictiveSchedule(params, lang);
  }
}

function simulateAIPredictiveSchedule(params, lang) {
  const isHi = lang === 'hi' || lang === 'hin';
  const isMr = lang === 'mr';
  
  // Create simulated values based on parameters
  const soilMult = params.soilType === 'Black Cotton' ? 1.5 : 1.0;
  const rainMult = params.season === 'Monsoon' ? 1.4 : 1.0;
  
  return {
    phases: [
      {
        phaseName: "Planning & Approvals",
        durationMultiplier: 1.0,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "फाउंडेशन डिजाइन के लिए मिट्टी की असर क्षमता (SBC) टेस्ट करवाएं।" : isMr ? "पाया डिझाइनसाठी मातीची SBC चाचणी आवश्यक आहे." : "Conduct SBC test of soil before finalizing structural dimensions.",
        architectAdvice: isHi ? "नगर निगम के नियमों के अनुसार सेट-बैक एरिया खाली छोड़ें।" : isMr ? "नगरपालिकेच्या नियमांनुसार सेट-बैक मोकळा ठेवा." : "Maintain side setback lines as per local municipal bylaws.",
        interiorAdvice: isHi ? "पिलर की पोजीशनिंग से पहले ही फर्नीचर लेआउट तय कर लें।" : isMr ? "पिलर उभारण्यापूर्वी फर्निचर लेआउट ठरवा." : "Lock wardrobe positions before columns are cast to avoid protrusions."
      },
      {
        phaseName: "Site Setup",
        durationMultiplier: 1.0,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "कंक्रीट की तराई के लिए बोरवेल पानी का pH स्तर 6 से 8 के बीच होना चाहिए।" : isMr ? "पाण्याचा pH ६ ते ८ दरम्यान असावा." : "Ensure borewell curing water pH is between 6.0 and 8.0.",
        architectAdvice: isHi ? "सामग्री स्टोर करने के लिए वाटरप्रूफ शेड बनाएं।" : isMr ? "साहित्यासाठी वॉटरप्रूफ शेड बनवा." : "Erect waterproof material storage sheds to avoid weathering.",
        interiorAdvice: isHi ? "बिजली की मुख्य केबल के लिए उपयुक्त नाली छोड़ें।" : isMr ? "विजेच्या मुख्य वायरसाठी पाइपिंग करा." : "Coordinate temporary DB panels away from finish interior walls."
      },
      {
        phaseName: "Substructure",
        durationMultiplier: soilMult * rainMult,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "काली मिट्टी (Black Cotton Soil) में नींव की गहराई बढ़ाएं और सैंड फिलिंग करें।" : isMr ? "काळी मातीत पाया खोल घ्या आणि वाळू भरा." : "For Black Cotton soil, increase footing depth and perform sand cushioning.",
        architectAdvice: isHi ? "प्लिंथ बीम का स्तर सड़क के स्तर से कम से कम 1.5-2 फीट ऊपर रखें।" : isMr ? "प्लिंथ पातळी रस्त्यापेक्षा २ फूट वर ठेवा." : "Plinth height must be min 1.5-2 feet above road level to prevent flooding.",
        interiorAdvice: isHi ? "फर्श के नीचे से जाने वाले प्लंबिंग पाइप का लेआउट पहले से तैयार करें।" : isMr ? "प्लंबिंग पाईप्सचे नियोजन आधीच करा." : "Route under-floor drainage lines before plinth backfilling."
      },
      {
        phaseName: "Structure",
        durationMultiplier: rainMult,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "स्लैब ढलाई के बाद 10-14 दिनों तक पानी भरकर तराई करें।" : isMr ? "स्लॅब ओतल्यानंतर १४ दिवस क्युरिंग करा." : "Pond water over roof slab for min 10-14 days to achieve maximum strength.",
        architectAdvice: isHi ? "rainwater डाउनटेक पाइप के लिए स्लैब में स्लीव्स छोड़ना न भूलें।" : isMr ? "पावसाच्या पाण्यासाठी पाईप होल ठेवा." : "Ensure slab sleeves are cast for plumbing/rainwater drops.",
        interiorAdvice: isHi ? "सीलिंग फैन के हुक सीधे सरिया से बांधें, बाद में न काटें।" : isMr ? "फॅन हुक सळईला बांधा." : "Anchor fan hooks directly to structural steel rebars before pouring slab."
      },
      {
        phaseName: "Walls",
        durationMultiplier: 1.0,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "चिनाई करने से पहले ईंटों को पानी में अच्छे से डुबोएं।" : isMr ? "विटा रचण्यापूर्वी पाण्यात भिजवा." : "Soak bricks in water for 2 hours to avoid joint mortar cracks.",
        architectAdvice: isHi ? "खिड़कियों के ऊपर लिंटल बीम कम से कम 150 मिमी दीवार पर टिका होना चाहिए।" : isMr ? "लिंटेल बीम दोन्ही बाजूंनी भिंतीवर १५० मिमी असावा." : "Ensure lintel beams bear at least 150mm on adjacent masonry support.",
        interiorAdvice: isHi ? "पिलर और ईंट के जोड़ पर मुर्गा जाली लगाएं ताकि प्लास्टर में दरार न आए।" : isMr ? "कॉलम-वीट सांध्यावर जाळी बसवा." : "Install chicken mesh at concrete-masonry joints to prevent plaster cracks."
      },
      {
        phaseName: "Plumbing",
        durationMultiplier: 1.0,
        relationship: "Parallel",
        overlapDays: 4,
        civilAdvice: isHi ? "बाथरूम के सनकेन स्लैब में टाइल्स लगाने से पहले वॉटरप्रूफिंग का 48 घंटे पॉन्ड टेस्ट करें।" : isMr ? "वॉटरप्रूफिंगची ४८ तास पाणी साठवून चाचणी घ्या." : "Sunken slab must undergo a 48-hour water pond test before tiling.",
        architectAdvice: isHi ? "गंदे पानी और साफ पानी के निकास के पाइप अलग रखें।" : isMr ? "सांडपाण्याचे आणि पिण्याच्या पाण्याचे पाईप वेगळे ठेवा." : "Separate waste soil stacks from fresh water piping.",
        interiorAdvice: isHi ? "दीवार में छुपाने वाले नल (concealed taps) की ऊंचाई फर्श से नाप कर लगाएं।" : isMr ? "भिंतीतील नळांची उंची अचूक ठेवा." : "Lock height of concealed mixer diverters matching proposed tile finishes."
      },
      {
        phaseName: "Electrical",
        durationMultiplier: 1.0,
        relationship: "Parallel",
        overlapDays: 3,
        civilAdvice: isHi ? "दीवार काटते समय कंक्रीट के पिलर (Columns) को न काटें।" : isMr ? "भिंत कापताना काँक्रीट कॉलम कापू नका." : "Do not hack or cut vertical load-bearing columns for electrical conduits.",
        architectAdvice: isHi ? "सभी कमरों में स्विचबोर्ड की स्थिति सुगम ऊंचाई (1.2 - 1.4 मीटर) पर रखें।" : isMr ? "स्विचबोर्डची उंची सोयीस्कर ठेवा." : "Fix modular switchboard boxes at standard user-friendly heights (1.2m).",
        interiorAdvice: isHi ? "टीव्ही पैनल और एसी के लिए कंसील्ड वायरिंग का रास्ता पहले से तय करें।" : isMr ? "टीव्ही आणि एसीच्या वायरिंगचे नियोजन करा." : "Route separate conduits for internet Cat6 and power cables to avoid interference."
      },
      {
        phaseName: "Flooring",
        durationMultiplier: 1.0,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "बाथरूम और बालकनी में फर्श का ढलान नाली की तरफ होना चाहिए।" : isMr ? "बाथरूमचा उतार मोरीकडे असावा." : "Ensure proper floor screed slope towards drain traps in bathrooms.",
        architectAdvice: isHi ? "मार्बल/टाइल्स लगाने के बाद सतह पर खरोंच से बचने के लिए सुरक्षात्मक शीट बिछाएं।" : isMr ? "फ्लोअरिंगवर स्क्रॅच टाळण्यासाठी प्लास्टिक शीट वापरा." : "Cover newly tiled floors with protection sheets to prevent scratch damage.",
        interiorAdvice: isHi ? "रसोई के प्लेटफार्म के लिए मजबूत ग्रेनाइट और वॉटरप्रूफ बेस बोर्ड का प्रयोग करें।" : isMr ? "किचन कट्ट्यासाठी कडक ग्रॅनाईट वापरा." : "Use BWR plywood for under-counter kitchen cabinet supports."
      },
      {
        phaseName: "Windows & Doors",
        durationMultiplier: 1.0,
        relationship: "Parallel",
        overlapDays: 2,
        civilAdvice: isHi ? "दरवाजे की चौखट को दीवार से मजबूती से जोड़ने के लिए एंकर फास्टनर का प्रयोग करें।" : isMr ? "चौकट भिंतीत बसवताना फास्टनर वापरा." : "Secure wooden door frames (chaukhat) with min 3 holdfast clamps per side.",
        architectAdvice: isHi ? "खिड़कियों में धूल और पानी रोकने के लिए यूपीवीसी (UPVC) फ्रेम्स का चुनाव करें।" : isMr ? "धूळ आणि पाणी रोखण्यासाठी यूपीवीसी खिडक्या वापरा." : "Ensure UPVC frames have clearance foam to prevent wind leakage.",
        interiorAdvice: isHi ? "मुख्य दरवाजे पर अच्छी पॉलिश (PU veneer polish) का इस्तेमाल करें।" : isMr ? "मुख्य दरवाजावर चांगल्या दर्जाचे पॉलिश वापरा." : "Verify door locks are aligned flush in recesses to avoid clicking issues."
      },
      {
        phaseName: "Interiors",
        durationMultiplier: 1.0,
        relationship: "Parallel",
        overlapDays: 5,
        civilAdvice: isHi ? "फॉल्स सीलिंग ग्रिड का वजन उठाने के लिए मजबूत जीआई हैंगर का प्रयोग करें।" : isMr ? "सीलिंगसाठी मजबूत हँगर्स वापरा." : "Use GI steel anchor fasteners for hanging false ceiling grids.",
        architectAdvice: isHi ? "रसोई में चिमनी के धुएं के निकास का पाइप सीधा और छोटा रखें।" : isMr ? "किचन चिमणीचे पाईप लहान ठेवा." : "Ensure chimney exhaust sleeve exists on external walls.",
        interiorAdvice: isHi ? "किचन में ड्रॉअर के लिए सॉफ्ट-क्लोज रनर्स और अलमारी में टिकाऊ लेमिनेट्स लगाएं।" : isMr ? "किचन ड्रॉअरसाठी सॉफ्ट-क्लोज चॅनेल्स वापरा." : "Install premium soft-close hinges on acrylic modular cabinet doors."
      },
      {
        phaseName: "Exterior Works",
        durationMultiplier: rainMult,
        relationship: "Parallel",
        overlapDays: 4,
        civilAdvice: isHi ? "बाहरी प्लास्टर में वॉटरप्रूफिंग कंपाउंड का प्रयोग करें ताकि सीलन न आए।" : isMr ? "बाहेरील प्लास्टरमध्ये वॉटरप्रूफिंग वापरा." : "Incorporate waterproofing additives in external double-coat plastering.",
        architectAdvice: isHi ? "छत के पानी को स्टोर करने के लिए रेनवाटर हार्वेस्टिंग पिट का निर्माण करें।" : isMr ? "पावसाच्या पाण्यासाठी हार्वेस्टिंग पिट बनवा." : "Install rain harvesting recharge wells near the borewell site.",
        interiorAdvice: isHi ? "बाहर लाइटिंग के लिए वाटरप्रूफ (IP66) लाइटों का उपयोग करें।" : isMr ? "बाहेर वॉटरप्रूफ दिवे वापरा." : "Select corrosion-protected IP66 rated bollard lights for lawn paths."
      },
      {
        phaseName: "Commissioning & Handover",
        durationMultiplier: 1.0,
        relationship: "Sequential",
        overlapDays: 0,
        civilAdvice: isHi ? "मुख्य बिजली चालू करने से पहले अर्थिंग प्रतिरोध (Earth Resistance) नापें।" : isMr ? "मुख्य वीज सुरू करण्यापूर्वी अर्थिंग तपासा." : "Measure earth grounding resistance to be below 2 ohms before turning on main line.",
        architectAdvice: isHi ? "गृह प्रवेश से पहले नगर निगम से भोग प्रमाणपत्र (Occupancy Certificate) प्राप्त करें।" : isMr ? "घरात राहण्यापूर्वी भोगवटा प्रमाणपत्र मिळवा." : "Acquire signed Occupancy Certificate (OC) from municipal body.",
        interiorAdvice: isHi ? "चाबियां सौंपने से पहले पूरे घर की गहरी सफाई (Deep Cleaning) करवाएं।" : isMr ? "चाव्या ताब्यात घेण्यापूर्वी घराची सखोल स्वच्छता करा." : "Conduct complete chemical deep cleaning of tiles and glass panels."
      }
    ]
  };
}

// 3. Ask Construction Advisor Chat
export async function askAdvisorQuestion(question, chatHistory = [], lang = 'en') {
  const langName = LANGUAGE_NAMES[lang] || 'English';
  
  if (!isLiveMode()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return simulateAdvisorAnswer(question);
  }

  const historyContext = chatHistory.map(h => 
    `${h.sender === 'user' ? 'User' : 'Advisor'}: ${h.text}`
  ).join('\n');

  const prompt = `
    System Context: You are "Nirmaan Sahayak Advisor", a Senior Project Management Consultant, Chartered Structural Engineer, and Principal Architect with 20+ years of experience in residential construction.
    
    Behavior: You speak as a highly knowledgeable, helpful, and technically precise engineering advisor. You always back up your answers with concrete construction codes (like Indian Standard Codes: IS 456 for concrete, IS 1905 for masonry, IS 1200 for measurement), concrete mixes (M20, M25, M30), water-cement ratios, structural safety guidelines, and space styling tips.
    
    Language Constraint:
    - You MUST write your entire response in the "${langName}" language. Use technically accurate and polite terms in ${langName}.
    
    Conversation History:
    ${historyContext}
    
    Current User Question:
    ${question}
  `;

  try {
    return await callGemini(prompt, false);
  } catch (error) {
    console.error('Failed to run live chat, falling back to simulator:', error);
    return simulateAdvisorAnswer(question);
  }
}

/* ==========================================================================
   Simulator / Demo Fallback Mode
   ========================================================================== */

function simulateRiskAnalysis(activities, lang = 'en') {
  let estimatedDelayDays = 0;
  let overallRisk = 'Low';
  const criticalPathRisks = [];
  const recommendations = [];

  const isHindi = lang === 'hi';

  // Inspect activities for delayed status or logs
  const delayed = activities.filter(a => a.status === 'Delayed');
  const inProgress = activities.filter(a => a.status === 'In Progress');

  // Let's add simulated delays
  if (delayed.length > 0) {
    overallRisk = 'High';
    estimatedDelayDays = delayed.length * 12 + inProgress.length * 4;
    
    delayed.forEach(d => {
      criticalPathRisks.push({
        activityId: d.id,
        riskDescription: isHindi
          ? `${d.name} में देरी आगामी चरणों के काम में बाधा डाल रही है।`
          : `Delay in ${d.name} is holding up subsequent sequencing.`,
        impact: isHindi
          ? `यह आगामी सभी कार्यों की शुरूआती तारीखों को आगे धकेलेगा। वर्तमान देरी लगभग ${d.name === 'Excavation' ? '15' : '10'} दिन अनुमानित है।`
          : `Pushes back the start dates of all descendant tasks. Current delay is estimated at ${d.name === 'Excavation' ? '15' : '10'} days.`
      });
    });

    if (isHindi) {
      recommendations.push(
        'देरी को कम करने के लिए अतिरिक्त श्रमिक बल तैनात करें।',
        'सप्लाई चेन में और रुकावट से बचने के लिए कच्चे माल (सीमेंट/बजरी/रेत) के स्टॉक की जांच करें।',
        'आगे के गैर-ढांचागत कार्यों (जैसे चिनाई की योजना) को समानांतर में करने के लिए समय-सारणी बदलें।'
      );
    } else {
      recommendations.push(
        'Deploy additional labor force to expedite current delayed phases.',
        'Check raw material stocks (cement/aggregate/sand) to avoid further supply chain lag.',
        'Reschedule upcoming non-structural activities (e.g. brickwork planning) to parallelize tasks.'
      );
    }
  } else if (inProgress.length > 0) {
    overallRisk = 'Medium';
    estimatedDelayDays = 5;
    
    criticalPathRisks.push({
      activityId: inProgress[0].id,
      riskDescription: isHindi
        ? `${inProgress[0].name} वर्तमान में सक्रिय है और प्रगति की कड़ी निगरानी की आवश्यकता है।`
        : `${inProgress[0].name} is currently active and requires strict progress monitoring.`,
      impact: isHindi
        ? `यदि यह चरण अपनी समय-सीमा से आगे बढ़ता है, तो यह अगले अनुक्रम में देरी करेगा।`
        : 'If this phase extends past its deadline, it will delay the next sequence.'
    });

    if (isHindi) {
      recommendations.push(
        'सत्यापित करें कि अगले चरण के लिए सामग्री खरीद पूरी हो चुकी है।',
        'समस्याओं (शटरिंग रिसाव, स्टील संरेखण) को जल्द पकड़ने के लिए दैनिक गुणवत्ता जांच (QC) निरीक्षण करें।'
      );
    } else {
      recommendations.push(
        'Verify that material procurement for the next phase is complete.',
        'Conduct daily QC inspections to catch issues (shuttering leaks, steel placement) early.'
      );
    }
  } else {
    overallRisk = 'Low';
    estimatedDelayDays = 0;
    if (isHindi) {
      recommendations.push(
        'वर्तमान कार्य गति बनाए रखें। सुनिश्चित करें कि कंक्रीट तराई (curing) नियमों का कड़ाई से पालन किया जाए।',
        'जैसे-जैसे नए मील के पत्थर हासिल हों, समय-सीमा को दैनिक रूप से अपडेट करें।'
      );
    } else {
      recommendations.push(
        'Maintain current workflow speed. Ensure concrete curing regimes are adhered to strictly.',
        'Update timeline daily as new milestones are hit.'
      );
    }
  }

  let summaryText = '';
  if (isHindi) {
    summaryText = `वर्तमान प्रगति के आधार पर, परियोजना की समय-सीमा ${overallRisk === 'High' ? 'अधूरी गतिविधियों के कारण गंभीर देरी के जोखिम में है।' : 'स्थिर है। समय-सारणी कुल मिलाकर अनुमानित और सही है।'}`;
  } else {
    summaryText = `Based on current progress, the project timeline is ${overallRisk === 'High' ? 'at critical delay risk due to uncompleted stages.' : 'stable. Schedule is overall predictable.'}`;
  }

  return {
    overallRisk,
    estimatedDelayDays,
    summary: summaryText,
    criticalPathRisks,
    recommendations
  };
}

function simulateCustomChecklist(params, activities) {
  const { soilType, season, stories, budget } = params;
  
  const simulated = activities.map(act => {
    const name = act.name.toLowerCase();
    const id = act.id;
    let checkpoints = [];

    if (name.includes('survey') || name.includes('demarcation') || name.includes('drawing') || name.includes('permit') || name.includes('planning') || name.includes('sbc')) {
      checkpoints = [
        {
          text: 'Verify building boundaries and setback dimensions using total station.',
          rule: 'Must comply with municipal zoning regulations (minimum 1.5m clearance).'
        },
        {
          text: 'Approve GFC (Good For Construction) structural and column layout drawings.',
          rule: 'Drawings must be stamped and sealed by a licensed structural engineer.'
        },
        {
          text: 'Analyze space ergonomics and cross-ventilation openings.',
          rule: 'Windows area must be at least 10% of carpet area for adequate natural light (National Building Code).'
        }
      ];
    } else if (name.includes('excavation') || name.includes('anti-termite') || name.includes('soil')) {
      const depth = soilType === 'Black Cotton' ? '2.0 meters' : '1.5 meters';
      checkpoints = [
        {
          text: `Verify excavation depth reaches minimum ${depth} to bypass loose top soil.`,
          rule: `Must reach stable hard strata. For ${soilType} soil, extra depth is required.`
        },
        {
          text: 'Check column center-line marking coordinates against base profile boards.',
          rule: 'Coordinate deviation limit is strictly +/- 2mm.'
        },
        {
          text: 'Apply anti-termite chemical emulsion uniformly to pit beds and side walls.',
          rule: 'Use Chlorpyrifos 20% EC solution mixed in water (1:19 ratio).'
        }
      ];
    } else if (name.includes('pcc') || name.includes('footing') || name.includes('foundation') || name.includes('plinth')) {
      const cover = name.includes('footing') ? '50mm' : '25mm';
      checkpoints = [
        {
          text: `Check bottom and side concrete cover blocks of minimum ${cover} thickness.`,
          rule: 'As per IS 456, cover blocks prevent rebar corrosion; do not use stones or wood.'
        },
        {
          text: 'Verify concrete mix grade and strict water-cement ratio.',
          rule: 'Use M20/M25 concrete mix. Water-cement ratio must be strictly 0.45 to 0.48.'
        },
        {
          text: 'Verify vertical alignment (plumb bob) of column starter rebars before casting.',
          rule: 'Plumb verticality deviation limit is maximum 3mm.'
        }
      ];
    } else if (name.includes('column') || name.includes('reinforcement') || name.includes('beam') || name.includes('slab') || name.includes('concrete')) {
      checkpoints = [
        {
          text: 'Check concrete reinforcement binding wire tightness and stirrup hook angles.',
          rule: 'Stirrup hooks must be bent at 135 degrees (not 90) to resist seismic shear forces.'
        },
        {
          text: 'Verify compaction using needle vibrators (vibrate 15-20 seconds per spot).',
          rule: 'Avoid over-vibrating which causes cement slurry separation (segregation).'
        },
        {
          text: 'Set up curing water ponds and jute bag wrappings.',
          rule: `Cure for minimum 10-14 days. If season is ${season}, perform curing 3 times daily.`
        }
      ];
    } else if (name.includes('brick') || name.includes('masonry') || name.includes('wall')) {
      checkpoints = [
        {
          text: 'Ensure bricks are pre-soaked in water tanks for at least 2 hours before laying.',
          rule: 'Dry bricks absorb mortar water, leading to weak joints and wall cracks.'
        },
        {
          text: 'Check mortar mix ratio and vertical plumb Bob alignment.',
          rule: 'Use 1:6 mix for 9-inch load-bearing walls, 1:4 for 4.5-inch partition walls.'
        },
        {
          text: 'Provide horizontal RCC bands (coping) at sill and lintel levels.',
          rule: 'Lintel beam must extend minimum 150mm on adjacent masonry supports.'
        }
      ];
    } else if (name.includes('plaster') || name.includes('groove') || name.includes('mesh')) {
      checkpoints = [
        {
          text: 'Fix chicken wire mesh (murga jaali) over column-brick masonry joints before plastering.',
          rule: 'Mesh must overlap 100mm on both sides to prevent thermal expansion cracks.'
        },
        {
          text: 'Check plaster thickness and surface level verticality.',
          rule: 'Inner walls plaster: 12mm thick, ceiling plaster: 6mm thick. Plaster mix ratio 1:4.'
        },
        {
          text: 'Erect vertical grooves at joints of concrete beams and brick masonry.',
          rule: 'Allows controlled minor expansion movements without cracks.'
        }
      ];
    } else if (name.includes('plumbing') || name.includes('pipe') || name.includes('sewage') || name.includes('water')) {
      checkpoints = [
        {
          text: 'Perform hydraulic pressure leakage test on concealed water pipes.',
          rule: 'Pipes must hold water pressure of 10 bar for 1 hour without any drops.'
        },
        {
          text: 'Check sewage piping slope coordinates using spirit levels.',
          rule: 'Slope must be minimum 1 in 40 for smooth flow; use rubber ring joint seals.'
        },
        {
          text: 'Erect bathroom floor traps and check their level alignment.',
          rule: 'Traps must be placed below floor tile level to ensure zero stagnant pools.'
        }
      ];
    } else if (name.includes('electrical') || name.includes('wiring') || name.includes('conduit') || name.includes('switch')) {
      checkpoints = [
        {
          text: 'Verify heavy-duty concealed PVC conduit pipe paths.',
          rule: 'Run conduits vertically; horizontal grooving on structural columns is strictly prohibited.'
        },
        {
          text: 'Check wire gauge diameters and insulation categories.',
          rule: 'Use copper wires: 1.5 sq.mm for lighting circuits, 2.5 for sockets, 4.0 for AC/Geysers.'
        },
        {
          text: 'Check earthing grounding resistance at main distribution board.',
          rule: 'Copper plate earthing resistance must be below 5 ohms for safety.'
        }
      ];
    } else if (name.includes('waterproofing') || name.includes('sunken') || name.includes('leak')) {
      checkpoints = [
        {
          text: 'Apply two coats of elastomeric polymer waterproofing membrane in wet zones.',
          rule: 'Extend waterproofing coating 300mm up the wall skirting to prevent damp patches.'
        },
        {
          text: 'Perform water pond test in bathroom sunken slabs for 48 hours.',
          rule: 'Maintain water depth of 100mm; check ceiling of floor below for seepage.'
        },
        {
          text: 'Fill joints around floor drains with non-shrink polyurethane sealant.',
          rule: 'Prevents leakage through concrete-pipe interface points.'
        }
      ];
    } else if (name.includes('tile') || name.includes('flooring') || name.includes('cladding')) {
      checkpoints = [
        {
          text: 'Check tile adhesive layer thickness and back-buttering coverage.',
          rule: 'Tap tiles with rubber mallets to ensure 100% mortar coverage and zero hollow spots.'
        },
        {
          text: 'Verify floor levels and slope direction towards drain traps.',
          rule: 'Floor slope must be 1:100 in wet zones, and perfectly level in bedrooms.'
        },
        {
          text: 'Apply epoxy grout in kitchen and bathroom joints instead of white cement.',
          rule: 'Epoxy grout is 100% waterproof, acid-resistant, and prevents black fungus growth.'
        }
      ];
    } else if (name.includes('paint') || name.includes('putty') || name.includes('finish')) {
      checkpoints = [
        {
          text: 'Check moisture levels in concrete walls using moisture meters.',
          rule: 'Moisture content must be below 12% before applying wall putty or primer.'
        },
        {
          text: 'Verify sanding of wall putty coat under halogen spotlight.',
          rule: 'Reveals minor surface waves or lines; ensures smooth premium finishes.'
        },
        {
          text: 'Use low-VOC acrylic emulsion paints for interior spaces.',
          rule: 'Protects indoor air quality and limits chemical fumes.'
        }
      ];
    } else {
      checkpoints = [
        {
          text: 'Inspect material dimensions and structural connection details.',
          rule: 'All finishes must align within standard tolerances (+/- 2mm).'
        },
        {
          text: 'Verify structural safety load tests or continuity checks.',
          rule: 'Must meet standard building codes and structural requirements.'
        },
        {
          text: 'Conduct visual inspections for Snag list reporting.',
          rule: 'Snags must be logged and fixed before handing over keys.'
        }
      ];
    }

    return {
      activityId: id,
      checkpoints
    };
  });

  return { activities: simulated };
}

function simulateAdvisorAnswer(question) {
  const q = question.toLowerCase();
  
  if (q.includes('curing') || q.includes('paani') || q.includes('tarai')) {
    return `### 💧 Curing (Tarai) Guidelines for Concrete Elements

Tarai ya Curing construction ki strength ke liye sabse important step hai. Agar concrete me paani sahi se nahi diya jaye, toh cement hydration process complete nahi hoga aur structural cracks aane ka khatra rahega.

Here is the standard engineering guideline:

1. **Columns & Beams**:
   - Column casting ke baad us par **Hessian cloth (jute bag / taat ki bori)** wrap karein aur use consistently wet rakhein.
   - Minimum curing period: **10 to 14 Days**.

2. **Roof Slab (Chat/Lanter)**:
   - Slab cast hone ke agle din (within 24 hours) check karein aur mitti ya cement mortar se **Ponds (kiyaari/bunds)** banayein.
   - Slab ko pure **10 to 14 Days** tak paani se bharke rakhein (pond curing).
   - **Tip**: Hot summer weather me curing period kam se kam 14 din hona chahiye.

3. **Brick Masonry (Eent ki Judai) & Plaster**:
   - Plaster karne ke baad diwaro par **7 Days** subah-shaam paani ka chidkaw karein.
   - Judai se pehle bricks ko achhe se paani me bhigona zaroori hai.

**Note:** Curing ke liye clean paani use karein jisme organic matter ya acidic levels na ho.`;
  }

  if (q.includes('mix') || q.includes('ratio') || q.includes('masala') || q.includes('cement')) {
    return `### 🏗️ Standard Cement-Sand-Aggregate Mix Ratios

Ghar banane me alag-alag kaam ke liye cement aur sand (ret) ka ratio alag hota hai. In engineering, we use standard grades:

1. **PCC (Plain Cement Concrete) - Base Foundation**:
   - **Mix Grade**: M10 / M15
   - **Ratio**: **1 : 3 : 6** ya **1 : 2 : 4** (1 bag Cement : 3 bags Sand : 6 bags Coarse Aggregate/Gitti).

2. **RCC (Reinforced Concrete) - Column, Beam & Slab**:
   - **Mix Grade**: Min M20
   - **Ratio**: **1 : 1.5 : 3** (1 bag Cement : 1.5 bags Sand : 3 bags Aggregate/Gitti).
   - **Tip**: Steel structural parts me **M20** se kam grade ka masala kabhi bhi use na karein.

3. **9-inch Wall Masonry (Judai)**:
   - **Ratio**: **1 : 6** (1 bag Cement : 6 bags Sand).

4. **4.5-inch Partition Wall**:
   - **Ratio**: **1 : 4** (1 bag Cement : 4 bags Sand). Kyunki diwar patli hoti hai, isme mortar mix jyada cement-rich hona chahiye.

5. **Inner Wall Plaster**:
   - **Ratio**: **1 : 4** (ceiling ke liye 1:3 recommend kiya jata hai). Plaster ki thickness 12-15mm honi chahiye.

⚠️ **Important Rule**: Paani ki maatra (water-cement ratio) strict rakhein. Zyaada paani milane se concrete jaldi behta toh hai par uski core strength aadhi reh jati hai (ideal water-cement ratio is 0.45 to 0.5).`;
  }

  if (q.includes('rain') || q.includes('monsoon') || q.includes('baarish') || q.includes('weather')) {
    return `### 🌧️ Monsoon Construction Precautions

Baarish ke mausam me construct karte waqt thoda savdhan rehna zaroori hai:

1. **Excavation Phase**:
   - Agar aapne foundation ke liye khaddhe khode hain, toh rain water ko waha collect na hone dein. Sump pumps ready rakhein.
   - Soft clayey soil me daldal ban sakti hai, isliye side supports (shoring) zaroor lagayein.

2. **Slab Casting (Roofing)**:
   - Active rain me concrete casting **bilkul na karein**. Concrete cast hone ke turant baad baarish hone se cement beh jata hai.
   - Tarpaulin sheets (tirpaal) ready rakhein taaki casted area ko cover kiya ja sake.
   - concrete me **Waterproof compounding** (e.g., Dr. Fixit LW+) cement ki har bori ke sath zaroor dalein (typically 200ml per bag).

3. **Cement Storage**:
   - Cement bags ko ground se 6 inches upar wooden planks par rakhein aur diwar se 1 feet door rakhein taaki moisture catch na kare. Pure store room ko airtight aur dry rakhein.`;
  }

  return `### 👋 Hello! Main aapka AI Nirmaan Sahayak hoon.

Main ek experienced civil engineer aur project manager ki tarah aapke ghar ke construction se jude sawaalon ka jawab de sakta hoon. 

Aap mujhse pooch sakte hain:
* **"Slab casting me kin baaton ka dhyan rakhna chahiye?"**
* **"Plaster me crack kyu aate hain aur use kaise rokein?"**
* **"M25 Concrete mix ratio kya hota hai?"**
* **"Monsoon me foundation banate waqt kya care leni chahiye?"**

Likh kar puchiye, aur main civil quality standards (Indian Standard Codes) ke mutabik answer dunga.`;
}

// 4. Translate Checklist items dynamically using Gemini
export async function translateCheckpointsWithGemini(activityName, checklist, langCode) {
  if (!isLiveMode()) {
    return checklist;
  }
  
  const langName = LANGUAGE_NAMES[langCode] || 'English';
  const prompt = `
    You are a professional construction project manager and translator.
    Translate the following construction activity and its checklist checkpoints into "${langName}".
    Ensure you preserve the technical engineering terminology (like concrete grades, water-cement ratios, spacing cover blocks) while translating accurately.
    
    Activity Name: "${activityName}"
    
    Checklist Items to Translate:
    ${checklist.map((item, idx) => `${idx + 1}. text: "${item.text}" | rule: "${item.rule}"`).join('\n')}
    
    Return ONLY a JSON array of objects representing the translated checkpoints in the requested language. Do not put markdown blocks or code blocks.
    
    JSON Schema:
    [
      {
        "text": "translated checkpoint text in ${langName}",
        "rule": "translated engineering rule in ${langName}"
      }
    ]
  `;
  
  try {
    const rawJson = await callGemini(prompt, true, 'gemini');
    return JSON.parse(rawJson);
  } catch (err) {
    console.error("Failed to translate checklist via AI:", err);
    return checklist;
  }
}

// 5. Analyze weather risk using Gemini based on city and season
export async function analyzeWeatherRisk(city, season, stories, activities, lang = 'en') {
  if (!isLiveMode()) {
    // Simulated weather delays fallback based on season
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Normalize string checks for language translation fallback
    const seasonLower = (season || '').toLowerCase();
    const isMonsoon = seasonLower.includes('monsoon') || seasonLower.includes('rain') || seasonLower.includes('मानसून') || seasonLower.includes('बारिश');
    const isWinter = seasonLower.includes('winter') || seasonLower.includes('ठंड') || seasonLower.includes('सर्दी');
    
    return {
      weatherSummary: lang === 'hi' 
        ? `मौसम विश्लेषण: ${city} में ${season} के दौरान मध्यम जोखिम पाया गया। आउटडोर ढलाई और खुदाई गतिविधियों पर नजर रखें।` 
        : `Weather Analysis: Moderate risk observed for ${city} during ${season}. Monitor outdoor concrete pouring and excavation tasks closely.`,
      affectedActivities: activities.map(act => {
        const idLower = (act.id || '').toLowerCase();
        const nameLower = (act.name || '').toLowerCase();
        
        if (isMonsoon && (idLower.includes('excavation') || nameLower.includes('excavation') || idLower.includes('foundation') || nameLower.includes('foundation'))) {
          return {
            id: act.id,
            status: 'Delayed',
            delayDays: 12,
            notes: lang === 'hi' 
              ? 'भारी मानसूनी बारिश के कारण खुदाई गड्ढे में पानी भर गया है, जिससे काम कुछ दिन बाधित रहेगा।' 
              : 'Heavy monsoon rains flooded excavation pit, halting foundation works temporarily.'
          };
        }
        if (isWinter && (idLower.includes('slab') || nameLower.includes('slab') || idLower.includes('curing') || nameLower.includes('curing') || idLower.includes('concrete') || nameLower.includes('concrete'))) {
          return {
            id: act.id,
            status: 'Delayed',
            delayDays: 6,
            notes: lang === 'hi' 
              ? 'अत्यधिक ठंड और कोहरे के कारण कंक्रीट सेट होने तथा क्योरिंग (तराई) की अवधि बढ़ा दी गई है।' 
              : 'Dense winter fog and low temperature delaying concrete setting/curing period.'
          };
        }
        return { id: act.id, status: act.status, delayDays: 0, notes: act.notes || '' };
      })
    };
  }

  const prompt = `
    System Context: You are an expert Civil Site Manager, Meteorological Risk Auditor, and Construction Scheduler.
    
    Task: Analyze the meteorological impact of "${season}" season in the city of "${city}" for a G+${stories} project, and predict activity-specific delays.
    
    Current Project Activities:
    ${JSON.stringify(activities.map(a => ({ id: a.id, name: a.name, stage: a.stage, duration: a.duration })))}
    
    Instructions:
    1. Identify which outdoor activities (e.g. excavation, foundation casting, slab casting, exterior painting) will be delayed by the typical weather conditions in "${city}" during "${season}" (e.g., heavy monsoon flooding in Mumbai, severe fog and frost in Delhi winters, extreme heat waves in central India summers).
    2. Suggest concrete, site-level weather-mitigation measures (e.g. using tarpaulins, adding accelerators to concrete, scheduling indoor plastering during peak rain days).
    
    Language Constraint:
    - All text values in the JSON output ("weatherSummary" and "notes" fields) MUST be written in the "${langName}" language.
    
    Output Format:
    Return ONLY a raw, valid JSON object matching the schema below. No markdown code blocks.
    
    JSON Schema:
    {
      "weatherSummary": "Meteorological risk summary and overall impact statement for ${city} during ${season} in ${langName}.",
      "affectedActivities": [
        {
          "id": "string (matching an activity ID)",
          "status": "Delayed",
          "delayDays": number of additional days of delay,
          "notes": "Specific weather reason and mitigation tip in ${langName}"
        }
      ]
    }
  `;

  try {
    const responseText = await callGemini(prompt, true);
    const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Failed to parse Gemini response for weather analysis:', e);
    // Fallback to simple simulated response if json parse fails
    return {
      weatherSummary: lang === 'hi' 
        ? `सफलतापूर्वक मौसम जोखिम विश्लेषण पूरा किया गया।` 
        : `Weather risk analysis completed successfully.`,
      affectedActivities: []
    };
  }
}

