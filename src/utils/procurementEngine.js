// Procurement Intelligence Engine for Nirmaan Sahayak
// ────────────────────────────────────────────────────────────────────────────
// Professional principle: DATE MATH & LEAD-TIMES ARE DETERMINISTIC (computed in
// code, never guessed by an LLM). The AI layer (see gemini.js) only adds market
// intelligence — price trends, seasonal supply risk, city-specific sourcing.
//
// For every material we know:
//   - which construction phase consumes it (matched against activity name/stage)
//   - its procurement LEAD TIME (order → delivery) in days, India residential norms
//   - a QUANTITY thumb-rule (per sq.ft of built-up area) for a planning estimate
// We then work BACKWARDS from the earliest activity that needs it to compute an
// "order-by date" = activityStart − leadTime − safetyBuffer, and grade urgency
// against today's date so the user is alerted BEFORE a material can delay site work.

import { BUILDING_CONFIGS } from './activityGenerator';

// Safety buffer added on top of supplier lead time (procurement + inspection slack)
const SAFETY_BUFFER_DAYS = 3;

// ─── Material master catalogue (India residential construction) ───
// leadTimeDays  : typical order-to-delivery time
// qtyPerSqft    : planning thumb-rule per sq.ft of gross built-up area (null = BOQ based)
// unit          : quantity unit
// critical      : on the structural critical path — a delay here stalls the whole build
// madeToOrder   : fabricated/custom — long lead, must be booked very early
// match         : lowercased keywords tested against "activity.name + activity.stage"
export const MATERIAL_CATALOG = [
  {
    key: 'cement',
    material: 'Cement (OPC 53 / PPC)',
    category: 'Structural',
    leadTimeDays: 2,
    qtyPerSqft: 0.4,
    unit: 'bags',
    critical: true,
    madeToOrder: false,
    shelfLifeNote: 'Shelf life ~90 days — order in batches, do not over-stock early.',
    match: ['pcc', 'concrete', 'casting', 'plaster', 'masonry', 'brickwork', 'screed', 'footing']
  },
  {
    key: 'steel',
    material: 'TMT Steel Bars (Fe 500/550)',
    category: 'Structural',
    leadTimeDays: 6,
    qtyPerSqft: 4.0,
    unit: 'kg',
    critical: true,
    madeToOrder: false,
    shelfLifeNote: 'Price-volatile commodity — lock rate early; store off-ground to avoid rust.',
    match: ['reinforcement', 'rebar', 'steel binding', 'footing', 'column rebar', 'beam rebar', 'slab rebar']
  },
  {
    key: 'sand',
    material: 'River / M-Sand',
    category: 'Structural',
    leadTimeDays: 3,
    qtyPerSqft: 1.8,
    unit: 'cft',
    critical: true,
    madeToOrder: false,
    shelfLifeNote: 'Monsoon sand-mining bans cause shortages — stockpile ahead of the rains.',
    match: ['pcc', 'concrete', 'plaster', 'masonry', 'brickwork', 'mortar', 'screed']
  },
  {
    key: 'aggregate',
    material: 'Coarse Aggregate (Gitti)',
    category: 'Structural',
    leadTimeDays: 3,
    qtyPerSqft: 1.35,
    unit: 'cft',
    critical: true,
    madeToOrder: false,
    match: ['pcc', 'concrete', 'casting']
  },
  {
    key: 'shuttering',
    material: 'Shuttering Ply, Props & Scaffolding',
    category: 'Structural',
    leadTimeDays: 4,
    qtyPerSqft: null,
    unit: 'lot',
    critical: true,
    madeToOrder: false,
    match: ['shuttering', 'formwork', 'centering', 'scaffold', 'bracing']
  },
  {
    key: 'bricks',
    material: 'Bricks / AAC Blocks',
    category: 'Masonry',
    leadTimeDays: 5,
    qtyPerSqft: 8,
    unit: 'nos',
    critical: false,
    madeToOrder: false,
    match: ['brickwork', 'masonry', 'brick', 'block work']
  },
  {
    key: 'mesh',
    material: 'Chicken Mesh, Binding Wire & Cover Blocks',
    category: 'Masonry',
    leadTimeDays: 3,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: false,
    match: ['chicken mesh', 'binding', 'cover block', 'chipping', 'hacking']
  },
  {
    key: 'waterproofing',
    material: 'Waterproofing Chemicals & Membranes',
    category: 'MEP / Wet Works',
    leadTimeDays: 4,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: false,
    match: ['waterproofing', 'sunken', 'pond', 'dpc']
  },
  {
    key: 'plumbing',
    material: 'CPVC/UPVC Pipes & Plumbing Fittings',
    category: 'MEP',
    leadTimeDays: 5,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: false,
    match: ['plumbing', 'pipe', 'cpvc', 'ppr', 'sewer', 'drain', 'water supply', 'sleeve']
  },
  {
    key: 'electrical',
    material: 'Conduits, Copper Wiring & Switchgear',
    category: 'MEP',
    leadTimeDays: 5,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: false,
    match: ['electrical', 'wiring', 'conduit', 'cable', 'switchbox', 'switchboard', 'chasing']
  },
  {
    key: 'tiles',
    material: 'Vitrified Tiles / Marble / Granite',
    category: 'Finishing',
    leadTimeDays: 15,
    qtyPerSqft: 1.1,
    unit: 'sqft',
    critical: false,
    madeToOrder: false,
    shelfLifeNote: 'Design selection + stock availability — finalise early; imported stone runs longer.',
    match: ['tile', 'tiling', 'flooring', 'dado', 'granite', 'countertop', 'cladding', 'screed bed']
  },
  {
    key: 'windows',
    material: 'UPVC / Aluminium Windows',
    category: 'Finishing',
    leadTimeDays: 25,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: true,
    shelfLifeNote: 'Made-to-order — measure openings & place order right after brickwork.',
    match: ['window']
  },
  {
    key: 'doors',
    material: 'Door Frames (Chaukhat) & Shutters',
    category: 'Finishing',
    leadTimeDays: 12,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: true,
    shelfLifeNote: 'Wood needs seasoning + polish time — order well before frame fixing.',
    match: ['door frame', 'chaukhat', 'shutter', 'door ']
  },
  {
    key: 'ceiling',
    material: 'False Ceiling (Gypsum / GI Grid)',
    category: 'Finishing',
    leadTimeDays: 7,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: false,
    match: ['false ceiling', 'gypsum']
  },
  {
    key: 'paint',
    material: 'Wall Putty, Primer & Emulsion Paint',
    category: 'Finishing',
    leadTimeDays: 4,
    qtyPerSqft: 0.15,
    unit: 'litre',
    critical: false,
    madeToOrder: false,
    match: ['putty', 'primer', 'paint', 'emulsion']
  },
  {
    key: 'joinery',
    material: 'Modular Kitchen & Wardrobes (Ply/Laminate)',
    category: 'Interiors',
    leadTimeDays: 30,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: true,
    shelfLifeNote: 'Made-to-order joinery — longest finishing lead; confirm design at plaster stage.',
    match: ['kitchen', 'wardrobe', 'cabinet', 'carpentry', 'woodwork', 'modular']
  },
  {
    key: 'sanitary',
    material: 'Sanitaryware & CP Fittings',
    category: 'Interiors',
    leadTimeDays: 10,
    qtyPerSqft: null,
    unit: 'lot',
    critical: false,
    madeToOrder: false,
    match: ['sanitary', 'wc', 'commode', 'washbasin', 'cistern', 'faucet', 'basin', 'fitting']
  }
];

function toDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function fmtDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(d, days) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function diffDays(a, b) {
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

// Estimate gross built-up area (sq.ft) from plot area × number of levels.
export function estimateBuiltUpArea(plotDetails, buildingType) {
  const plotArea = parseFloat(plotDetails?.plotArea) || 1500;
  const levels = (BUILDING_CONFIGS[buildingType] || []).length || 1;
  // Ground coverage factor ~0.7 (setbacks reduce per-floor slab vs plot area)
  return Math.round(plotArea * levels * 0.7);
}

function formatQty(qty, unit) {
  if (qty == null) return 'As per BOQ';
  if (unit === 'kg' && qty >= 1000) return `${(qty / 1000).toFixed(1)} tonnes`;
  if (unit === 'nos') return `~${Math.round(qty).toLocaleString('en-IN')} nos`;
  return `~${Math.round(qty).toLocaleString('en-IN')} ${unit}`;
}

// Grade urgency from days remaining until the order-by date.
function gradeStatus(daysUntilOrder, ordered) {
  if (ordered) return { status: 'ordered', rank: 5 };
  if (daysUntilOrder < 0) return { status: 'overdue', rank: 0 };
  if (daysUntilOrder <= 7) return { status: 'urgent', rank: 1 };
  if (daysUntilOrder <= 30) return { status: 'upcoming', rank: 2 };
  return { status: 'scheduled', rank: 3 };
}

export const STATUS_META = {
  overdue:   { label: { en: 'OVERDUE',    hi: 'देरी हो चुकी' }, color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
  urgent:    { label: { en: 'ORDER NOW',  hi: 'अभी ऑर्डर करें' }, color: '#f97316', bg: 'rgba(249,115,22,0.10)' },
  upcoming:  { label: { en: 'UPCOMING',   hi: 'आगामी' },        color: '#eab308', bg: 'rgba(234,179,8,0.10)' },
  scheduled: { label: { en: 'SCHEDULED',  hi: 'निर्धारित' },     color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  ordered:   { label: { en: 'ORDERED',    hi: 'ऑर्डर हो गया' },   color: '#10b981', bg: 'rgba(16,185,129,0.10)' }
};

// Core: build the full procurement schedule for a project.
//   activities   : the project's scheduled activities (need startDate, name, stage)
//   opts.plotDetails, opts.buildingType : for quantity estimation
//   opts.orderedKeys : array of material keys already marked ordered
//   opts.today   : reference "now" (defaults to real today)
export function generateProcurementSchedule(activities = [], opts = {}) {
  const today = opts.today ? new Date(opts.today) : new Date();
  today.setHours(0, 0, 0, 0);
  const orderedKeys = new Set(opts.orderedKeys || []);
  const builtUp = estimateBuiltUpArea(opts.plotDetails, opts.buildingType);

  const items = MATERIAL_CATALOG.map(mat => {
    // Find the EARLIEST activity that consumes this material.
    let earliestStart = null;
    let anchorActivity = null;
    for (const act of activities) {
      const hay = `${act.name || ''} ${act.stage || ''}`.toLowerCase();
      if (!mat.match.some(kw => hay.includes(kw))) continue;
      const s = toDate(act.startDate);
      if (!s) continue;
      if (!earliestStart || s < earliestStart) {
        earliestStart = s;
        anchorActivity = act;
      }
    }

    if (!earliestStart) return null; // material not used by this project config

    const totalLead = mat.leadTimeDays + SAFETY_BUFFER_DAYS;
    const orderByDate = addDays(earliestStart, -totalLead);
    const daysUntilOrder = diffDays(orderByDate, today);
    const { status, rank } = gradeStatus(daysUntilOrder, orderedKeys.has(mat.key));
    const qty = mat.qtyPerSqft != null ? mat.qtyPerSqft * builtUp : null;

    return {
      key: mat.key,
      material: mat.material,
      category: mat.category,
      critical: mat.critical,
      madeToOrder: mat.madeToOrder,
      shelfLifeNote: mat.shelfLifeNote || '',
      leadTimeDays: mat.leadTimeDays,
      unit: mat.unit,
      estimatedQty: qty,
      estimatedQtyLabel: formatQty(qty, mat.unit),
      requiredForActivity: anchorActivity?.name || '',
      requiredForStage: anchorActivity?.stage || '',
      requiredByDate: fmtDate(earliestStart),
      orderByDate: fmtDate(orderByDate),
      daysUntilOrder,
      status,
      rank
    };
  }).filter(Boolean);

  // Sort by urgency (overdue → urgent → …), then by order-by date.
  items.sort((a, b) => a.rank - b.rank || new Date(a.orderByDate) - new Date(b.orderByDate));

  const summary = {
    builtUpArea: builtUp,
    total: items.length,
    overdue: items.filter(i => i.status === 'overdue').length,
    urgent: items.filter(i => i.status === 'urgent').length,
    upcoming: items.filter(i => i.status === 'upcoming').length,
    ordered: items.filter(i => i.status === 'ordered').length,
    // Count materials that need action within the next 7 days and aren't ordered
    actionNeeded: items.filter(i => (i.status === 'overdue' || i.status === 'urgent')).length
  };

  return { items, summary };
}
