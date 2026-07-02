import React, { useState, useEffect } from 'react';
import { CalendarRange, Edit3, X, Save, AlertCircle, FileText, BarChart3, HelpCircle, Layers3, ChevronDown, ChevronRight } from 'lucide-react';
import { UI_TRANSLATIONS, translateContent } from '../utils/translationHelper';

export default function JourneyTimeline({ 
  activities, 
  onUpdateActivity,
  selectedActivityId,
  setSelectedActivityId,
  language = 'en'
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'default', 'addon'
  const [scaleMode, setScaleMode] = useState('week'); // 'day', 'week', 'month'
  const [view3D, setView3D] = useState(true);
  const [shiftDays, setShiftDays] = useState(0); // Interactive slider shift
  const [expandedStages, setExpandedStages] = useState({});

  // Auto-expand stages when activities list changes
  useEffect(() => {
    if (activities.length > 0) {
      const stages = {};
      activities.forEach(act => {
        stages[act.stage] = true;
      });
      setExpandedStages(stages);
    }
  }, [activities.length]);

  const selectedActivity = activities.find(a => a.id === selectedActivityId);
  
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editActualStartDate, setEditActualStartDate] = useState('');
  const [editActualEndDate, setEditActualEndDate] = useState('');

  // When a row is clicked, open panel and populate form
  const handleSelectActivity = (act) => {
    setSelectedActivityId(act.id);
    setEditNotes(act.notes || '');
    setEditStatus(act.status || 'Pending');
    setEditStartDate(act.startDate || '');
    setEditEndDate(act.endDate || '');
    setEditActualStartDate(act.actualStartDate || '');
    setEditActualEndDate(act.actualEndDate || '');
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    onUpdateActivity(selectedActivityId, {
      notes: editNotes,
      status: editStatus,
      startDate: editStartDate,
      endDate: editEndDate,
      actualStartDate: editActualStartDate || null,
      actualEndDate: editActualEndDate || null
    });
    alert(language === 'hi' ? 'कार्य सफलतापूर्वक अपडेट किया गया! परिवर्तनों को देखने के लिए डैशबोर्ड पर "जोखिम विश्लेषण" चलाएं।' : 'Activity updated! Run AI Risk prediction on Dashboard to update project analysis.');
  };

  // Shift dates helper
  const shiftDateString = (dateStr, days) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Filter activities based on selection
  const filteredActivities = activities.filter(act => {
    if (taskFilter === 'default') return !act.isAddon;
    if (taskFilter === 'addon') return act.isAddon;
    return true;
  });

  // Calculate coordinates for Gantt Chart bars
  const getMinMaxDates = () => {
    if (filteredActivities.length === 0) return { min: new Date(), max: new Date() };
    const dates = filteredActivities.flatMap(a => [
      new Date(a.startDate), 
      new Date(a.endDate),
      a.actualStartDate ? new Date(a.actualStartDate) : null,
      a.actualEndDate ? new Date(a.actualEndDate) : null
    ].filter(Boolean));
    
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    // Add buffer
    min.setDate(min.getDate() - 3);
    max.setDate(max.getDate() + 7);
    return { min, max };
  };

  const { min: timelineMinDate, max: timelineMaxDate } = getMinMaxDates();
  const totalDays = Math.max(1, Math.round((timelineMaxDate - timelineMinDate) / (1000 * 60 * 60 * 24)));

  // Day width mapping depending on scaleMode
  const getDayWidth = () => {
    if (scaleMode === 'day') return 24;
    if (scaleMode === 'month') return 3;
    return 8; // week (default)
  };

  const dayWidth = getDayWidth();
  const timelineWidthPx = totalDays * dayWidth;

  const getLeftOffset = (dateStr) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const diffTime = Math.max(0, date - timelineMinDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.round(diffDays * dayWidth);
  };

  const getWidth = (startStr, endStr) => {
    if (!startStr || !endStr) return 40;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.max(0, end - start);
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    return Math.round(diffDays * dayWidth);
  };

  const getStageColor = (stage) => {
    const s = stage.toLowerCase();
    if (s.includes('permit') || s.includes('plan')) return 'var(--primary)'; // Safety Orange
    if (s.includes('site') || s.includes('excavation') || s.includes('substructure')) return '#10b981'; // Green
    if (s.includes('structure') || s.includes('wall') || s.includes('masonry')) return '#3b82f6'; // Blue
    if (s.includes('plumb') || s.includes('wiring') || s.includes('elect')) return '#a855f7'; // Purple
    return '#f43f5e'; // Rose
  };

  const getStatusTranslation = (status) => {
    if (language === 'hi') {
      if (status === 'Completed') return 'पूरा हुआ';
      if (status === 'In Progress') return 'प्रगति पर';
      if (status === 'Delayed') return 'अवरुद्ध/देरी';
      return 'लंबित';
    }
    return status;
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') return <span className="badge badge-completed">{getStatusTranslation('Completed')}</span>;
    if (status === 'In Progress') return <span className="badge badge-progress">{getStatusTranslation('In Progress')}</span>;
    if (status === 'Delayed') return <span className="badge badge-delayed">{getStatusTranslation('Delayed')}</span>;
    return <span className="badge badge-pending">{getStatusTranslation('Pending')}</span>;
  };

  // Generate grid columns (e.g. month labels or week markings)
  const renderTimeGridHeader = () => {
    const columns = [];
    const currentDate = new Date(timelineMinDate);
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const month = currentDate.getMonth();
      const isStartOfMonth = month !== lastMonth || i === 0;

      if (isStartOfMonth || scaleMode === 'month') {
        const monthLabel = currentDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', year: '2-digit' });
        columns.push(
          <div 
            key={i} 
            className="timeline-grid-header-label"
            style={{ 
              position: 'absolute', 
              left: `${i * dayWidth}px`, 
              width: `${dayWidth * (scaleMode === 'month' ? 30 : 7)}px`,
              fontSize: '11px',
              fontWeight: 'bold',
              color: 'var(--text-muted)',
              borderLeft: '1px solid rgba(120, 120, 120, 0.15)',
              paddingLeft: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            {monthLabel}
          </div>
        );
        lastMonth = month;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return columns;
  };

  return (
    <div className="split-layout">
      {/* Left side: Timeline Charts Visualizer */}
      <div className={`split-left ${selectedActivity ? 'shrunk' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Interactive Controls Panel */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0, fontWeight: 'bold' }}>
              <CalendarRange size={20} style={{ color: 'var(--primary)' }} />
              {language === 'hi' ? '3D निर्माण समय-सीमा चार्ट' : '3D Journey Timeline Gantt'}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Task Type Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.taskFilter}:</span>
                <select 
                  className="form-select" 
                  style={{ padding: '4px 8px', fontSize: '11px', height: '28px', minWidth: '110px' }}
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                >
                  <option value="all">{t.allTasks}</option>
                  <option value="default">{t.defaultTasks}</option>
                  <option value="addon">{t.addonTasks}</option>
                </select>
              </div>

              {/* Grid Scale Mode */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{language === 'hi' ? 'चार्ट पैमाना:' : 'Scale:'}</span>
                <div className="btn-group" style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                  <button 
                    className={`btn btn-sm ${scaleMode === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '3px 8px', fontSize: '10px', borderRadius: 0 }}
                    onClick={() => setScaleMode('day')}
                  >
                    {language === 'hi' ? 'दिन' : 'Day'}
                  </button>
                  <button 
                    className={`btn btn-sm ${scaleMode === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '3px 8px', fontSize: '10px', borderRadius: 0 }}
                    onClick={() => setScaleMode('week')}
                  >
                    {language === 'hi' ? 'सप्ताह' : 'Week'}
                  </button>
                  <button 
                    className={`btn btn-sm ${scaleMode === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '3px 8px', fontSize: '10px', borderRadius: 0 }}
                    onClick={() => setScaleMode('month')}
                  >
                    {language === 'hi' ? 'माह' : 'Month'}
                  </button>
                </div>
              </div>

              {/* 3D Mode Switcher */}
              <button 
                className={`btn btn-sm ${view3D ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px', height: '28px' }}
                onClick={() => setView3D(!view3D)}
              >
                <Layers3 size={13} />
                <span>{view3D ? '3D View' : '2D View'}</span>
              </button>

              {/* Expand / Collapse All */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', height: '28px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    const stages = {};
                    activities.forEach(act => { stages[act.stage] = true; });
                    setExpandedStages(stages);
                  }}
                >
                  {language === 'hi' ? 'सभी खोलें' : 'Expand All'}
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', height: '28px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    const stages = {};
                    activities.forEach(act => { stages[act.stage] = false; });
                    setExpandedStages(stages);
                  }}
                >
                  {language === 'hi' ? 'सभी बंद करें' : 'Collapse All'}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Date-Shift Slider input */}
          <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
              <span>{language === 'hi' ? '🗓️ निर्माण प्रारंभ तिथि शिफ्ट करें (Interactive Offset):' : '🗓️ Shift Construction Start Date (Interactive):'}</span>
              <span style={{ color: 'var(--primary)' }}>
                {shiftDays === 0 ? (language === 'hi' ? 'मूल तिथि (0 दिन)' : 'Original') : `${shiftDays > 0 ? '+' : ''}${shiftDays} ${language === 'hi' ? 'दिन' : 'days'}`}
              </span>
            </div>
            <input 
              type="range" 
              min="-15" 
              max="60" 
              className="form-range" 
              style={{ width: '100%', accentColor: 'var(--primary)' }}
              value={shiftDays}
              onChange={(e) => setShiftDays(parseInt(e.target.value))}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {language === 'hi' 
                ? '💡 इस स्लाइडर को खिसकाकर देखें कि प्रोजेक्ट शुरू होने में देरी होने पर आपके पूरे 3D टाइमलाइन चार्ट्स पर क्या प्रभाव पड़ेगा।' 
                : '💡 Slide this input control to see the cascade delay effect on all subsequent structural casting tasks in real-time.'}
            </span>
          </div>
        </div>

        {/* 3D Isometric / Flat Gantt Board */}
        <div 
          className="card" 
          style={{ 
            padding: '20px', 
            overflowX: 'auto', 
            scrollbarWidth: 'thin',
            position: 'relative',
            background: 'var(--card-bg)'
          }}
        >
          {/* Isometric Perspective Tilt Wrapping */}
          <div 
            style={{ 
              minWidth: `${timelineWidthPx + 240}px`,
              transition: 'transform 0.5s ease',
              transform: view3D ? 'perspective(800px) rotateX(15deg) rotateY(-5deg)' : 'none',
              transformStyle: 'preserve-3d',
              padding: '10px 0 40px'
            }}
          >
            {/* Grid background markers */}
            <div 
              style={{ 
                position: 'relative', 
                height: '32px', 
                borderBottom: '2px solid var(--border-color)', 
                marginBottom: '16px' 
              }}
            >
              <div style={{ position: 'absolute', left: 0, width: '220px', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'गतिविधियां (Activities)' : 'Activities'}
              </div>
              <div style={{ position: 'relative', marginLeft: '240px', height: '100%' }}>
                {renderTimeGridHeader()}
              </div>
            </div>

            {/* List of Tasks represented as 3D Cylinders grouped by Collapsible Stage */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
              {(() => {
                const uniqueStages = [];
                filteredActivities.forEach(act => {
                  if (!uniqueStages.includes(act.stage)) {
                    uniqueStages.push(act.stage);
                  }
                });

                return uniqueStages.map(stage => {
                  const stageActs = filteredActivities.filter(a => a.stage === stage);
                  if (stageActs.length === 0) return null;

                  const startDates = stageActs.map(a => new Date(a.startDate));
                  const endDates = stageActs.map(a => new Date(a.endDate));
                  const minStart = new Date(Math.min(...startDates));
                  const maxEnd = new Date(Math.max(...endDates));
                  
                  const shiftedMinStart = shiftDateString(minStart.toISOString().split('T')[0], shiftDays);
                  const shiftedMaxEnd = shiftDateString(maxEnd.toISOString().split('T')[0], shiftDays);

                  const left = getLeftOffset(shiftedMinStart);
                  const width = getWidth(shiftedMinStart, shiftedMaxEnd);
                  const stageColor = getStageColor(stage);
                  const completedCount = stageActs.filter(a => a.status === 'Completed').length;
                  const totalCount = stageActs.length;
                  const isExpanded = !!expandedStages[stage];

                  return (
                    <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid rgba(120, 120, 120, 0.05)', paddingBottom: '8px' }}>
                      
                      {/* Collapsible Stage Header Row */}
                      <div 
                        onClick={() => setExpandedStages(prev => ({ ...prev, [stage]: !prev[stage] }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '38px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          background: 'rgba(120, 120, 120, 0.04)',
                          padding: '0 8px',
                          userSelect: 'none'
                        }}
                      >
                        {/* Title & Stats */}
                        <div style={{ width: '220px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                          {isExpanded ? <ChevronDown size={14} style={{ color: 'var(--primary)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                              {translateContent(stage, language)}
                            </span>
                            <span style={{ fontSize: '9px', color: 'var(--primary)', fontWeight: 'bold' }}>
                              {completedCount}/{totalCount} {language === 'hi' ? 'पूर्ण' : 'Completed'}
                            </span>
                          </div>
                        </div>

                        {/* Stage Summary Bar */}
                        <div style={{ flex: 1, position: 'relative', height: '100%', marginLeft: '20px' }}>
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: `${left}px`, 
                              width: `${Math.max(40, width)}px`, 
                              height: '14px', 
                              top: '12px',
                              background: `repeating-linear-gradient(45deg, ${stageColor}, ${stageColor} 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 20px)`,
                              borderRadius: '3px',
                              opacity: 0.7,
                              boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Child Activities inside this Stage */}
                      {isExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px' }}>
                          {stageActs.map(act => {
                            const shiftedStart = shiftDateString(act.startDate, shiftDays);
                            const shiftedEnd = shiftDateString(act.endDate, shiftDays);

                            const actLeft = getLeftOffset(shiftedStart);
                            const actWidth = getWidth(shiftedStart, shiftedEnd);
                            const isSelected = selectedActivityId === act.id;

                            return (
                              <div 
                                key={act.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectActivity(act);
                                }}
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  height: '34px', 
                                  position: 'relative',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  backgroundColor: isSelected ? 'rgba(249, 115, 22, 0.05)' : 'transparent',
                                  transition: 'background 0.2s',
                                  transformStyle: 'preserve-3d'
                                }}
                              >
                                {/* Task Title */}
                                <div 
                                  style={{ 
                                    width: '204px', 
                                    paddingRight: '12px', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                    transform: view3D ? 'translateZ(10px)' : 'none'
                                  }}
                                >
                                  <span 
                                    style={{ 
                                      fontSize: '11px', 
                                      fontWeight: isSelected ? '700' : '500', 
                                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {translateContent(act.name, language)}
                                  </span>
                                </div>

                                {/* Bar area */}
                                <div style={{ flex: 1, position: 'relative', height: '100%', marginLeft: '20px' }}>
                                  
                                  {/* Guideline */}
                                  <div 
                                    style={{ 
                                      position: 'absolute', 
                                      top: '50%', 
                                      left: 0, 
                                      right: 0, 
                                      height: '1px', 
                                      borderTop: '1px dashed rgba(120,120,120,0.06)',
                                      zIndex: 0 
                                    }}
                                  />

                                  {/* Cylinder/Flat Bar */}
                                  <div 
                                    style={{ 
                                      position: 'absolute', 
                                      left: `${actLeft}px`, 
                                      width: `${Math.max(25, actWidth)}px`, 
                                      height: '18px', 
                                      top: '8px',
                                      transition: 'all 0.3s ease',
                                      transformStyle: 'preserve-3d',
                                      transform: view3D && isSelected ? 'translateZ(20px) scaleY(1.05)' : view3D ? 'translateZ(8px)' : 'none',
                                      zIndex: 1
                                    }}
                                    className="timeline-3d-bar-parent"
                                  >
                                    {view3D ? (
                                      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
                                        {/* Top */}
                                        <div 
                                          style={{ 
                                            position: 'absolute', 
                                            top: '-4px', 
                                            left: 0, 
                                            width: '100%', 
                                            height: '4px', 
                                            background: `linear-gradient(to right, ${stageColor}, rgba(255,255,255,0.1))`, 
                                            transform: 'rotateX(90deg)', 
                                            transformOrigin: 'bottom',
                                            opacity: 0.9
                                          }} 
                                        />
                                        {/* Main */}
                                        <div 
                                          style={{ 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '100%', 
                                            background: `linear-gradient(135deg, ${stageColor} 0%, rgba(${act.status === 'Completed' ? '16, 185, 129' : act.status === 'Delayed' ? '239, 68, 68' : '249, 115, 22'}, 0.8) 100%)`, 
                                            borderRadius: '3px',
                                            boxShadow: isSelected ? '0 6px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingLeft: '6px',
                                            color: '#ffffff',
                                            fontSize: '8px',
                                            fontWeight: '700',
                                            textShadow: '0 1px 1px rgba(0,0,0,0.5)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden'
                                          }}
                                        >
                                          {act.status === 'Completed' ? '✓ ' : ''}{Math.max(1, Math.round(actWidth / dayWidth))}d ({getStatusTranslation(act.status)})
                                        </div>
                                        {/* Right Cap */}
                                        <div 
                                          style={{ 
                                            position: 'absolute', 
                                            right: '-4px', 
                                            top: 0, 
                                            width: '4px', 
                                            height: '100%', 
                                            background: 'rgba(0,0,0,0.2)', 
                                            transform: 'rotateY(90deg)', 
                                            transformOrigin: 'left' 
                                          }} 
                                        />
                                      </div>
                                    ) : (
                                      <div 
                                        style={{ 
                                          width: '100%', 
                                          height: '100%', 
                                          backgroundColor: stageColor, 
                                          borderRadius: '3px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          paddingLeft: '6px',
                                          color: '#ffffff',
                                          fontSize: '8px',
                                          fontWeight: '700',
                                          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)'
                                        }}
                                      >
                                        {act.status === 'Completed' ? '✓ ' : ''}{Math.max(1, Math.round(actWidth / dayWidth))} days
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="alert alert-info" style={{ margin: 0 }}>
          <AlertCircle size={18} className="alert-icon" />
          <div style={{ fontSize: '12px' }}>
            <strong>{language === 'hi' ? 'अनुक्रमिक और समानांतर कार्य विश्लेषण:' : 'Sequential and Parallel Tasks:'}</strong>{' '}
            {language === 'hi' 
              ? 'चार्ट में नीली पट्टियाँ स्ट्रक्चर कार्यों को दर्शाती हैं जो अनुक्रमिक (Sequential) चलती हैं, जबकि बिजली, प्लंबिंग और फिनिशिंग जैसे कार्य समानांतर (Parallel) चलाए जा सकते हैं।' 
              : 'Blue cylinders represent structural phases running sequentially. Electrical, plumbing, and wall plastering work can run parallel to optimize total build time.'}
          </div>
        </div>
      </div>

      {/* Right side: Detailed Activity Panel */}
      {selectedActivity && (
        <div className="split-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} />
              {t.milestoneManager}
            </h3>
            <button 
              className="btn btn-ghost" 
              onClick={() => setSelectedActivityId(null)}
              style={{ padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(120,120,120,0.03)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
              {translateContent(selectedActivity.name, language)}
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {translateContent(selectedActivity.stage, language)}
            </span>
          </div>

          <form onSubmit={handleSaveChanges}>
            <div className="form-group">
              <label className="form-label" htmlFor="actStatus">{t.activityStatus}</label>
              <select 
                id="actStatus" 
                className="form-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="Pending">{t.pending}</option>
                <option value="In Progress">{t.inProgress}</option>
                <option value="Completed">{t.completed}</option>
                <option value="Delayed">{t.delayed}</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="planStart">{t.plannedStart}</label>
                <input 
                  type="date" 
                  id="planStart" 
                  className="form-input text-mono"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="planEnd">{t.plannedEnd}</label>
                <input 
                  type="date" 
                  id="planEnd" 
                  className="form-input text-mono"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="actualStart">{t.actualStart}</label>
                <input 
                  type="date" 
                  id="actualStart" 
                  className="form-input text-mono"
                  value={editActualStartDate}
                  onChange={(e) => setEditActualStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="actualEnd">{t.actualEnd}</label>
                <input 
                  type="date" 
                  id="actualEnd" 
                  className="form-input text-mono"
                  value={editActualEndDate}
                  onChange={(e) => setEditActualEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="actNotes">{t.activeLogs}</label>
              <textarea 
                id="actNotes" 
                className="form-input" 
                rows="3" 
                placeholder={t.notesPlaceholder}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <Save size={16} style={{ marginRight: '6px' }} />
              {t.save}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
