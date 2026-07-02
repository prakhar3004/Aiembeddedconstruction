import React, { useState, useEffect } from 'react';
import { HardHat, LogIn, UserPlus, CheckCircle2, BarChart3, ClipboardCheck, Bot, Sun, Moon } from 'lucide-react';
import { LANGUAGES } from '../utils/translationHelper';
import { apiService } from '../services/api';

const AUTH_TRANSLATIONS = {
  en: {
    tagline: 'AI-powered construction journey planner — build your dream home step by step with the help of an experienced AI Knowledge Base engineer.',
    loginTab: '🔑 Login',
    registerTab: '📝 Register',
    emailLabel: 'Email Address *',
    passwordLabel: 'Password *',
    loginBtn: 'Login',
    registerBtn: 'Register',
    fullNameLabel: 'Full Name *',
    phoneLabel: 'Phone Number',
    cityLabel: 'City / Town',
    prefLangLabel: 'Preferred Language',
    accCreateBtn: 'Create Account',
    emailPlaceholder: 'yourname@email.com',
    passwordPlaceholder: 'Enter password',
    namePlaceholder: 'Your full name',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'e.g. Indore, Pune, Lucknow...',
    reqFieldsError: 'Name, Email and Password are required.',
    reqLoginError: 'Email and Password are required.',
    loginFailed: 'Invalid email or password. Please try again.',
    regFailed: 'Registration failed. Please try again.'
  },
  hi: {
    tagline: 'एआई-संचालित निर्माण यात्रा योजनाकार — अपने सपनों का घर बनाएं, कदम दर कदम, एक अनुभवी एआई नॉलेज बेस इंजीनियर की मदद से।',
    loginTab: '🔑 लॉगिन',
    registerTab: '📝 पंजीकरण',
    emailLabel: 'ईमेल पता *',
    passwordLabel: 'पासवर्ड *',
    loginBtn: 'लॉगिन करें',
    registerBtn: 'पंजीकरण करें',
    fullNameLabel: 'पूरा नाम *',
    phoneLabel: 'फ़ोन नंबर',
    cityLabel: 'शहर / कस्बा',
    prefLangLabel: 'पसंदीदा भाषा',
    accCreateBtn: 'खाता बनाएं',
    emailPlaceholder: 'aapkanam@email.com',
    passwordPlaceholder: 'अपना पासवर्ड डालें',
    namePlaceholder: 'आपका पूरा नाम',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'जैसे: इंदौर, पुणे, लखनऊ...',
    reqFieldsError: 'नाम, ईमेल और पासवर्ड देना अनिवार्य है।',
    reqLoginError: 'ईमेल और पासवर्ड दोनों आवश्यक हैं।',
    loginFailed: 'गलत ईमेल या पासवर्ड। कृपया दोबारा प्रयास करें।',
    regFailed: 'पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।'
  },
  mr: {
    tagline: 'एआय-संचालित बांधकाम प्रवास नियोजक — अनुभवी एआय नॉलेज बेस इंजिनिअरच्या मदतीने आपले स्वप्नातील घर पाऊल दर पाऊल बनवा.',
    loginTab: '🔑 लॉगिन',
    registerTab: '📝 नोंदणी',
    emailLabel: 'ईमेल पत्ता *',
    passwordLabel: 'पासवर्ड *',
    loginBtn: 'लॉगिन करा',
    registerBtn: 'नोंदणी करा',
    fullNameLabel: 'पूर्ण नाव *',
    phoneLabel: 'फोन नंबर',
    cityLabel: 'शहर / गाव',
    prefLangLabel: 'पसंतीची भाषा',
    accCreateBtn: 'खाते तयार करा',
    emailPlaceholder: 'tumchenav@email.com',
    passwordPlaceholder: 'पासवर्ड प्रविष्ट करा',
    namePlaceholder: 'तुमचे पूर्ण नाव',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'उदा. मुंबई, पुणे, नागपूर...',
    reqFieldsError: 'नाव, ईमेल आणि पासवर्ड आवश्यक आहेत.',
    reqLoginError: 'ईमेल आणि पासवर्ड दोन्ही आवश्यक आहेत.',
    loginFailed: 'अवैध ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा.',
    regFailed: 'नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.'
  },
  gu: {
    tagline: 'AI-સંચાલિત બાંધકામ યાત્રા પ્લાનર — અનુભવી AI નોલેજ બેઝ એન્જિનિયરની મદદથી તમારા સપનાનું ઘર બનાવો, પગલું દ્વારા પગલું.',
    loginTab: '🔑 લોગિન',
    registerTab: '📝 નોંધણી',
    emailLabel: 'ઈમેલ એડ્રેસ *',
    passwordLabel: 'પાસવર્ડ *',
    loginBtn: 'લોગિન કરો',
    registerBtn: 'નોંધણી કરો',
    fullNameLabel: 'પૂરું નામ *',
    phoneLabel: 'ફોન નંબર',
    cityLabel: 'શહેર / ગામ',
    prefLangLabel: 'પસંદગીની ભાષા',
    accCreateBtn: 'ખાતું બનાવો',
    emailPlaceholder: 'tamrunam@email.com',
    passwordPlaceholder: 'પાસવર્ડ દાખલ કરો',
    namePlaceholder: 'તમારું પૂરું નામ',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'જેમ કે: અમદાવાદ, સુરત, વડોદરા...',
    reqFieldsError: 'નામ, ઈમેલ અને પાસવર્ડ જરૂરી છે.',
    reqLoginError: 'ઈમેલ અને પાસવર્ડ બંને જરૂરી છે.',
    loginFailed: 'અમાન્ય ઈમેલ અથવા પાસવર્ડ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    regFailed: 'નોંધણી નિષ્ફળ ગઈ. કૃપા કરીને ફરી પ્રયાસ કરો.'
  },
  te: {
    tagline: 'AI-ఆధారిత నిర్మాణ ప్రయాణ ప్లానర్ — అనుభవజ్ఞుడైన AI నాలెడ్జ్ బేస్ ఇంజనీర్ సహాయంతో మీ కలల ఇల్లును దశలవారీగా నిర్మించుకోండి.',
    loginTab: '🔑 లాగిన్',
    registerTab: '📝 రిజిస్టర్',
    emailLabel: 'ఈమెయిల్ చిరునామా *',
    passwordLabel: 'పాస్‌వర్డ్ *',
    loginBtn: 'లాగిన్ అవ్వండి',
    registerBtn: 'నమోదు చేయండి',
    fullNameLabel: 'పూర్తి పేరు *',
    phoneLabel: 'ఫోన్ నంబర్',
    cityLabel: 'నగరం / పట్టణం',
    prefLangLabel: 'ప్రాధాన్యత భాష',
    accCreateBtn: 'ఖాతాను సృష్టించండి',
    emailPlaceholder: 'meeperu@email.com',
    passwordPlaceholder: 'పాస్‌వర్డ్ నమోదు చేయండి',
    namePlaceholder: 'మీ పూర్తి పేరు',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'ఉదా: హైదరాబాద్, విజయవాడ...',
    reqFieldsError: 'పేరు, ఈమెయిల్ మరియు పాస్‌వర్డ్ తప్పనిసరి.',
    reqLoginError: 'ఈమెయిల్ మరియు పాస్‌వర్డ్ రెండు అవసరం.',
    loginFailed: 'చెల్లని ఈమెయిల్ లేదా పాస్‌వర్డ్. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    regFailed: 'నమోదు విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
  },
  ta: {
    tagline: 'AI-இயங்கும் கட்டுமானப் பயணத் திட்டமிடுபவர் — அனுபவம் வாய்ந்த AI அறிவுத் தளப் பொறியாளரின் உதவியுடன் உங்கள் கனவு இல்லத்தை படிப்படியாக உருவாக்குங்கள்.',
    loginTab: '🔑 உள்நுழைவு',
    registerTab: '📝 பதிவு ചെയ്യുക',
    emailLabel: 'மின்னஞ்சல் முகவரி *',
    passwordLabel: 'கடவுச்சொல் *',
    loginBtn: 'உள்நுழைக',
    registerBtn: 'பதிவு செய்க',
    fullNameLabel: 'முழு பெயர் *',
    phoneLabel: 'தொலைபேசி எண்',
    cityLabel: 'நகரம் / ஊர்',
    prefLangLabel: 'விருப்பமான மொழி',
    accCreateBtn: 'கணக்கை உருவாக்கு',
    emailPlaceholder: 'ungalpeyar@email.com',
    passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
    namePlaceholder: 'உங்கள் முழு பெயர்',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'உதாரணமாக: சென்னை, கோவை, மதுரை...',
    reqFieldsError: 'பெயர், மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை.',
    reqLoginError: 'மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டும் தேவை.',
    loginFailed: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.',
    regFailed: 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'
  },
  kn: {
    tagline: 'AI-ಚಾಲಿತ ನಿರ್ಮಾಣ ಪ್ರಯಾಣ ಯೋಜಕ — ಅನುಭವಿ AI ಜ್ಞಾನ ಬೇಸ್ ಎಂಜಿನಿಯರ್ ಸಹಾಯದಿಂದ ನಿಮ್ಮ ಕನಸಿನ ಮನೆಯನ್ನು ಹಂತ ಹಂತವಾಗಿ ನಿರ್ಮಿಸಿ.',
    loginTab: '🔑 ಲಾಗಿನ್',
    registerTab: '📝 ನೋಂದಣಿ',
    emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ *',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್ *',
    loginBtn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    registerBtn: 'ನೋಂದಣಿ ಮಾಡಿ',
    fullNameLabel: 'ಪೂರ್ಣ ಹೆಸರು *',
    phoneLabel: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    cityLabel: 'ನಗರ / ಪಟ್ಟಣ',
    prefLangLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    accCreateBtn: 'ಖಾತೆಯನ್ನು ರಚಿಸಿ',
    emailPlaceholder: 'nimmadesha@email.com',
    passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    namePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'ಉದಾ: ಬೆಂಗಳೂರು, ಮೈಸೂರು...',
    reqFieldsError: 'ಹೆಸರು, ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ.',
    reqLoginError: 'ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಎರಡೂ ಅಗತ್ಯವಿದೆ.',
    loginFailed: 'ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    regFailed: 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
  },
  bn: {
    tagline: 'এআই-চালিত নির্মাণ যাত্রা পরিকল্পনাকারী — একজন অভিজ্ঞ এআই নলেজ বেস ইঞ্জিনিয়ারের সাহায্যে ধাপে ধাপে আপনার স্বপ্নের বাড়ি তৈরি করুন।',
    loginTab: '🔑 লগইন',
    registerTab: '📝 নিবন্ধন',
    emailLabel: 'ইমেল ঠিকানা *',
    passwordLabel: 'পাসওয়ার্ড *',
    loginBtn: 'লগইন করুন',
    registerBtn: 'নিবন্ধন করুন',
    fullNameLabel: 'সম্পূর্ণ নাম *',
    phoneLabel: 'ফোন নম্বর',
    cityLabel: 'শহর / নগর',
    prefLangLabel: 'পছন্দসই ভাষা',
    accCreateBtn: 'অ্যাকাউন্ট তৈরি করুন',
    emailPlaceholder: 'apnarnam@email.com',
    passwordPlaceholder: 'পাসওয়ার্ড লিখুন',
    namePlaceholder: 'আপনার সম্পূর্ণ নাম',
    phonePlaceholder: '+91 98765 43210',
    cityPlaceholder: 'যেমন: কলকাতা, হাওড়া...',
    reqFieldsError: 'নাম, ইমেল এবং পাসওয়ার্ড প্রয়োজন।',
    reqLoginError: 'ইমেল এবং পাসওয়ার্ড উভয়ই প্রয়োজন।',
    loginFailed: 'অবৈধ ইমেল বা পাসওয়ার্ড। আবার চেষ্টা করুন।',
    regFailed: 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
  }
};

export default function AuthPage({ onLogin, language = 'en', onLanguageChange }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');

  // Local theme state syncing with documentElement & localStorage
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('nirmaan_theme') !== 'light'; // default to true
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark-theme-active');
      localStorage.setItem('nirmaan_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-theme-active');
      localStorage.setItem('nirmaan_theme', 'light');
    }
  }, [isDark]);

  const lang = AUTH_TRANSLATIONS[language] ? language : 'en';
  const t = AUTH_TRANSLATIONS[lang];

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [apiBaseInput, setApiBaseInput] = useState(() => {
    return localStorage.getItem('nirmaan_api_base') || 'http://localhost:3001/api';
  });

  const handleApiBaseChange = (val) => {
    setApiBaseInput(val);
    localStorage.setItem('nirmaan_api_base', val);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError(t.reqFieldsError);
      return;
    }

    try {
      const data = await apiService.register(regName.trim(), regEmail.trim(), regPassword);
      // Save language preference in localStorage
      localStorage.setItem('nirmaan_language', lang);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || t.regFailed);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError(t.reqLoginError);
      return;
    }

    try {
      const data = await apiService.login(loginEmail.trim(), loginPassword);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || t.loginFailed);
    }
  };

  return (
    <div className="auth-wrapper" style={{ position: 'relative' }}>
      
      {/* Floating Theme and Language Controls */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 100 }}>
        {/* Language Select */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="header-lang-select"
          style={{ height: '34px', padding: '0 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
        
        {/* Theme Toggle Button */}
        <button 
          className="btn btn-ghost" 
          onClick={() => setIsDark(!isDark)}
          style={{ width: '34px', height: '34px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={15} style={{ color: '#eab308' }} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Left Brand Panel */}
      <div className="auth-brand-panel">
        <div className="brand-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', marginBottom: '24px' }}>
          <img src="/app_icon.png" alt="Nirmaan Sahayak App Icon" style={{ width: '100px', height: '100px', borderRadius: '20px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
          <h1 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Nirmaan Sahayak</h1>
        </div>
        <p className="brand-tagline" style={{ textAlign: 'center', fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '32px' }}>
          {t.tagline}
        </p>
        <div className="brand-features">
          <div className="brand-feature-item">
            <CheckCircle2 size={20} />
            <span>{language === 'hi' ? '500+ निर्माण गतिविधियाँ और चेकलिस्ट' : '500+ Construction Activities & Checklists'}</span>
          </div>
          <div className="brand-feature-item">
            <BarChart3 size={20} />
            <span>{language === 'hi' ? 'एआई समय-सीमा और जोखिम संकेतक' : 'AI Predictive Scheduling & Risk Analysis'}</span>
          </div>
          <div className="brand-feature-item">
            <ClipboardCheck size={20} />
            <span>{language === 'hi' ? 'गुणवत्ता मानकों के साथ साइट नियंत्रण' : 'Quality Control with Engineering Standards'}</span>
          </div>
          <div className="brand-feature-item">
            <Bot size={20} />
            <span>{language === 'hi' ? 'एआई सिविल कंसल्टेंट चैट' : 'AI Construction Advisor Chat'}</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            <img src="/app_icon.png" alt="Nirmaan Sahayak App Icon" style={{ width: '64px', height: '64px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '12px 0 0 0', color: '#ffffff' }}>Nirmaan Sahayak</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px', lineHeight: 1.5, textAlign: 'center', marginBottom: '16px' }}>
              {t.tagline}
            </p>
          </div>
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              <span>{t.loginTab}</span>
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              <span>{t.registerTab}</span>
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {mode === 'register' ? (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">{t.fullNameLabel}</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.emailLabel}</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.phoneLabel}</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.passwordLabel}</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.cityLabel}</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={t.cityPlaceholder}
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-auth">
                <UserPlus size={18} style={{ marginRight: '6px' }} />
                {t.accCreateBtn}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">{t.emailLabel}</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.passwordLabel}</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-auth">
                <LogIn size={18} style={{ marginRight: '6px' }} />
                {t.loginBtn}
              </button>
            </form>
          )}

          {/* API Server URL Config */}
          <div style={{ marginTop: '24px', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
            <details style={{ cursor: 'pointer' }}>
              <summary style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚙️ {language === 'hi' ? 'एपीआई सर्वर सेटिंग्स (Vercel/Local)' : 'API Server URL Settings'}
              </summary>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ height: '30px', fontSize: '11px', padding: '0 8px' }}
                  value={apiBaseInput}
                  onChange={(e) => handleApiBaseChange(e.target.value)}
                  placeholder="Jaise: https://xxxx.ngrok-free.app/api"
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                  💡 {language === 'hi'
                    ? 'नोट: Vercel पर चलाने के लिए HTTPS होना ज़रूरी है। लोकल सर्वर को टनल करने के लिए ngrok चलाएं और उसका HTTPS URL यहाँ डालें।'
                    : 'Note: Vercel requires HTTPS. For local testing on Vercel, run "ngrok http 3001" and paste the HTTPS URL here.'}
                </span>
              </div>
            </details>
          </div>

        </div>
      </div>
    </div>
  );
}
