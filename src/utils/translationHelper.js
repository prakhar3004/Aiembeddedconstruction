// Indian Multilingual Translation Dictionary & NLP Translation Engine for Nirmaan Sahayak
// Supports English, Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, and Kannada

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'hin', label: 'Hinglish (Conversational)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'bn', label: 'বাংলা (Bengali)' }
];

export const UI_TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard Overview',
    timeline: 'Construction Timeline',
    checklists: 'Quality Checklists',
    procurement: 'Procurement',
    advisor: 'AI Advisor & Chat',
    progress: 'Project Progress',
    estimatedDelay: 'AI Estimated Delay',
    currentStage: 'Current Stage',
    checklistStatus: 'Checklist Status',
    analyzeRisk: 'Analyze Delay Risk',
    analyzing: 'Analyzing Schedule...',
    overallRisk: 'Overall Delay Risk',
    remedialSteps: 'AI Advisory Remedial Steps',
    obstacles: 'Critical Path Obstacles',
    customizerTitle: 'AI Checklist Customizer',
    customizerDesc: 'Quality checkpoints adjust automatically based on soil type, starting season, and budget.',
    soilType: 'Soil Type (Mitti)',
    season: 'Start Season (Mausam)',
    stories: 'Building Configuration',
    budget: 'Budget Level',
    generateCustom: 'Generate Custom AI Checklists',
    generating: 'Customising Rules...',
    reset: 'Reset',
    simulate: 'Simulate Issues',
    save: 'Save Changes',
    notesPlaceholder: 'Log delay reasons here (e.g. Labor shortage, lack of cement bags, bad weather)...',
    activeLogs: 'Active Construction Logs',
    curingTip: 'Tip: Cure concrete slab for min 10-14 days to achieve design compressive strength.',
    liveMode: 'AI Live Active',
    demoMode: 'Simulator Mode',
    configuration: 'API Configuration',
    verified: 'verified',
    stageVerified: 'Stage Verified',
    pendingVerification: 'Pending Verification',
    commonTopics: 'Common Construction Topics',
    taskFilter: 'Task Filter',
    allTasks: 'All Tasks',
    defaultTasks: 'Essential (Default) Tasks',
    addonTasks: 'Add-on (Optional) Tasks',
    milestoneActivity: 'Milestone Activity',
    plannedRange: 'Planned Range',
    actualRange: 'Actual Range',
    status: 'Status',
    actions: 'Actions',
    milestoneManager: 'Milestone Manager (AI)',
    activityStatus: 'Activity Status',
    plannedStart: 'Planned Start',
    plannedEnd: 'Planned End',
    actualStart: 'Actual Start',
    actualEnd: 'Actual End',
    civilTipTitle: 'Civil Engineer Code',
    archTipTitle: 'Architect Design Check',
    interiorTipTitle: 'Interior Style Tip',
    journeyDescLabel: 'Journey Description:',
    curingNotice: 'Quality Standard Notice',
    essentialLabel: 'Essential',
    addonLabel: 'Add-on'
  },
  hi: {
    dashboard: 'डैशबोर्ड विवरण',
    timeline: 'निर्माण समय-सीमा',
    checklists: 'गुणवत्ता चेकलिस्ट',
    procurement: 'सामग्री खरीद',
    advisor: 'एआई सलाहकार और चैट',
    progress: 'परियोजना की प्रगति',
    estimatedDelay: 'एआई अनुमानित देरी',
    currentStage: 'वर्तमान चरण',
    checklistStatus: 'चेकलिस्ट की स्थिति',
    analyzeRisk: 'देरी जोखिम का विश्लेषण',
    analyzing: 'शेड्यूल का विश्लेषण...',
    overallRisk: 'कुल देरी जोखिम',
    remedialSteps: 'एआई सलाहकार उपचारात्मक उपाय',
    obstacles: 'क्रिटिकल पाथ बाधाएं',
    customizerTitle: 'एआई चेकलिस्ट कस्टमाइज़र',
    customizerDesc: 'मिट्टी के प्रकार, शुरू होने वाले मौसम और बजट के आधार पर गुणवत्ता चेकपॉइंट स्वचालित रूप से समायोजित हो जाते हैं।',
    soilType: 'मिट्टी का प्रकार (Soil)',
    season: 'शुरू होने का मौसम (Season)',
    stories: 'भवन कॉन्फ़िगरेशन (Building Type)',
    budget: 'बजट स्तर',
    generateCustom: 'कस्टम एआई चेकलिस्ट बनाएं',
    generating: 'नियम कस्टमाइज़ हो रहे हैं...',
    reset: 'रीसेट करें',
    simulate: 'समस्याएं सिमुलेट करें',
    save: 'बदलाव सहेजें',
    notesPlaceholder: 'देरी के कारणों को यहाँ लिखें (जैसे - लेबर की कमी, सीमेंट बैग की कमी, ख़राब मौसम)...',
    activeLogs: 'सक्रिय निर्माण लॉग',
    curingTip: 'सलाह: कंक्रीट स्लैब को कम से कम 10-14 दिनों तक पानी की तराई (curing) दें ताकि डिज़ाइन संपीड़न शक्ति प्राप्त हो सके।',
    liveMode: 'एआई लाइव सक्रिय',
    demoMode: 'सिमुलेटर मोड',
    configuration: 'एपीआई कॉन्फ़िगरेशन',
    verified: 'सत्यापित',
    stageVerified: 'चरण सत्यापित',
    pendingVerification: 'सत्यापन लंबित',
    commonTopics: 'सामान्य निर्माण विषय',
    taskFilter: 'कार्य फ़िल्टर (Filter)',
    allTasks: 'सभी कार्य (All)',
    defaultTasks: 'आवश्यक बुनियादी कार्य (Essential)',
    addonTasks: 'वैकल्पिक अतिरिक्त कार्य (Add-ons)',
    milestoneActivity: 'मुख्य कार्य (Milestone Activity)',
    plannedRange: 'नियोजित समय-सीमा (Planned Range)',
    actualRange: 'वास्तविक समय-सीमा (Actual Range)',
    status: 'स्थिति (Status)',
    actions: 'कार्रवाई (Actions)',
    milestoneManager: 'मील का पत्थर प्रबंधक (Milestone Manager)',
    activityStatus: 'कार्य की स्थिति (Status)',
    plannedStart: 'नियोजित शुरुआत (Planned Start)',
    plannedEnd: 'नियोजित समाप्ति (Planned End)',
    actualStart: 'वास्तविक शुरुआत (Actual Start)',
    actualEnd: 'वास्तविक समाप्ति (Actual End)',
    civilTipTitle: 'सिविल इंजीनियर कोड',
    archTipTitle: 'आर्किटेक्ट डिजाइन चेक',
    interiorTipTitle: 'इंटीरियर स्टाइल टिप',
    journeyDescLabel: 'यात्रा विवरण (Journey Description):',
    curingNotice: 'गुणवत्ता मानक सूचना',
    essentialLabel: 'आवश्यक कार्य (Essential)',
    addonLabel: 'अतिरिक्त कार्य (Add-on)'
  },
  hin: {
    dashboard: 'Dashboard Overview',
    timeline: 'Construction Timeline',
    checklists: 'Quality Checklists',
    procurement: 'Procurement',
    advisor: 'AI Advisor & Chat',
    progress: 'Project Progress',
    estimatedDelay: 'AI Estimated Delay',
    currentStage: 'Current Stage',
    checklistStatus: 'Checklist Status',
    analyzeRisk: 'Analyze Delay Risk',
    analyzing: 'Schedule Analyze ho raha hai...',
    overallRisk: 'Overall Delay Risk',
    remedialSteps: 'AI Advisor Remedial Steps',
    obstacles: 'Critical Path Obstacles',
    customizerTitle: 'AI Checklist Customizer',
    customizerDesc: 'Mitti ka type, weather aur budget ke mutabik quality checks automatically adjust hote hain.',
    soilType: 'Mitti Ka Type (Soil)',
    season: 'Shuruat Ka Mausam (Season)',
    stories: 'Building Type (Configuration)',
    budget: 'Budget Level',
    generateCustom: 'Generate Custom AI Checklists',
    generating: 'Rules Customise ho rahe hain...',
    reset: 'Reset',
    simulate: 'Simulate Issues',
    save: 'Save Changes',
    notesPlaceholder: 'Delay ke reasons yaha likhein (jaise labor shortage, cement ki kami, kharab mausam)...',
    activeLogs: 'Active Construction Logs',
    curingTip: 'Tip: Slab dhalai ke baad kam se kam 10-14 din tarai (curing) zaroor karein strength ke liye.',
    liveMode: 'AI Live Active',
    demoMode: 'Simulator Mode',
    configuration: 'API Configuration',
    verified: 'verified',
    stageVerified: 'Stage Verified',
    pendingVerification: 'Pending Verification',
    commonTopics: 'Common Construction Topics',
    taskFilter: 'Tasks Filter',
    allTasks: 'Sare Tasks (All)',
    defaultTasks: 'Essential Basic Tasks',
    addonTasks: 'Optional Add-on Tasks'
  },
  mr: {
    dashboard: 'डॅशबोर्ड विहंगावलोकन',
    timeline: 'बांधकाम टाइमलाइन',
    checklists: 'गुणवत्ता चेकलिस्ट',
    advisor: 'एआय सल्लागार आणि चॅट',
    progress: 'प्रकल्पाची प्रगती',
    estimatedDelay: 'एआय अंदाजित विलंब',
    currentStage: 'सध्याचा टप्पा',
    checklistStatus: 'चेकलिस्टची स्थिती',
    analyzeRisk: 'विलंब जोखमीचे विश्लेषण',
    analyzing: 'शेड्यूलचे विश्लेषण करत आहे...',
    overallRisk: 'एकूण विलंब जोखीम',
    remedialSteps: 'एआय सल्लागार उपचारात्मक पावले',
    obstacles: 'क्रिटिकल पाथ अडथळे',
    customizerTitle: 'एआय चेकलिस्ट कस्टमायझर',
    customizerDesc: 'मातीचा प्रकार, हंगाम आणि बजेटनुसार गुणवत्ता तपासणी स्वयंचलितपणे समायोजित केली जाते.',
    soilType: 'मातीचा प्रकार (Soil)',
    season: 'सुरुवातीचा हंगाम (Season)',
    stories: 'इमारत कॉन्फिगरेशन',
    budget: 'बजेट पातळी',
    generateCustom: 'कस्टम एआय चेकलिस्ट तयार करा',
    generating: 'नियम कस्टमायझ होत आहेत...',
    reset: 'रीसेट करा',
    simulate: 'समस्या सिम्युलेट करा',
    save: 'बदल जतन करा',
    notesPlaceholder: 'विलंबाची कारणे येथे नोंदवा (उदा. मजुरांची कमतरता, सिमेंटची टंचाई, खराब हवामान)...',
    activeLogs: 'सक्रिय बांधकाम लॉग',
    curingTip: 'टीप: काँक्रीट स्लॅबची मजबुती मिळवण्यासाठी किमान १०-१४ दिवस पाणी शिंपडून (curing) करावी.',
    liveMode: 'एआय लाइव्ह सक्रिय',
    demoMode: 'सिम्युलेटर मोड',
    configuration: 'एपीआई कॉन्फिगरेशन',
    verified: 'सत्यापित',
    stageVerified: 'टप्पा सत्यापित',
    pendingVerification: 'पडताळणी प्रलंबित',
    commonTopics: 'सामान्य बांधकाम विषय',
    taskFilter: 'कार्य फिल्टर',
    allTasks: 'सर्व कामे (All)',
    defaultTasks: 'महत्वाची मूलभूत कामे (Essential)',
    addonTasks: 'वैकल्पिक अतिरिक्त कामे (Add-ons)'
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్ అవలోకనం',
    timeline: 'నిర్మాణ కాలక్రమం',
    checklists: 'నాణ్యత తనిఖీ జాబితా',
    advisor: 'AI సలహాదారు & చాట్',
    progress: 'ప్రాజెక్ట్ పురోగతి',
    estimatedDelay: 'AI అంచనా వేసిన ఆలస్యం',
    currentStage: 'ప్రస్తుత దశ',
    checklistStatus: 'చెక్లిస్ట్ స్థితి',
    analyzeRisk: 'ఆలస్యం ప్రమాద విశ్లేషణ',
    analyzing: 'షెడ్యూల్ విశ్లేషిస్తోంది...',
    overallRisk: 'మొత్తం ఆలస్యం ప్రమాదం',
    remedialSteps: 'AI సలహా నివారణ చర్యలు',
    obstacles: 'క్రిటికల్ పాత్ అడ్డంకులు',
    customizerTitle: 'AI చెక్లిస్ట్ కస్టమైజర్',
    customizerDesc: 'నేల రకం, కాలం మరియు బడ్జెట్ ఆధారంగా నాణ్యత పాయింట్లు స్వయంచాలకంగా సర్దుబాటు చేయబడతాయి.',
    soilType: 'నేల రకం (Soil)',
    season: 'ప్రారంభ కాలం (Season)',
    stories: 'భవనం రకం (Configuration)',
    budget: 'బడ్జెట్ స్థాయి',
    generateCustom: 'అనుకూల AI చెక్లిస్ట్ సృష్టించు',
    generating: 'నియమాలు సవరిస్తోంది...',
    reset: 'రీసెట్',
    simulate: 'సమస్యలను అనుకరించండి',
    save: 'మార్పులను సేవ్ చేయి',
    notesPlaceholder: 'ఆలస్యం కారణాలను ఇక్కడ రాయండి (ఉదా. కార్మికుల కొరత, సిమెంట్ కొరత, వాతావरणం బాగోలేదు)...',
    activeLogs: 'క్రియాశీల నిర్మాణ లాగ్‌లు',
    curingTip: 'చిట్కా: కంప్రెసివ్ బలం కోసం కాంక్రీట్ స్లాబ్‌ను కనీсем 10-14 రోజులు క్యూరింగ్ చేయాలి.',
    liveMode: 'AI లైవ్ యాక్టివ్',
    demoMode: 'సిమ్యులేటర్ మోడ్',
    configuration: 'API కాన్ఫిగరేషన్',
    verified: 'ధృవీకరించబడింది',
    stageVerified: 'దశ ధృవీకరించబడింది',
    pendingVerification: 'ధృవీకరణ పెండింగ్‌లో ఉంది',
    commonTopics: 'సాధారణ నిర్మాణ అంశాలు',
    taskFilter: 'టాస్క్ ఫిల్టర్',
    allTasks: 'అన్ని పనులు (All)',
    defaultTasks: 'ముఖ్యమైన పనులు (Essential)',
    addonTasks: 'ఐచ్ఛిక అదనపు పనులు (Add-ons)'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு மேலோட்டம்',
    timeline: 'கட்டுமான காலவரிசை',
    checklists: 'தரக் கட்டுப்பாட்டுப் பட்டியல்',
    advisor: 'AI ஆலோசகர் & அரட்டை',
    progress: 'திட்ட முன்னேற்றம்',
    estimatedDelay: 'AI தாமதம்',
    currentStage: 'தற்போதைய நிலை',
    checklistStatus: 'சரிபார்ப்பு நிலை',
    analyzeRisk: 'தாமத அபாயத்தை பகுப்பாய்வு செய்',
    analyzing: 'கால அட்டவணையை பகுப்பாய்வு செய்கிறது...',
    overallRisk: 'ஒட்டுமொத்த தாமத ஆபத்து',
    remedialSteps: 'AI ஆலோசனை தீர்வுகள்',
    obstacles: 'முக்கிய பாதை தடைகள்',
    customizerTitle: 'AI சரிபார்ப்பு பட்டியல் மாற்றி',
    customizerDesc: 'மண் வகை, பருவம் மற்றும் பட்ஜெட் அடிப்படையில் தர சோதனைகள் தானாகவே மாறும்.',
    soilType: 'மண் வகை (Soil)',
    season: 'ஆரம்ப பருவம் (Season)',
    stories: 'கட்டிட வகை (Configuration)',
    budget: 'பட்ஜெட் நிலை',
    generateCustom: 'தனிப்பயன் AI சரிபார்ப்பு பட்டியலை உருவாக்கு',
    generating: 'விதிகள் மாற்றியமைக்கப்படுகிறது...',
    reset: 'மீட்டமை',
    simulate: 'சிக்கல்களை உருவகப்படுத்து',
    save: 'மாற்றங்களை சேமிக்கவும்',
    notesPlaceholder: 'தாமதத்திற்கான காரணங்களை இங்கே எழுதவும் (உதாரணமாக - தொழிலாளர் பற்றாக்குறை, சிமெண்ட் பற்றாக்குறை, மோசமான வானிலை)...',
    activeLogs: 'செயலில் உள்ள கட்டுமானப் பதிவுகள்',
    curingTip: 'குறிப்பு: கான்கிரீட் கூரையின் வலிமையை அதிகரிக்க குறைந்தபட்சம் 10-14 நாட்கள் தண்ணீர் தெளித்து பதப்படுத்துதல் (curing) அவசியம்.',
    liveMode: 'AI நேரலை செயல்படுகிறது',
    demoMode: 'சிமுலேட்டர் பயன்முறை',
    configuration: 'API உள்ளமைப்பு',
    verified: 'சரிபார்க்கப்பட்டது',
    stageVerified: 'நிலை சரிபார்க்கப்பட்டது',
    pendingVerification: 'சரிபார்ப்பு நிலுவையில் உள்ளது',
    commonTopics: 'பொதுவான கட்டுமான தலைப்புகள்',
    taskFilter: 'பணி வடிகட்டி',
    allTasks: 'அனைத்து பணிகள் (All)',
    defaultTasks: 'அத்தியாவசிய பணிகள் (Essential)',
    addonTasks: 'கூடுதல் விருப்பப் பணிகள் (Add-ons)'
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅವಲೋಕನ',
    timeline: 'ನಿರ್ಮಾಣದ ಕಾಲಮಿತಿ',
    checklists: 'ಗುಣಮಟ್ಟದ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
    advisor: 'AI ಸಲಹೆಗಾರ ಮತ್ತು ಚಾಟ್',
    progress: 'ಯೋಜನೆಯ ಪ್ರಗತಿ',
    estimatedDelay: 'AI ವಿಳಂಬ',
    currentStage: 'ಪ್ರಸ್ತುತ ಹಂತ',
    checklistStatus: 'ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ಸ್ಥಿತಿ',
    analyzeRisk: 'ವಿಳಂಬ ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ',
    analyzing: 'ವೇಳಾಪಟ್ಟಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    overallRisk: 'ಒಟ್ಟಾರೆ ವಿಳಂಬ ಅಪಾಯ',
    remedialSteps: 'AI ಸಲಹೆ ಪರಿಹಾರ ಕ್ರಮಗಳು',
    obstacles: 'ಕ್ರಿಟಿಕಲ್ ಪಾತ್ ಅಡೆತಡೆಗಳು',
    customizerTitle: 'AI ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ಗ್ರಾಹಕೀಕರಣ',
    customizerDesc: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ, ಹವಾಮಾನ ಮತ್ತು ಬಜೆಟ್ ಆಧಾರದ ಮೇಲೆ ಗುಣಮಟ್ಟದ ಪರಿಶೀಲನೆಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಬದಲಾಗುತ್ತವೆ.',
    soilType: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ (Soil)',
    season: 'ಪ್ರಾರಂಭದ ಕಾಲ (Season)',
    stories: 'ಕಟ್ಟಡದ ವಿಧ (Configuration)',
    budget: 'ಬಜೆಟ್ ಮಟ್ಟ',
    generateCustom: 'ಕಸ್ಟಮ್ AI ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ರಚಿಸಿ',
    generating: 'ನಿಯಮಗಳನ್ನು ಅಳವಡಿಸಲಾಗುತ್ತಿದೆ...',
    reset: 'ಮರುಹೊಂದಿಸಿ',
    simulate: 'ಸಮಸ್ಯೆಗಳನ್ನು ಅನುಕರಿಸಿ',
    save: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    notesPlaceholder: 'ವಿಳಂಬಕ್ಕೆ ಕಾರಣಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (ಉದಾಹರಣೆಗೆ - ಕಾರ್ಮಿಕರ ಕೊರತೆ, ಸಿಮೆಂಟ್ ಕೊರತೆ, ಕೆಟ್ಟ ಹವಾಮಾನ)...',
    activeLogs: 'ಸಕ್ರिय ನಿರ್ಮಾಣ ಲಾಗ್‌ಗಳು',
    curingTip: 'ಸಲಹೆ: ಕಾಂಕ್ರೀಟ್ ಮಹಡಿಯ ದೃಢತೆಗಾಗಿ ಕನಿಷ್ಠ 10-14 ದಿನಗಳು ನೀರು ಹಾಕಿ ಹಸಿಯಾಗಿಡುವುದು (curing) ಕಡ್ಡಾಯ.',
    liveMode: 'AI ಲೈವ್ ಸಕ್ರಿಯ',
    demoMode: 'ಸಿಮ್ಯುಲೇಟರ್ ಮೋಡ್',
    configuration: 'API ಕಾನ್ಫಿಗರೇಶನ್',
    verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    stageVerified: 'ಹಂತ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    pendingVerification: 'ಪರಿಶೀಲನೆ ಬಾಕಿ ಉಳಿದಿದೆ',
    commonTopics: 'ಸಾಮಾನ್ಯ ನಿರ್ಮಾಣ ವಿಷಯಗಳು',
    taskFilter: 'ಕಾರ್ಯ ಶೋಧಕ',
    allTasks: 'ಎಲ್ಲಾ ಕಾರ್ಯಗಳು (All)',
    defaultTasks: 'ಅಗತ್ಯ ಮೂಲಭೂತ ಕಾರ್ಯಗಳು (Essential)',
    addonTasks: 'ಐಚ್ಛಿಕ ಹೆಚ್ಚುವರಿ ಕಾರ್ಯಗಳು (Add-ons)'
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড ওভারভিউ',
    timeline: 'নির্মাণ সময়সীমা',
    checklists: 'গুণমান চেকলিস্ট',
    advisor: 'এআই উপদেষ্টা এবং চ্যাট',
    progress: 'প্রকল্পের অগ্রগতি',
    estimatedDelay: 'এআই আনুমানিক বিলম্ব',
    currentStage: 'বর্তমান ধাপ',
    checklistStatus: 'চেকলিস্টের স্থিতি',
    analyzeRisk: 'বিলম্ব ঝুঁকির বিশ্লেষণ',
    analyzing: 'সূচী বিশ্লেষণ করা হচ্ছে...',
    overallRisk: 'সামগ্রিক বিলম্ব ঝুঁকি',
    remedialSteps: 'এআই উপদেষ্টা প্রতিকারমূলক পদক্ষেপ',
    obstacles: 'ক্রিটিক্যাল পাথ বাধা সমূহ',
    customizerTitle: 'এআই চেকলিস্ট কাস্টমাইজার',
    customizerDesc: 'মাটির ধরণ, শুরুর মরশুম এবং বাজেটের ভিত্তিতে গুণমানের চেকপয়েন্টগুলি স্বয়ংক্রিয়ভাবে সামঞ্জস্যপূর্ণ হয়।',
    soilType: 'মাটির ধরণ (Soil)',
    season: 'শুরুর মরশুম (Season)',
    stories: 'ভবনের ধরণ (Configuration)',
    budget: 'বাজেটের স্তর',
    generateCustom: 'কাস্টম এআই চেকলিস্ট তৈরি করুন',
    generating: 'নিয়ম কাস্টমাইজ করা হচ্ছে...',
    reset: 'রিসেট করুন',
    simulate: 'সমস্যা সিমুলেট করুন',
    save: 'পরিবর্তন সংরক্ষণ করুন',
    notesPlaceholder: 'বিলম্বের কারণগুলি এখানে লিখুন (যেমন শ্রমিকের অভাব, সিমেন্টের অভাব, খারাপ আবহাওয়া)...',
    activeLogs: 'সক্রিয় নির্মাণ লগ',
    curingTip: 'টিপ: কংক্রিট স্ল্যাবটির মজবুতির জন্য কমপক্ষে ১০-১৪ দিন জল দিয়ে ভেজানো (curing) আবশ্যক।',
    liveMode: 'এআই লাইভ সক্রিয়',
    demoMode: 'সিমুলেটর মোড',
    configuration: 'এপিআই কনফিগারেশন',
    verified: 'যাচাইকৃত',
    stageVerified: 'ধাপ যাচাই করা হয়েছে',
    pendingVerification: 'যাচাইকরণ মুলতুবি',
    commonTopics: 'সাধারণ নির্মাণ বিষয়',
    taskFilter: 'টাস্ক ফিল্টার',
    allTasks: 'সমস্ত কাজ (All)',
    defaultTasks: 'প্রয়োজনীয় মৌলিক কাজ (Essential)',
    addonTasks: 'ঐচ্ছিক অতিরিক্ত কাজ (Add-ons)'
  }
};

// NLP Translation Word-Replacement Dictionary
// Translate all 500+ dynamic activities and checklists into Indian languages on-the-fly
const DIC_WORDS = {
  // Levels
  'Basement Level': {
    hi: 'बेसमेंट स्तर (Basement Level)',
    hin: 'Basement Level',
    mr: 'बेसमेंट पातळी',
    te: 'బేస్మెంట్ అంతస్తు',
    ta: 'அடித்தளம்',
    kn: 'ಬೇಸ್ಮೆಂಟ್ ಮಹಡಿ',
    bn: 'বেসমেন্ট লেভেল'
  },
  'Stilt Parking Level': {
    hi: 'स्टिल्ट पार्किंग तल',
    hin: 'Stilt Parking Level',
    mr: 'स्टिल्ट पार्किंग पातळी',
    te: 'స్టిల్ట్ పార్కింగ్ అంతస్తు',
    ta: 'ஸ்டில்ட் பார்க்கிங் தளம்',
    kn: 'ಸ್ಟಿಲ್ಟ್ ಪಾರ್ಕಿಂಗ್ ಮಹಡಿ',
    bn: 'স্টিল্ট পার্কিং লেভেল'
  },
  'Ground Floor': {
    hi: 'भूतल',
    hin: 'Ground Floor',
    mr: 'तळमजला',
    te: 'ನೆಲ ಮಹಡಿ',
    ta: 'தரை தளம்',
    kn: 'ನೆಲ ಮಹಡಿ',
    bn: 'নিচতলা'
  },
  'First Floor': {
    hi: 'प्रथम तल (1st Floor)',
    hin: '1st Floor',
    mr: 'पहिला मजला',
    te: 'మొదటి అంతస్తు',
    ta: 'முதல் மாடி',
    kn: 'ಮೊದಲ ಮಹಡಿ',
    bn: 'প্রথম তলা'
  },
  'Second Floor': {
    hi: 'द्वितीय तल (2nd Floor)',
    hin: '2nd Floor',
    mr: 'दुसरा मजला',
    te: 'రెండవ అంతస్తు',
    ta: 'இரண்டாம் மாடி',
    kn: 'ಎರಡನೇ ಮಹಡಿ',
    bn: 'দ্বিতীয় তলা'
  },
  'Third Floor': {
    hi: 'तृतीय तल (3rd Floor)',
    hin: '3rd Floor',
    mr: 'तिसरा मजला',
    te: 'మూడవ అంతస్తు',
    ta: 'மூன்றாம் மாடி',
    kn: 'ಮೂರನೇ ಮಹಡಿ',
    bn: 'তৃতীয় তলা'
  },
  'Fourth Floor': {
    hi: 'चतुर्थ तल (4th Floor)',
    hin: '4th Floor',
    mr: 'चौथा मजला',
    te: 'ನಾಲ್ಕನೇ అంతస్తు',
    ta: 'நான்காம் மாடி',
    kn: 'ನಾಲ್ಕನೇ ಮಹಡಿ',
    bn: 'চতুর্থ তলা'
  },

  // Stages
  'Planning & Approvals': {
    hi: 'नियोजन और स्वीकृति',
    hin: 'Planning & Approvals',
    mr: 'नियोजन आणि मंजुरी',
    te: 'ప్లానింగ్ & అనుమతులు',
    ta: 'திட்டமிடல் & அனுமதிகள்',
    kn: 'ಯೋಜನೆ ಮತ್ತು ಅನುಮೋದನೆ',
    bn: 'পরিকল্পনা ও অনুমোদন'
  },
  'Site Setup': {
    hi: 'साइट सेटअप',
    hin: 'Site Setup',
    mr: 'साइट सेटअप',
    te: 'సైట్ సెటప్',
    ta: 'தள அமைப்பு',
    kn: 'ಸೈಟ್ ಸೆಟಪ್',
    bn: 'সাইট সেটআপ'
  },
  'Substructure': {
    hi: 'नींव का काम (Substructure)',
    hin: 'Foundation Kaam',
    mr: 'पाया बांधकाम',
    te: 'పునాది పనులు',
    ta: 'அடித்தள வேலைകൾ',
    kn: 'ಪುನಾಡಿ ಕೆಲಸ',
    bn: 'ভিত্তিপ্রস্তর স্থাপন'
  },
  'Structure': {
    hi: 'आरसीसी ढांचा (RCC Structure)',
    hin: 'RCC Structure',
    mr: 'आरसीसी रचना',
    te: 'నిర్మాణం (RCC)',
    ta: 'கட்டமைப்பு (RCC)',
    kn: 'ರಚನೆ (RCC)',
    bn: 'কাঠামো (RCC)'
  },
  'Walls': {
    hi: 'दीवारें और प्लास्टर (Walls & Plaster)',
    hin: 'Walls & Plaster',
    mr: 'भिंती आणि प्लास्टर',
    te: 'గోడలు & ప్లాస్టరింగ్',
    ta: 'சுவர்கள் & பூச்சு',
    kn: 'ಗೋಡೆಗಳು ಮತ್ತು ಪ್ಲ್ಯಾಸ್ಟರಿಂಗ್',
    bn: 'দেয়াল ও প্লাস্টার'
  },
  'Plumbing': {
    hi: 'प्लंबिंग पाइपलाइन (Plumbing)',
    hin: 'Plumbing Piping',
    mr: 'प्लंबिंगची कामे',
    te: 'ప్లంబింగ్ పనులు',
    ta: 'குழாய் வேலைகள் (Plumbing)',
    kn: 'ಪ್ಲಂಬಿಂಗ್ ಕೆಲಸ',
    bn: 'প্লাম্বিং'
  },
  'Electrical': {
    hi: 'बिजली वायरिंग (Electrical Wiring)',
    hin: 'Electrical wiring',
    mr: 'विद्युत कामे',
    te: 'విద్యుత్ వైరింగ్',
    ta: 'மின்சார வேலைகள் (Electrical)',
    kn: 'ವಿದ್ಯುತ್ ಕೆಲಸ',
    bn: 'বৈদ্যুতিক ওয়্যারিং'
  },
  'Flooring': {
    hi: 'फर्श और टाइल्स (Flooring & Tiles)',
    hin: 'Flooring aur Tiles',
    mr: 'फ्लोअरिंग कामे',
    te: 'ఫ్లోరింగ్ & టైల్స్',
    ta: 'தரை வேலைகள் (Flooring)',
    kn: 'ನೆಲಹಾಸು (Flooring)',
    bn: 'মেঝে ও টাইলস'
  },
  'Windows & Doors': {
    hi: 'खिड़की और दरवाजे',
    hin: 'Windows aur Doors',
    mr: 'खिडक्या आणि दरवाजे',
    te: 'కిటికీలు & తలుపులు',
    ta: 'ஜன்னல்கள் & கதவுகள்',
    kn: 'ಕಿಟಕಿಗಳು ಮತ್ತು ಬಾಗಿಲುಗಳು',
    bn: 'জানলা ও দরজা'
  },
  'Interiors': {
    hi: 'इंटीरियर और बढ़ईगीरी (Woodwork)',
    hin: 'Interiors aur Woodwork',
    mr: 'इंटीरियर डिझाईन',
    te: 'ఇంటీరియర్ పనులు',
    ta: 'உள்வடிவமைப்பு (Interiors)',
    kn: 'ಒಳಾಂಗಣ ವಿನ್ಯಾಸ',
    bn: 'ইন্টেরিয়র ও কাঠের কাজ'
  },
  'Painting': {
    hi: 'पेंटिंग और सजावट (Painting)',
    hin: 'Painting aur Putty',
    mr: 'रंगकाम (Painting)',
    te: 'పెయింటింగ్ పనులు',
    ta: 'வண்ணம் பூசுதல்',
    kn: 'ಬಣ್ಣ ಬಳಿಯುವುದು',
    bn: 'রং ও পুটি'
  },
  'Exterior Works': {
    hi: 'बाहरी काम (Exterior)',
    hin: 'Exterior Works',
    mr: 'बाह्य कामे',
    te: 'బాహ్య పనులు',
    ta: 'வெளிப்புற வேலைகள்',
    kn: 'ಬಾಹ್ಯ ಕೆಲಸಗಳು',
    bn: 'বাইরের কাজ'
  },
  'Commissioning & Handover': {
    hi: 'अंतिम हैंडओवर (Handover)',
    hin: 'Final Handover',
    mr: 'कमिशनिंग आणि हस्तांतरण',
    te: 'హ్యాండోవర్ పనులు',
    ta: 'ஒப்படைப்பு (Handover)',
    kn: 'ಹ್ಯಾಂಡೋವರ್ ಕೆಲಸಗಳು',
    bn: 'হস্তান্তর ও ফিনিশিং'
  },

  // Key nouns & Actions inside Activities
  'Column Rebar Binding': {
    hi: 'कॉलम सरिया बांधना (Rebar Binding)',
    hin: 'Column Ka Saria Binding',
    mr: 'कॉलम सळई बांधणी',
    te: 'స్తంభం స్టీల్ బైండింగ్',
    ta: 'தூண் கம்பி கட்டுதல்',
    kn: 'ಕಂಬದ ಸ್ಟೀಲ್ ಬೈಂಡಿಂಗ್',
    bn: 'কলামের রড বাঁধা'
  },
  'Column Shuttering & Bracing': {
    hi: 'कॉलम शटरिंग और सपोर्ट',
    hin: 'Column Formwork/Shuttering',
    mr: 'कॉलम शटरिंग आणि सपोर्ट',
    te: 'స్తంభం షట్టరింగ్ పనులు',
    ta: 'தூண் சட்டக வேலை (Shuttering)',
    kn: 'ಕಂಬದ ಶಟ್ಟರಿಂಗ್ ಕೆಲಸ',
    bn: 'কলামের সাটারিং ও সাপোর্ট'
  },
  'Column Concrete Casting (M20/M25)': {
    hi: 'कॉलम कंक्रीट ढलाई (M20/M25)',
    hin: 'Column Concrete Casting M20/M25',
    mr: 'कॉलम काँक्रीट ओतणे (M20/M25)',
    te: 'స్తంభం కాంక్రీట్ కాస్టింగ్ (M20/M25)',
    ta: 'தூண் கான்கிரீட் போடுதல் (M20/M25)',
    kn: 'ಕಂಬದ ಕಾಂಕ್ರೀಟ್ ಕಾಸ್ಟಿಂಗ್ (M20/M25)',
    bn: 'কলামের কংক্রিট ঢালাই'
  },
  'Column Curing (Jute Bags Wrap)': {
    hi: 'कॉलम की तराई (बोरी लपेटकर)',
    hin: 'Column Curing (Jute bag wrap)',
    mr: 'कॉलम पाणी शिंपडणे (curing)',
    te: 'స్తంభం క్యూరింగ్ (గోనె సంచులు)',
    ta: 'தூண் பதப்படுத்துதல் (Curing)',
    kn: 'ಕಂಬದ ಕ್ಯೂರಿಂಗ್ (ಗೋಣಿ ಚೀಲ)',
    bn: 'কলামের কিউরিং (চট জড়িয়ে)'
  },
  'Beam Shuttering & Bottom Lining': {
    hi: 'बीम शटरिंग और बेस लाइनिंग',
    hin: 'Beam Shuttering bottom',
    mr: 'बीम शटरिंग कामे',
    te: 'బీమ్ షట్టరింగ్ పనులు',
    ta: 'உத்திரம் சட்டக வேலை (Beam Shuttering)',
    kn: 'ಬೀಮ್ ಶಟ್ಟರಿಂಗ್ ಕೆಲಸ',
    bn: 'বিমের সাটারিং ও নিচের লাইনিং'
  },
  'Slab Shuttering & Scaffolding': {
    hi: 'छत शटरिंग और मचान (Scaffolding)',
    hin: 'Slab Shuttering & Centering',
    mr: 'स्लॅब शटरिंग आणि स्कॅफोल्डिंग',
    te: 'స్లాబ్ షట్టరింగ్ పనులు',
    ta: 'கூரை சட்டக வேலை (Slab Shuttering)',
    kn: 'ಛಾವಣಿ ಶಟ್ಟರಿಂಗ್ ಕೆಲಸ',
    bn: 'ছাদের সাটারিং ও ভারা বাঁধা'
  },
  'Beam Steel Reinforcement Binding': {
    hi: 'बीम सरिया बाइंडिंग (Steel Cage)',
    hin: 'Beam Steel Cage Binding',
    mr: 'बीम सळई बांधणी',
    te: 'బీమ్ స్టీల్ బైండింగ్',
    ta: 'உத்திரம் கம்பி கட்டுதல்',
    kn: 'ಬೀಮ್ ಸ್ಟೀಲ್ ಬೈಂಡಿಂಗ್',
    bn: 'বিমের রড বাঁধা'
  },
  'Slab Reinforcement Steel Binding': {
    hi: 'छत का सरिया बांधना (Slab Steel Mesh)',
    hin: 'Slab Steel mesh binding',
    mr: 'स्लॅब सळई बांधणी',
    te: 'స్లాబ్ స్టీల్ బైండింగ్',
    ta: 'கூரை கம்பி கட்டுதல்',
    kn: 'ಛಾವಣಿ ಸ್ಟೀಲ್ ಬೈಂಡಿಂಗ್',
    bn: 'ছাদের রড বাঁধা'
  },
  'Slab Electrical Conduits Laying': {
    hi: 'छत में बिजली के पाइप बिछाना',
    hin: 'Slab me electrical pipe laying',
    mr: 'स्लॅब विद्युत पाईप घालणे',
    te: 'స్లాబ్ ఎలక్ట్రికల్ పైపులు వేయడం',
    ta: 'கூரை மின்சார குழாய் பதித்தல்',
    kn: 'ಛಾವಣಿ ವೈರಿಂಗ್ ಪೈಪ್ ಅಳವಡಿಕೆ',
    bn: 'ছাদে বৈদ্যুতিক পাইপ বসানো'
  },
  'Slab Plumbing Sleeves Installation': {
    hi: 'छत में प्लंबिंग के लिए जगह (Sleeves) छोड़ना',
    hin: 'Slab plumbing sleeves lagana',
    mr: 'स्लॅब प्लंबिंग स्लीव्हज बसवणे',
    te: 'స్లాబ్ ప్లంబింగ్ స్లీవ్స్ అమర్చడం',
    ta: 'கூரை குழாய் துளைகள் அமைத்தல்',
    kn: 'ಛಾವಣಿ ಪ್ಲಂಬಿಂಗ್ ಸ್ಲೀವ್ಸ್ ಅಳವಡಿಕೆ',
    bn: 'ছাদে প্লাম্বিং পাইপের জায়গা রাখা'
  },
  'Slab Concrete Casting (M20/M25 Pour)': {
    hi: 'छत की कंक्रीट ढलाई (लैंटर डालना)',
    hin: 'Slab concrete casting (Lanter pour)',
    mr: 'स्लॅब काँक्रीट ओतणे (M20/M25)',
    te: 'స్లాబ్ కాంక్రీట్ కాస్టింగ్ (M20/M25)',
    ta: 'கூரை கான்கிரீட் போடுதல் (M20/M25)',
    kn: 'ಛಾವಣಿ ಕಾಂಕ್ರೀಟ್ ಕಾಸ್ಟಿಂಗ್ (M20/M25)',
    bn: 'ছাদ কংক্রিট ঢালাই'
  },
  'Slab Curing & Ponding Setup': {
    hi: 'छत की तराई (पानी भरकर)',
    hin: 'Slab Pond Curing (Tarai)',
    mr: 'स्लॅब पाणी साठवून क्युरिंग करणे',
    te: 'స్లాబ్ క్యూరింగ్ (నీటి చెరువులు)',
    ta: 'கூரை தண்ணீர் தேக்கி பதப்படுத்துதல்',
    kn: 'ಛಾವಣಿ ಕ್ಯೂರಿಂಗ್ (ನೀರು ನಿಲ್ಲಿಸುವುದು)',
    bn: 'ছাদে জল জমিয়ে কিউরিং'
  },
  'Brickwork Layout Marking': {
    hi: 'ईंट चुनाई लेआउट मार्किंग',
    hin: 'Brickwork layout marking',
    mr: 'वीटकाम मांडणी आखणी',
    te: 'ఇటుక గోడ లేఅవుట్ మార్కింగ్',
    ta: 'செங்கல் சுவர் வரைபடம் குறித்தல்',
    kn: 'ಇಟ್ಟಿಗೆ ಗೋಡೆ ಗುರುತು ಮಾಡುವುದು',
    bn: 'ইটের গাঁথুনির লেআউট মার্কিং'
  },
  'Outer 9-inch Brickwork Masonry': {
    hi: 'बाहरी 9-इंच ईंट की चिनाई',
    hin: 'Outer 9-inch wall ki judai',
    mr: 'बाहेरील ९ इंच वीटकाम',
    te: 'బాహ్య 9-అంగుళాల ఇటుక గోడ',
    ta: 'வெளிப்புற 9-இன்ச் செங்கல் சுவர் கட்டுதல்',
    kn: 'ಬಾಹ್ಯ 9-ಇಂಚು ಇಟ್ಟಿಗೆ ಗೋಡೆ ಕೆಲಸ',
    bn: 'বাইরের ৯ ইঞ্চি ইটের গাঁথুনি'
  },
  'Inner 4.5-inch Brickwork Masonry': {
    hi: 'अंदरूनी 4.5-इंच विभाजन दीवार',
    hin: 'Partition 4.5-inch wall ki judai',
    mr: 'आतील ४.५ इंच वीटकाम',
    te: 'అంతర్గత 4.5-అంగుళాల విభజన గోడ',
    ta: 'உட்புற 4.5-இன்ச் செங்கல் தடுப்புச் சுவர்',
    kn: 'ಆಂತರಿಕ 4.5-ಇಂಚು ಇಟ್ಟಿಗೆ ಗೋಡೆ ಕೆಲಸ',
    bn: 'ভেতরের ৪.৫ ইঞ্চি ইটের গাঁথুনি'
  },
  'Lintel Beams Casting': {
    hi: 'दरवाजे/खिड़की के ऊपर लिंटल ढलाई',
    hin: 'Door/window Lintel casting',
    mr: 'लिंटेल बीम काँक्रीट ओतणे',
    te: 'లింటెల్ బీమ్ కాస్టింగ్',
    ta: 'வாசல் உத்திரம் கான்கிரீட் போடுதல்',
    kn: 'ಲಿಂಟೆಲ್ ಬೀಮ್ ಕಾಂಕ್ರೀಟ್ ಕಾಸ್ಟಿಂಗ್',
    bn: 'দরজা-জানলার ওপরে লিন্টেল ঢালাই'
  },
  'Masonry Walls Curing': {
    hi: 'ईंट की दीवारों की तराई',
    hin: 'Brick wall ki Tarai',
    mr: 'भिंतींना पाणी मारणे (Curing)',
    te: 'ఇటుక గోడల క్యూరింగ్',
    ta: 'செங்கல் சுவர்கள் பதப்படுத்துதல்',
    kn: 'ಇಟ್ಟಿಗೆ ಗೋಡೆಗಳ ಕ್ಯೂರಿಂಗ್',
    bn: 'ইটের দেয়ালের কিউরিং'
  },
  'Electrical Wall Chasing & Box Fixing': {
    hi: 'दीवार काटना और स्विचबोर्ड बॉक्स लगाना',
    hin: 'Deewar cutting aur switchbox lagana',
    mr: 'भिंत कापणे आणि स्विचबोर्ड बसवणे',
    te: 'గోడ కటింగ్ & బోర్డ్ అమర్చడం',
    ta: 'சுவர் வெட்டுதல் & பாக்ஸ் பொருத்துதல்',
    kn: 'ಗೋಡೆ ಕತ್ತರಿಸುವುದು ಮತ್ತು ಬೋರ್ಡ್ ಅಳವಡಿಕೆ',
    bn: 'দেয়াল কেটে সুইচবোর্ড বক্স বসানো'
  },
  'Plumbing Pipe Hacking & Concealing': {
    hi: 'दीवार काटना और प्लंबिंग पाइप छुपाना',
    hin: 'Plumbing pipe concealed fitting',
    mr: 'प्लंबिंग पाईप भिंतीत लपवणे',
    te: 'ప్లంబింగ్ పైపులు అమర్చడం',
    ta: 'குழாய் பதித்து சுவரை மூடுதல்',
    kn: 'ಪ್ಲಂಬಿಂಗ್ ಪೈಪ್ ಅಳವಡಿಕೆ',
    bn: 'দেয়াল কেটে প্লাম্বিং পাইপ বসানো'
  },
  'Concrete Surface Hacking (Chipping)': {
    hi: 'कंक्रीट सतह पर टांचा मारना (Chipping)',
    hin: 'Concrete chipping (Tacha marna)',
    mr: 'काँक्रीट पृष्ठभाग रफ करणे',
    te: 'కాంక్రీట్ ఉపరితలాన్ని చిప్ చేయడం',
    ta: 'கான்கிரீட் மேற்பரப்பு செதுக்குதல்',
    kn: 'ಕಾಂಕ್ರೀಟ್ ಮೇಲ್ಮೈ ಚಿಪ್ಪಿಂಗ್',
    bn: 'কংক্রিটের উপরিভাগ চিপিং করা'
  },
  'Column-Brick Joint Chicken Mesh Installation': {
    hi: 'कॉलम-ईंट जोड़ पर मुर्गा जाली (Chicken Mesh) लगाना',
    hin: 'Column-wall joint par chicken mesh lagana',
    mr: 'कॉलम-वीट सांध्यावर जाळी बसवणे',
    te: 'స్తంభం-గోడ జాయింట్ మెష్ అమర్చడం',
    ta: 'தூண்-செங்கல் இணைப்பு வலை பொருத்துதல்',
    kn: 'ಕಂಬ-ಗೋಡೆ ಜಂಟಿ ಮೆಶ್ ಅಳವಡಿಕೆ',
    bn: 'কলাম ও দেয়ালের সংযোগস্থলে তারজালি বসানো'
  },
  'Interior Wall Plastering (1st Coat)': {
    hi: 'भीतरी दीवार का प्लास्टर (प्रथम कोट)',
    hin: 'Inner wall plastering 1st coat',
    mr: 'आतील भिंत प्लास्टर (पहिला थर)',
    te: 'లోపలి గోడ ప్లాస్టరింగ్ (మొదటి కోట్)',
    ta: 'உட்புற சுவர் பூச்சு வேலை (முதல் பூச்சு)',
    kn: 'ಆಂತರಿಕ ಗೋಡೆ ಪ್ಲ್ಯಾಸ್ಟರಿಂಗ್ (ಮೊದಲ ಕೋಟ್)',
    bn: 'ভেতরের দেয়ালের প্লাস্টার (১ম কোট)'
  },
  'Ceiling Plastering': {
    hi: 'छत का प्लास्टर (Ceiling Plaster)',
    hin: 'Ceiling plastering',
    mr: 'छताचे प्लास्टर',
    te: 'సీలింగ్ ప్లాస్టరిಂಗ್',
    ta: 'மேற்கூரை பூச்சு வேலை (Ceiling Plaster)',
    kn: 'ಛಾವಣಿ ಪ್ಲ್ಯಾಸ್ಟರಿಂಗ್ ಕೆಲಸ',
    bn: 'সিলিং প্লাস্টার'
  },
  'Plaster Curing': {
    hi: 'प्लास्टर की तराई',
    hin: 'Plaster ki Tarai',
    mr: 'प्लास्टरला पाणी मारणे (Curing)',
    te: 'ప్లాస్టరింగ్ క్యూరింగ్',
    ta: 'பூச்சு வேலை பதப்படுத்துதல்',
    kn: 'ಪ್ಲ್ಯಾಸ್ಟರಿಂಗ್ ಕ್ಯೂರಿಂಗ್',
    bn: 'প্লাস্টারের কিউরিং'
  },
  'Soil Bearing Capacity (SBC) Test': {
    hi: 'मिट्टी की वहन क्षमता (SBC) परीक्षण',
    hin: 'Soil Bearing Capacity (SBC) Test',
    mr: 'मातीची वहन क्षमता (SBC) चाचणी',
    te: 'నేల బేరింగ్ సామర్థ్యం (SBC) పరీక్ష',
    ta: 'மண் தாங்கும் திறன் (SBC) சோதனை',
    kn: 'ಮಣ್ಣಿನ ಬೇರಿಂಗ್ ಸಾಮರ್ಥ್ಯ (SBC) ಪರೀಕ್ಷೆ',
    bn: 'মাটির ভারবহন ক্ষমতা (SBC) পরীক্ষা'
  },
  'Topographical Survey & Boundary Demarcation': {
    hi: 'टोपोग्राफिकल सर्वे और सीमा सीमांकन',
    hin: 'Topographical Survey & Boundary Demarcation',
    mr: 'टोपोग्राफिकल सर्वेक्षण आणि सीमांकन',
    te: 'టోపోగ్రాఫికల్ సర్వే & సరిహద్దు గుర్తింపు',
    ta: 'நிலப்பரப்பு கணக்கெடுப்பு & எல்லை நிர்ணயம்',
    kn: 'ಸ್ಥಳಾಕೃತಿ ಸಮೀಕ್ಷೆ ಮತ್ತು ಗಡಿ ಗುರುತು',
    bn: 'টোপোগ্রাফিকাল জরিপ ও সীমানা নির্ধারণ'
  },
  'Architectural & Working Drawing Finalization': {
    hi: 'वास्तुकला और वर्किंग ड्राइंग का अंतिम रूप',
    hin: 'Architectural & Working Drawing Finalization',
    mr: 'आर्किटेक्चरल आणि वर्किंग ड्रॉइंग फायनलायझेशन',
    te: 'ఆర్కిటెక్చరల్ & వర్కింగ్ డ్రాయింగ్ ఖరారు',
    ta: 'கட்டிடக்கலை & வரைபடங்கள் இறுதி செய்தல்',
    kn: 'ವಾಸ್ತುಶಿಲ್ಪ आणि ಕೆಲಸದ ರೇಖಾಚಿತ್ರ ಅಂತಿಮಗೊಳಿಸುವಿಕೆ',
    bn: 'স্থাপত্য ও কার্যকারী নকশা চূড়ান্তকরণ'
  },
  'Municipal Plan Approval & Building Permit Procurement': {
    hi: 'नगर निगम योजना स्वीकृति और निर्माण परमिट प्राप्त करना',
    hin: 'Municipal Plan Approval & Building Permit Procurement',
    mr: 'महानगरपालिका नकाशा मंजुरी आणि परवानगी',
    te: 'మున్సిపల్ ప్లాన్ ఆమోదం & పర్మిట్ సేకరణ',
    ta: 'நகராட்சி திட்ட அனுமதி & கட்டிட அனுமதி பெறுதல்',
    kn: 'ಪೌರಸಭೆ ನಕ್ಷೆ ಅನುಮೋದನೆ ಮತ್ತು ಪರವಾನಗಿ ಪಡೆಯುವಿಕೆ',
    bn: 'পৌরসভা প্ল্যান অনুমোদন ও বিল্ডিং পারমিট সংগ্রহ'
  },
  'Borewell Drilling & Curing Water Source Setup': {
    hi: 'बोरवेल ड्रिलिंग और तराई जल स्रोत सेटअप',
    hin: 'Borewell Drilling & Curing Water Source Setup',
    mr: 'बोरवेल ड्रिलिंग आणि पाण्याचे नियोजन',
    te: 'బోరుబావి తవ్వకం & నీటి వనరుల ఏర్పాటు',
    ta: 'போர்வெல் துளையிடுதல் & நீர் ஆதார அமைப்பு',
    kn: 'ಬೋರ್‌ವೆಲ್ ಕೊರೆಯುವಿಕೆ ಮತ್ತು ನೀರಿನ ಮೂಲದ ವ್ಯವಸ್ಥೆ',
    bn: 'নলকূপ খনন ও জলের ব্যবস্থা'
  },
  'Temporary Power Meter & Commercial Electric Supply': {
    hi: 'अस्थायी बिजली मीटर और व्यावसायिक बिजली आपूर्ति',
    hin: 'Temporary Power Meter & Commercial Electric Supply',
    mr: 'अस्थायी वीज मीटर आणि पुरवठा',
    te: 'తాత్कालिक విద్యుత్ మీటర్ & కనెక్షన్',
    ta: 'தற்காலிக மின்சார மீட்டர் & மின் இணைப்பு',
    kn: 'ತಾತ್ಕಾಲಿಕ ವಿದ್ಯುತ್ ಮೀಟರ್ ಮತ್ತು ಸಂಪರ್ಕ',
    bn: 'অস্থায়ী বিদ্যুৎ মিটার ও সংযোগ'
  },
  'Site Clearing & Natural Veg/Soil Scraping': {
    hi: 'साइट की सफाई और प्राकृतिक वनस्पति/मिट्टी की कटाई',
    hin: 'Site Clearing & Natural Veg/Soil Scraping',
    mr: 'जागेची स्वच्छता आणि सपाटीकरण',
    te: 'సైట్ క్లీనింగ్ & నేల మట్టం చేయడం',
    ta: 'தளம் சுத்தம் செய்தல் & மண் சமன்படுத்துதல்',
    kn: 'ಸ್ಥಳ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ ಮತ್ತು ನೆಲ ಸಮತಟ್ಟುಗೊಳಿಸುವಿಕೆ',
    bn: 'সাইট পরিষ্কার ও মাটি সমতলকরণ'
  },
  'Material Storage Yard & Labor Shed Erection': {
    hi: 'सामग्री भंडारण यार्ड और लेबर शेड का निर्माण',
    hin: 'Material Storage Yard & Labor Shed Erection',
    mr: 'साहित्य कोठार आणि कामगार शेड उभारणी',
    te: 'మెటీరియల్ స్టೋరేజ్ యార్డ్ & లేబర్ షెడ్ నిర్మాణం',
    ta: 'பொருட்கள் சேமிப்பு தளம் & தொழிலாளர் தங்குமிடம்',
    kn: 'ವಸ್ತು ಸಂಗ್ರಹಣಾ ಸ್ಥಳ ಮತ್ತು ಕಾರ್ಮಿಕರ ಶೆಡ್ ನಿರ್ಮಾಣ',
    bn: 'উপকরণ রাখার জায়গা ও লেবার শেড নির্মাণ'
  },
  'Layout Marking & Center-line Rope Threading': {
    hi: 'लेआउट मार्किंग और सेंटर-लाइन रोप थ्रेडिंग',
    hin: 'Layout Marking & Center-line Rope Threading',
    mr: 'लेआउट मार्किंग आणि सेंटर-लाईन आखणी',
    te: 'లేఅవుట్ మార్కింగ్ & సెంటర్ లైన్ తాడు వేయడం',
    ta: 'வரைபட குறித்தல் & மையக்கோடு நூல் கட்டுதல்',
    kn: 'ಲೇಔಟ್ ಗುರುತು ಮತ್ತು ಸೆಂಟರ್ ಲೈನ್ ದಾರ ಜೋಡಣೆ',
    bn: 'লেআউট মার্কিং ও সেন্টার-লাইন দড়ি টানা'
  },
  'Foundation Footing Excavation': {
    hi: 'नींव स्तर की खुदाई',
    hin: 'Foundation Footing Excavation',
    mr: 'पाया खोदाई काम',
    te: 'పునాది కోసం గుంతలు తవ్వడం',
    ta: 'அடித்தள குழி தோண்டுதல்',
    kn: 'ಅಡಿಪಾಯಕ್ಕಾಗಿ ಗುಂಡಿ ತೋಡುವುದು',
    bn: 'ভিত্তিপ্রস্তর খনন'
  },
  'Plinth Foundation PCC Base Casting': {
    hi: 'प्लिंथ फाउंडेशन पीसीसी बेस ढलाई',
    hin: 'Plinth Foundation PCC Base Casting',
    mr: 'पायासाठी पीसीसी बेस ओतणे',
    te: 'ప్లింత్ పునాది పీసీసీ బేస్ కాస్టింగ్',
    ta: 'அடித்தள பிசிసి தளம் போடுதல்',
    kn: 'ಪ್ಲಿಂತ್ ಅಡಿಪಾಯ ಪಿಸಿಸಿ ಬೇಸ್ ಕಾಸ್ಟಿಂಗ್',
    bn: 'ভিত্তিপ্রস্তর পিসিসি বেস ঢালাই'
  },
  'Footing Reinforcement Steel Binding': {
    hi: 'फ़ुटिंग स्टील सुदृढीकरण पिंजरा बांधना',
    hin: 'Footing Reinforcement Steel Binding',
    mr: 'फुटिंग स्टील बांधणी',
    te: 'ఫుటింగ్ స్టీల్ బైండింగ్ పనులు',
    ta: 'அடித்தள கம்பி கட்டுதல்',
    kn: 'ಫುಟಿಂಗ್ ಸ್ಟೀಲ್ ಬೈಂಡಿಂಗ್',
    bn: 'ভিত্তিপ্রস্তর রড বাঁধা'
  },
  'Footing Concrete Casting (RCC M20/M25)': {
    hi: 'फ़ुटिंग कंक्रीट ढलाई (M20/M25)',
    hin: 'Footing Concrete Casting (RCC M20/M25)',
    mr: 'फुटिंग काँक्रीट ओतणे',
    te: 'ఫుటింగ్ కాంక్రీట్ కాస్టింగ్ (M20/M25)',
    ta: 'அடித்தள கான்கிரீட் போடுதல் (M20/M25)',
    kn: 'ಫುಟಿಂಗ್ ಕಾಂಕ್ರೀಟ್ ಕಾಸ್ಟಿಂಗ್ (M20/M25)',
    bn: 'ভিত্তিপ্রস্তর কংক্রিট ঢালাই'
  },
  'Plinth Beam Reinforcement Binding': {
    hi: 'प्लिंथ बीम सुदृढीकरण और बाइंडिंग',
    hin: 'Plinth Beam Reinforcement Binding',
    mr: 'प्लिंथ बीम स्टील बांधणी',
    te: 'ప్లింత్ బీమ్ స్టీల్ బైండింగ్',
    ta: 'பிளின்த் பீம் கம்பி கட்டுதல்',
    kn: 'ಪ್ಲಿಂತ್ ಬೀಮ್ ಸ್ಟೀಲ್ ಬೈಂಡಿಂಗ್',
    bn: 'প্লিথ বিম রড বাঁধা'
  },
  'Plinth Beam Concrete Casting & Curing': {
    hi: 'प्लिंथ बीम कंक्रीट ढलाई और तराई',
    hin: 'Plinth Beam Concrete Casting & Curing',
    mr: 'प्लिंथ बीम काँक्रीट आणि क्युरिंग',
    te: 'ప్లింత్ బీమ్ కాంక్రీట్ & క్యూరింగ్',
    ta: 'பிளின்த் பீம் கான்கிரீட் & பதப்படுத்துதல்',
    kn: 'ಪ್ಲಿಂತ್ ಬೀಮ್ ಕಾಂಕ್ರೀಟ್ ಮತ್ತು ಕ್ಯೂರಿಂಗ್',
    bn: 'প্লিথ বিম কংক্রিট ঢালাই ও কিউরিং'
  },
  'Plinth Area Excavation Backfilling & Compaction': {
    hi: 'प्लिंथ क्षेत्र बैकफिलिंग और संघनन',
    hin: 'Plinth Area Excavation Backfilling & Compaction',
    mr: 'प्लिंथ क्षेत्र भराव आणि सपाटीकरण',
    te: 'ప్లింత్ ఏరియా మట్టి నింపడం & మట్టం చేయడం',
    ta: 'பிளின்த் தளம் மண் நிரப்புதல் & சமன்படுத்துதல்',
    kn: 'ಪ್ಲಿಂತ್ ಪ್ರದೇಶ ಮಣ್ಣು ತುಂಬುವಿಕೆ ಮತ್ತು ಸಮತಟ್ಟುಗೊಳಿಸುವಿಕೆ',
    bn: 'প্লিথ এরিয়া মাটি ভরাট ও সমতলকরণ'
  }
};

const CHECKLIST_WORDS = {
  // SBC Test
  'Verify borehole depth is minimum 3 meters from natural ground level.': {
    hi: 'सत्यापित करें कि बोरहोल की गहराई प्राकृतिक जमीनी स्तर से न्यूनतम 3 मीटर है।',
    hin: 'Borehole depth natural ground level se min 3m verify karein.',
    mr: 'बोरहोलची खोली नैसर्गिक जमिनीच्या पातळीपासून किमान ३ मीटर असल्याची खात्री करा.'
  },
  'As per IS:1892, borehole must reach hard strata.': {
    hi: 'आईएस:1892 के अनुसार, बोरहोल को कठोर परत तक पहुंचना चाहिए।',
    hin: 'IS:1892 ke mutabik borehole hard strata tak pahunchna chahiye.',
    mr: 'IS:1892 नुसार, बोरहोल कठीण थरापर्यंत पोहोचला पाहिजे.'
  },
  'Perform standard penetration test (SPT) at regular depth intervals.': {
    hi: 'नियमित गहराई के अंतराल पर मानक प्रवेश परीक्षण (SPT) करें।',
    hin: 'Regular intervals par standard penetration test (SPT) karein.',
    mr: 'नियमित खोलीच्या अंतरावर मानक प्रवेश चाचणी (SPT) करा.'
  },
  'Record N-values every 1.5 meters.': {
    hi: 'प्रत्येक 1.5 मीटर पर एन-मान (N-values) रिकॉर्ड करें।',
    hin: 'N-values ko har 1.5 meter par record karein.',
    mr: 'प्रत्येक १.५ मीटरवर N-व्हॅल्यूजची नोंद करा.'
  },
  'Collect core soil samples in sealed containers for lab moisture and cohesion test.': {
    hi: 'प्रयोगशाला नमी और सामंजस्य परीक्षण के लिए सीलबंद कंटेनरों में मिट्टी के नमूने एकत्र करें।',
    hin: 'Lab moisture test ke liye sealed containers me soil samples jama karein.',
    mr: 'लॅबमधील चाचणीसाठी सीलबंद डब्यात मातीचे नमुने गोळा करा.'
  },
  'Samples must reach lab within 24 hours.': {
    hi: 'नमूने 24 घंटे के भीतर प्रयोगशाला पहुंच जाने चाहिए।',
    hin: 'Samples 24 ghante ke andar lab pahunchna chahiye.',
    mr: 'नमुने २४ तासांच्या आत लॅबमध्ये पोहोचले पाहिजेत.'
  },
  'Check ground water table depth in test pits.': {
    hi: 'परीक्षण गड्ढों में भूजल स्तर की गहराई की जाँच करें।',
    hin: 'Test pits me ground water table ki depth check karein.',
    mr: 'चाचणी खड्ड्यांमध्ये भूजल पातळीची खोली तपासा.'
  },
  'Note seepage rates to plan basement dewatering pumps.': {
    hi: '베이스मेंट ड्रेन पंपों की योजना बनाने के लिए रिसाव दरों को नोट करें।',
    hin: 'Basement dewatering pumps ke liye seepage rates note karein.',
    mr: 'पाणी बाहेर काढण्यासाठी पंपांचे नियोजन करण्यासाठी गळतीचा दर नोंदवा.'
  },
  'Obtain structural engineer signed soil investigation report.': {
    hi: 'स्ट्रक्चरल इंजीनियर द्वारा हस्ताक्षरित मृदा जांच रिपोर्ट प्राप्त करें।',
    hin: 'Structural engineer se signed soil investigation report lein.',
    mr: 'स्ट्रक्चरल इंजिनिअरची स्वाक्षरी असलेला मातीचा अहवाल मिळवा.'
  },
  'Ensure SBC rating is specified in tonnes/sq.m.': {
    hi: 'सुनिश्चित करें कि एसबीसी रेटिंग टन/वर्ग मीटर में निर्दिष्ट है।',
    hin: 'Ensure karein ki SBC rating tonnes/sq.m me di gayi hai.',
    mr: 'SBC रेटिंग टन/चौ.मी. मध्ये नमूद केल्याची खात्री करा.'
  },

  // Boundary Demarcation
  'Check boundary dimensions using electronic Total Station instrument.': {
    hi: 'इलेक्ट्रॉनिक टोटल स्टेशन उपकरण का उपयोग करके सीमा आयामों की जाँच करें।',
    hin: 'Total Station se boundary dimensions check karein.',
    mr: 'इलेक्ट्रॉनिक टोटल स्टेशन वापरून सीमेचे मोजमाप तपासा.'
  },
  'Accuracy must be within +/- 5mm.': {
    hi: 'सटीकता +/- 5 मिमी के भीतर होनी चाहिए।',
    hin: 'Accuracy +/- 5mm ke andar honi chahiye.',
    mr: 'अचूकता +/- ५ मिमीच्या आत असावी.'
  },
  'Match plot coordinates with government revenue maps (patta/registry).': {
    hi: 'सरकारी राजस्व मानचित्रों (पट्टा/रजिस्ट्री) के साथ प्लॉट निर्देशांक का मिलान करें।',
    hin: 'Plot coordinates ko sarkari naksha (patta) se match karein.',
    mr: 'प्लॉटचे सहनिर्देशन सरकारी महसूल नकाशांशी जुळवून घ्या.'
  },
  'Ensure no encroachment on public roads/drains.': {
    hi: 'सुनिश्चित करें कि सार्वजनिक सड़कों/नालियों पर कोई अतिक्रमण न हो।',
    hin: 'Ensure karein ki public road ya naali par koi kabza na ho.',
    mr: 'सार्वजनिक रस्ते/गटारांवर कोणतेही अतिक्रमण नसल्याची खात्री करा.'
  },
  'Establish temporary benchmark (TBM) level on site.': {
    hi: 'साइट पर अस्थायी बेंचमार्क (TBM) स्तर स्थापित करें।',
    hin: 'Site par temporary benchmark (TBM) level set karein.',
    mr: 'साइटवर तात्पुरता बेंचमार्क (TBM) स्तर स्थापित करा.'
  },
  'Transfer level from nearest municipal benchmark.': {
    hi: 'निकटतम नगरपालिका बेंचमार्क से स्तर स्थानांतरित करें।',
    hin: 'Level ko pass ke municipal benchmark se transfer karein.',
    mr: 'जवळच्या नगरपालिकेच्या बेंचमार्कवरून पातळी हस्तांतरित करा.'
  },
  'Mark set-back lines as per municipal building bylaws.': {
    hi: 'नगरपालिका भवन उपनियमों के अनुसार सेट-बैक लाइनों को चिह्नित करें।',
    hin: 'Municipal bylaws ke mutabik set-back lines mark karein.',
    mr: 'महानगरपालिकेच्या नियमांनुसार सेट-बॅक रेषा चिन्हांकित करा.'
  },
  'Clear clearance of min 1.5m on sides must be maintained.': {
    hi: 'किनारों पर न्यूनतम 1.5 मीटर की स्पष्ट निकासी रखी जानी चाहिए।',
    hin: 'Sides par min 1.5m ka gap maintain hona chahiye.',
    mr: 'बाजूला किमान १.५ मीटर अंतर ठेवले पाहिजे.'
  },
  'Insert concrete pegs at corner boundary junctions.': {
    hi: 'कोने की सीमा जंक्शनों पर कंक्रीट के खूंटे डालें।',
    hin: 'Corner boundary points par concrete pegs lagayein.',
    mr: 'कोपरऱ्यातील सीमा जंक्शनवर काँक्रीटचे पेग रोवा.'
  },
  'Pegs must be cast 150x150mm and 0.5m deep.': {
    hi: 'खूंटों को 150x150 मिमी और 0.5 मीटर गहरा ढाला जाना चाहिए।',
    hin: 'Pegs 150x150mm size aur 0.5m deep hone chahiye.',
    mr: 'पेग १५०x१५० मिमी आणि ०.५ मीटर खोल असावेत.'
  },

  // Drawings
  'Approve floor layouts, room layouts, and furniture layouts.': {
    hi: 'फ्लोर लेआउट, रूम लेआउट और फर्नीचर लेआउट को मंजूरी दें।',
    hin: 'Floor aur furniture layout ko approve karein.',
    mr: 'मजल्यांचे आणि फर्निचरचे लेआउट मंजूर करा.'
  },
  'Ensure room dimensions follow Vastu and functional codes.': {
    hi: 'सुनिश्चित करें कि कमरों के आयाम वास्तु और कार्यात्मक कोड के अनुसार हों।',
    hin: 'Ensure karein ki room Vastu ke according ho.',
    mr: 'खोल्यांचे मोजमाप वास्तूनुसार असल्याची खात्री करा.'
  },
  'Verify electrical distribution wiring plans and socket heights.': {
    hi: 'विद्युत वितरण वायरिंग योजनाओं और सॉकेट की ऊंचाइयों को सत्यापित करें।',
    hin: 'Electrical wiring plans aur switch heights check karein.',
    mr: 'इलेक्ट्रिकल वायरिंग प्लॅन आणि सॉकेटची उंची तपासा.'
  },
  'AC sockets must be at 1.2m, light switches at 1.4m.': {
    hi: 'एसी सॉकेट 1.2 मीटर पर, light switches 1.4 मीटर पर होने चाहिए।',
    hin: 'AC socket 1.2m par aur light switch 1.4m par hone chahiye.',
    mr: 'AC सॉकेट्स १.२ मीटर आणि लाईट स्विच १.४ मीटरवर असावेत.'
  },
  'Approve sanitary plumbing pipe routing layout.': {
    hi: 'सैनिटरी प्लंबिंग पाइप रूटिंग लेआउट को मंजूरी दें।',
    hin: 'Sanitary plumbing pipe route approve karein.',
    mr: 'सॅनिटरी प्लंबिंग पाईप रूटिंग प्लॅन मंजूर करा.'
  },
  'Slope of waste line must be min 1 in 40.': {
    hi: 'अपशिष्ट लाइन का ढलान न्यूनतम 40 में 1 होना चाहिए।',
    hin: 'Waste pipe ka slope min 1 in 40 hona chahiye.',
    mr: 'सांडपाण्याच्या पाईपचा उतार किमान १:४० असावा.'
  },
  'Verify column positions in architectural plan match structural layout.': {
    hi: 'सत्यापित करें कि वास्तुकला योजना में कॉलम की स्थिति संरचनात्मक लेआउट से मेल खाती है।',
    hin: 'Architectural plan me columns structural layout se match karein.',
    mr: 'आर्किटेक्चरल प्लॅनमधील कॉलमचे स्थान स्ट्रक्चरल लेआउटशी जुळवून घ्या.'
  },
  'Verify zero column overhangs in rooms.': {
    hi: 'कमरों में शून्य कॉलम ओवरहैंग को सत्यापित करें।',
    hin: 'Rooms me koi column overhang nahi hona chahiye.',
    mr: 'खोल्यांमध्ये कॉलम बाहेर डोकावणार नाहीत याची खात्री करा.'
  },
  'Obtain Good For Construction (GFC) stamped blueprints.': {
    hi: 'निर्माण के लिए उपयुक्त (GFC) मुहर लगे ब्लूप्रिंट प्राप्त करें।',
    hin: 'Good For Construction (GFC) stamps wale prints lein.',
    mr: 'बांधकामासाठीचे (GFC) मंजुरी नकाशे मिळवा.'
  },
  'All blueprints must have structural engineer license seal.': {
    hi: 'सभी ब्लूप्रिंट पर स्ट्रक्चरल इंजीनियर का लाइसेंस सील होना चाहिए।',
    hin: 'Sare blueprints par structural engineer ki seal honi chahiye.',
    mr: 'सर्व नकाशांवर स्ट्रक्चरल इंजिनिअरचा परवाना शिक्का असावा.'
  },

  // Municipal Permit
  'Submit FAR (Floor Area Ratio) calculation sheet.': {
    hi: 'एफएआर (फ्लोर एरिया रेशियो) गणना पत्रक जमा करें।',
    hin: 'FAR calculation sheet submit karein.',
    mr: 'FAR मोजमाप पत्रक सादर करा.'
  },
  'Verify total carpet area matches municipal maximum limits.': {
    hi: 'सत्यापित करें कि कुल कारपेट क्षेत्र नगरपालिका की अधिकतम सीमा से मेल खाता है।',
    hin: 'Verify karein ki carpet area limit ke andar ho.',
    mr: 'एकूण कार्पेट क्षेत्र मर्यादेत असल्याची खात्री करा.'
  },
  'File fire safety and structural stability certificates.': {
    hi: 'अग्निशमन सुरक्षा और संरचनात्मक स्थिरता प्रमाण पत्र दाखिल करें।',
    hin: 'Fire safety aur structural stability certificates jama karein.',
    mr: 'अग्निशमन सुरक्षा आणि स्थिरता प्रमाणपत्रे दाखल करा.'
  },
  'Must be issued by certified government structural engineers.': {
    hi: 'प्रमाणित सरकारी संरचनात्मक इंजीनियरों द्वारा जारी किया जाना चाहिए।',
    hin: 'Sarkari structural engineer se certified hona chahiye.',
    mr: 'शासकीय प्रमाणित स्ट्रक्चरल इंजिनिअरद्वारे जारी केलेले असावे.'
  },
  'Pay municipal development and garbage taxes.': {
    hi: 'नगरपालिका विकास और कचरा करों का भुगतान करें।',
    hin: 'Municipal tax aur garbage tax pay karein.',
    mr: 'महानगरपालिका विकास आणि कचरा कर भरा.'
  },
  'Obtain official computerized receipts.': {
    hi: 'आधिकारिक कंप्यूटरीकृत रसीदें प्राप्त करें।',
    hin: 'Official computerised receipts lein.',
    mr: 'अधिकृत संगणकीकृत पावत्या मिळवा.'
  },
  'Verify environmental NOC (No Objection Certificate) status.': {
    hi: 'पर्यावरणी NOC (No Objection Certificate) स्थिति सत्यापित करें।',
    hin: 'Environmental NOC ka status check karein.',
    mr: 'पर्यावरणीय NOC ची स्थिती तपासा.'
  },
  'Required if basement excavation exceeds 3 meters.': {
    hi: 'यदि बेसमेंट की खुदाई 3 मीटर से अधिक हो तो आवश्यक है।',
    hin: 'Basement khodai 3m se zyada hone par zaroori hai.',
    mr: 'बेसमेंट खोदाई ३ मीटरपेक्षा जास्त असल्यास आवश्यक.'
  },
  'Obtain signed municipal building sanction permit order.': {
    hi: 'हस्ताक्षरित नगरपालिका भवन स्वीकृति परमिट आदेश प्राप्त करें।',
    hin: 'Municipal building approval permit order lein.',
    mr: 'मंजूर बांधकाम परवाना आदेश मिळवा.'
  },
  'Permit must be prominently displayed on-site.': {
    hi: 'परमिट साइट पर प्रमुखता से प्रदर्शित किया जाना चाहिए।',
    hin: 'Sanction paper site par front par chipkayein.',
    mr: 'परवाना पत्र साइटवर दर्शनी भागात लावणे आवश्यक आहे.'
  },

  // Borewell Setup
  'Locate drilling point via hydro-geological survey.': {
    hi: 'जल-भूवैज्ञानिक सर्वेक्षण के माध्यम से ड्रिलिंग बिंदु का पता लगाएं।',
    hin: 'Survey se drilling point pata karein.',
    mr: 'जल-भूवैज्ञानिक सर्वेक्षणानुसार बोअरवेलची जागा निश्चित करा.'
  },
  'Drilling point must be min 15m away from septic soak pits.': {
    hi: 'ड्रिलिंग बिंदु सेप्टिक सोख गड्ढों से न्यूनतम 15 मीटर दूर होना चाहिए।',
    hin: 'Drilling point septic tank se min 15m door hona chahiye.',
    mr: 'बोअरवेलची जागा सेप्टिक टँकपासून किमान १५ मीटर लांब असावी.'
  },
  'Verify casing pipe thickness and material quality (PVC/MS).': {
    hi: 'केसिंग पाइप की मोटाई और सामग्री की गुणवत्ता (PVC/MS) सत्यापित करें।',
    hin: 'Casing pipe ki thickness aur quality check karein.',
    mr: 'केसिंग पाईपची जाडी आणि गुणवत्ता तपासा.'
  },
  'Use minimum 6-inch diameter heavy duty PVC pipes.': {
    hi: 'न्यूनतम 6-इंच व्यास वाले हेवी ड्यूटी पीवीसी पाइप का उपयोग करें।',
    hin: 'Min 6-inch heavy PVC pipe use karein.',
    mr: 'किमान ६ इंच व्यासाचे पीव्हीसी पाईप्स वापरा.'
  },
  'Drill borewell to water-bearing fractured rock aquifer layer.': {
    hi: 'जल-युक्त खंडित चट्टान जलभृत (aquifer) परत तक बोरवेल ड्रिल करें।',
    hin: 'Water strata tak borewell drill karein.',
    mr: 'पाण्याच्या थरापर्यंत बोअरवेल खोदा.'
  },
  'Average depth in region is 150-250 feet.': {
    hi: 'क्षेत्र में औसत गहराई 150-250 फीट है।',
    hin: 'Regional average depth 150-250 feet hoti hai.',
    mr: 'या भागातील सरासरी खोली १५०-२५० फूट आहे.'
  },
  'Install submersible pump motor and run flushing operations.': {
    hi: 'सबमर्सिबल पंप मोटर स्थापित करें और फ्लशिंग ऑपरेशन चलाएं।',
    hin: 'Submersible pump fit karein aur pipe saaf karein.',
    mr: 'सबमर्सिबल पंप बसवून पाणी साफ होईपर्यंत मोटर चालवा.'
  },
  'Flush muddy water for at least 4 hours until output is clear.': {
    hi: 'कम से कम 4 घंटे तक मटमैला पानी बहाएं जब तक कि आउटपुट साफ न हो जाए।',
    hin: 'Ganda paani 4 ghante tak flush karein jab tak saaf na ho.',
    mr: 'पाणी पूर्ण स्वच्छ होईपर्यंत किमान ४ तास पंप चालवा.'
  },
  'Test TDS (Total Dissolved Solids) and pH of borewell water.': {
    hi: 'बोरवेल के पानी के टीडीएस (TDS) और पीएच (pH) का परीक्षण करें।',
    hin: 'Borewell paani ka TDS aur pH test karein.',
    mr: 'बोअरवेलच्या पाण्याचा TDS आणि pH तपासा.'
  },
  'For concrete mixing/curing, pH must be between 6.0 and 8.0.': {
    hi: 'कंक्रीट मिश्रण/तराई के लिए, पीएच 6.0 और 8.0 के बीच होना चाहिए।',
    hin: 'Concrete mixing ke liye pH 6.0 aur 8.0 ke beech hona chahiye.',
    mr: 'काँक्रीटीकरणासाठी पाण्याचा pH ६ ते ८ दरम्यान असावा.'
  },

  // Temporary Power
  'File commercial electrical connection load application.': {
    hi: 'व्यावसायिक विद्युत कनेक्शन लोड आवेदन दाखिल करें।',
    hin: 'Commercial electric load application file karein.',
    mr: 'व्यावसायिक वीज जोडणीसाठी अर्ज करा.'
  },
  'Ensure min 10kW load for mixers and pumps.': {
    hi: 'मिक्सर और पंपों के लिए न्यूनतम 10kW लोड सुनिश्चित करें।',
    hin: 'Mixers/pumps ke liye min 10kW load ensure karein.',
    mr: 'मिक्सर आणि पंपांसाठी किमान १०kW लोड आवश्यक.'
  },
  'Install double-insulated copper cables from pole to site DB box.': {
    hi: 'पोल से साइट डीबी बॉक्स तक डबल-इन्सुलेटेड तांबे के केबल स्थापित करें।',
    hin: 'Pole se site DB tak double insulated cable lagayein.',
    mr: 'खांबावरून साईटवरील मुख्य बोर्डापर्यंत दुहेरी केबल टाका.'
  },
  'Armored cable of min 16 sq.mm is mandatory.': {
    hi: 'न्यूनतम 16 वर्ग मिमी का बख्तरबंद (Armored) केबल अनिवार्य है।',
    hin: 'Min 16 sq.mm armored cable mandatory hai.',
    mr: 'किमान १६ चौ.मिमी आर्मर्ड केबल अनिवार्य आहे.'
  },
  'Install temporary waterproof distribution box with MCB.': {
    hi: 'एमसीबी के साथ अस्थायी वाटरप्रूफ वितरण बॉक्स स्थापित करें।',
    hin: 'Temporary waterproof DB box with MCB fit karein.',
    mr: 'एमसीबीसह तात्पुरता वॉटरप्रूफ वीज वितरण बोर्ड बसवा.'
  },
  'Include 30mA residual current circuit breaker (RCCB) for safety.': {
    hi: 'सुरक्षा के लिए 30mA अवशिष्ट वर्तमान सर्किट ब्रेकर (RCCB) शामिल करें।',
    hin: 'Safety ke liye 30mA RCCB lagayein.',
    mr: 'सुरक्षेसाठी ३०mA चा RCCB सर्किट ब्रेकर बसवा.'
  },
  'Verify earthing grounding resistance at the temporary meter.': {
    hi: 'अस्थायी मीटर पर अर्थिंग ग्राउंडिंग प्रतिरोध को सत्यापित करें।',
    hin: 'Temporary meter par earthing test karein.',
    mr: 'तात्पुरत्या मीटरवर अर्थिंग जोडणी तपासा.'
  },
  'Resistance should be less than 5 ohms.': {
    hi: 'प्रतिरोध 5 ओम से कम होना चाहिए।',
    hin: 'Earth resistance 5 ohms se kam hona chahiye.',
    mr: 'अर्थिंगचा रोध ५ ओहमपेक्षा कमी असावा.'
  },
  'Setup power sockets with waterproof flaps for site drills and concrete mixers.': {
    hi: 'साइट ड्रिल और कंक्रीट मिक्सर के लिए वाटरप्रूफ फ्लैप के साथ पावर सॉकेट सेटअप करें।',
    hin: 'Waterproof sockets setup karein site drills ke liye.',
    mr: 'मशीन्ससाठी वॉटरप्रूफ झाकण असलेले सॉकेट बसवा.'
  },
  'Must use IP65 rated outdoor sockets.': {
    hi: 'आईपी65 रेटेड आउटडोर सॉकेट का उपयोग अवश्य करें।',
    hin: 'IP65 rated outdoor sockets use karein.',
    mr: 'IP65 मानांकित सॉकेट्स वापरणे आवश्यक आहे.'
  },

  // Site Clearing
  'Remove roots, bushes, trees, and trash from site boundary.': {
    hi: 'साइट की सीमा से जड़ें, झाड़ियाँ, पेड़ और कचरा हटा दें।',
    hin: 'Site boundary se roots, jhaadiyan aur kachra saaf karein.',
    mr: 'साइटच्या हद्दीतील झाडे-झುಡಪೆ ಆಣಿ ಕಚರಾ ಕಧುನ್ ಟಾಕಾ.'
  },
  'Organic debris weakens foundation if buried.': {
    hi: 'जैविक मलबा दफन होने पर नींव को कमजोर कर देता है।',
    hin: 'Kachra zameen me dabne se foundation kamzor ho sakta hai.',
    mr: 'सेंद्रिय कचरा जमिनीत गाडल्यास पाया कमकुवत होतो.'
  },
  'Scrape top 150mm organic humus soil.': {
    hi: 'शीर्ष 150 मिमी जैविक धरण मिट्टी को खुरचें।',
    hin: 'Upar ki 150mm mitti ko scrape karein.',
    mr: 'वरचा १५० मिमी मातीचा थर खरवडून बाजूला करा.'
  },
  'Top soil must be stocked separately for future garden landscaping.': {
    hi: 'भविष्य में बगीचे के भूनिर्माण के लिए ऊपरी मिट्टी को अलग से स्टॉक किया जाना चाहिए।',
    hin: 'Garden ke liye top soil alag se store karein.',
    mr: 'बागकामासाठी वरची सुपीक माती वेगळी साठवून ठेवा.'
  },
  'Level the terrain using graders or manual JCB shovel.': {
    hi: 'ग्रेडर या मैनुअल जेसीबी फावड़े का उपयोग करके भूभाग को समतल करें।',
    hin: 'JCB se ground level karwayein.',
    mr: 'JCB किंवा मजुरांच्या मदतीने जागा समतल करा.'
  },
  'Maintain slope of 1:100 away from proposed house coordinates.': {
    hi: 'प्रस्तावित घर के निर्देशांक से दूर 1:100 का ढलान बनाए रखें।',
    hin: 'Proposed house area se door 1:100 slope rakhein.',
    mr: 'घराच्या जागेपासून दूर जाणारा १:१०० चा उतार ठेवा.'
  },
  'Clear boulder rocks and debris deposits.': {
    hi: 'बोल्डर चट्टानों और मलबे के जमाव को साफ करें।',
    hin: 'Boulders aur malba saaf karwayein.',
    mr: 'दगड आणि ढिगारे साफ करा.'
  },
  'Dump waste material at municipal approved locations only.': {
    hi: 'अपशिष्ट सामग्री केवल नगर निगम द्वारा अनुमोदित स्थानों पर ही डंप करें।',
    hin: 'Malba municipal approved dumping site par daalein.',
    mr: 'कचरा महानगरपालिकेच्या अधिकृत ठिकाणीच टाका.'
  },
  'Perform pest treatment against termites in surrounding soil area.': {
    hi: 'आसपास की मिट्टी के क्षेत्र में दीमकों के खिलाफ कीट उपचार करें।',
    hin: 'Deemak treatment karein mitti par.',
    mr: 'मातीवर वाळवी प्रतिबंधक औषध फवारणी करा.'
  },
  'Spray chlorpyrifos emulsion on scraped base.': {
    hi: 'खुले आधार पर क्लोरपायरीफॉस इमल्शन का छिड़काव करें।',
    hin: 'Scraped base par Chlorpyrifos spray karein.',
    mr: 'खरवडलेल्या बेसवर क्लोरपायरीफॉस फवारा.'
  },

  // Material Storage
  'Build waterproof lockable cement warehouse.': {
    hi: 'वाटरप्रूफ लॉक करने योग्य सीमेंट गोदाम का निर्माण करें।',
    hin: 'Waterproof lockable cement godown banayein.',
    mr: 'सिमेंट साठवण्यासाठी कुलूप असलेले वॉटरप्रूफ कोठार बांधा.'
  },
  'Must have raised wooden platform (150mm height) to prevent moisture.': {
    hi: 'नमी को रोकने के लिए ऊंचा लकड़ी का प्लेटफॉर्म (150 मिमी ऊंचाई) होना चाहिए।',
    hin: 'Mitti ke floor se 150mm upar wooden platform banayein.',
    mr: 'सिमेंट खाली लाकडी फळ्या ठेवून जमिनीपासून १५० मिमी उंचीवर ठेवा.'
  },
  'Construct steel storage racks.': {
    hi: 'स्टील भंडारण रैक का निर्माण करें।',
    hin: 'Steel storage racks banayein.',
    mr: 'स्टील साठवणीसाठी रॅक बनवा.'
  },
  'Store rebars based on diameter (8mm, 10mm, 12mm, 16mm) off the ground.': {
    hi: 'सरियों को व्यास (8 मिमी, 10 मिमी, 12 मिमी, 16 मिमी) के आधार पर जमीन से ऊपर स्टोर करें।',
    hin: 'Saria size ke according zameen se upar store karein.',
    mr: 'लोखंडी गजांचे व्यासवार वर्गीकरण करून जमिनीपासून वर साठवा.'
  },
  'Set up labor sanitation toilets and drinking water tank.': {
    hi: 'लेबर स्वच्छता शौचालय और पीने के पानी की टंकी स्थापित करें।',
    hin: 'Labor toilets aur peene ka paani tank setup karein.',
    mr: 'मजुरांसाठी शौचालय आणि पिण्याच्या पाण्याची व्यवस्था करा.'
  },
  'Clean water tank with chlorine regularly.': {
    hi: 'पानी की टंकी को नियमित रूप से क्लोरीन से साफ करें।',
    hin: 'Paani ka tank regular chlorine se clean karein.',
    mr: 'पाण्याची टाकी वेळोवेळी क्लोरीन पावडर टाकून साफ करा.'
  },
  'Erect site safety fencing and warning banners.': {
    hi: 'साइट सुरक्षा बाड़ और चेतावनी बैनर लगाएं।',
    hin: 'Safety border fencing aur banners lagayein.',
    mr: 'साईटभोवती सुरक्षा कुंपण आणि फलक लावा.'
  },
  'Banners should read: "Caution - Construction Site - Hardhats Required".': {
    hi: 'बैनर पर लिखा होना चाहिए: "सावधान - निर्माण स्थल - हेलमेट आवश्यक"।',
    hin: 'Banners par "Caution - Construction Site" likhein.',
    mr: 'फलकावर "सावधान - बांधकाम चालू आहे" असे स्पष्ट लिहा.'
  },
  'Prepare sand and coarse aggregate washing bays.': {
    hi: 'रेत और मोटे मिलावे (Aggregate) धोने के बे तैयार करें।',
    hin: 'Ret dhone ke liye washing bay ready karein.',
    mr: 'वाळू धुण्यासाठी जागा तयार ठेवा.'
  },
  'Silt content in washing bay should be below 3%.': {
    hi: 'धुलाई बे में गाद (Silt) की मात्रा 3% से कम होनी चाहिए।',
    hin: 'Silt content wash hone ke baad 3% se kam hona chahiye.',
    mr: 'वाळूतील मातीचे (silt) प्रमाण ३% पेक्षा कमी असावे.'
  }
};

// NLP Translation Parser Engine
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Precompile phrase-replacement regexes ONCE (module load), longest keys first so
// composite phrases (e.g. "Ground Floor (Commercial)") win over their substrings.
// Escaping prevents crashes on keys containing regex metacharacters like "(M20/M25)".
const COMPILED_DIC = Object.keys(DIC_WORDS)
  .sort((a, b) => b.length - a.length)
  .map(key => ({ val: DIC_WORDS[key], re: new RegExp('\\b' + escapeRegExp(key) + '\\b', 'g') }));

// Memoize results — the same activity/checklist strings render many times.
const contentCache = new Map();

export function translateContent(text, langCode) {
  if (!text) return '';
  if (langCode === 'en') return text;

  const cacheKey = langCode + '::' + text;
  const cached = contentCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let result;

  // 1. Direct dictionary matches (fast path for exact activity/stage/item strings)
  const directMatch = DIC_WORDS[text];
  const checkMatch = CHECKLIST_WORDS[text];
  if (directMatch && directMatch[langCode]) {
    result = directMatch[langCode];
  } else if (checkMatch && checkMatch[langCode]) {
    result = checkMatch[langCode];
  } else {
    // 2. Phrase-based segment replacement for composite strings (using precompiled regexes)
    let translatedText = text;
    for (const { val, re } of COMPILED_DIC) {
      const rep = val[langCode];
      if (rep) translatedText = translatedText.replace(re, rep);
    }
    result = translatedText;
  }

  contentCache.set(cacheKey, result);
  return result;
}

const translationCache = {};

// 3. Free Public Google Translation API
export async function translateTextFree(text, targetLang) {
  if (!text || !text.trim() || targetLang === 'en') return text;
  
  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  let tl = targetLang;
  if (targetLang === 'hin') tl = 'hi'; // Hinglish fallbacks to Hindi
  
  try {
    const cleanText = text.trim();
    if (cleanText.length > 800) {
      return text; // Skip extremely long paragraphs to avoid URL limits
    }
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(cleanText)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Google API returned status ${res.status}`);
    const data = await res.json();
    if (data && data[0]) {
      const translated = data[0].map(part => part[0]).join('');
      translationCache[cacheKey] = translated;
      return translated;
    }
    return text;
  } catch (err) {
    console.warn(`Translation fallback for: "${text.substring(0, 20)}...":`, err.message);
    return text; // Graceful fallback to original text
  }
}

// 4. Batch Translation Helper
export async function translateBatchFree(stringsList, targetLang) {
  if (!stringsList || stringsList.length === 0 || targetLang === 'en') {
    return stringsList;
  }
  
  const results = [];
  for (const str of stringsList) {
    const res = await translateTextFree(str, targetLang);
    results.push(res);
    // Micro delay to avoid rate limits
    const cacheKey = `${targetLang}:${str}`;
    if (!translationCache[cacheKey]) {
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
  return results;
}
