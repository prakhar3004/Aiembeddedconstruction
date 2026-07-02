// Gemini Flash API Integration Service for Nirmaan Sahayak

const DEFAULT_MODEL = 'gemini-1.5-flash';

// Retrieve API key from localStorage
export const getApiKey = () => {
  return localStorage.getItem('nirmaan_gemini_api_key') || '';
};

// Save API key to localStorage
export const saveApiKey = (key) => {
  if (key) {
    localStorage.setItem('nirmaan_gemini_api_key', key);
  } else {
    localStorage.removeItem('nirmaan_gemini_api_key');
  }
};

// Check if live API calls are configured
export const isLiveMode = () => {
  return !!getApiKey();
};

// Helper for making API calls to Gemini Flash
async function callGemini(prompt, isJson = false) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API Key not configured. Using simulator.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  if (isJson) {
    requestBody.generationConfig = {
      responseMimeType: 'application/json'
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || `HTTP ${response.status}`;
    throw new Error(`AI API Error: ${errMsg}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) {
    throw new Error('Empty response received from AI API');
  }

  return textContent;
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
    return simulateRiskAnalysis(activities);
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
    You are an expert construction scheduler and civil engineer project manager with 15+ years experience.
    Analyze the following construction timeline and identify risks, delay forecasts, and path impacts.
    
    Current Construction Timeline Details:
    ${activityDataText}
    
    Please provide a risk and delay analysis in structured JSON format. You MUST return ONLY the JSON object matching this schema. Do not put markdown blocks like \`\`\`json around the JSON.
    
    CRITICAL: You MUST write all the text values (including "summary", "riskDescription", "impact", and "recommendations") inside the JSON in the "${langName}" language.
    
    JSON Schema:
    {
      "overallRisk": "Low" | "Medium" | "High",
      "estimatedDelayDays": number,
      "summary": "string explaining the project delay forecast and root cause analysis in 2-3 sentences written in ${langName}.",
      "criticalPathRisks": [
        {
          "activityId": "string (matching an activity ID)",
          "riskDescription": "string detailing what is going wrong written in ${langName}",
          "impact": "string detailing the ripple effect on subsequent stages written in ${langName}"
        }
      ],
      "recommendations": [
        "string action item 1 written in ${langName}",
        "string action item 2 written in ${langName}"
      ]
    }
  `;

  try {
    const rawJson = await callGemini(prompt, true);
    return JSON.parse(rawJson);
  } catch (error) {
    console.error('Failed to run live risk prediction, falling back to simulator:', error);
    return simulateRiskAnalysis(activities);
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
    You are an elite Quality Assurance & Quality Control (QA/QC) construction engineer, professional residential architect, and interior designer with 15+ years experience.
    We are planning a home construction project with these configuration parameters:
    - Soil Type: ${soilType}
    - Construction Start Season: ${season}
    - Building Structure/Size: ${stories}
    - Budget Tier: ${budget}
    
    Here is the list of activities planned for this project:
    ${activityListText}
    
    For each activity in the list, you MUST generate exactly 3 highly rigorous, industry-standard checklists (representing Civil, Architectural, and Interior Designer checks).
    Each checklist item must contain:
    1. "text": Specific quality/standard check.
    2. "rule": Specific engineering standard, Indian Standard Code (e.g. IS 456, IS 1905, IS 1200), concrete mix ratios, curing days, tolerance limits, or thickness parameters.
    
    CRITICAL: All textual descriptions ("text" and "rule") inside the JSON MUST be written in the "${langName}" language.
    
    You MUST return ONLY the JSON object matching this schema. Do not put markdown blocks like \`\`\`json.
    
    JSON Schema:
    {
      "activities": [
        {
          "activityId": "string (matching the exact activity ID from the input list)",
          "checkpoints": [
            {
              "text": "string (Civil check detail) in ${langName}",
              "rule": "string (Civil standard/IS code) in ${langName}"
            },
            {
              "text": "string (Architect check detail) in ${langName}",
              "rule": "string (Architectural rule/bylaw) in ${langName}"
            },
            {
              "text": "string (Interior check detail) in ${langName}",
              "rule": "string (Interior standard/finishing rule) in ${langName}"
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
    You are a professional construction scheduler, civil engineer, and architect with 15+ years experience.
    Analyze the construction scheduling constraints for a building configuration: "${stories}".
    
    Site Parameters:
    - Soil Type: ${soilType}
    - Start Season: ${season}
    - Budget Level: ${budget}
    
    Predict the scheduling relationships and duration multipliers for the main construction phases:
    1. "Planning & Approvals"
    2. "Site Setup"
    3. "Substructure"
    4. "Structure" (Core RCC Frames, columns, slabs)
    5. "Walls" (Brickwork, masonry and plastering)
    6. "Plumbing" (Piping, concealed lines, pressure testing)
    7. "Electrical" (Conduit routing, DB panels, wire pulling)
    8. "Flooring" (IPS screeding, tiling, dado works)
    9. "Windows & Doors" (Chaukhat frames, UPVC sashes)
    10. "Interiors" (False ceilings, carpentry cabinets, LED panels)
    11. "Exterior Works" (Facade plastering, waterproofing, septic tank, solar panels, landscaping)
    12. "Commissioning & Handover" (Insulation tests, de-snagging, OC certification)
    
    For each phase, determine:
    - "durationMultiplier": A multiplier (0.8 to 2.0) representing the speed of work under these conditions (e.g. wet monsoon clayey soil slows down substructure to 1.6x, winter slows concrete curing, luxury budget adds QA steps).
    - "relationship": "Sequential" (must wait for predecessor to finish) or "Parallel" (can overlap with previous phase).
    - "overlapDays": If Parallel, how many days of overlap are possible (0 to 10 days).
    - "civilAdvice": Key structural recommendation in "${langName}".
    - "architectAdvice": Space layout/sanction tip in "${langName}".
    - "interiorAdvice": Finishing/woodwork suggestion in "${langName}".
    
    Return ONLY a JSON object matching this schema. Do not put markdown blocks like \`\`\`json.
    
    JSON Schema:
    {
      "phases": [
        {
          "phaseName": "string",
          "durationMultiplier": number,
          "relationship": "Sequential" | "Parallel",
          "overlapDays": number,
          "civilAdvice": "string in ${langName}",
          "architectAdvice": "string in ${langName}",
          "interiorAdvice": "string in ${langName}"
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
    You are "Nirmaan Sahayak Advisor", a senior civil engineer, space architect, and professional interior designer with 15+ years experience.
    You help users build their homes safely, economically, and with top-tier aesthetic quality.
    
    Answer the user's question clearly. Use practical terms, mention specific building rules (like curing time, cement grades M20/M25, water-cement ratios), and provide architectural/interior styling tips.
    
    CRITICAL: You MUST write your entire answer in the "${langName}" language.
    Keep your answer structured using bullet points where necessary.
    
    Conversation History:
    ${historyContext}
    
    Current Question:
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

function simulateRiskAnalysis(activities) {
  let estimatedDelayDays = 0;
  let overallRisk = 'Low';
  const criticalPathRisks = [];
  const recommendations = [];

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
        riskDescription: `Delay in ${d.name} is holding up subsequent sequencing.`,
        impact: `Pushes back the start dates of all descendant tasks. Current delay is estimated at ${d.name === 'Excavation' ? '15' : '10'} days.`
      });
    });

    recommendations.push(
      'Deploy additional labor force to expedite current delayed phases.',
      'Check raw material stocks (cement/aggregate/sand) to avoid further supply chain lag.',
      'Reschedule upcoming non-structural activities (e.g. brickwork planning) to parallelize tasks.'
    );
  } else if (inProgress.length > 0) {
    overallRisk = 'Medium';
    estimatedDelayDays = 5;
    
    criticalPathRisks.push({
      activityId: inProgress[0].id,
      riskDescription: `${inProgress[0].name} is currently active and requires strict progress monitoring.`,
      impact: 'If this phase extends past its deadline, it will delay the next sequence.'
    });

    recommendations.push(
      'Verify that material procurement for the next phase is complete.',
      'Conduct daily QC inspections to catch issues (shuttering leaks, steel placement) early.'
    );
  } else {
    overallRisk = 'Low';
    estimatedDelayDays = 0;
    recommendations.push(
      'Maintain current workflow speed. Ensure concrete curing regimes are adhered to strictly.',
      'Update timeline daily as new milestones are hit.'
    );
  }

  return {
    overallRisk,
    estimatedDelayDays,
    summary: `Based on current progress, the project timeline is ${overallRisk === 'High' ? 'at critical delay risk due to uncompleted stages.' : 'stable. Schedule is overall predictable.'}`,
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
    const rawJson = await callGemini(prompt, true);
    return JSON.parse(rawJson);
  } catch (err) {
    console.error("Failed to translate checklist via AI:", err);
    return checklist;
  }
}
