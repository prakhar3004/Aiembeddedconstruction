import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import JourneyTimeline from './components/JourneyTimeline';
import Checklists from './components/Checklists';
import AIAdvisor from './components/AIAdvisor';
import AuthPage from './components/AuthPage';
import PlotOnboarding from './components/PlotOnboarding';
import { getApiKey, saveApiKey, predictProjectRisk, generateCustomChecklists, isLiveMode, translateCheckpointsWithGemini, generateAIPredictiveSchedule, checkServerLiveMode, analyzeWeatherRisk } from './services/gemini';
import { generateProjectTimeline } from './utils/activityGenerator';
import { UI_TRANSLATIONS, translateTextFree, translateBatchFree } from './utils/translationHelper';
import { apiService } from './services/api';
import { LayoutDashboard, Calendar, ClipboardCheck, Bot } from 'lucide-react';

// ─── Helper: date formatting ───
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function App() {
  // ─── AUTH STATE ───
  const [currentUser, setCurrentUser] = useState(null);

  // ─── MULTI-PROJECT STATE ───
  const [projects, setProjects] = useState([]);

  const [activeProjectId, setActiveProjectId] = useState(null);

  const [showOnboarding, setShowOnboarding] = useState(false);

  // Derive active project
  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  // ─── APP STATE ───
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nirmaan_language') || 'en';
  });

  const [activities, setActivities] = useState([]);

  const [projectParams, setProjectParams] = useState({ soilType: 'Hard Murrum', season: 'Summer', stories: 'G+1 Standard', budget: 'Standard' });

  const [apiKey, setApiKeyState] = useState(getApiKey());

  const [riskAssessment, setRiskAssessment] = useState({ overallRisk: 'Low', estimatedDelayDays: 0, summary: '', criticalPathRisks: [], recommendations: [] });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [aiQuery, setAiQuery] = useState('');

  // ─── TOAST NOTIFICATION STATE ───
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // ─── STARTUP: check token to restore session ───
  useEffect(() => {
    const checkAuth = async () => {
      // Check if server has API Key configured
      checkServerLiveMode();
      
      const token = localStorage.getItem('nirmaan_jwt_token');
      if (token) {
        try {
          const data = await apiService.me();
          setCurrentUser(data.user);
        } catch (err) {
          console.error('Session restore failed:', err);
          apiService.logout();
          setCurrentUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  // ─── SYNC: when user logs in, reload their projects from backend ───
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) {
        setProjects([]);
        setActiveProjectId(null);
        return;
      }
      try {
        const data = await apiService.getProjects();
        setProjects(data);
        if (data.length > 0) {
          const savedActive = localStorage.getItem(`nirmaan_active_project_${currentUser.id}`);
          const exists = data.some(p => p.id === savedActive);
          setActiveProjectId(exists ? savedActive : data[0].id);
        } else {
          setActiveProjectId(null);
        }
      } catch (err) {
        console.error('Failed to fetch projects from backend:', err);
      }
    };
    fetchProjects();
  }, [currentUser]);

  // ─── SYNC: when activeProjectId changes, load project activities from database ───
  useEffect(() => {
    const loadProjectDetails = async () => {
      if (!activeProjectId || !currentUser) {
        setActivities([]);
        setProjectParams({ soilType: 'Hard Murrum', season: 'Summer', stories: 'G+1 Standard', budget: 'Standard' });
        setRiskAssessment({ overallRisk: 'Low', estimatedDelayDays: 0, summary: '', criticalPathRisks: [], recommendations: [] });
        setSelectedActivityId(null);
        return;
      }

      const proj = projects.find(p => p.id === activeProjectId);
      if (proj) {
        setProjectParams({
          buildingType: proj.building_type,
          soilType: proj.soil_type,
          season: proj.season,
          stories: proj.stories,
          budget: proj.budget
        });
        setRiskAssessment({
          overallRisk: proj.overall_risk,
          estimatedDelayDays: proj.estimated_delay_days,
          summary: proj.risk_summary,
          criticalPathRisks: [],
          recommendations: []
        });
      }

      try {
        const activeActs = await apiService.getActivities(activeProjectId);
        setActivities(activeActs);
        if (activeActs.length > 0) {
          setSelectedActivityId(activeActs[0].id);
        }
      } catch (err) {
        console.error('Failed to load project activities:', err);
      }
    };
    loadProjectDetails();
  }, [activeProjectId, currentUser, projects.length]);

  useEffect(() => {
    if (!currentUser || !activeProjectId) return;
    localStorage.setItem(`nirmaan_active_project_${currentUser.id}`, activeProjectId);
  }, [activeProjectId, currentUser]);

  useEffect(() => {
    localStorage.setItem('nirmaan_language', language);
  }, [language]);

  useEffect(() => {
    const viewport = document.querySelector('.content-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  // ─── Dynamic Project-Wide Translation ───
  useEffect(() => {
    const translateProject = async () => {
      if (activities.length === 0) return;

      // 1. If English, restore original values
      if (language === 'en') {
        const needsRestore = activities.some(a => a.name !== (a.originalName || a.name));
        if (needsRestore) {
          setActivities(prev => prev.map(a => ({
            ...a,
            name: a.originalName || a.name,
            checklist: a.checklist.map(item => ({
              ...item,
              text: item.originalText || item.text,
              rule: item.originalRule || item.rule
            })),
            translatedLang: 'en'
          })));
        }
        return;
      }

      // 2. If all already translated, do nothing
      const alreadyTranslated = activities.every(a => a.translatedLang === language);
      if (alreadyTranslated) return;

      // Ensure all activities have original backups
      const preppedActivities = activities.map(a => ({
        ...a,
        originalName: a.originalName || a.name,
        checklist: a.checklist.map(item => ({
          ...item,
          originalText: item.originalText || item.text,
          originalRule: item.originalRule || item.rule
        }))
      }));

      // Find selected activity to prioritize translating it first
      const activeIdx = preppedActivities.findIndex(a => a.id === selectedActivityId);
      const order = [];
      if (activeIdx !== -1) {
        order.push(activeIdx);
      }
      preppedActivities.forEach((_, idx) => {
        if (idx !== activeIdx) order.push(idx);
      });

      // Translate sequentially in the order prioritizing active view
      const updated = [...preppedActivities];
      for (const idx of order) {
        const act = updated[idx];
        if (act.translatedLang === language) continue;

        try {
          // Translate activity name
          const translatedName = await translateTextFree(act.originalName, language);
          
          // Translate checklist items
          const texts = act.checklist.map(item => item.originalText);
          const rules = act.checklist.map(item => item.originalRule || '');

          const transTexts = await translateBatchFree(texts, language);
          const transRules = await translateBatchFree(rules, language);

          act.name = translatedName;
          act.checklist = act.checklist.map((item, cIdx) => ({
            ...item,
            text: transTexts[cIdx] || item.text,
            rule: transRules[cIdx] || item.rule
          }));
          act.translatedLang = language;

          // Update state incrementally so user sees progress in real-time!
          setActivities(prev => prev.map(a => a.id === act.id ? { ...act } : a));
        } catch (err) {
          console.error(`Failed to translate activity ${act.id}:`, err);
        }
      }
    };

    translateProject();
  }, [language, activities.length, selectedActivityId]);

  // ═══════════════════════════════════════
  // AUTH HANDLERS
  // ═══════════════════════════════════════
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setProjects([]);
    setActiveProjectId(null);
    setActivities([]);
  };

  // ═══════════════════════════════════════
  // ONBOARDING: New project creation
  // ═══════════════════════════════════════
  const handleOnboardingComplete = async (plotDetails) => {
    const startDate = plotDetails.startDate || formatDate(new Date());

    // Generate base activities from the building config
    const baseActivities = generateProjectTimeline(plotDetails.buildingType, startDate, plotDetails);

    const params = {
      buildingType: plotDetails.buildingType,
      soilType: plotDetails.soilType,
      season: plotDetails.season,
      stories: plotDetails.buildingType,
      budget: plotDetails.budget
    };

    // Run CPM scheduling with the user's chosen start date
    let scheduleData = { phases: [] };
    try {
      scheduleData = await generateAIPredictiveSchedule(params, startDate, language);
    } catch (err) {
      console.error("Scheduler fallback:", err);
    }

    // Apply dates using CPM logic
    let currentPtrDate = new Date(startDate);
    let previousEndDate = new Date(startDate);
    let activePhaseName = '';

    const scheduledActivities = baseActivities.map((act, index) => {
      const matchingPhase = scheduleData.phases?.find(p =>
        act.stage.toLowerCase().includes(p.phaseName.toLowerCase()) ||
        p.phaseName.toLowerCase().includes(act.stage.toLowerCase())
      ) || { durationMultiplier: 1.0, relationship: 'Sequential', overlapDays: 0 };

      const baseDuration = act.duration || 3;
      const predictedDuration = Math.max(1, Math.round(baseDuration * matchingPhase.durationMultiplier));

      let actStartDate = new Date(currentPtrDate);

      if (act.stage !== activePhaseName) {
        activePhaseName = act.stage;
        if (matchingPhase.relationship === 'Parallel' && index > 0) {
          actStartDate = new Date(previousEndDate);
          actStartDate.setDate(actStartDate.getDate() - (matchingPhase.overlapDays || 0));
          const startBound = new Date(startDate);
          if (actStartDate < startBound) actStartDate = startBound;
        }
      }

      const actEndDate = new Date(actStartDate);
      actEndDate.setDate(actEndDate.getDate() + predictedDuration);

      currentPtrDate = new Date(actEndDate);
      currentPtrDate.setDate(currentPtrDate.getDate() + 1);
      if (actEndDate > previousEndDate) previousEndDate = new Date(actEndDate);

      return {
        ...act,
        duration: predictedDuration,
        startDate: formatDate(actStartDate),
        endDate: formatDate(actEndDate),
        civilAdvice: matchingPhase.civilAdvice || '',
        architectAdvice: matchingPhase.architectAdvice || '',
        interiorAdvice: matchingPhase.interiorAdvice || '',
        relationship: matchingPhase.relationship || 'Sequential'
      };
    });

    const projectData = {
      name: `${plotDetails.buildingType} — ${plotDetails.city || 'My Plot'}`,
      params,
      startDate,
      activities: scheduledActivities,
      riskAssessment: {
        overallRisk: 'Low',
        estimatedDelayDays: 0,
        summary: 'Fresh project. Run AI Analysis after reviewing activities.'
      }
    };

    try {
      const newProj = await apiService.createProject(projectData);
      setProjects(prev => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      setShowOnboarding(false);
    } catch (err) {
      showToast(`Failed to save project: ${err.message}`, 'error');
    }
  };

  // ═══════════════════════════════════════
  // PROJECT SWITCHING
  // ═══════════════════════════════════════
  const handleSwitchProject = (projectId) => {
    setActiveProjectId(projectId);
    setActiveTab('dashboard');
  };

  const handleAddNewProject = () => {
    setShowOnboarding(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Kya aap yeh project delete karna chahte hain?')) return;
    try {
      await apiService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (activeProjectId === projectId) {
        const remaining = projects.filter(p => p.id !== projectId);
        setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // ═══════════════════════════════════════
  // EXISTING HANDLERS (integrated with backend database)
  // ═══════════════════════════════════════
  const handleApiKeyChange = (newKey) => {
    saveApiKey(newKey);
    setApiKeyState(newKey);
  };

  const handleToggleChecklist = async (activityId, itemId) => {
    const act = activities.find(a => a.id === activityId);
    if (!act) return;
    const itemIndex = act.checklist.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    const item = act.checklist[itemIndex];
    const newChecked = !item.checked;

    // Optimistic UI Update
    let newStatus = act.status;
    const updatedChecklist = act.checklist.map(ch => ch.id === itemId ? { ...ch, checked: newChecked } : ch);
    const checkedCount = updatedChecklist.filter(c => c.checked).length;
    const totalCount = updatedChecklist.length;
    if (totalCount > 0) {
      if (checkedCount === totalCount) newStatus = 'Completed';
      else if (checkedCount > 0) newStatus = 'In Progress';
      else newStatus = 'Pending';
    }

    setActivities(prev => prev.map(a => {
      if (a.id !== activityId) return a;
      return { ...a, checklist: updatedChecklist, status: newStatus };
    }));

    try {
      await apiService.toggleChecklistItem(activeProjectId, activityId, itemIndex, newChecked);
      await apiService.updateActivity(activeProjectId, activityId, { status: newStatus });
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
    }
  };

  const handleUpdateActivity = async (activityId, fields) => {
    let updatedActivities = [...activities];
    const index = activities.findIndex(a => a.id === activityId);
    let shiftedCount = 0;
    
    if (index !== -1) {
      const prevAct = activities[index];
      let deltaDays = 0;
      
      // Case 1: If planned endDate changed
      if (fields.endDate && fields.endDate !== prevAct.endDate) {
        const oldEnd = new Date(prevAct.endDate);
        const newEnd = new Date(fields.endDate);
        deltaDays = Math.round((newEnd - oldEnd) / (1000 * 60 * 60 * 24));
      }
      // Case 2: If actualEndDate changed
      else if (fields.actualEndDate && fields.actualEndDate !== prevAct.actualEndDate) {
        const oldActualEnd = prevAct.actualEndDate ? new Date(prevAct.actualEndDate) : new Date(prevAct.endDate);
        const newActualEnd = new Date(fields.actualEndDate);
        deltaDays = Math.round((newActualEnd - oldActualEnd) / (1000 * 60 * 60 * 24));
      }
      // Case 3: If planned startDate changed
      else if (fields.startDate && fields.startDate !== prevAct.startDate) {
        const oldStart = new Date(prevAct.startDate);
        const newStart = new Date(fields.startDate);
        deltaDays = Math.round((newStart - oldStart) / (1000 * 60 * 60 * 24));
      }

      if (deltaDays !== 0) {
        const shiftDate = (dateStr, days) => {
          if (!dateStr) return dateStr;
          const d = new Date(dateStr);
          d.setDate(d.getDate() + days);
          return d.toISOString().split('T')[0];
        };

        updatedActivities = activities.map((act, idx) => {
          if (idx === index) {
            return { ...act, ...fields };
          }
          if (idx > index) {
            shiftedCount++;
            return {
              ...act,
              startDate: shiftDate(act.startDate, deltaDays),
              endDate: shiftDate(act.endDate, deltaDays)
            };
          }
          return act;
        });
      } else {
        updatedActivities = activities.map(act => act.id === activityId ? { ...act, ...fields } : act);
      }
    }

    setActivities(updatedActivities);

    try {
      if (shiftedCount > 0) {
        await apiService.bulkUpdateActivities(activeProjectId, updatedActivities);
        showToast(
          language === 'hi' 
            ? `परिवर्तन सिंक हुआ! आगे की ${shiftedCount} गतिविधियों की तारीखें शिफ्ट कर दी गईं।` 
            : `Schedule shifted! Cascaded dates for ${shiftedCount} succeeding activities.`,
          'success'
        );
      } else {
        await apiService.updateActivity(activeProjectId, activityId, fields);
        showToast(
          language === 'hi' ? 'माइलस्टोन सफलतापूर्वक अपडेट किया गया!' : 'Milestone updated successfully!',
          'success'
        );
      }
    } catch (err) {
      console.error('Failed to update activity on database:', err);
      showToast(`Database update failed: ${err.message}`, 'error');
    }
  };

  const handleRunRiskAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const assessment = await predictProjectRisk(activities, language);
      setRiskAssessment(assessment);
      await apiService.updateProjectRisk(activeProjectId, {
        overallRisk: assessment.overallRisk,
        estimatedDelayDays: assessment.estimatedDelayDays,
        summary: assessment.summary
      });
      // Refresh project list for updated badges
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      showToast(`Analysis error: ${err.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCustomChecklist = async () => {
    if (!activeProject) return;
    setIsGeneratingChecklist(true);
    try {
      const startDate = activeProject.start_date || activeProject.plotDetails?.startDate || formatDate(new Date());
      const baseActivities = generateProjectTimeline(projectParams.stories, startDate, projectParams);

      const scheduleData = await generateAIPredictiveSchedule(projectParams, startDate, language);

      let customData = { activities: [] };
      if (isLiveMode()) {
        try { customData = await generateCustomChecklists(projectParams, baseActivities, language); } catch (e) { console.error(e); }
      }

      let currentPtrDate = new Date(startDate);
      let previousEndDate = new Date(startDate);
      let activePhaseName = '';

      const scheduledActivities = baseActivities.map((act, index) => {
        const matchingPhase = scheduleData.phases?.find(p =>
          act.stage.toLowerCase().includes(p.phaseName.toLowerCase()) ||
          p.phaseName.toLowerCase().includes(act.stage.toLowerCase())
        ) || { durationMultiplier: 1.0, relationship: 'Sequential', overlapDays: 0 };

        const baseDuration = act.duration || 3;
        const predictedDuration = Math.max(1, Math.round(baseDuration * matchingPhase.durationMultiplier));
        let actStartDate = new Date(currentPtrDate);

        if (act.stage !== activePhaseName) {
          activePhaseName = act.stage;
          if (matchingPhase.relationship === 'Parallel' && index > 0) {
            actStartDate = new Date(previousEndDate);
            actStartDate.setDate(actStartDate.getDate() - (matchingPhase.overlapDays || 0));
            const startBound = new Date(startDate);
            if (actStartDate < startBound) actStartDate = startBound;
          }
        }

        const actEndDate = new Date(actStartDate);
        actEndDate.setDate(actEndDate.getDate() + predictedDuration);
        currentPtrDate = new Date(actEndDate);
        currentPtrDate.setDate(currentPtrDate.getDate() + 1);
        if (actEndDate > previousEndDate) previousEndDate = new Date(actEndDate);

        let finalChecklist = act.checklist;
        const matchingCustomAct = customData.activities?.find(p => p.activityId === act.id);
        if (matchingCustomAct?.checkpoints) {
          finalChecklist = matchingCustomAct.checkpoints.map((cp, idx) => ({
            id: `${act.id}-custom-${idx}`, text: cp.text || cp.title, rule: cp.rule, checked: false
          }));
        }

        return {
          ...act,
          duration: predictedDuration,
          startDate: formatDate(actStartDate),
          endDate: formatDate(actEndDate),
          checklist: finalChecklist,
          civilAdvice: matchingPhase.civilAdvice || '',
          architectAdvice: matchingPhase.architectAdvice || '',
          interiorAdvice: matchingPhase.interiorAdvice || '',
          relationship: matchingPhase.relationship || 'Sequential'
        };
      });

      // Save to database
      await apiService.bulkUpdateActivities(activeProjectId, scheduledActivities);

      setActivities(scheduledActivities);
      setSelectedActivityId(scheduledActivities[0]?.id || null);
      showToast(
        language === 'hi' 
          ? `एआई शेड्यूलर: ${scheduledActivities.length} गतिविधियों का दिनांक सफलतापूर्वक निर्धारित किया गया!` 
          : `AI Scheduler: Schedule generated for ${scheduledActivities.length} activities successfully!`,
        'success'
      );
    } catch (err) {
      showToast(`AI Scheduler error: ${err.message}`, 'error');
    } finally {
      setIsGeneratingChecklist(false);
    }
  };

  const loadDemoData = async () => {
    if (!activeProjectId) return;
    setIsGeneratingChecklist(true);
    try {
      const city = projectParams.city || 'Indore';
      const season = projectParams.season || 'Monsoon';
      const stories = projectParams.stories || '1';
      
      const weatherResult = await analyzeWeatherRisk(city, season, stories, activities, language);
      
      // Map affected activities
      const affectedMap = {};
      (weatherResult.affectedActivities || []).forEach(item => {
        affectedMap[item.id] = item;
      });
      
      let datesNeedRecalculation = false;
      
      const updatedActivities = activities.map(act => {
        const affected = affectedMap[act.id];
        if (affected && affected.status === 'Delayed') {
          datesNeedRecalculation = true;
          // Increase duration by delayDays
          const delayDays = parseInt(affected.delayDays, 10) || 0;
          const originalDuration = parseInt(act.duration, 10) || 1;
          const newDuration = originalDuration + delayDays;
          
          return {
            ...act,
            status: 'Delayed',
            duration: newDuration,
            notes: affected.notes || (language === 'hi' ? 'खराब मौसम के कारण विलंब।' : 'Delayed due to adverse weather.')
          };
        }
        return act;
      });

      // Recalculate schedule sequential dates if any duration changed
      let finalActivities = updatedActivities;
      if (datesNeedRecalculation) {
        const projectStartDate = activeProject?.start_date || formatDate(new Date());
        let currentPtr = new Date(projectStartDate);
        
        finalActivities = updatedActivities.map(act => {
          const sDate = formatDate(currentPtr);
          const dur = parseInt(act.duration, 10) || 1;
          const endD = new Date(currentPtr);
          endD.setDate(endD.getDate() + dur);
          const eDate = formatDate(endD);
          
          // Next activity starts next day
          currentPtr = new Date(endD);
          currentPtr.setDate(currentPtr.getDate() + 1);
          
          return {
            ...act,
            startDate: sDate,
            endDate: eDate
          };
        });
      }

      await apiService.bulkUpdateActivities(activeProjectId, finalActivities);
      setActivities(finalActivities);
      
      // Update overall project risk summary based on the weather analysis summary
      if (weatherResult.weatherSummary) {
        const totalDelay = (weatherResult.affectedActivities || []).reduce((acc, curr) => acc + (parseInt(curr.delayDays, 10) || 0), 0);
        const newRisk = {
          overallRisk: totalDelay > 10 ? 'High' : totalDelay > 0 ? 'Medium' : 'Low',
          estimatedDelayDays: totalDelay,
          summary: weatherResult.weatherSummary
        };
        setRiskAssessment(prev => ({
          ...prev,
          ...newRisk
        }));
        await apiService.updateProjectRisk(activeProjectId, newRisk);
      }
      
      showToast(
        language === 'hi' 
          ? `मौसम जोखिम विश्लेषण पूरा हुआ! ${weatherResult.weatherSummary}` 
          : `Weather risk analysis completed! ${weatherResult.weatherSummary}`,
        'success'
      );
    } catch (err) {
      showToast(`Weather analysis failed: ${err.message}`, 'error');
    } finally {
      setIsGeneratingChecklist(false);
    }
  };

  const resetAll = async () => {
    if (!window.confirm('Reset all data for this project?')) return;
    if (!activeProjectId) return;
    const startDate = activeProject?.start_date || formatDate(new Date());
    const initialActs = generateProjectTimeline(projectParams.stories, startDate, projectParams);

    try {
      await apiService.bulkUpdateActivities(activeProjectId, initialActs);
      setActivities(initialActs);
      setRiskAssessment({ overallRisk: 'Low', estimatedDelayDays: 0, summary: '', criticalPathRisks: [], recommendations: [] });
      setSelectedActivityId(initialActs[0]?.id || null);
      await apiService.updateProjectRisk(activeProjectId, { overallRisk: 'Low', estimatedDelayDays: 0, summary: '' });
      showToast(
        language === 'hi' ? 'प्रोजेक्ट डेटा सफलतापूर्वक रीसेट किया गया!' : 'Project data reset successfully!', 
        'info'
      );
    } catch (err) {
      showToast(`Failed to reset activities: ${err.message}`, 'error');
    }
  };

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════

  // Screen 1: Auth
  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} language={language} onLanguageChange={setLanguage} />;
  }

  // Screen 2: Onboarding (new project or no projects)
  if (showOnboarding || projects.length === 0) {
    return <PlotOnboarding user={currentUser} onComplete={handleOnboardingComplete} />;
  }

  // Screen 3: Main App
  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        projects={projects}
        activeProjectId={activeProjectId}
        onSwitchProject={handleSwitchProject}
        onAddProject={handleAddNewProject}
        onDeleteProject={handleDeleteProject}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="main-content">
        <Header
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
          activities={activities}
          onLoadDemo={loadDemoData}
          onReset={resetAll}
          language={language}
          onLanguageChange={setLanguage}
          currentUser={currentUser}
          activeProject={activeProject}
          projects={projects}
          onSwitchProject={handleSwitchProject}
        />

        <div className="content-viewport">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              activities={activities}
              riskAssessment={riskAssessment}
              isAnalyzing={isAnalyzing}
              onRunAnalysis={handleRunRiskAnalysis}
              projectParams={projectParams}
              setProjectParams={setProjectParams}
              isGenerating={isGeneratingChecklist}
              onGenerateChecklist={handleGenerateCustomChecklist}
              language={language}
              onAskAI={(query) => { setAiQuery(query); setActiveTab('advisor'); }}
            />
          )}

          {activeTab === 'timeline' && (
            <JourneyTimeline
              activities={activities}
              onUpdateActivity={handleUpdateActivity}
              selectedActivityId={selectedActivityId}
              setSelectedActivityId={setSelectedActivityId}
              language={language}
            />
          )}

          {activeTab === 'checklists' && (
            <Checklists
              activities={activities}
              selectedActivityId={selectedActivityId}
              setSelectedActivityId={setSelectedActivityId}
              onToggleItem={handleToggleChecklist}
              language={language}
            />
          )}

          {activeTab === 'advisor' && (
            <AIAdvisor
              activeProjectId={activeProjectId}
              activities={activities}
              riskAssessment={riskAssessment}
              language={language}
              prefilledQuery={aiQuery}
              setPrefilledQuery={setAiQuery}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <button className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <LayoutDashboard size={20} />
          <span>{UI_TRANSLATIONS[language]?.dashboard || 'Dashboard'}</span>
        </button>
        <button className={`mobile-nav-item ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
          <Calendar size={20} />
          <span>{UI_TRANSLATIONS[language]?.timeline || 'Timeline'}</span>
        </button>
        <button className={`mobile-nav-item ${activeTab === 'checklists' ? 'active' : ''}`} onClick={() => setActiveTab('checklists')}>
          <ClipboardCheck size={20} />
          <span>{UI_TRANSLATIONS[language]?.checklists || 'Checklists'}</span>
        </button>
        <button className={`mobile-nav-item ${activeTab === 'advisor' ? 'active' : ''}`} onClick={() => setActiveTab('advisor')}>
          <Bot size={20} />
          <span>{UI_TRANSLATIONS[language]?.advisor || 'AI Chat'}</span>
        </button>
      </div>

      {/* Toast Notification overlay */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
