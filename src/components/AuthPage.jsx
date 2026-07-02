import React, { useState } from 'react';
import { HardHat, LogIn, UserPlus, CheckCircle2, BarChart3, ClipboardCheck, Bot } from 'lucide-react';
import { LANGUAGES } from '../utils/translationHelper';
import { apiService } from '../services/api';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regLang, setRegLang] = useState('hi');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Name, Email aur Password dena zaroori hai.');
      return;
    }
    
    try {
      const data = await apiService.register(regName.trim(), regEmail.trim(), regPassword);
      // Save language preference in localStorage
      localStorage.setItem('nirmaan_language', regLang);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Email aur Password dono required hain.');
      return;
    }
    
    try {
      const data = await apiService.login(loginEmail.trim(), loginPassword);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Galat email ya password. Dobara try karein.');
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Brand Panel */}
      <div className="auth-brand-panel">
        <div className="brand-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', marginBottom: '24px' }}>
          <img src="/app_icon.png" alt="Nirmaan Sahayak App Icon" style={{ width: '100px', height: '100px', borderRadius: '20px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
          <h1 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Nirmaan Sahayak</h1>
        </div>
        <p className="brand-tagline" style={{ textAlign: 'center', fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '32px' }}>
          AI-powered construction journey planner — apne sapnon ka ghar banayein, step by step, ek experienced engineer ki madad se.
        </p>
        <div className="brand-features">
          <div className="brand-feature-item">
            <CheckCircle2 size={20} />
            <span>500+ Construction Activities & Checklists</span>
          </div>
          <div className="brand-feature-item">
            <BarChart3 size={20} />
            <span>AI Predictive Scheduling & Risk Analysis</span>
          </div>
          <div className="brand-feature-item">
            <ClipboardCheck size={20} />
            <span>Quality Control with Engineering Standards</span>
          </div>
          <div className="brand-feature-item">
            <Bot size={20} />
            <span>AI Construction Advisor Chat</span>
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
              AI-powered construction journey planner — apne sapnon ka ghar banayein, step by step, ek experienced engineer ki madad se.
            </p>
          </div>
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              <span>🔑 Login</span>
            </button>
            <button 
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              <span>📝 Register</span>
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {mode === 'register' ? (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="Aapka poora naam"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  className="form-input" 
                  type="email" 
                  placeholder="yourname@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  className="form-input" 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input 
                  className="form-input" 
                  type="password" 
                  placeholder="Strong password rakhein"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City / Town</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="Jaise: Indore, Pune, Lucknow..."
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Language</label>
                <select 
                  className="form-select"
                  value={regLang}
                  onChange={(e) => setRegLang(e.target.value)}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-auth">
                <UserPlus size={18} />
                Account Banayein
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  className="form-input" 
                  type="email" 
                  placeholder="yourname@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  placeholder="Apna password dalein"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-auth">
                <LogIn size={18} />
                Login Karein
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
