import React, { useState } from 'react';
import { MapPin, Building2, Sparkles, ArrowRight, ArrowLeft, Check, Ruler, Compass, CalendarDays, Wallet, RefreshCw } from 'lucide-react';
import { BUILDING_CONFIGS } from '../utils/activityGenerator';

const SOIL_TYPES = ['Black Cotton', 'Hard Murrum', 'Sandy Loam', 'Laterite', 'Rocky / Hard Strata', 'Alluvial Clay'];
const SEASONS = ['Summer (March–June)', 'Monsoon (July–September)', 'Post-Monsoon (Oct–Nov)', 'Winter (Dec–Feb)'];
const BUDGETS = ['Economy (₹800–1200/sqft)', 'Standard (₹1200–1800/sqft)', 'Premium (₹1800–2500/sqft)', 'Ultra Luxury (₹2500+/sqft)'];
const FACINGS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

export default function PlotOnboarding({ user, onComplete, language }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Plot Details
  const [plotArea, setPlotArea] = useState('');
  const [plotShape, setPlotShape] = useState('Rectangular');
  const [plotFacing, setPlotFacing] = useState('North');
  const [roadWidth, setRoadWidth] = useState('');
  const [city, setCity] = useState(user?.city || '');
  const [startDate, setStartDate] = useState('2026-08-01');

  // Step 2: Building Configuration
  const [buildingType, setBuildingType] = useState('G+1 Standard');
  const [soilType, setSoilType] = useState('Hard Murrum');
  const [season, setSeason] = useState('Summer (March–June)');
  const [budget, setBudget] = useState('Standard (₹1200–1800/sqft)');

  const configKeys = Object.keys(BUILDING_CONFIGS);
  const floors = BUILDING_CONFIGS[buildingType] || [];

  const handleFinish = async () => {
    setIsLoading(true);
    const plotDetails = {
      plotArea: plotArea || '1500',
      plotShape,
      plotFacing,
      roadWidth: roadWidth || '30',
      city,
      startDate,
      buildingType,
      soilType,
      season: season.split(' (')[0],
      budget: budget.split(' (')[0],
      floors
    };

    // Save to localStorage
    localStorage.setItem('nirmaan_plot_details', JSON.stringify(plotDetails));

    try {
      await onComplete(plotDetails);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stepClass = (s) => {
    if (s < step) return 'onboarding-step done';
    if (s === step) return 'onboarding-step active';
    return 'onboarding-step';
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-header">
        <h1>🏗️ Apne Plot ki Details Bharein</h1>
        <p>Hum aapki details ke hisaab se poori construction journey generate karenge</p>
      </div>

      {/* Step Indicators */}
      <div className="onboarding-steps">
        <div className={stepClass(1)}>
          <div className="onboarding-step-num">{step > 1 ? <Check size={16} /> : '1'}</div>
          <span className="onboarding-step-label">Plot Details</span>
        </div>
        <div className="onboarding-step-connector" />
        <div className={stepClass(2)}>
          <div className="onboarding-step-num">{step > 2 ? <Check size={16} /> : '2'}</div>
          <span className="onboarding-step-label">Building Config</span>
        </div>
        <div className="onboarding-step-connector" />
        <div className={stepClass(3)}>
          <div className="onboarding-step-num">3</div>
          <span className="onboarding-step-label">AI Preview</span>
        </div>
      </div>

      {/* Step Cards */}
      <div className="onboarding-card">
        {step === 1 && (
          <>
            <h2><MapPin size={22} /> Plot & Site Information</h2>
            <div className="onboarding-grid">
              <div className="form-group">
                <label className="form-label">Plot Area (sq.ft)</label>
                <input 
                  className="form-input" 
                  type="number" 
                  placeholder="e.g. 1500"
                  value={plotArea}
                  onChange={(e) => setPlotArea(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Plot Shape</label>
                <select className="form-select" value={plotShape} onChange={(e) => setPlotShape(e.target.value)}>
                  <option>Rectangular</option>
                  <option>Square</option>
                  <option>L-shaped</option>
                  <option>Irregular / Triangular</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Plot Facing</label>
                <select className="form-select" value={plotFacing} onChange={(e) => setPlotFacing(e.target.value)}>
                  {FACINGS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Road Width (feet)</label>
                <input 
                  className="form-input" 
                  type="number" 
                  placeholder="e.g. 30"
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City / Zone</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="e.g. Indore, Nagpur, Delhi..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project Start Date</label>
                <input 
                  className="form-input" 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="onboarding-actions">
              <div />
              <button className="btn-next" onClick={() => setStep(2)}>
                Next: Building Config <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2><Building2 size={22} /> Building Configuration</h2>
            <div className="onboarding-grid">
              <div className="form-group full-width">
                <label className="form-label">Building Type (20 Configurations)</label>
                <select className="form-select" value={buildingType} onChange={(e) => setBuildingType(e.target.value)}>
                  {configKeys.map(k => (
                    <option key={k} value={k}>{k} — {BUILDING_CONFIGS[k].length} Levels</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select className="form-select" value={soilType} onChange={(e) => setSoilType(e.target.value)}>
                  {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Start Season</label>
                <select className="form-select" value={season} onChange={(e) => setSeason(e.target.value)}>
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Budget Level</label>
                <select className="form-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                  {BUDGETS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Floor Preview */}
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'var(--mortar-light)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Floor Levels Preview</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {floors.map((f, i) => (
                  <span key={i} style={{ padding: '4px 10px', borderRadius: '4px', background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="onboarding-actions">
              <button className="btn-back" onClick={() => setStep(1)}>
                <ArrowLeft size={14} /> Back
              </button>
              <button className="btn-next" onClick={() => setStep(3)}>
                Next: AI Preview <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2><Sparkles size={22} /> AI Journey Preview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Yeh aapki construction journey ka summary hai. Confirm karein aur AI apna poora schedule generate karega.
            </p>

            <div className="onboarding-summary">
              <div className="onboarding-summary-row">
                <span className="label"><Ruler size={14} /> Plot Area</span>
                <span className="value">{plotArea || '1500'} sq.ft</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label"><Compass size={14} /> Facing / Shape</span>
                <span className="value">{plotFacing} / {plotShape}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label"><MapPin size={14} /> City</span>
                <span className="value">{city || 'Not specified'}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label"><CalendarDays size={14} /> Start Date</span>
                <span className="value">{startDate}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label"><Building2 size={14} /> Building Type</span>
                <span className="value">{buildingType}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label">🏔️ Soil Type</span>
                <span className="value">{soilType}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label">☀️ Season</span>
                <span className="value">{season}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="label"><Wallet size={14} /> Budget</span>
                <span className="value">{budget}</span>
              </div>
              <div className="onboarding-summary-row" style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
                <span className="label" style={{ fontWeight: 700, color: 'var(--primary)' }}>📊 Estimated Levels</span>
                <span className="value">{floors.length} Floors</span>
              </div>
            </div>

            <div className="onboarding-actions">
              <button className="btn-back" onClick={() => setStep(2)} disabled={isLoading}>
                <ArrowLeft size={14} /> Back
              </button>
              <button className="btn-next" onClick={handleFinish} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} style={{ marginRight: '6px' }} />
                    {language === 'hi' ? 'जर्नी जनरेट हो रही है...' : 'Generating Journey...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    {language === 'hi' ? 'मेरी कंस्ट्रक्शन जर्नी जनरेट करें' : 'Generate My Construction Journey'}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
