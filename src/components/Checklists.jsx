import React, { useState } from 'react';
import { ClipboardCheck, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UI_TRANSLATIONS, translateContent } from '../utils/translationHelper';

// Professional role analyzer for quality checklists
const getCheckpointBadge = (text) => {
  const t = text.toLowerCase();
  if (
    t.includes('layout') || t.includes('dimension') || t.includes('boundary') || 
    t.includes('drawing') || t.includes('setback') || t.includes('blueprint') || 
    t.includes('permit') || t.includes('rainwater') || t.includes('map') || 
    t.includes('municipal') || t.includes('clearance') || t.includes('set-back')
  ) {
    return {
      en: 'Architect Check',
      hi: 'वास्तुकार (Architect) जाँच',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.08)'
    };
  }
  if (
    t.includes('furniture') || t.includes('socket') || t.includes('light') || 
    t.includes('switch') || t.includes('interior') || t.includes('plywood') || 
    t.includes('tile') || t.includes('modular') || t.includes('paint') || 
    t.includes('putty') || t.includes('woodwork') || t.includes('ceiling') || 
    t.includes('door') || t.includes('window') || t.includes('aesthetic') || 
    t.includes('finish') || t.includes('fixture')
  ) {
    return {
      en: 'Interior Design Check',
      hi: 'इंटीरियर डिजाइनर (Interior) जाँच',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.08)'
    };
  }
  return {
    en: 'Civil Engineer Check',
    hi: 'सिविल इंजीनियर (Civil) जाँच',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.08)'
  };
};

export default function Checklists({ 
  activities, 
  selectedActivityId, 
  setSelectedActivityId, 
  onToggleItem,
  language = 'en'
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'default', 'addon'
  const [activeView, setActiveView] = useState('list'); // 'list' or 'panel'

  const filteredActivities = activities.filter(act => {
    if (taskFilter === 'default') return !act.isAddon;
    if (taskFilter === 'addon') return act.isAddon;
    return true;
  });

  const selectedActivity = filteredActivities.find(a => a.id === selectedActivityId) || filteredActivities[0];

  const getCompletedCount = (act) => {
    return act ? act.checklist.filter(item => item.checked).length : 0;
  };

  return (
    <div className={`checklists-container ${activeView === 'list' ? 'show-sidebar' : 'show-panel'}`}>
      
      {/* Left panel: List of Milestone Checklists */}
      <div className="card checklists-sidebar" style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ fontSize: '11px', fontWeight: 'bold' }}>{t.taskFilter}</label>
          <select 
            className="form-select" 
            style={{ padding: '4px 8px', fontSize: '12px' }}
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
          >
            <option value="all">{t.allTasks}</option>
            <option value="default">{t.defaultTasks}</option>
            <option value="addon">{t.addonTasks}</option>
          </select>
        </div>

        <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '8px', padding: '0 8px' }}>
          {language === 'hi' ? 'गुणवत्ता चरण' : 'Quality Phases'}
        </h3>
        
        {filteredActivities.map(act => {
          const completed = getCompletedCount(act);
          const total = act.checklist.length;
          const isSelected = selectedActivity && selectedActivity.id === act.id;
          
          return (
            <div 
              key={act.id} 
              onClick={() => {
                setSelectedActivityId(act.id);
                setActiveView('panel');
              }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: isSelected ? 'var(--primary-glow)' : 'transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '13px', color: isSelected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: '4px' }}>
                {translateContent(act.name, language)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{language === 'hi' ? 'गुणवत्ता जांच' : 'QA checks'}</span>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: completed === total && total > 0 ? 'var(--success)' : 'inherit'
                }}>
                  {completed}/{total} {language === 'hi' ? 'सत्यापित' : t.verified}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right panel: Active checklist list */}
      <div className="card checklists-panel" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Back button visible on mobile */}
        <button 
          className="btn-back-mobile"
          onClick={() => setActiveView('list')}
          style={{
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '12px',
            alignSelf: 'flex-start'
          }}
        >
          ← {language === 'hi' ? 'गतिविधियों पर वापस जाएं' : 'Back to Activities'}
        </button>

        {selectedActivity ? (
          <>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0, fontWeight: 'bold' }}>
                  <ClipboardCheck size={22} style={{ color: 'var(--primary)' }} />
                  {translateContent(selectedActivity.name, language)} - {language === 'hi' ? 'गुणवत्ता चेकलिस्ट' : 'Quality Checklist'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: '4px 0 0' }}>
                  {language === 'hi' 
                    ? 'सुनिश्चित करें कि काम पूरा करने से पहले साइट पर प्रत्येक जांच का निम्नलिखित पेशेवर मानकों के अनुसार परीक्षण किया गया है।' 
                    : 'Ensure every on-site check follows the standard engineering rules below before marking them complete.'}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                {getCompletedCount(selectedActivity) === selectedActivity.checklist.length ? (
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={16} /> {t.stageVerified}
                  </span>
                ) : (
                  <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={16} /> {t.pendingVerification}
                  </span>
                )}
              </div>
            </div>

            {/* Checkpoints list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedActivity.checklist && selectedActivity.checklist.length > 0 ? (
                selectedActivity.checklist.map(item => {
                  const badge = getCheckpointBadge(item.originalText || item.text);
                  return (
                    <div 
                      key={item.id} 
                      className={`checklist-item ${item.checked ? 'checked' : ''}`}
                      onClick={() => onToggleItem(selectedActivity.id, item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`checklist-checkbox ${item.checked ? 'checked' : ''}`}>
                        {item.checked && <Check size={12} strokeWidth={3} />}
                      </div>
                      
                      <div className="checklist-details" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            color: badge.color, 
                            backgroundColor: badge.bgColor,
                            textTransform: 'uppercase' 
                          }}>
                            {language === 'hi' ? badge.hi : badge.en}
                          </span>
                          <span className="checklist-title" style={{ fontSize: '13px', fontWeight: '500' }}>
                            {translateContent(item.text, language)}
                          </span>
                        </div>
                        {item.rule && (
                          <div className="checklist-rule" onClick={(e) => e.stopPropagation()} style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-muted)' }}>
                            ⚖️ <strong>{language === 'hi' ? 'मानक (Standard):' : 'Standard:'}</strong> {translateContent(item.rule, language)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  {language === 'hi' 
                    ? 'इस गतिविधि के लिए कोई गुणवत्ता जांच आइटम सेट नहीं हैं। चेकपॉइंट भरने के लिए डैशबोर्ड में कस्टम एआई चेकलिस्ट बनाएं।' 
                    : 'No quality check items set for this activity. Generate custom AI checklists in the dashboard to populate checkpoints.'}
                </div>
              )}
            </div>
            
            {/* Quality Standard Notice */}
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(120, 120, 120, 0.02)', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>📋</span>
              <div style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                <strong>{t.curingNotice}:</strong> {t.curingTip}
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No activities match your current filter. Switch filter to "All Tasks" to view available phases.
          </div>
        )}
      </div>

    </div>
  );
}
