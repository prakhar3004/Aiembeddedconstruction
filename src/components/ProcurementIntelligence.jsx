import React, { useState, useMemo, useEffect } from 'react';
import {
  Package, Truck, AlertTriangle, Clock, CheckCircle2, Sparkles,
  TrendingUp, TrendingDown, Minus, ShoppingCart, Boxes, CalendarClock, Undo2
} from 'lucide-react';
import { generateProcurementSchedule, STATUS_META } from '../utils/procurementEngine';
import { analyzeProcurementIntelligence } from '../services/gemini';
import { translateContent } from '../utils/translationHelper';

export default function ProcurementIntelligence({
  activities = [],
  projectParams = {},
  activeProject = null,
  language = 'en'
}) {
  const isHi = language === 'hi';
  const projectId = activeProject?.id || 'local';

  // Plot details for quantity/city estimation — prefer the active project's own
  // stored values (per-project), falling back to the last onboarding localStorage.
  const plotDetails = useMemo(() => {
    let local = {};
    try { local = JSON.parse(localStorage.getItem('nirmaan_plot_details')) || {}; } catch { local = {}; }
    return {
      plotArea: activeProject?.plot_area || local.plotArea,
      city: activeProject?.city || local.city
    };
  }, [activeProject]);

  const buildingType = activeProject?.building_type || projectParams.buildingType || projectParams.stories;

  // Track which materials have been ordered (persisted per project).
  const orderedStorageKey = `nirmaan_procurement_ordered_${projectId}`;
  const [orderedKeys, setOrderedKeys] = useState(() => {
    try { return JSON.parse(localStorage.getItem(orderedStorageKey)) || []; }
    catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem(orderedStorageKey, JSON.stringify(orderedKeys));
  }, [orderedKeys, orderedStorageKey]);

  const toggleOrdered = (key) => {
    setOrderedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // Deterministic schedule — recomputed whenever activities/ordered state change.
  const { items, summary } = useMemo(
    () => generateProcurementSchedule(activities, { plotDetails, buildingType, orderedKeys }),
    [activities, plotDetails, buildingType, orderedKeys]
  );

  // AI market intelligence (optional enhancement).
  const [aiIntel, setAiIntel] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  const aiByKey = useMemo(() => {
    const map = {};
    (aiIntel?.materials || []).forEach(m => { map[m.key] = m; });
    return map;
  }, [aiIntel]);

  const runAiIntelligence = async () => {
    setLoadingAi(true);
    setAiError('');
    try {
      const params = {
        city: plotDetails.city || activeProject?.city,
        season: projectParams.season,
        budget: projectParams.budget,
        stories: buildingType,
        soilType: projectParams.soilType
      };
      const result = await analyzeProcurementIntelligence(params, items, language);
      setAiIntel(result);
    } catch (err) {
      setAiError(err.message || 'Failed to fetch procurement intelligence');
    } finally {
      setLoadingAi(false);
    }
  };

  const actionItems = items.filter(i => i.status === 'overdue' || i.status === 'urgent');

  const trendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp size={13} style={{ color: '#ef4444' }} />;
    if (trend === 'falling') return <TrendingDown size={13} style={{ color: '#10b981' }} />;
    return <Minus size={13} style={{ color: 'var(--text-muted)' }} />;
  };

  const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status] || STATUS_META.scheduled;
    return (
      <span style={{
        fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px',
        color: meta.color, backgroundColor: meta.bg, textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        {meta.label[isHi ? 'hi' : 'en']}
      </span>
    );
  };

  // Empty state — no schedule yet
  if (!activities || activities.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Package size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
        <p>{isHi
          ? 'प्रोक्योरमेंट योजना बनाने के लिए पहले कोई प्रोजेक्ट शेड्यूल जनरेट करें।'
          : 'Generate a project schedule first to build the procurement plan.'}</p>
      </div>
    );
  }

  const kpi = (label, value, color, Icon) => (
    <div className="card kpi-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="kpi-header"><span>{label}</span><Icon size={16} style={{ color }} /></div>
      <div className="kpi-value" style={{ color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>
            <Truck size={22} style={{ color: 'var(--primary)' }} />
            {isHi ? 'सामग्री प्रोक्योरमेंट इंटेलिजेंस' : 'Material Procurement Intelligence'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {isHi
              ? 'हर सामग्री को समय पर ऑर्डर करें ताकि निर्माण में देरी न आए। अनुमानित बिल्ट-अप एरिया: '
              : 'Order every material on time so procurement never delays the build. Est. built-up area: '}
            <strong>{summary.builtUpArea.toLocaleString('en-IN')} sq.ft</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={runAiIntelligence} disabled={loadingAi}>
          <Sparkles size={15} style={{ marginRight: '6px' }} />
          {loadingAi
            ? (isHi ? 'विश्लेषण हो रहा है...' : 'Analysing Market...')
            : (isHi ? 'एआई मार्केट इंटेलिजेंस' : 'AI Market Intelligence')}
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid-4">
        {kpi(isHi ? 'देरी हो चुकी' : 'Overdue', summary.overdue, '#ef4444', AlertTriangle)}
        {kpi(isHi ? 'अभी ऑर्डर करें' : 'Order Now', summary.urgent, '#f97316', ShoppingCart)}
        {kpi(isHi ? 'आगामी' : 'Upcoming', summary.upcoming, '#eab308', CalendarClock)}
        {kpi(isHi ? 'ऑर्डर हो गया' : 'Ordered', summary.ordered, '#10b981', CheckCircle2)}
      </div>

      {/* AI Intelligence panel */}
      {aiError && (
        <div className="alert" style={{ margin: 0, border: '1px solid var(--error)', color: 'var(--error)', fontSize: '13px' }}>
          {isHi ? 'एआई त्रुटि: ' : 'AI error: '}{aiError}
        </div>
      )}
      {aiIntel && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--primary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', margin: 0 }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            {isHi ? 'एआई प्रोक्योरमेंट सलाह' : 'AI Procurement Advisory'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>{aiIntel.summary}</p>
          {aiIntel.marketAlerts?.length > 0 && (
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0 }}>
              {aiIntel.marketAlerts.map((a, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Required alerts */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', margin: 0 }}>
          <AlertTriangle size={18} style={{ color: 'var(--error)' }} />
          {isHi ? 'तुरंत कार्रवाई आवश्यक' : 'Action Required Now'}
          {actionItems.length > 0 && (
            <span className="badge badge-delayed" style={{ marginLeft: '4px' }}>{actionItems.length}</span>
          )}
        </h3>
        {actionItems.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {isHi ? 'बढ़िया! अभी कोई सामग्री ऑर्डर के लिए लंबित नहीं है।' : 'All good — no materials pending an urgent order.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {actionItems.map(item => {
              const ai = aiByKey[item.key];
              return (
                <div key={item.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                  padding: '12px', borderRadius: '8px',
                  border: `1px solid ${item.status === 'overdue' ? 'rgba(239,68,68,0.4)' : 'rgba(249,115,22,0.35)'}`,
                  background: item.status === 'overdue' ? 'rgba(239,68,68,0.05)' : 'rgba(249,115,22,0.04)'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <StatusBadge status={item.status} />
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{item.material}</span>
                      {item.critical && <span style={{ fontSize: '9px', fontWeight: 700, color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '4px', padding: '1px 5px' }}>{isHi ? 'क्रिटिकल' : 'CRITICAL'}</span>}
                      {item.madeToOrder && <span style={{ fontSize: '9px', fontWeight: 700, color: '#a855f7', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '1px 5px' }}>{isHi ? 'ऑर्डर पर' : 'MADE-TO-ORDER'}</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {isHi ? 'ऑर्डर करें: ' : 'Order by: '}<strong style={{ color: 'var(--text-primary)' }}>{item.orderByDate}</strong>
                      {'  •  '}
                      {isHi ? 'ज़रूरत: ' : 'Needed for: '}{translateContent(item.requiredForStage, language)} ({item.requiredByDate})
                      {'  •  '}
                      {isHi ? 'अनु. मात्रा: ' : 'Est. qty: '}{item.estimatedQtyLabel}
                    </div>
                    {ai?.sourcingTip && (
                      <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px' }}>💡 {ai.sourcingTip}</div>
                    )}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => toggleOrdered(item.key)}>
                    <ShoppingCart size={13} style={{ marginRight: '4px' }} />
                    {isHi ? 'ऑर्डर किया' : 'Mark Ordered'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full procurement schedule */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', margin: 0 }}>
          <Boxes size={18} style={{ color: 'var(--primary)' }} />
          {isHi ? 'पूर्ण प्रोक्योरमेंट शेड्यूल' : 'Full Procurement Schedule'}
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px', fontSize: '12px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'सामग्री' : 'Material'}</th>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'अनु. मात्रा' : 'Est. Qty'}</th>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'लीड टाइम' : 'Lead'}</th>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'ऑर्डर तिथि' : 'Order By'}</th>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'ज़रूरत तिथि' : 'Needed By'}</th>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'दाम रुझान' : 'Price'}</th>
                <th style={{ padding: '8px 10px' }}>{isHi ? 'स्थिति' : 'Status'}</th>
                <th style={{ padding: '8px 10px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ai = aiByKey[item.key];
                const isOrdered = item.status === 'ordered';
                return (
                  <tr key={item.key} style={{ borderBottom: '1px solid var(--border-color)', opacity: isOrdered ? 0.55 : 1 }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.material}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.category}</div>
                    </td>
                    <td style={{ padding: '10px', color: 'var(--text-primary)' }}>{item.estimatedQtyLabel}</td>
                    <td style={{ padding: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.leadTimeDays}{isHi ? ' दिन' : 'd'}</td>
                    <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{item.orderByDate}</td>
                    <td style={{ padding: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.requiredByDate}</td>
                    <td style={{ padding: '10px' }}>
                      <span title={ai?.seasonalRisk || ''} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {ai ? trendIcon(ai.priceTrend) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}><StatusBadge status={item.status} /></td>
                    <td style={{ padding: '10px' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleOrdered(item.key)}
                        title={isOrdered ? (isHi ? 'पूर्ववत करें' : 'Undo') : (isHi ? 'ऑर्डर किया' : 'Mark ordered')}
                        style={{ padding: '4px 8px', color: isOrdered ? 'var(--text-muted)' : 'var(--success)' }}
                      >
                        {isOrdered ? <Undo2 size={14} /> : <CheckCircle2 size={14} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <Clock size={13} style={{ marginTop: '1px', flexShrink: 0 }} />
          <span>{isHi
            ? 'ऑर्डर तिथि = ज़रूरत तिथि − सप्लायर लीड टाइम − सुरक्षा बफर। मात्राएँ थंब-रूल आधारित अनुमान हैं; अंतिम BOQ हेतु इंजीनियर से पुष्टि करें।'
            : 'Order-by date = needed date − supplier lead time − safety buffer. Quantities are thumb-rule estimates; confirm final BOQ with your engineer.'}</span>
        </div>
      </div>
    </div>
  );
}
