import React, { useState } from 'react';
import { LayoutDashboard, Calendar, ClipboardCheck, Bot, HardHat, Plus, Trash2, LogOut, ChevronDown, User, FolderOpen, Truck } from 'lucide-react';
import { UI_TRANSLATIONS } from '../utils/translationHelper';

export default function Sidebar({
  activeTab, setActiveTab, language = 'en',
  projects = [], activeProjectId, onSwitchProject, onAddProject, onDeleteProject,
  currentUser, onLogout
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [showProjects, setShowProjects] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'timeline', label: t.timeline, icon: Calendar },
    { id: 'checklists', label: t.checklists, icon: ClipboardCheck },
    { id: 'procurement', label: t.procurement || 'Procurement', icon: Truck },
    { id: 'advisor', label: t.advisor, icon: Bot },
  ];

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <aside className="sidebar">
      <div>
        {/* Brand */}
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <img src="/app_icon.png" alt="Nirmaan Sahayak Logo" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>Nirmaan Sahayak</span>
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600 }}>AI Journey Planner</span>
          </div>
        </div>

        {/* User Card */}
        {currentUser && (
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px',
              background: 'rgba(232, 104, 58, 0.06)', border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brick-red), #f08050)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '13px', fontWeight: 800
              }}>
                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.city || currentUser.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Switcher */}
        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
          <div
            onClick={() => setShowProjects(!showProjects)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
              background: 'var(--card-bg)', border: '1px solid var(--border-color)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              <FolderOpen size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeProject ? activeProject.name : (language === 'hi' ? 'परियोजना चुनें' : 'Select Project')}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showProjects ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </div>

          {showProjects && (
            <div style={{
              marginTop: '6px', borderRadius: '8px', overflow: 'hidden',
              border: '1px solid var(--border-color)', background: 'var(--card-bg)'
            }}>
              {projects.map(proj => (
                <div
                  key={proj.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', cursor: 'pointer',
                    background: proj.id === activeProjectId ? 'var(--primary-glow)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div
                    onClick={() => { onSwitchProject(proj.id); setShowProjects(false); }}
                    style={{ flex: 1, fontSize: '12px', fontWeight: proj.id === activeProjectId ? 700 : 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {proj.name}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(proj.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                    title={language === 'hi' ? 'परियोजना हटाएं' : 'Delete Project'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => { onAddProject(); setShowProjects(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
                  padding: '10px 12px', fontSize: '12px', fontWeight: 700,
                  color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer'
                }}
              >
                <Plus size={14} /> {language === 'hi' ? 'नया प्लॉट जोड़ें' : 'Add New Plot'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ul className="sidebar-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '10px 14px', fontSize: '13px', fontWeight: 600,
            color: 'var(--error)', background: 'rgba(239, 83, 80, 0.06)',
            border: '1px solid rgba(239, 83, 80, 0.15)', borderRadius: '8px',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={16} />
          {language === 'hi' ? 'लॉगआउट (Logout)' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
