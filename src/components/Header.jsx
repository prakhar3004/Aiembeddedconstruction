import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, RefreshCw, CloudRain, Sun, Moon, Menu } from 'lucide-react';
import { isLiveMode } from '../services/gemini';
import { LANGUAGES } from '../utils/translationHelper';

export default function Header({ activities, onLoadDemo, onReset, language, onLanguageChange, currentUser, activeProject }) {
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

  const getOverallProgress = () => {
    if (!activities || activities.length === 0) return 0;
    const completed = activities.filter(a => a.status === 'Completed').length;
    return Math.round((completed / activities.length) * 100);
  };

  const active = isLiveMode();

  return (
    <>
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo-wrapper">
            <span className="header-logo-emoji">🏗️</span>
          </div>
          <div>
            <h1 className="header-title">Nirmaan Sahayak</h1>
            <p className="header-subtitle">
              {activeProject ? activeProject.name : (language === 'hi' ? 'नया निर्माण प्रोजेक्ट' : 'New Construction Project')}
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="header-progress-section">
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>{language === 'hi' ? 'कुल निर्माण प्रगति' : 'Total Progress'}</span>
              <span>{getOverallProgress()}%</span>
            </div>
            <div className="header-progress-bar">
              <div className="header-progress-fill" style={{ width: `${getOverallProgress()}%` }}></div>
            </div>
          </div>
        </div>

        <div className="header-actions">
          {/* AI Status — always visible */}
          <div className="api-config-card" style={{ cursor: 'default' }}>
            {active ? (
              <>
                <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                <span className="header-action-label" style={{ color: 'var(--success)' }}>
                  {language === 'hi' ? 'एआई सक्रिय' : 'AI Active'}
                </span>
              </>
            ) : (
              <>
                <ShieldAlert size={14} style={{ color: 'var(--warning)' }} />
                <span className="header-action-label" style={{ color: 'var(--warning)' }}>
                  {language === 'hi' ? 'सिम्युलेटर' : 'Simulator'}
                </span>
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

          {/* Desktop-only: Weather Risk & Reset */}
          <div className="header-desktop-actions">
            <button className="btn btn-secondary btn-sm" onClick={onLoadDemo} title={language === 'hi' ? 'मौसम जोखिम विश्लेषण' : 'Analyze Weather Risk'}>
              <CloudRain size={14} />
              <span>{language === 'hi' ? 'मौसम जोखिम' : 'Weather Risk'}</span>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset" style={{ color: 'var(--error)' }}>
              <RefreshCw size={14} />
              <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
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
            <CloudRain size={14} /> {language === 'hi' ? 'मौसम जोखिम विश्लेषण' : 'Analyze Weather Risk'}
          </button>
          <button className="header-mobile-action" onClick={() => { onReset(); setShowMobileMenu(false); }} style={{ color: 'var(--error)' }}>
            <RefreshCw size={14} /> {language === 'hi' ? 'प्रोजेक्ट रीसेट करें' : 'Reset Project'}
          </button>
        </div>
      )}
    </>
  );
}
