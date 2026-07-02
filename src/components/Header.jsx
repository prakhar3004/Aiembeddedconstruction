import React, { useState, useEffect } from 'react';
import { Key, ShieldAlert, ShieldCheck, RefreshCw, Play, Sun, Moon, Menu } from 'lucide-react';
import { isLiveMode } from '../services/gemini';
import { LANGUAGES } from '../utils/translationHelper';

export default function Header({ apiKey, onApiKeyChange, activities, onLoadDemo, onReset, language, onLanguageChange, currentUser, activeProject }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isDark, setIsDark] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark-theme-active');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-theme-active');
    }
  }, [isDark]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    onApiKeyChange(tempKey);
    setShowKeyModal(false);
  };

  const getOverallProgress = () => {
    const totalCheckpoints = activities.reduce((acc, curr) => acc + (curr.checklist?.length || 0), 0);
    if (totalCheckpoints === 0) {
      const total = activities.length;
      if (total === 0) return 0;
      const completed = activities.filter(a => a.status === 'Completed').length;
      return Math.round((completed / total) * 100);
    }
    const checkedCheckpoints = activities.reduce((acc, curr) => 
      acc + (curr.checklist?.filter(item => item.checked).length || 0), 0);
    return Math.round((checkedCheckpoints / totalCheckpoints) * 100);
  };

  return (
    <>
      <header className="header">
        <div className="header-title-container">
          <h1>{activeProject?.name || 'Nirmaan Sahayak'}</h1>
          <div className="header-meta">
            {activeProject?.plotDetails?.plotArea && (
              <span className="header-plot-info">
                📐 {activeProject.plotDetails.plotArea} sq.ft
              </span>
            )}
            <span className="header-progress-label">Progress:</span>
            <span className="header-progress-value">{getOverallProgress()}%</span>
            <div className="header-progress-bar">
              <div className="header-progress-fill" style={{ width: `${getOverallProgress()}%` }}></div>
            </div>
          </div>
        </div>

        <div className="header-actions">
          {/* AI Status — always visible */}
          <div className="api-config-card" style={{ cursor: 'pointer' }} onClick={() => setShowKeyModal(true)}>
            {apiKey ? (
              <>
                <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                <span className="header-action-label">AI Live</span>
              </>
            ) : (
              <>
                <ShieldAlert size={14} style={{ color: 'var(--warning)' }} />
                <span className="header-action-label">Simulator</span>
              </>
            )}
          </div>

          {/* Language — always visible */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="header-lang-select"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button className="btn btn-ghost header-icon-btn" onClick={() => setIsDark(!isDark)} title="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Desktop-only: Simulate & Reset */}
          <div className="header-desktop-actions">
            <button className="btn btn-secondary btn-sm" onClick={onLoadDemo} title="Load demo data">
              <Play size={14} />
              <span>Simulate</span>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset" style={{ color: 'var(--error)' }}>
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Mobile hamburger for overflow actions */}
          <button className="btn btn-ghost header-icon-btn header-mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {showMobileMenu && (
        <div className="header-mobile-dropdown">
          <button className="header-mobile-action" onClick={() => { onLoadDemo(); setShowMobileMenu(false); }}>
            <Play size={14} /> Simulate Issues
          </button>
          <button className="header-mobile-action" onClick={() => { onReset(); setShowMobileMenu(false); }} style={{ color: 'var(--error)' }}>
            <RefreshCw size={14} /> Reset Project
          </button>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <Key size={20} style={{ color: 'var(--primary)' }} />
                AI Engine Configuration
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowKeyModal(false)} style={{ fontSize: '16px', fontWeight: 'bold' }}>✕</button>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              We use advanced predictive analytics models for AI-powered construction scheduling, risk prediction, and custom checklist generation.
            </p>

            <form onSubmit={handleSaveKey}>
              <div className="form-group">
                <label className="form-label" htmlFor="apiKey">AI API Key</label>
                <input 
                  type="password" id="apiKey" className="form-input text-mono"
                  placeholder="Paste your AI Studio API key here..."
                  value={tempKey} onChange={(e) => setTempKey(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setTempKey(''); onApiKeyChange(''); setShowKeyModal(false); }}>Clear Key</button>
                <button type="submit" className="btn btn-primary">Save Configuration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
