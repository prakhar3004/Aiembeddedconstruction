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

  const lang = language === 'hi' ? 'hi' : 'en';
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
        </div>
      </div>
    </div>
  );
}
