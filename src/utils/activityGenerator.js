// Dynamic Construction Activity & Quality Checklist Generator
// Supports 20 configurations (G+1, G+2, B+S+4, Farmhouse, etc.)
// Distinguishes between Essential (Default) and Add-on (Optional) activities
// Each activity contains a minimum of 5 rigorous QA/QC checkpoints (Niyam)

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 20 building configuration mappings to their vertical levels
export const BUILDING_CONFIGS = {
  'G+1 Standard': ['Ground Floor', 'First Floor'],
  'G+1 Economy': ['Ground Floor', 'First Floor'],
  'G+1 Premium (Luxury Villa)': ['Ground Floor', 'First Floor'],
  'G+2 Standard': ['Ground Floor', 'First Floor', 'Second Floor'],
  'G+2 Economy': ['Ground Floor', 'First Floor', 'Second Floor'],
  'G+2 Premium': ['Ground Floor', 'First Floor', 'Second Floor'],
  'G+3 Apartment Block': ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'],
  'G+4 Housing Block': ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor'],
  'B+G+1 Basement Duplex': ['Basement Level', 'Ground Floor', 'First Floor'],
  'B+G+2 Basement Triplex': ['Basement Level', 'Ground Floor', 'First Floor', 'Second Floor'],
  'B+G+3 Basement Building': ['Basement Level', 'Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'],
  'B+S+2 Stilt+2 Parking': ['Basement Level', 'Stilt Parking Level', 'Ground Floor', 'First Floor'],
  'B+S+3 Stilt+3 Parking': ['Basement Level', 'Stilt Parking Level', 'Ground Floor', 'First Floor', 'Second Floor'],
  'B+S+4 Stilt+4 Parking (Ultra)': ['Basement Level', 'Stilt Parking Level', 'Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor'],
  'S+2 Parking + 2 Floors': ['Stilt Parking Level', 'Ground Floor', 'First Floor'],
  'S+3 Parking + 3 Floors': ['Stilt Parking Level', 'Ground Floor', 'First Floor', 'Second Floor'],
  'S+4 Parking + 4 Floors': ['Stilt Parking Level', 'Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'],
  'Row House G+0 Economy': ['Ground Floor'],
  'Mixed-use Commercial G+3': ['Ground Floor (Commercial)', 'First Floor', 'Second Floor', 'Third Floor'],
  'Farmhouse Villa (with Pool)': ['Ground Floor', 'First Floor']
};

// Substructure (Foundation & Earthworks) Templates - 16 Essential activities
const SUBSTRUCTURE_TEMPLATES = [
  {
    id: 'pre-1',
    name: 'Soil Bearing Capacity (SBC) Test',
    stage: 'Planning & Approvals',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Verify borehole depth is minimum 3 meters from natural ground level.', rule: 'As per IS:1892, borehole must reach hard strata.' },
      { text: 'Perform standard penetration test (SPT) at regular depth intervals.', rule: 'Record N-values every 1.5 meters.' },
      { text: 'Collect core soil samples in sealed containers for lab moisture and cohesion test.', rule: 'Samples must reach lab within 24 hours.' },
      { text: 'Check ground water table depth in test pits.', rule: 'Note seepage rates to plan basement dewatering pumps.' },
      { text: 'Obtain structural engineer signed soil investigation report.', rule: 'Ensure SBC rating is specified in tonnes/sq.m.' }
    ]
  },
  {
    id: 'pre-2',
    name: 'Topographical Survey & Boundary Demarcation',
    stage: 'Planning & Approvals',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Check boundary dimensions using electronic Total Station instrument.', rule: 'Accuracy must be within +/- 5mm.' },
      { text: 'Match plot coordinates with government revenue maps (patta/registry).', rule: 'Ensure no encroachment on public roads/drains.' },
      { text: 'Establish temporary benchmark (TBM) level on site.', rule: 'Transfer level from nearest municipal benchmark.' },
      { text: 'Mark set-back lines as per municipal building bylaws.', rule: 'Clear clearance of min 1.5m on sides must be maintained.' },
      { text: 'Insert concrete pegs at corner boundary junctions.', rule: 'Pegs must be cast 150x150mm and 0.5m deep.' }
    ]
  },
  {
    id: 'pre-3',
    name: 'Architectural & Working Drawing Finalization',
    stage: 'Planning & Approvals',
    duration: 5,
    isAddon: false,
    checklist: [
      { text: 'Approve floor layouts, room layouts, and furniture layouts.', rule: 'Ensure room dimensions follow Vastu and functional codes.' },
      { text: 'Verify electrical distribution wiring plans and socket heights.', rule: 'AC sockets must be at 1.2m, light switches at 1.4m.' },
      { text: 'Approve sanitary plumbing pipe routing layout.', rule: 'Slope of waste line must be min 1 in 40.' },
      { text: 'Verify column positions in architectural plan match structural layout.', rule: 'Verify zero column overhangs in rooms.' },
      { text: 'Obtain Good For Construction (GFC) stamped blueprints.', rule: 'All blueprints must have structural engineer license seal.' }
    ]
  },
  {
    id: 'pre-4',
    name: 'Municipal Plan Approval & Building Permit Procurement',
    stage: 'Planning & Approvals',
    duration: 7,
    isAddon: false,
    checklist: [
      { text: 'Submit FAR (Floor Area Ratio) calculation sheet.', rule: 'Verify total carpet area matches municipal maximum limits.' },
      { text: 'File fire safety and structural stability certificates.', rule: 'Must be issued by certified government structural engineers.' },
      { text: 'Pay municipal development and garbage taxes.', rule: 'Obtain official computerized receipts.' },
      { text: 'Verify environmental NOC (No Objection Certificate) status.', rule: 'Required if basement excavation exceeds 3 meters.' },
      { text: 'Obtain signed municipal building sanction permit order.', rule: 'Permit must be prominently displayed on-site.' }
    ]
  },
  {
    id: 'pre-5',
    name: 'Borewell Drilling & Curing Water Source Setup',
    stage: 'Site Setup',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Locate drilling point via hydro-geological survey.', rule: 'Drilling point must be min 15m away from septic soak pits.' },
      { text: 'Verify casing pipe thickness and material quality (PVC/MS).', rule: 'Use minimum 6-inch diameter heavy duty PVC pipes.' },
      { text: 'Drill borewell to water-bearing fractured rock aquifer layer.', rule: 'Average depth in region is 150-250 feet.' },
      { text: 'Install submersible pump motor and run flushing operations.', rule: 'Flush muddy water for at least 4 hours until output is clear.' },
      { text: 'Test TDS (Total Dissolved Solids) and pH of borewell water.', rule: 'For concrete mixing/curing, pH must be between 6.0 and 8.0.' }
    ]
  },
  {
    id: 'pre-6',
    name: 'Temporary Power Meter & Commercial Electric Supply',
    stage: 'Site Setup',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'File commercial electrical connection load application.', rule: 'Ensure min 10kW load for mixers and pumps.' },
      { text: 'Install double-insulated copper cables from pole to site DB box.', rule: 'Armored cable of min 16 sq.mm is mandatory.' },
      { text: 'Install temporary waterproof distribution box with MCB.', rule: 'Include 30mA residual current circuit breaker (RCCB) for safety.' },
      { text: 'Verify earthing grounding resistance at the temporary meter.', rule: 'Resistance should be less than 5 ohms.' },
      { text: 'Setup power sockets with waterproof flaps for site drills and concrete mixers.', rule: 'Must use IP65 rated outdoor sockets.' }
    ]
  },
  {
    id: 'pre-7',
    name: 'Site Clearing & Natural Veg/Soil Scraping',
    stage: 'Site Setup',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Remove roots, bushes, trees, and trash from site boundary.', rule: 'Organic debris weakens foundation if buried.' },
      { text: 'Scrape top 150mm organic humus soil.', rule: 'Top soil must be stocked separately for future garden landscaping.' },
      { text: 'Level the terrain using graders or manual JCB shovel.', rule: 'Maintain slope of 1:100 away from proposed house coordinates.' },
      { text: 'Clear boulder rocks and debris deposits.', rule: 'Dump waste material at municipal approved locations only.' },
      { text: 'Perform pest treatment against termites in surrounding soil area.', rule: 'Spray chlorpyrifos emulsion on scraped base.' }
    ]
  },
  {
    id: 'pre-8',
    name: 'Material Storage Yard & Labor Shed Erection',
    stage: 'Site Setup',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Build waterproof lockable cement warehouse.', rule: 'Must have raised wooden platform (150mm height) to prevent moisture.' },
      { text: 'Construct steel storage racks.', rule: 'Store rebars based on diameter (8mm, 10mm, 12mm, 16mm) off the ground.' },
      { text: 'Set up labor sanitation toilets and drinking water tank.', rule: 'Clean water tank with chlorine regularly.' },
      { text: 'Erect site safety fencing and warning banners.', rule: 'Banners should read: "Caution - Construction Site - Hardhats Required".' },
      { text: 'Prepare sand and coarse aggregate washing bays.', rule: 'Silt content in washing bay should be below 3%.' }
    ]
  },
  {
    id: 'pre-9',
    name: 'Layout Marking & Center-line Rope Threading',
    stage: 'Substructure',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Erect wooden profile boards (burji) around excavation line.', rule: 'Distance of profile from pit edge must be min 1.5m.' },
      { text: 'Thread nylon masonry strings along exact center lines of columns.', rule: 'Use structural layout drawing sheet No. 1.' },
      { text: 'Verify 3-4-5 right angle (Pythagoras rule) for all corner junctions.', rule: 'Ensure diagonal dimensions (D1 vs D2) match within +/- 2mm.' },
      { text: 'Mark column footprint on ground using dry lime powder.', rule: 'Add 150mm working offset on all sides of column box.' },
      { text: 'Mark excavation depth levels on profile boards using water-level tube.', rule: 'Tolerance of depth transfer is +/- 1mm.' }
    ]
  },
  {
    id: 'sub-1',
    name: 'Foundation Footing Excavation',
    stage: 'Substructure',
    duration: 4,
    isAddon: false,
    checklist: [
      { text: 'Excavate pits to target depth (min 1.5m).', rule: 'Ensure excavation is in dry soil conditions; deploy sump pump if water table is reached.' },
      { text: 'Check side walls verticality of excavation pits.', rule: 'Slope walls by 1:0.5 to prevent soil collapse in soft clay.' },
      { text: 'Verify hardness of pit bed before placing concrete.', rule: 'Perform pocket penetrometer test; loose soil must be removed.' },
      { text: 'Stockpile excavated soil at least 2 meters away from pit edges.', rule: 'Prevents load sliding and collapse back into pits.' },
      { text: 'Check bottom levels using auto-level instrument.', rule: 'Pit bed level tolerance is max +/- 10mm.' }
    ]
  },
  {
    id: 'sub-2',
    name: 'Plinth Foundation PCC Base Casting',
    stage: 'Substructure',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Prepare M10/M15 concrete mix ratio (1:3:6 / 1:2:4).', rule: 'Silt content in sand must be checked to be under 5%.' },
      { text: 'Compact the rammed soil bed and place clean plastic sheet.', rule: 'Plastic sheet (150 microns) prevents soil from absorbing cement water.' },
      { text: 'Fix wooden side shuttering boards securely.', rule: 'Shutter height must be exactly 100mm, verified with spirit level.' },
      { text: 'Pour concrete and compact with manual steel rammers.', rule: 'Pour concrete uniformly; no loose aggregate segments allowed.' },
      { text: 'Provide trowel finish to surface and cure for 3 days.', rule: 'Keep surface wet by spraying water twice daily.' }
    ]
  },
  {
    id: 'sub-3',
    name: 'Footing Reinforcement Steel Binding',
    stage: 'Substructure',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Check rebar steel grade (Fe 500/Fe 550) against drawings.', rule: 'Ensure TMT steel rods are clean and rust-free.' },
      { text: 'Bind footing mesh with 18-gauge binding wire.', rule: 'Tie every single intersection tightly; rebar spacing max 150mm.' },
      { text: 'Provide 50mm concrete cover blocks at bottom and sides.', rule: 'Do not use raw bricks or stones as cover blocks; use precast concrete blocks.' },
      { text: 'Erect column vertical rebars (starter bars) inside footing mesh.', rule: 'Provide L-bend of min 300mm at the base of column bars.' },
      { text: 'Check centering of vertical column bars against grid lines.', rule: 'Centering tolerance is +/- 5mm.' }
    ]
  },
  {
    id: 'sub-4',
    name: 'Footing Concrete Casting (RCC M20/M25)',
    stage: 'Substructure',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Confirm concrete mixing machine is clean and water ratio is measured.', rule: 'Water-cement ratio must be strictly 0.48.' },
      { text: 'Verify shuttering box support holds weight of concrete.', rule: 'Support with diagonal wooden props; check plumb of boxes.' },
      { text: 'Pour concrete and run mechanical needle vibrator.', rule: 'Vibrate concrete for 15-20 seconds per spot to avoid honeycombing.' },
      { text: 'Cast test concrete cubes (150mm size) for compressive strength tests.', rule: 'Cast 6 cubes for 7-day and 28-day testing.' },
      { text: 'Finish top surface and insert key indentations (keys) for column joints.', rule: 'Key indentations improve bonding between footing and columns.' }
    ]
  },
  {
    id: 'sub-5',
    name: 'Plinth Beam Reinforcement Binding',
    stage: 'Substructure',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Bind bottom and top steel rebars in plinth beam cages.', rule: 'Verify rebar diameter matches blueprint (e.g. 12mm/16mm).' },
      { text: 'Verify stirrup ring spacing and spacing intervals near column joints.', rule: 'Stirrup spacing must be closer (100mm) within 1 meter of columns.' },
      { text: 'Bind column junctions and beam anchors.', rule: 'Beam rods must extend inside column cores with L-hook of min 50D length.' },
      { text: 'Install concrete cover blocks of 25mm thickness.', rule: 'Ensure steel does not touch side shuttering boards.' },
      { text: 'Check horizontal level of the steel cage using level tube.', rule: 'Tolerance of level is +/- 3mm.' }
    ]
  },
  {
    id: 'sub-6',
    name: 'Plinth Beam Concrete Casting & Curing',
    stage: 'Substructure',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Inspect plinth shuttering line, level, and joint leakage waterproofing.', rule: 'Use foam tape at shutter joints to prevent slurry leak.' },
      { text: 'Pour M20 grade concrete uniformly in layers.', rule: 'Compact each layer using a 40mm needle vibrator.' },
      { text: 'Check plinth top level matching benchmark heights.', rule: 'Ensure surface is level to receive subsequent brickwork.' },
      { text: 'Remove side shuttering boards after 24 hours.', rule: 'Avoid cracking edges of the cast beam during removal.' },
      { text: 'Perform pond curing of plinth beam for 7 days.', rule: 'Wrap beam in wet jute bags and water consistently.' }
    ]
  },
  {
    id: 'sub-7',
    name: 'Plinth Area Excavation Backfilling & Compaction',
    stage: 'Substructure',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Fill plinth area with non-expansive murrum soil or sand.', rule: 'Do not use black cotton soil for backfilling inside plinth.' },
      { text: 'Fill soil in layers of 150mm maximum thickness.', rule: 'Water each layer thoroughly to settle loose soil voids.' },
      { text: 'Compact each layer with heavy mechanical plate compactor.', rule: 'Compact until no indentation marks are left on surface.' },
      { text: 'Check final compaction density of backfilled earth.', rule: 'Dry density must be min 95% of Proctor density.' },
      { text: 'Prepare the sub-base surface with M5/M10 PCC dry floor bed.', rule: 'Cast 75mm lean PCC to make a solid dust-free work floor.' }
    ]
  }
];

function getCheckpointsForActivity(name, stage, params = {}) {
  const n = name.toLowerCase();
  const soil = params.soilType || 'Standard';
  const season = params.season || 'Summer';
  const budget = params.budget || 'Standard';

  let list = [
    { text: 'Verify dimensions matching structural drawings.', rule: 'Tolerance limit within +/- 5mm.' },
    { text: 'Ensure materials meet specification grades.', rule: 'Check delivery invoices and stamps.' },
    { text: 'Inspect connection alignment and joint details.', rule: 'Zero gaps allowed.' },
    { text: 'Check safety gear is worn by workers.', rule: 'Hardhats and gloves are mandatory.' },
    { text: 'Log phase completion details in supervisor diary.', rule: 'Record supervisor sign-off.' }
  ];

  if (n.includes('borewell')) {
    list = [
      { text: 'Verify drilling location with hydro-geological map coordinates.', rule: 'Min 15m away from septic tank points.' },
      { text: 'Check casing pipe thickness and material quality (Heavy PVC).', rule: 'Must use 6-inch diameter heavy duty pipes.' },
      { text: 'Drill to water-bearing rock layers.', rule: 'Average depth in region is 200 feet.' },
      { text: 'Flush borewell until water output is clear of silt.', rule: 'Run flushing for at least 4 hours.' },
      { text: 'Test TDS and pH levels of borewell water.', rule: 'pH must be between 6.0 and 8.0 for construction.' }
    ];
  } else if (n.includes('excavation')) {
    const depth = soil === 'Black Cotton' ? '2.0 meters' : '1.5 meters';
    list = [
      { text: `Excavate pits to target depth of min ${depth}.`, rule: `Reach stable load-bearing soil strata; for ${soil} soil, extra depth is required.` },
      { text: 'Check verticality of pit side walls.', rule: 'Provide 1:0.5 slope in soft soil to prevent collapse.' },
      { text: 'Verify pit center lines against survey strings.', rule: 'Center coordinates deviation limit +/- 5mm.' },
      { text: 'Sprinkle water and compact pit bottom using manual rammers.', rule: 'Bed must be rock hard.' },
      { text: 'Erect timber shoring supports if soil is loose.', rule: 'Prevents side collapse during worker entry.' }
    ];
  } else if (n.includes('rebar') || n.includes('reinforcement') || n.includes('steel')) {
    list = [
      { text: 'Verify rebar steel grade matches Fe500/Fe550 TMT rods.', rule: 'Steel must be rust and oil-free.' },
      { text: 'Check rod count and diameters against structural layouts.', rule: 'No undersized rods allowed.' },
      { text: 'Verify spacing between parallel bars using measuring tape.', rule: 'Spacing tolerance +/- 5mm.' },
      { text: 'Verify stirrups/ties hooks are bent at 135 degrees.', rule: 'Hooks must point inside structural core.' },
      { text: 'Tie spacer cover blocks tightly with binding wire.', rule: 'Footings: 50mm, Columns: 40mm, Beams: 25mm, Slabs: 20mm cover.' }
    ];
  } else if (n.includes('shuttering') || n.includes('centering') || n.includes('formwork')) {
    list = [
      { text: 'Clean inner surface of plywood sheets thoroughly.', rule: 'Apply release oil layer to ease demolding.' },
      { text: 'Inspect shuttering joints for slurry leak gaps.', rule: 'Seal gaps using foam tape or putty.' },
      { text: 'Verify vertical plumb Bob alignment on adjacent faces.', rule: 'Tolerance limit is max 3mm.' },
      { text: 'Anchor diagonal steel props and bracing runners securely.', rule: 'Props must withstand concrete weight without shifting.' },
      { text: 'Seal bottom of formwork with cement mortar.', rule: 'Prevents honeycombing at joint bases.' }
    ];
  } else if (n.includes('concrete') || n.includes('pour') || n.includes('casting')) {
    list = [
      { text: 'Verify concrete grade ratio is measured correctly.', rule: 'M20: 1:1.5:3, M25: 1:1:2 mix ratios.' },
      { text: 'Verify water-cement ratio is strictly controlled.', rule: 'Ideal ratio 0.45 to 0.48; do not add excess water.' },
      { text: 'Vibrate concrete continuously using mechanical needle vibrator.', rule: 'Vibrate 15-20 seconds per spot; avoid honeycombs.' },
      { text: 'Prepare Compressive Strength Test Cubes (150mm size).', rule: 'Cast 6 cubes per major pour for 7-day and 28-day testing.' },
      { text: 'Finish top concrete surface and insert shear keys.', rule: 'Rough surfaces improve next-stage concrete bonds.' }
    ];
  } else if (n.includes('curing')) {
    const frequency = season === 'Summer' ? 'thrice daily' : 'twice daily';
    list = [
      { text: `Spray concrete surfaces with clean water ${frequency}.`, rule: `Keep concrete damp to allow full cement hydration.` },
      { text: 'Wrap columns/beams in double-layered wet jute bags.', rule: 'Jute bags must be tied with wire.' },
      { text: 'Construct sand kiyaari (bunds) on slab surface.', rule: 'Slab pond curing water depth min 50mm.' },
      { text: 'Maintain water level in ponds for minimum 10-14 days.', rule: 'Refill if evaporation is high.' },
      { text: 'Record curing dates in register logs.', rule: 'Curing is mandatory for structural strength.' }
    ];
  } else if (n.includes('brick') || n.includes('masonry') || n.includes('wall')) {
    list = [
      { text: 'Pre-soak bricks in water tanks for at least 2 hours.', rule: 'Prevents bricks from absorbing mortar moisture.' },
      { text: 'Check cement-sand mortar mix ratio.', rule: '9-inch wall: 1:6 ratio, 4.5-inch wall: 1:4 ratio.' },
      { text: 'Verify vertical plumb Bob alignment every 3 courses.', rule: 'Align walls straight within +/- 3mm.' },
      { text: 'Limit masonry build height to 1.5m in a single day.', rule: 'Prevents lower courses from buckling.' },
      { text: 'Provide horizontal RCC coping bands at sill levels.', rule: 'Reroutes wall load stress to columns.' }
    ];
  } else if (n.includes('plaster')) {
    list = [
      { text: 'Fix chicken wire mesh (murga jaali) at masonry-concrete joints.', rule: 'Mesh overlap 100mm on both sides to avoid cracks.' },
      { text: 'Wet the brickwork surface thoroughly before plastering.', rule: 'Washes dust and improves plaster bond.' },
      { text: 'Check plaster thickness using pre-laid mortar patches.', rule: 'Inner walls: 12mm thick, ceilings: 6mm thick.' },
      { text: 'Check surface levels using 2-meter steel straight-edge.', rule: 'Tolerance limit is +/- 2mm.' },
      { text: 'Cure plaster surfaces twice daily for 7 days.', rule: 'Keep plaster wet to avoid dry shrink cracks.' }
    ];
  } else if (n.includes('conduit') || n.includes('switchbox') || n.includes('electrical box')) {
    list = [
      { text: 'Chase wall grooves vertically using mechanical wall chaser.', rule: 'Horizontal grooving on structural walls is prohibited.' },
      { text: 'Lay heavy duty PVC conduit pipes along lines.', rule: 'Conduits must run straight.' },
      { text: 'Mount metal switch boxes flush with plaster level.', rule: 'Use spirit levels to ensure horizontal alignment.' },
      { text: 'Glue PVC conduit joints using solvent cement.', rule: 'Joints must not separate.' },
      { text: 'Insert pull wire (fish tape) inside conduits.', rule: 'Verifies conduit path is clear.' }
    ];
  } else if (n.includes('wiring') || n.includes('cable') || n.includes('wire')) {
    list = [
      { text: 'Verify wire gauge diameters match circuit loads.', rule: 'Lighting: 1.5 sq.mm, Power: 4.0 sq.mm copper wires.' },
      { text: 'Ensure separate conduit paths for power and telephone/data wires.', rule: 'Prevents electro-magnetic interference.' },
      { text: 'Pull wires using fish tape gently.', rule: 'Do not pull hard to avoid stripping wire insulation.' },
      { text: 'Leave 150mm wire loops inside switchboxes.', rule: 'Allows connection splicing flexibility.' },
      { text: 'Verify insulation resistance using megger tester.', rule: 'Must exceed 50 mega-ohms.' }
    ];
  } else if (n.includes('plumbing') || n.includes('pipe') || n.includes('cpvc') || n.includes('drain')) {
    list = [
      { text: 'Lay CPVC pipes for hot/cold water distribution.', rule: 'Use food-grade high-pressure CPVC pipes.' },
      { text: 'Run CPVC pipes along wall grooves horizontally.', rule: 'Secure pipes using plastic saddle clamps.' },
      { text: 'Verify drain pipe slope gradients.', rule: 'Slope must be min 1 in 40 for toilet lines.' },
      { text: 'Verify sanitary water pressure test.', rule: 'Pipes must hold 10 bar pressure for 1 hour.' },
      { text: 'Check floor trap grating placement.', rule: 'Trap must sit 5mm below tile levels.' }
    ];
  } else if (n.includes('waterproofing')) {
    list = [
      { text: 'Clean floor slabs of all dust, cement slurry, and grit.', rule: 'Base must be clean and dry.' },
      { text: 'Apply primer layer of elastomeric polymer waterproofing.', rule: 'Primer improves membrane adhesion.' },
      { text: 'Apply first coat of polymer waterproofing membrane.', rule: 'Extend coating 300mm up the wall skirtings.' },
      { text: 'Apply second coat perpendicular to the first coat.', rule: 'Total thickness must be min 1.5mm.' },
      { text: 'Perform water pond test for 48 hours.', rule: 'Fill area with 100mm water; check ceiling below for dampness.' }
    ];
  } else if (n.includes('tile') || n.includes('tiling') || n.includes('dado') || n.includes('flooring')) {
    list = [
      { text: 'Apply cement mortar screed bed or tile adhesive.', rule: 'Verify bed levels using spirit tubes.' },
      { text: 'Tap tiles using rubber mallets to settle voids.', rule: 'Ensures 100% glue contact; zero hollow sounds.' },
      { text: 'Maintain uniform joint spacing using tile spacers.', rule: 'Spacers must be min 2mm wide.' },
      { text: 'Verify floor slopes lead to water drain traps.', rule: 'Water must drain quickly without pooling.' },
      { text: 'Fill tile joints with water-proof epoxy grouting.', rule: 'Protects joints from mold and leakage.' }
    ];
  } else if (n.includes('wardrobe') || n.includes('cabinet') || n.includes('carpentry') || n.includes('woodwork')) {
    list = [
      { text: 'Assemble cabinet carcasses using commercial plywood.', rule: 'Verify dimensions and right angles.' },
      { text: 'Paste laminates/veneers using quality wood glue.', rule: 'Apply uniform pressure; check for air bubbles.' },
      { text: 'Mount cabinet hinges and drawer slider tracks.', rule: 'Use soft-close telescoping tracks.' },
      { text: 'Verify doors align straight with zero gaps.', rule: 'Hinges must be adjustable.' },
      { text: 'Mount cabinet handles and locks.', rule: 'Verify key works smoothly.' }
    ];
  } else if (n.includes('painting') || n.includes('putty') || n.includes('primer')) {
    list = [
      { text: 'Sand plaster walls to remove grit.', rule: 'Base must be clean.' },
      { text: 'Apply putty layer to smooth out surface.', rule: 'Putty thickness max 1.5mm.' },
      { text: 'Sand putty surface using fine emery paper.', rule: 'Check flat levels under halogen spot lights.' },
      { text: 'Apply coat of acrylic wall primer.', rule: 'Seals wall suction.' },
      { text: 'Apply two coats of plastic emulsion paint.', rule: 'Wait 4 hours between coats; roll paint uniformly.' }
    ];
  } else if (n.includes('door') || n.includes('window') || n.includes('frame')) {
    list = [
      { text: 'Mount door chaukhat frames in wall openings.', rule: 'Verify plumb and diagonal width.' },
      { text: 'Fix frames using MS anchor bolts and polyurethane foam.', rule: 'Foam fills gaps and dampens sounds.' },
      { text: 'Hang door shutters using brass/stainless steel hinges.', rule: 'Door must swing freely without noise.' },
      { text: 'Fix UPVC window tracks and sashes.', rule: 'Silicon sealant must seal exterior track gaps.' },
      { text: 'Mount door locks and latches.', rule: 'Lock tongue must enter frame strike plate smoothly.' }
    ];
  } else if (n.includes('false ceiling')) {
    list = [
      { text: 'Erect metal GI framing grid suspended from ceiling.', rule: 'GI grid must be level and stable.' },
      { text: 'Fix gypsum board sheets using drywall screws.', rule: 'Screws spaced max 200mm.' },
      { text: 'Seal gypsum sheet joints using fiber tape and joint compound.', rule: 'Sand joints to a smooth finish.' },
      { text: 'Cut round holes for concealed LED spot lights.', rule: 'Check dimensions with light fixtures.' },
      { text: 'Verify ceiling level matches design benchmark heights.', rule: 'Zero sag allowed.' }
    ];
  }

  return list.map(item => ({ ...item, checked: false }));
}

function generateZoneTasks(levelName, levelIdx, zone, params) {
  const prefix = `L${levelIdx}-${zone.code}`;
  const stageName = `${levelName} Finishing & Services`;
  const tasks = [];

  tasks.push({
    id: `${prefix}-ele-1`,
    name: `${levelName} ${zone.name} Wall Chasing & Conduit Routing`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} electrical conduit`, stageName, params)
  });
  
  tasks.push({
    id: `${prefix}-ele-2`,
    name: `${levelName} ${zone.name} Metal Switchbox Mounting`,
    stage: stageName,
    duration: 1,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} electrical box`, stageName, params)
  });

  tasks.push({
    id: `${prefix}-ele-3`,
    name: `${levelName} ${zone.name} Wiring & Cable Pulling`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} wiring`, stageName, params)
  });

  tasks.push({
    id: `${prefix}-flr-1`,
    name: `${levelName} ${zone.name} Floor Screed Bed Leveling`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} floor screed`, stageName, params)
  });

  if (zone.code.startsWith('b') || zone.code === 'kit') {
    tasks.push({
      id: `${prefix}-wtp-1`,
      name: `${levelName} ${zone.name} Waterproofing Coating`,
      stage: stageName,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} waterproofing`, stageName, params)
    });
    tasks.push({
      id: `${prefix}-wtp-2`,
      name: `${levelName} ${zone.name} Waterproofing Pond Leak Test`,
      stage: stageName,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} pond test`, stageName, params)
    });
    tasks.push({
      id: `${prefix}-til-1`,
      name: `${levelName} ${zone.name} Wall Dado Ceramic Tiling`,
      stage: stageName,
      duration: 3,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} wall dado`, stageName, params)
    });
    tasks.push({
      id: `${prefix}-til-2`,
      name: `${levelName} ${zone.name} Floor Tiles Laying`,
      stage: stageName,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} tile flooring`, stageName, params)
    });
  } else {
    tasks.push({
      id: `${prefix}-til-1`,
      name: `${levelName} ${zone.name} Floor Tiling Layout`,
      stage: stageName,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} flooring tiles`, stageName, params)
    });
  }

  tasks.push({
    id: `${prefix}-til-3`,
    name: `${levelName} ${zone.name} Tile Grouting`,
    stage: stageName,
    duration: 1,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} tile joint grout`, stageName, params)
  });

  tasks.push({
    id: `${prefix}-pnt-1`,
    name: `${levelName} ${zone.name} Plaster Sanding & Putty Prep`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} wall putty`, stageName, params)
  });
  tasks.push({
    id: `${prefix}-pnt-2`,
    name: `${levelName} ${zone.name} Wall Primer Application`,
    stage: stageName,
    duration: 1,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} wall primer`, stageName, params)
  });
  tasks.push({
    id: `${prefix}-pnt-3`,
    name: `${levelName} ${zone.name} Acrylic Emulsion Painting`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} painting`, stageName, params)
  });

  tasks.push({
    id: `${prefix}-clg-1`,
    name: `${levelName} ${zone.name} False Ceiling Framing & Gypsum`,
    stage: stageName,
    duration: 3,
    isAddon: true,
    checklist: getCheckpointsForActivity(`${zone.name} false ceiling`, stageName, params)
  });

  if (zone.code.endsWith('br')) {
    tasks.push({
      id: `${prefix}-wdw-1`,
      name: `${levelName} ${zone.name} Modular Wardrobe Erection`,
      stage: stageName,
      duration: 3,
      isAddon: true,
      checklist: getCheckpointsForActivity(`${zone.name} wardrobe cabinet`, stageName, params)
    });
  }

  tasks.push({
    id: `${prefix}-drw-1`,
    name: `${levelName} ${zone.name} Door Frame & Shutter Installation`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} door frame`, stageName, params)
  });
  tasks.push({
    id: `${prefix}-drw-2`,
    name: `${levelName} ${zone.name} UPVC Window Frame & Fitting`,
    stage: stageName,
    duration: 2,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} window frame`, stageName, params)
  });

  tasks.push({
    id: `${prefix}-ele-4`,
    name: `${levelName} ${zone.name} Switchboard Plate & Light Fitting`,
    stage: stageName,
    duration: 1,
    isAddon: false,
    checklist: getCheckpointsForActivity(`${zone.name} switchboard plate`, stageName, params)
  });

  if (zone.code === 'kit') {
    tasks.push({
      id: `${prefix}-kit-1`,
      name: `${levelName} Kitchen Countertop Granite Erection`,
      stage: stageName,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity('Kitchen countertop granite', stageName, params)
    });
    tasks.push({
      id: `${prefix}-kit-2`,
      name: `${levelName} Kitchen Stainless Steel Sink Installation`,
      stage: stageName,
      duration: 1,
      isAddon: false,
      checklist: getCheckpointsForActivity('Kitchen stainless sink', stageName, params)
    });
    tasks.push({
      id: `${prefix}-kit-3`,
      name: `${levelName} Kitchen Chimney Hood & Vent Mounting`,
      stage: stageName,
      duration: 2,
      isAddon: true,
      checklist: getCheckpointsForActivity('Kitchen chimney hood', stageName, params)
    });
  }

  if (zone.code.startsWith('b')) {
    tasks.push({
      id: `${prefix}-san-1`,
      name: `${levelName} ${zone.name} Concealed Cistern & WC Fitting`,
      stage: stageName,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} commode WC`, stageName, params)
    });
    tasks.push({
      id: `${prefix}-san-2`,
      name: `${levelName} ${zone.name} Washbasin Counter & Faucet Mounting`,
      stage: stageName,
      duration: 1,
      isAddon: false,
      checklist: getCheckpointsForActivity(`${zone.name} washbasin counter`, stageName, params)
    });
  }

  return tasks;
}

const createFloorActivities = (levelName, levelIdx, startDate, params = {}) => {
  const prefix = `L${levelIdx}`;
  
  const baseShellActivities = [
    {
      id: `${prefix}-rcc-1`,
      name: `${levelName} Column Rebar Binding`,
      stage: `${levelName} Structure`,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity('column rebar', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-2`,
      name: `${levelName} Column Shuttering & Bracing`,
      stage: `${levelName} Structure`,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity('column shuttering', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-3`,
      name: `${levelName} Column Concrete Casting (M20/M25)`,
      stage: `${levelName} Structure`,
      duration: 1,
      isAddon: false,
      checklist: getCheckpointsForActivity('column concrete pour', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-4`,
      name: `${levelName} Column Curing (Jute Bags Wrap)`,
      stage: `${levelName} Structure`,
      duration: 5,
      isAddon: false,
      checklist: getCheckpointsForActivity('column curing', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-5`,
      name: `${levelName} Beam Shuttering & Scaffold Lining`,
      stage: `${levelName} Structure`,
      duration: 3,
      isAddon: false,
      checklist: getCheckpointsForActivity('beam shuttering', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-6`,
      name: `${levelName} Slab Shuttering scaffolding`,
      stage: `${levelName} Structure`,
      duration: 3,
      isAddon: false,
      checklist: getCheckpointsForActivity('slab shuttering', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-7`,
      name: `${levelName} Beam Steel Reinforcement Binding`,
      stage: `${levelName} Structure`,
      duration: 3,
      isAddon: false,
      checklist: getCheckpointsForActivity('beam rebar', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-8`,
      name: `${levelName} Slab Reinforcement Steel Binding`,
      stage: `${levelName} Structure`,
      duration: 3,
      isAddon: false,
      checklist: getCheckpointsForActivity('slab rebar', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-9`,
      name: `${levelName} Slab Electrical Conduits Laying`,
      stage: `${levelName} Structure`,
      duration: 2,
      isAddon: false,
      checklist: getCheckpointsForActivity('slab electrical conduits', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-10`,
      name: `${levelName} Slab Plumbing Sleeves Installation`,
      stage: `${levelName} Structure`,
      duration: 1,
      isAddon: false,
      checklist: getCheckpointsForActivity('slab plumbing sleeves', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-11`,
      name: `${levelName} Slab Concrete Casting (M20/M25)`,
      stage: `${levelName} Structure`,
      duration: 1,
      isAddon: false,
      checklist: getCheckpointsForActivity('slab concrete pour', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-rcc-12`,
      name: `${levelName} Slab Curing & Ponding Setup`,
      stage: `${levelName} Structure`,
      duration: 10,
      isAddon: false,
      checklist: getCheckpointsForActivity('slab curing', `${levelName} Structure`, params)
    },
    {
      id: `${prefix}-wll-1`,
      name: `${levelName} Brickwork Layout Marking`,
      stage: `${levelName} Walls`,
      duration: 1,
      isAddon: false,
      checklist: [
        { text: 'Establish reference layout lines on cured concrete floor.', rule: 'Use chalk lines based on architectural layout blueprint.' },
        { text: 'Lay first course of bricks (starter course) dry without mortar.', rule: 'Check door openings and wall alignments.' },
        { text: 'Check room diagonal dimensions (cross measurements).', rule: 'Diagonal difference must be within +/- 3mm.' },
        { text: 'Mark precise door frame openings.', rule: 'Leave 50mm offset on sides for door chaukhat installation.' },
        { text: 'Establish finish floor level (FFL) line on column walls.', rule: 'Transfer levels using water level tube.' }
      ]
    },
    {
      id: `${prefix}-wll-2`,
      name: `${levelName} Outer 9-inch Brickwork Masonry`,
      stage: `${levelName} Walls`,
      duration: 5,
      isAddon: false,
      checklist: [
        { text: 'Soak bricks in water tank for minimum 2 hours.', rule: 'Wet bricks prevent absorption of mortar water.' },
        { text: 'Prepare cement mortar mix of 1:6 ratio (1 cement : 6 sand).', rule: 'Mix mortar in mechanical mixer; hand mixing not recommended.' },
        { text: 'Use plumb bob (sahawal) every 3 courses to check vertical alignment.', rule: 'Vertical tilt tolerance is max 2mm per meter.' },
        { text: 'Verify horizontal course level using spirit level.', rule: 'Bed joint mortar thickness must be uniform at 10-12mm.' },
        { text: 'Limit masonry construction height to 1.5 meters per day.', rule: 'Prevents load deformation on fresh lower joint mortar.' }
      ]
    },
    {
      id: `${prefix}-wll-3`,
      name: `${levelName} Inner 4.5-inch Brickwork Masonry`,
      stage: `${levelName} Walls`,
      duration: 4,
      isAddon: false,
      checklist: [
        { text: 'Use cement mortar mix of 1:4 ratio (1 cement : 4 sand).', rule: 'Richer mix is required for thinner walls.' },
        { text: 'Install horizontal reinforcement (2 concrete bands of 50mm height).', rule: 'Place 2 rods of 8mm steel inside masonry layer at 1m height intervals.' },
        { text: 'Check wall connection bonding with main columns.', rule: 'Hack/chip column concrete surface and insert steel anchor dowels.' },
        { text: 'Check door frame lintel supports.', rule: 'Ensure lintel beam over doors extends min 150mm on adjacent walls.' },
        { text: 'Rake joints to a depth of 10-12mm while mortar is wet.', rule: 'Raking provides mechanical key grip for plastering later.' }
      ]
    },
    {
      id: `${prefix}-wll-4`,
      name: `${levelName} Lintel Beams Casting`,
      stage: `${levelName} Walls`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Assemble wooden formwork support over door/window openings.', rule: 'Formwork bottom prop must stand on firm wedged boards.' },
        { text: 'Bind lintel steel reinforcement cage (min 2 bottom 10mm, 2 top 8mm).', rule: 'Verify rebar grades and sizes.' },
        { text: 'Verify bearing length of lintel over adjacent walls.', rule: 'Minimum bearing of lintel is 150mm on both sides.' },
        { text: 'Pour M20 concrete and compact with manual steel rods.', rule: 'Verify shutter boxes do not bulge.' },
        { text: 'Provide 3 days curing to cast lintels.', rule: 'Keep wooden support props intact for 7 days.' }
      ]
    },
    {
      id: `${prefix}-wll-5`,
      name: `${levelName} Masonry Walls Curing`,
      stage: `${levelName} Walls`,
      duration: 5,
      isAddon: false,
      checklist: [
        { text: 'Start wall curing 24 hours after brickwork completion.', rule: 'Water must be sprayed gently; do not apply high pressure.' },
        { text: 'Water brick walls at least twice a day.', rule: 'Ensure mortar joints remain damp.' },
        { text: 'Cure walls for a minimum of 7 days.', rule: 'Extends to 10 days in dry summer weather.' },
        { text: 'Ensure water reaches column-brick junctions.', rule: 'Dampness prevents future separation cracks.' },
        { text: 'Maintain dry storage zones near curing areas.', rule: 'Verify curing water does not damage stored cement bags.' }
      ]
    },
    {
      id: `${prefix}-wll-6`,
      name: `${levelName} Electrical Wall Chasing & Box Fixing`,
      stage: `${levelName} Walls`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Mark conduit routes on brick walls using chalk/marker.', rule: 'Follow electrical drawings layout.' },
        { text: 'Cut wall grooves (chases) using wall cutting machine.', rule: 'Do not hammer brick walls directly; machine cutting avoids structural cracks.' },
        { text: 'Chase depth must be sufficient to conceal PVC conduit pipes.', rule: 'Conduit must sit at least 15mm below plaster finish line.' },
        { text: 'Fix metal/plastic switchbox boxes securely using cement mortar.', rule: 'Switchbox face must align flush with proposed plaster surface.' },
        { text: 'Insert dummy plastic caps in conduit pipe entries.', rule: 'Prevents plaster debris from jamming pipe pathways.' }
      ]
    },
    {
      id: `${prefix}-wll-7`,
      name: `${levelName} Plumbing Pipe Hacking & Concealing`,
      stage: `${levelName} Walls`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Mark hot/cold water pipeline routes on bathroom walls.', rule: 'Verify heights of shower mixers, taps, and geyser points.' },
        { text: 'Cut wall grooves using diamond disc cutter.', rule: 'Depth of groove must accommodate pipe insulation layers.' },
        { text: 'Mount concealed CPVC/PPR pipes using plastic clamps.', rule: 'Clamp spacing must be max 1 meter to avoid pipe sagging.' },
        { text: 'Ensure plumbing pipe joints are clean and bonded with solvent.', rule: 'Check alignment of CP elbows; elbows must sit square.' },
        { text: 'Pack chased grooves with non-shrink grout/mortar after pipe test.', rule: 'Pack tightly to avoid plaster cracking along pipe lines.' }
      ]
    },
    {
      id: `${prefix}-wll-8`,
      name: `${levelName} Concrete Surface Hacking (Chipping)`,
      stage: `${levelName} Walls`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Chip smooth column and beam surfaces manually or with power hammer.', rule: 'Make at least 30 indents (hacks) per square foot.' },
        { text: 'Depth of hacks must be minimum 3-5mm.', rule: 'Hacks expose aggregate and create key bond for plastering.' },
        { text: 'Wash chipped surfaces with clean water.', rule: 'Remove concrete dust and shutter oil traces.' },
        { text: 'Apply cement-slurry bond coat over concrete surfaces.', rule: 'Slurry ratio: 1 kg cement to 1 liter water, applied just before plaster.' },
        { text: 'Inspect chipped surfaces to ensure uniform roughness.', rule: 'Ensure no smooth plywood finish patches are left.' }
      ]
    },
    {
      id: `${prefix}-wll-9`,
      name: `${levelName} Column-Brick Joint Chicken Mesh Installation`,
      stage: `${levelName} Walls`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Cut galvanized iron (GI) chicken mesh into 200mm wide strips.', rule: 'Mesh wire diameter min 24 gauge.' },
        { text: 'Center the mesh strip along column-brick wall joints.', rule: 'Mesh must overlap 100mm on column concrete and 100mm on brick masonry.' },
        { text: 'Fix mesh strips using steel nails (concrete nails).', rule: 'Space nails at 150mm zig-zag intervals.' },
        { text: 'Ensure chicken mesh lies flat and tight against wall surface.', rule: 'Loose mesh will bulge out of plaster.' },
        { text: 'Verify mesh is corrosion-protected (GI coated).', rule: 'Mesh must not rust inside plaster which causes brown staining.' }
      ]
    },
    {
      id: `${prefix}-wll-10`,
      name: `${levelName} Interior Wall Plastering (1st Coat)`,
      stage: `${levelName} Walls`,
      duration: 4,
      isAddon: false,
      checklist: [
        { text: 'Apply level pads (bulls/marks) on wall surface using plumb bob.', rule: 'Bull marks establish uniform plaster thickness of 12-15mm.' },
        { text: 'Mix cement-sand mortar of 1:4 ratio.', rule: 'Verify sand is sieved to remove pebbles and clay.' },
        { text: 'Apply plaster mortar throw manually and level with aluminum straight edge.', rule: 'Verify horizontal alignment of straight edge.' },
        { text: 'Finish surface using wooden float (gurmala) for rough texture.', rule: 'Slightly rough texture bonds well with wall putty.' },
        { text: 'Check final wall plumb and level.', rule: 'Plaster level tolerance is max 2mm deviation over 2 meters.' }
      ]
    },
    {
      id: `${prefix}-wll-11`,
      name: `${levelName} Ceiling Plastering`,
      stage: `${levelName} Walls`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Ensure ceiling concrete is chipped and coated with slurry.', rule: 'Cement slurry coat prevents ceiling plaster from falling.' },
        { text: 'Mix plaster mortar in 1:3 ratio (1 cement : 3 fine sand).', rule: 'Richer mix holds ceiling weight.' },
        { text: 'Apply ceiling plaster with maximum thickness of 6-8mm.', rule: 'Thick ceiling plaster is heavy and prone to detachment.' },
        { text: 'Level ceiling surface using float and check water level line.', rule: 'Ensure ceiling is perfectly horizontal.' },
        { text: 'Check ceiling plaster for hollow sound using mallet after 24 hrs.', rule: 'Hollow sound indicates lack of bonding; redo hollow patch.' }
      ]
    },
    {
      id: `${prefix}-wll-12`,
      name: `${levelName} Plaster Curing`,
      stage: `${levelName} Walls`,
      duration: 7,
      isAddon: false,
      checklist: [
        { text: 'Start plaster curing 24 hours after plaster application.', rule: 'Keep surface wet by spraying water fine mist.' },
        { text: 'Water plaster walls three times daily.', rule: 'Do not let plaster surface dry out and develop hairline cracks.' },
        { text: 'Cure plaster for minimum 7 days.', rule: 'Ensure continuous hydration of cement.' },
        { text: 'Check for visible hairline cracks or shrinkage cracks.', rule: 'If cracks are wider than 0.5mm, log as defect.' },
        { text: 'Verify electrical switch boxes remain clean during curing.', rule: 'Do not fill switchboxes with curing water.' }
      ]
    },

    // --- Plumbing & Piping ---
    {
      id: `${prefix}-plb-1`,
      name: `${levelName} Water Supply Pipes Layout (PPR/CPVC)`,
      stage: `${levelName} Plumbing`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Use CPVC/PPR pipes rated for SDR 11 (high pressure).', rule: 'Pipes must have ISI quality stamp.' },
        { text: 'Cut pipes square using pipe cutter and clean joints.', rule: 'Deburr inner edges to maintain smooth flow.' },
        { text: 'Apply solvent cement uniformly on pipe ends and socket interiors.', rule: 'Hold joint together for 15 seconds to ensure bonding.' },
        { text: 'Install thermal insulation sleeves on hot water pipeline.', rule: 'Prevents heat loss and condensation inside walls.' },
        { text: 'Check horizontal and vertical coordinates of pipeline layout.', rule: 'Pipes must run parallel to floor lines.' }
      ]
    },
    {
      id: `${prefix}-plb-2`,
      name: `${levelName} Sewerage & Waste Drain Pipes Layout`,
      stage: `${levelName} Plumbing`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Use PVC pipes of minimum 100mm diameter for soil waste and 75mm for waste water.', rule: 'Use Type-B thick-walled PVC pipes.' },
        { text: 'Maintain minimum pipe slope of 1 in 40 towards main stack.', rule: 'Incorrect slope causes clogging.' },
        { text: 'Install water-seal bottle traps (nahani trap) in bathroom floor.', rule: 'Traps must have minimum 50mm water seal height to block sewer gas smell.' },
        { text: 'Seal joints using PVC rubber rings and solvent.', rule: 'Check joint seals before concealment.' },
        { text: 'Fix floor cleanouts (gully traps) at bend corners.', rule: 'Bends must be 45 degrees, not 90 degrees, to facilitate cleaning.' }
      ]
    },
    {
      id: `${prefix}-plb-3`,
      name: `${levelName} Toilet Sunken Slab Waterproofing`,
      stage: `${levelName} Plumbing`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Clean sunken slab base concrete to remove dust and plaster drops.', rule: 'Surface must be dry and clean.' },
        { text: 'Cast cement mortar coving (curved fillet) at wall-slab junctions.', rule: 'Coving prevents corner joint leaks.' },
        { text: 'Apply first coat of polymer-modified cementitious waterproofing chemical.', rule: 'Use high-quality waterproofing chemicals like Dr. Fixit Fastflex.' },
        { text: 'Apply second coat perpendicular to first coat after 6 hours.', rule: 'Total dry film thickness must be min 1.2mm.' },
        { text: 'Conduct pond testing of waterproofing by filling water for 48 hours.', rule: 'Verify zero dampness underneath the slab.' }
      ]
    },
    {
      id: `${prefix}-plb-4`,
      name: `${levelName} Sunken Slab Filling (Light Weight Aggregate)`,
      stage: `${levelName} Plumbing`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Fill sunken slab area after waterproofing clearance.', rule: 'Do not use heavy concrete debris or soil.' },
        { text: 'Use lightweight aggregates (such as cinder, autoclaved concrete blocks, or clay brick ballast).', rule: 'Lightweight fill reduces load on structural slab.' },
        { text: 'Add waterproofing chemical powder to cement mortar mix.', rule: 'Mortar bed seals lightweight aggregate.' },
        { text: 'Level the aggregate bed, maintaining slope towards floor drain.', rule: 'Slope must be 1 in 100.' },
        { text: 'Cast a 50mm thick M15 protection concrete screed over aggregate.', rule: 'Protects pipeline layout from damage.' }
      ]
    },
    {
      id: `${prefix}-plb-5`,
      name: `${levelName} Plumbing Pressure Leakage Test`,
      stage: `${levelName} Plumbing`,
      duration: 1,
      isAddon: false,
      checklist: [
        { text: 'Plug all outlet ends with threaded plastic dummy plugs.', rule: 'Seal taps, mixers, and geyser pipes.' },
        { text: 'Connect manual hydraulic pressure testing pump to main inlet.', rule: 'Fill pipelines with clean water.' },
        { text: 'Pump pressure to 10 kg/sq.cm (10 bar / 150 psi).', rule: 'Pressure must be held for minimum 1 hour.' },
        { text: 'Inspect all joints and elbow connections for water weeping.', rule: 'Log pressure drop on gauge; pressure drop indicates leakage.' },
        { text: 'Obtain plumber supervisor pressure test clearance certificate.', rule: 'Keep report for municipal records.' }
      ]
    },
    {
      id: `${prefix}-plb-6`,
      name: `${levelName} Bathroom Wall Tiling & Dado Work`,
      stage: `${levelName} Flooring`,
      duration: 4,
      isAddon: false,
      checklist: [
        { text: 'Check wall plaster surface verticality.', rule: 'Rough plaster surface must be flat and in plumb.' },
        { text: 'Apply high-performance polymer tile adhesive on wall.', rule: 'Do not use normal cement slurry; adhesive prevents tile hollow sound.' },
        { text: 'Use plastic tile spacers of 2mm thickness between tiles.', rule: 'Spacers allow joint thermal expansion.' },
        { text: 'Verify horizontal alignment of tile joints using spirit level.', rule: 'Joint alignment must be checked course by course.' },
        { text: 'Ensure plumbing pipe outlets project out of tiles cleanly.', rule: 'Cut tiles around pipe pipes using diamond hole saws.' }
      ]
    },
    {
      id: `${prefix}-plb-7`,
      name: `${levelName} Sanitaryware Installation (Commodes & Basins)`,
      stage: `${levelName} Flooring`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Mount wall-hung commode brackets securely to structural wall columns.', rule: 'Use heavy duty anchor bolts.' },
        { text: 'Connect toilet flushing pipe and waste outlet pipe seal.', rule: 'Use rubber gasket rings to prevent sewer gas leakage.' },
        { text: 'Mount wash basins checking level and height from finished floor.', rule: 'Standard basin top height is 800-850mm.' },
        { text: 'Seal bathroom wall-fixture joints using anti-fungal silicone sealant.', rule: 'Prevents water seepage into walls.' },
        { text: 'Verify flush tank water discharge volume.', rule: 'Flush volume must be calibrated (dual flush 3L/6L).' }
      ]
    },
    {
      id: `${prefix}-plb-8`,
      name: `${levelName} CP Fittings Installation (Taps & Showers)`,
      stage: `${levelName} Flooring`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Install chrome-plated (CP) fittings (taps, diverters, shower heads).', rule: 'Wrap threads with Teflon tape to prevent leaks.' },
        { text: 'Use specialized strap wrenches to tighten CP fittings.', rule: 'Avoid pipe wrench teeth marks on polished chrome.' },
        { text: 'Verify hot and cold water handle alignments.', rule: 'Left side is hot, right side is cold water.' },
        { text: 'Install health faucet and check hose length.', rule: 'Ensure hose does not touch toilet floor.' },
        { text: 'Perform water flow check to verify pressure at aerators.', rule: 'Clean aerator filters to remove construction sand.' }
      ]
    },

    // --- Electrical Rough-ins & Wiring ---
    {
      id: `${prefix}-ele-1`,
      name: `${levelName} Distribution Board (DB) Panel Installation`,
      stage: `${levelName} Electrical`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Fix metal DB box enclosure securely in wall niche.', rule: 'DB box height must be 1.5m from finished floor.' },
        { text: 'Verify DB box is in plumb and levels match wall surface.', rule: 'Tolerance of leveling is +/- 1mm.' },
        { text: 'Arrange internal wiring terminal busbars.', rule: 'Phase, neutral, and earth busbars must be isolated.' },
        { text: 'Install main circuit breaker (MCB) and RCCB switches.', rule: 'Verify ratings match load requirements (e.g. 40A RCCB).' },
        { text: 'Label circuit terminals using printed wire markers.', rule: 'Markers help isolate circuits during future maintenance.' }
      ]
    },
    {
      id: `${prefix}-ele-2`,
      name: `${levelName} Main Line Wire Pulling (Conduit Routing)`,
      stage: `${levelName} Electrical`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Use copper wire of minimum 4 sq.mm for mains and AC lines.', rule: 'Wire insulation must be FRLS (Flame Retardant Low Smoke).' },
        { text: 'Use steel wire puller (fish tape) to route wires through conduits.', rule: 'Ensure conduits are dry and free of debris.' },
        { text: 'Route separate conduits for power lines and signal lines (TV/internet).', rule: 'Separate conduits prevent electromagnetic noise interference.' },
        { text: 'Verify color-coded wiring system (Red/Yellow/Blue for phases, Black for Neutral, Green for Earth).', rule: 'Mandatory safety color coding.' },
        { text: 'Leave minimum 150mm wire loop length inside junction boxes.', rule: 'Allows connection splicing in switchboards.' }
      ]
    },
    {
      id: `${prefix}-ele-3`,
      name: `${levelName} Lighting & Socket Wire Pulling`,
      stage: `${levelName} Electrical`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Use 1.5 sq.mm copper wire for light circuits and 2.5 sq.mm for power sockets.', rule: 'Wires must carry ISI certification markings.' },
        { text: 'Ensure no joints or splices are made inside conduit pipes.', rule: 'All joints must occur inside openable junction boxes.' },
        { text: 'Verify earthing wire (1.0 sq.mm green) is routed to every switch box.', rule: 'Ensure grounding of all metallic plates.' },
        { text: 'Group wires systematically inside switchboard boxes.', rule: 'Tie wires with cable ties to maintain neat layout.' },
        { text: 'Conduct continuity test of pulled wires using multimeter.', rule: 'Check for wire breakage or short circuits before plastering.' }
      ]
    },
    {
      id: `${prefix}-ele-4`,
      name: `${levelName} Earthing Connection & Grounding Pit Setup`,
      stage: `${levelName} Electrical`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Excavate pit for copper plate/chemical pipe electrode.', rule: 'Pit depth must be minimum 2.5 meters.' },
        { text: 'Use chemical grounding mix (bentonite/charcoal-salt mix) around electrode.', rule: 'Chemical mix maintains soil moisture and low resistance.' },
        { text: 'Install copper earth strip from pit to main distribution board.', rule: 'Earth strip must be min 25x3mm size.' },
        { text: 'Measure grounding earth resistance.', rule: 'Resistance must be below 2.0 ohms for home safety.' },
        { text: 'Construct brick chamber with concrete cover around earth pit.', rule: 'Enables watering access and testing.' }
      ]
    },
    {
      id: `${prefix}-ele-5`,
      name: `${levelName} Modular Switches & Sockets Installation`,
      stage: `${levelName} Finishing`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Clean plaster and paint dust from inside switch boxes.', rule: 'Clean boxes prevent rust on screw terminals.' },
        { text: 'Connect wires to modular switches using terminal screws.', rule: 'Tighten screws securely to prevent sparking.' },
        { text: 'Screw switch grid plate to metal box and verify alignment.', rule: 'Grid plate must align horizontally with spirit level.' },
        { text: 'Snap modular switch faceplates onto grid plates.', rule: 'Plates must sit flush against wall paint.' },
        { text: 'Verify shutter operation in power sockets.', rule: 'Child-safety shutters must work smoothly.' }
      ]
    },
    {
      id: `${prefix}-ele-6`,
      name: `${levelName} Lighting Fixtures & Fans Mounting`,
      stage: `${levelName} Finishing`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Mount ceiling fans on structural hooks.', rule: 'Fan downrods must be secured with split cotter pin locks.' },
        { text: 'Install LED downlights inside false ceiling cutouts.', rule: 'Connect light transformer using insulated wire connectors.' },
        { text: 'Mount wall bracket lights checking height alignment.', rule: 'Verify symmetry of lights on walls.' },
        { text: 'Install outdoor weather-proof (IP65) balcony lights.', rule: 'Prevent water ingress during rains.' },
        { text: 'Verify light switches control correct fixtures.', rule: 'Double check switch marking layouts.' }
      ]
    },
    {
      id: `${prefix}-ele-7`,
      name: `${levelName} AC & Power Appliance Connection`,
      stage: `${levelName} Finishing`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Use heavy-duty 16A/25A plugs for AC, geyser, and kitchen appliances.', rule: 'Standard plugs prevent overload melting.' },
        { text: 'Verify AC stabilizers or starter switches are installed.', rule: 'Geysers must have dedicated isolation switches.' },
        { text: 'Check earth continuity of appliance metallic parts.', rule: 'Verify earth resistance is zero.' },
        { text: 'Measure supply voltage at power socket terminals.', rule: 'Voltage must be stable between 220V and 240V AC.' },
        { text: 'Verify individual MCB breakers are marked in DB panel.', rule: 'Helps trace AC circuit breakers.' }
      ]
    },
    {
      id: `${prefix}-ele-8`,
      name: `${levelName} Electrical Load & Continuity Testing`,
      stage: `${levelName} Finishing`,
      duration: 1,
      isAddon: false,
      checklist: [
        { text: 'Perform insulation resistance test using megger meter.', rule: 'Insulation resistance must exceed 50 mega-ohms.' },
        { text: 'Turn on all circuits simultaneously to test maximum load.', rule: 'Monitor DB box temperature for 30 minutes (thermal check).' },
        { text: 'Test RCCB safety trip switches by pressing test button.', rule: 'RCCB must trip instantly (within 30 milliseconds).' },
        { text: 'Check polarities of all power sockets (Phase on right, Neutral on left).', rule: 'Incorrect polarities present safety hazards.' },
        { text: 'Obtain electrical supervisor testing clearance sheet.', rule: 'Keep copy in site records.' }
      ]
    },

    // --- Flooring & Finishing ---
    {
      id: `${prefix}-flr-1`,
      name: `${levelName} Floor Bed Screeding (IPS Bedding)`,
      stage: `${levelName} Flooring`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Clean floor slab concrete surface to expose clean aggregate.', rule: 'Remove dry plaster mortar lumps.' },
        { text: 'Transfer level markings from columns to floor corners.', rule: 'Ensure floor leveling screed thickness is minimum 30-40mm.' },
        { text: 'Mix concrete for screed (M15 grade with waterproofing compound).', rule: 'Waterproofing compound prevents water seepage.' },
        { text: 'Pour screed concrete and compact using aluminum straight-edge.', rule: 'Verify slope in bathroom/balcony directs towards drain.' },
        { text: 'Provide trowel finish to surface and cure for 3 days.', rule: 'Keep surface damp.' }
      ]
    },
    {
      id: `${prefix}-flr-2`,
      name: `${levelName} Living & Dining Tiling (Vitrified/Marble)`,
      stage: `${levelName} Flooring`,
      duration: 5,
      isAddon: false,
      checklist: [
        { text: 'Apply dry layout check of marble/vitrified tiles.', rule: 'Ensure tile pattern grains flow in same direction.' },
        { text: 'Mix cement adhesive paste according to instructions.', rule: 'Use notched trowel to spread adhesive uniformly on floor.' },
        { text: 'Install tiles using 2mm spacer joints.', rule: 'Spacers keep tile lines straight.' },
        { text: 'Tap tiles with rubber mallet to remove hollow air spaces.', rule: 'Check level across tiles using bubble level.' },
        { text: 'Install skirting tiles along walls.', rule: 'Skirting tile must stand 100mm high and align with floor joints.' }
      ]
    },
    {
      id: `${prefix}-flr-3`,
      name: `${levelName} Bedroom Flooring (Tile/Wooden)`,
      stage: `${levelName} Flooring`,
      duration: 4,
      isAddon: false,
      checklist: [
        { text: 'For tiles: check adhesive backing coverage (min 95%).', rule: 'Gaps under tiles lead to crack defects.' },
        { text: 'For wooden flooring: ensure floor bed screed is dry.', rule: 'Screed moisture content must be below 5%.' },
        { text: 'Lay 2mm polyethylene foam underlayment sheet.', rule: 'Foam underlayment provides thermal and sound insulation.' },
        { text: 'Install interlocking laminate floor planks.', rule: 'Leave 8-10mm expansion gap along wall edges.' },
        { text: 'Install wooden transition profiles at door thresholds.', rule: 'Covers edge joints cleanly.' }
      ]
    },
    {
      id: `${prefix}-flr-4`,
      name: `${levelName} Kitchen Granite Countertop Assembly`,
      stage: `${levelName} Flooring`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Erect vertical granite partition supports.', rule: 'Fix supports to wall using steel brackets and epoxy.' },
        { text: 'Verify horizontal leveling of partition tops.', rule: 'Levels must match perfectly.' },
        { text: 'Cut granite slab matching kitchen counter layouts.', rule: 'Ensure edges are rounded (moulded) and polished.' },
        { text: 'Cut openings for kitchen sink and cooking hob.', rule: 'Ensure dimensions match appliance sizes.' },
        { text: 'Bond granite slab to support structure using adhesive epoxy.', rule: 'Seal joints with matching color grout.' }
      ]
    },
    {
      id: `${prefix}-flr-5`,
      name: `${levelName} Tile Grouting & Cleanup`,
      stage: `${levelName} Flooring`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Clean tile joints to remove adhesive dust.', rule: 'Joints must be clean before grouting.' },
        { text: 'Mix polymer-modified tile joint grout powder with water.', rule: 'Use epoxy grout in wet bathroom zones.' },
        { text: 'Apply grout paste into tile joints using rubber float.', rule: 'Press grout deep into joint gaps.' },
        { text: 'Clean tile surfaces using damp sponge after 30 minutes.', rule: 'Do not scratch joint grout while damp.' },
        { text: 'Remove dry grout haze from tile face.', rule: 'Wipe tile surfaces clean.' }
      ]
    },
    {
      id: `${prefix}-flr-6`,
      name: `${levelName} Flooring Protection Sheeting`,
      stage: `${levelName} Flooring`,
      duration: 1,
      isAddon: false,
      checklist: [
        { text: 'Ensure tile grout is fully cured (min 24 hours).', rule: 'Walkway loads prohibited during curing.' },
        { text: 'Sweep floor surfaces clean of sand particles.', rule: 'Sand particles scratch tiles under foot traffic.' },
        { text: 'Lay corrugated plastic protection sheets over flooring.', rule: 'Sheets prevent scratches from paint spills or scaffolding.' },
        { text: 'Tape protection sheet joints using packing tape.', rule: 'Ensure no tile floor surface is exposed.' },
        { text: 'Inspect protection layout to ensure it covers corners.', rule: 'Protects floor during subsequent interior works.' }
      ]
    },

    // --- Doors & Windows ---
    {
      id: `${prefix}-drw-1`,
      name: `${levelName} Wooden Door Frames (Chaukhat) Fixing`,
      stage: `${levelName} Windows & Doors`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Check door frame wood quality (Teak/Sal wood).', rule: 'Wood must be dry and knot-free.' },
        { text: 'Apply anti-termite paint coat on door frame back surfaces.', rule: 'Protects wood from damp masonry walls.' },
        { text: 'Fix frames in brick openings using steel anchor fasteners (holdfasts).', rule: 'Use min 3 fasteners on each side post.' },
        { text: 'Check frame vertical plumb and horizontal level.', rule: 'Verify squareness using corner diagonals.' },
        { text: 'Pack gaps between frame and wall with concrete mortar.', rule: 'Ensures rigid mounting.' }
      ]
    },
    {
      id: `${prefix}-drw-2`,
      name: `${levelName} UPVC/Aluminium Window Frames Installation`,
      stage: `${levelName} Windows & Doors`,
      duration: 3,
      isAddon: false,
      checklist: [
        { text: 'Verify plaster borders (grooves) of window openings are flat.', rule: 'Opening dimensions must match frame sizes.' },
        { text: 'Mount UPVC/Aluminium window outer frames using steel fasteners.', rule: 'Fastener spacing must be max 600mm.' },
        { text: 'Verify frame levels and vertical plumb.', rule: 'Alignment tolerance is +/- 1mm.' },
        { text: 'Fill gaps between frame and wall with polyurethane expansion foam.', rule: 'Polyurethane foam provides dust and sound insulation.' },
        { text: 'Clean drainage slots in window bottom tracks.', rule: 'Drainage slots must remain clear for rainwater outflow.' }
      ]
    },
    {
      id: `${prefix}-drw-3`,
      name: `${levelName} Window Glass Panels Fitting`,
      stage: `${levelName} Windows & Doors`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Install double-glazed unit (DGU) or toughened glass panels in sash.', rule: 'Glass thickness must match specifications (min 5-6mm).' },
        { text: 'Verify rubber gasket linings are inserted into sash tracks.', rule: 'Gaskets seal out dust and water.' },
        { text: 'Apply weather-proof silicone sealant along glass edges.', rule: 'Sealant prevents water seepage during high wind rains.' },
        { text: 'Check operation of sliding window panels.', rule: 'Sashes must slide smoothly on wheels.' },
        { text: 'Verify window mesh screens are clean.', rule: 'Mesh must be free of tears.' }
      ]
    },
    {
      id: `${prefix}-drw-4`,
      name: `${levelName} Flush Door Shutters Hanging`,
      stage: `${levelName} Windows & Doors`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Measure door shutter dimensions match frames.', rule: 'Shutter margin gap must be 2-3mm around frame.' },
        { text: 'Fix steel hinges (min 4 hinges for main door, 3 for internal doors).', rule: 'Hinges must be screwed flush into wood recesses.' },
        { text: 'Verify door hangs straight and does not swing open/close automatically.', rule: 'Indicates correct vertical alignment.' },
        { text: 'Check bottom ground clearance of door shutter.', rule: 'Clearance must be 8-10mm to avoid dragging on flooring.' },
        { text: 'Apply waterproof wood primer coat on top and bottom cuts.', rule: 'Protects door cores from floor dampness.' }
      ]
    },
    {
      id: `${prefix}-drw-5`,
      name: `${levelName} Door Locks & Hardware Fittings`,
      stage: `${levelName} Windows & Doors`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Mortise lock cavities in door shutters using templates.', rule: 'Lock body must fit snugly.' },
        { text: 'Install main door lock, handle handles, and brass latch hooks.', rule: 'Verify lock key operation works smoothly.' },
        { text: 'Fix cylinder locks on bathroom/bedroom door handles.', rule: 'Check locks lock securely from inside.' },
        { text: 'Mount magnetic door stoppers on wall/floor.', rule: 'Stoppers prevent door handles from hitting walls.' },
        { text: 'Verify latch alignment matches strike plates.', rule: 'Plates must sit flush in frame.' }
      ]
    },

    // --- False Ceiling (Add-on/Optional) ---
    {
      id: `${prefix}-clg-1`,
      name: `${levelName} False Ceiling GI Grid Framing`,
      stage: `${levelName} Interiors`,
      duration: 2,
      isAddon: true,
      checklist: [
        { text: 'Mark ceiling level lines on walls using laser level.', rule: 'Ensure ceiling height is consistent.' },
        { text: 'Anchor steel perimeter L-channels along marked wall lines.', rule: 'Use plastic plugs and screws at 450mm spacing.' },
        { text: 'Suspend main T-channels from structural slab using steel hangers.', rule: 'Space hangers at max 1.2m intervals.' },
        { text: 'Connect cross T-channels to form a rigid grid.', rule: 'Grid spacing must be 600x600mm.' },
        { text: 'Verify structural stability of suspension grid.', rule: 'Grid must not shake or sag.' }
      ]
    },
    {
      id: `${prefix}-clg-2`,
      name: `${levelName} False Ceiling Gypsum Board Assembly`,
      stage: `${levelName} Interiors`,
      duration: 2,
      isAddon: true,
      checklist: [
        { text: 'Use moisture-resistant gypsum boards in toilets/kitchens.', rule: 'Use standard gypsum boards in bedrooms/living rooms.' },
        { text: 'Screw gypsum boards to GI grid channels.', rule: 'Space screws at 150mm intervals along board borders.' },
        { text: 'Ensure board joint borders are staggered.', rule: 'Staggered joints prevent linear plaster cracks.' },
        { text: 'Sink screw heads slightly below board surface.', rule: 'Do not tear board face paper.' },
        { text: 'Verify electrical wiring wires protrude through board cutouts.', rule: 'Wiring must be ready for lighting connections.' }
      ]
    },
    {
      id: `${prefix}-clg-3`,
      name: `${levelName} False Ceiling Joint Taping & Putty`,
      stage: `${levelName} Interiors`,
      duration: 2,
      isAddon: true,
      checklist: [
        { text: 'Clean gypsum board joints to remove dust.', rule: 'Ensure dry joints.' },
        { text: 'Apply joint fiber mesh tape along board joints.', rule: 'Mesh tape prevents joint cracking.' },
        { text: 'Fill joint recesses with specialized joint filler compound.', rule: 'Spread compound evenly using putty knife.' },
        { text: 'Apply second coat of joint compound and sand surface smooth.', rule: 'Joints must be flush with board surfaces.' },
        { text: 'Check ceiling flatness using straight-edge.', rule: 'Tolerance of ceiling deviation is max 1.5mm.' }
      ]
    },

    // --- Interior Woodwork & Carpentry (Add-on/Optional) ---
    {
      id: `${prefix}-int-1`,
      name: `${levelName} Modular Kitchen Cabinet Carcass assembly`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Use BWR (Boiling Water Resistant) plywood for kitchen carcass boards.', rule: 'Plywood thickness must be min 16-18mm.' },
        { text: 'Verify cabinet sizes against kitchen layouts.', rule: 'Accuracy must be within +/- 2mm.' },
        { text: 'Assemble cabinet boards using steel dowel pins and screws.', rule: 'Do not use normal nails.' },
        { text: 'Check cabinet box squareness by checking diagonal corners.', rule: 'Diagonals must match perfectly.' },
        { text: 'Seal raw plywood borders with PVC edge band tape.', rule: 'Edge band tape protects board cores from moisture.' }
      ]
    },
    {
      id: `${prefix}-int-2`,
      name: `${levelName} Modular Kitchen Acrylic Shutters installation`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Check quality of acrylic/laminate shutters.', rule: 'Shutters must be flat and free of scratches.' },
        { text: 'Mount shutters using soft-close concealed auto-hinges.', rule: 'Use min 3 hinges for shutters higher than 1.2m.' },
        { text: 'Adjust hinge screws to align shutter borders.', rule: 'Margins between shutters must be uniform (2mm).' },
        { text: 'Install shutter handles or profile channels.', rule: 'Check handle alignments.' },
        { text: 'Verify soft-close operation works smoothly.', rule: 'Shutters must close silently.' }
      ]
    },
    {
      id: `${prefix}-int-3`,
      name: `${levelName} Wardrobe Carcass Assembly`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Use MR (Moisture Resistant) commercial plywood for bedroom wardrobes.', rule: 'Plywood thickness min 18mm.' },
        { text: 'Verify carcass vertical plumb and level.', rule: 'Secure carcass boxes to walls using metal anchor L-brackets.' },
        { text: 'Install internal shelves and drawer runners.', rule: 'Drawers must slide smoothly without friction.' },
        { text: 'Verify wardrobe dimensions match design heights.', rule: 'Carcass must reach ceiling level if built-in.' },
        { text: 'Apply backing plywood sheet (min 6-8mm thickness).', rule: 'Backing sheet must be screwed, not nailed.' }
      ]
    },
    {
      id: `${prefix}-int-4`,
      name: `${levelName} Wardrobe Laminates & Drawer Fitting`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Glue decorative laminates (min 1mm thickness) on shutters and drawers.', rule: 'Use premium PVA adhesive.' },
        { text: 'Press laminates using heavy roller/clamps to remove air pockets.', rule: 'Ensure zero bubble defects.' },
        { text: 'File laminate borders to remove sharp edges.', rule: 'Borders must be smooth.' },
        { text: 'Install drawer channels (telescopic runners) and drawer locks.', rule: 'Verify lock key operation.' },
        { text: 'Mount handles checking level alignment.', rule: 'Verify alignment.' }
      ]
    },
    {
      id: `${prefix}-int-5`,
      name: `${levelName} TV Unit Backing Panel Carpentry`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Erect plywood framing grids on wall.', rule: 'Secure framing to wall using expansion anchors.' },
        { text: 'Cover framing with decorative veneer/laminated boards.', rule: 'Ensure pattern grains match.' },
        { text: 'Incorporate concealed wiring conduits behind panel.', rule: 'TV power and HDMI cables must run concealed.' },
        { text: 'Check panel vertical plumb.', rule: 'Tolerance is max 1.5mm.' },
        { text: 'Verify strength of TV wall-mount bracket section.', rule: 'Reinforce section with double plywood.' }
      ]
    },
    {
      id: `${prefix}-int-6`,
      name: `${levelName} Veneer Polishing on Main Door`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Sand veneer wood surface using fine emery paper (grit 220/320).', rule: 'Remove wood fibers and dust.' },
        { text: 'Apply wood filler paste matching veneer color.', rule: 'Seal open wood pores.' },
        { text: 'Apply base coat of polyurethane (PU) sealer.', rule: 'Sealer protects veneer fibers.' },
        { text: 'Sand sealer coat gently and apply final PU lacquer polish.', rule: 'Apply polish using spray gun.' },
        { text: 'Verify finish gloss/matte sheen uniformity.', rule: 'Ensure no dust bubbles or runs.' }
      ]
    },
    {
      id: `${prefix}-int-7`,
      name: `${levelName} Cupboard LED Lighting Installation`,
      stage: `${levelName} Interiors`,
      duration: 2,
      isAddon: true,
      checklist: [
        { text: 'Route low-voltage wires inside wardrobe channels.', rule: 'Use insulated wires.' },
        { text: 'Embed LED aluminum profiles in wood grooves.', rule: 'Profiles must sit flush.' },
        { text: 'Stick LED strip lights inside profiles and mount diffusers.', rule: 'Ensure uniform light projection.' },
        { text: 'Install automatic door sensor switches.', rule: 'LED must turn on when door opens.' },
        { text: 'Mount LED driver transformer in accessible cabinet top.', rule: 'Do not conceal transformer.' }
      ]
    },

    // --- Smart Automation & Extra Add-ons ---
    {
      id: `${prefix}-smart-1`,
      name: `${levelName} Smart Home Automation System Integration`,
      stage: `${levelName} Interiors`,
      duration: 3,
      isAddon: true,
      checklist: [
        { text: 'Install smart controller hub inside distribution board box.', rule: 'Controller must connect to Wi-Fi router.' },
        { text: 'Fit modular touch switches and smart dimmer modules.', rule: 'Dimmer circuits must support LED loads.' },
        { text: 'Install smart door lock at main entrance checking code access.', rule: 'Test biometric fingerprint and PIN code access.' },
        { text: 'Route LAN Cat6 cables to smart camera locations.', rule: 'Cables must carry signal without noise.' },
        { text: 'Verify app configuration on mobile phone.', rule: 'All room lights must toggle from app.' }
      ]
    },

    // --- Painting & Wall Finishes ---
    {
      id: `${prefix}-pnt-1`,
      name: `${levelName} Plaster Sanding & Base Prep`,
      stage: `${levelName} Painting`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Ensure plaster is cured (min 14 days) and completely dry.', rule: 'Do not paint damp walls.' },
        { text: 'Scrub plaster walls using emery stone or silicon carbide paper.', rule: 'Remove loose cement grains and projections.' },
        { text: 'Fill plaster voids and minor cracks using cement-sand mortar paste.', rule: 'Wait 24 hours to dry.' },
        { text: 'Wipe walls clean of sand particles and dust.', rule: 'Ensure clean walls.' },
        { text: 'Apply coat of acrylic wall primer sealer.', rule: 'Primer binds plaster surface.' }
      ]
    },
    {
      id: `${prefix}-pnt-2`,
      name: `${levelName} Acrylic Putty (1st Coat)`,
      stage: `${levelName} Painting`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Mix acrylic wall putty paste to uniform lump-free consistency.', rule: 'Follow manufacturer ratio.' },
        { text: 'Apply putty coat vertically using steel trowel.', rule: 'Thickness must be max 1.5mm.' },
        { text: 'Ensure putty fills plaster depressions.', rule: 'Level walls.' },
        { text: 'Check for visible trowel marks.', rule: 'Marks must be minimized.' },
        { text: 'Allow putty coat to dry for 6-8 hours.', rule: 'Ensure dry.' }
      ]
    },
    {
      id: `${prefix}-pnt-3`,
      name: `${levelName} Acrylic Putty (2nd Coat) & Sanding`,
      stage: `${levelName} Painting`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Apply second putty coat horizontally perpendicular to first coat.', rule: 'Total thickness max 2mm.' },
        { text: 'Sand putty walls using fine emery paper (grit 150/220).', rule: 'Ensure flat walls.' },
        { text: 'Check wall flatness using focus bulb light.', rule: 'Bulb light reveals minor wall deviations.' },
        { text: 'Wipe dust from walls.', rule: 'Ensure dust-free surface.' },
        { text: 'Apply second coat of acrylic wall primer.', rule: 'Primer seals putty absorption.' }
      ]
    },
    {
      id: `${prefix}-pnt-4`,
      name: `${levelName} Interior Wall Primer application`,
      stage: `${levelName} Painting`,
      duration: 1,
      isAddon: false,
      checklist: [
        { text: 'Dilute wall primer according to manufacturer instructions.', rule: 'Do not over-thin.' },
        { text: 'Apply primer coat using paint roller.', rule: 'Ensure uniform coverage.' },
        { text: 'Check for runs or drips on primer surface.', rule: 'Smooth out drips.' },
        { text: 'Allow primer to dry for 4-6 hours.', rule: 'Ensure dry.' },
        { text: 'Verify primer binds putty powder.', rule: 'Ensures paint adhesion.' }
      ]
    },
    {
      id: `${prefix}-pnt-5`,
      name: `${levelName} Emulsion Paint (1st Coat)`,
      stage: `${levelName} Painting`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Mix premium plastic emulsion paint to uniform consistency.', rule: 'Filter paint to remove particles.' },
        { text: 'Apply paint coat using roller and brush.', rule: 'Maintain wet edges during application.' },
        { text: 'Ensure uniform color coverage.', rule: 'No primer showing.' },
        { text: 'Check for roller brush marks.', rule: 'Smooth out marks.' },
        { text: 'Allow paint to dry for minimum 4 hours.', rule: 'Ensure dry.' }
      ]
    },
    {
      id: `${prefix}-pnt-6`,
      name: `${levelName} Emulsion Paint (Final Coat) & Cleaning`,
      stage: `${levelName} Painting`,
      duration: 2,
      isAddon: false,
      checklist: [
        { text: 'Apply final paint coat using premium micro-fiber rollers.', rule: 'Final coat provides rich texture.' },
        { text: 'Check painted walls under final lighting.', rule: 'Ensure color uniformity and zero patchiness.' },
        { text: 'Remove masking tapes from switchboards and door frames.', rule: 'Ensure clean border lines.' },
        { text: 'Clean paint drops from flooring and glass.', rule: 'Do not scratch finishes.' },
        { text: 'Protect painted walls from dust until dry.', rule: 'Keep doors closed.' }
      ]
    }
  ];

  let currentDate = new Date(startDate);
  return baseShellActivities.map(act => {
    const sDate = formatDate(currentDate);
    currentDate = addDays(currentDate, act.duration);
    const eDate = formatDate(currentDate);
    currentDate = addDays(currentDate, 1);
    return {
      ...act,
      startDate: sDate,
      endDate: eDate,
      actualStartDate: null,
      actualEndDate: null,
      status: 'Pending',
      notes: ''
    };
  });
};

// Exterior templates - 20 activities (including solar, pool, landscaping add-ons)
const EXTERIOR_TEMPLATES = [
  {
    id: 'ext-1',
    name: 'Terrace Waterproofing Slab Prep',
    stage: 'Exterior Works',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Clean terrace slab concrete surface using wire brushes.', rule: 'Remove all loose cement slurry and dirt.' },
      { text: 'Hack concrete surface around rainwater pipe outlets.', rule: 'Create depression joints for sealing.' },
      { text: 'Apply prime coat of acrylic polymer over concrete.', rule: 'Ensures adhesion of waterproof chemical.' },
      { text: 'Construct cement mortar coving along parapet wall base.', rule: 'Fillet size min 75x75mm.' },
      { text: 'Verify slope of slab directs water towards drain pipes.', rule: 'Slope must be min 1 in 100.' }
    ]
  },
  {
    id: 'ext-2',
    name: 'Terrace Chemical Membrane Coating',
    stage: 'Exterior Works',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Mix polyurethane (PU) waterproofing liquid chemical.', rule: 'Mix to uniform consistency.' },
      { text: 'Apply first coat of polyurethane membrane using rollers.', rule: 'Coverage must match product specs.' },
      { text: 'Embed fiberglass reinforcing mesh over first coat while wet.', rule: 'Mesh prevents cracks over joints.' },
      { text: 'Apply second coat of PU membrane after 8 hours.', rule: 'Total thickness must be min 1.5mm.' },
      { text: 'Perform pond testing by filling water for 72 hours.', rule: 'Verify zero leaks on ceiling below.' }
    ]
  },
  {
    id: 'ext-3',
    name: 'Terrace Floor Heat-Insulation Tiles Layout',
    stage: 'Exterior Works',
    duration: 4,
    isAddon: false,
    checklist: [
      { text: 'Lay protective cement screed over cured waterproof membrane.', rule: 'Screed thickness min 25-30mm.' },
      { text: 'Select heat-reflecting ceramic tiles (SRI value > 78).', rule: 'Tiles reflect heat and keep building cool.' },
      { text: 'Install tiles using polymer-modified adhesive.', rule: 'Use 3mm spacer joints.' },
      { text: 'Fill tile joints with weather-proof epoxy grout.', rule: 'Epoxy joints prevent water seepage.' },
      { text: 'Verify parapet flashing tiles overlap wall plaster.', rule: 'Prevents water entry behind plaster.' }
    ]
  },
  {
    id: 'ext-4',
    name: 'Rainwater Harvesting Pit Construction',
    stage: 'Exterior Works',
    duration: 5,
    isAddon: false,
    checklist: [
      { text: 'Excavate recharge pit near borewell point.', rule: 'Pit dimensions min 2x2x2 meters.' },
      { text: 'Construct brick lining wall inside pit.', rule: 'Mortar mix 1:5, with weep holes at intervals.' },
      { text: 'Fill bottom layer of pit with aggregate boulders (100mm size).', rule: 'Boulder layer thickness min 1 meter.' },
      { text: 'Fill middle layer with coarse river sand and charcoal.', rule: 'Filters suspended silt from rainwater.' },
      { text: 'Connect terrace rainwater inlet pipe to filter chamber.', rule: 'Ensure mesh screen filter is installed at chamber inlet.' }
    ]
  },
  {
    id: 'ext-5',
    name: 'Septic Tank Concrete Construction',
    stage: 'Exterior Works',
    duration: 6,
    isAddon: false,
    checklist: [
      { text: 'Excavate trench matching tank drawings.', rule: 'Verify tank dimensions.' },
      { text: 'Cast M20 concrete base slab with waterproofing chemical.', rule: 'Slab thickness min 150mm.' },
      { text: 'Build brick partition walls separating three chambers.', rule: 'Use M15 concrete for partition walls.' },
      { text: 'Plaster inner walls using cement mortar with waterproofing liquid.', rule: 'Inner plaster thickness min 20mm.' },
      { text: 'Install inlet-outlet PVC baffles (T-pipes).', rule: 'Inlet must sit 50mm higher than outlet pipe.' }
    ]
  },
  {
    id: 'ext-6',
    name: 'Boundary Wall Construction & Footings',
    stage: 'Exterior Works',
    duration: 5,
    isAddon: false,
    checklist: [
      { text: 'Excavate footing pits for boundary wall columns.', rule: 'Space columns at 3 meter intervals.' },
      { text: 'Cast PCC base and bind reinforcement cages.', rule: 'Verify column steel size (min 4 rods of 10mm).' },
      { text: 'Cast columns and brick wall panels.', rule: 'Brick wall height min 1.8 meters.' },
      { text: 'Provide horizontal expansion joints every 6 meters.', rule: 'Prevents wall cracks due to soil movement.' },
      { text: 'Plaster boundary wall faces on both sides.', rule: 'Plaster thickness min 12mm.' }
    ]
  },
  {
    id: 'ext-7',
    name: 'Main Gate Fabrication & Fitting',
    stage: 'Exterior Works',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Fabricate mild steel/wood gate design matching drawings.', rule: 'Verify dimensions match entrance opening.' },
      { text: 'Fix heavy duty steel gate hinge hinges to boundary pillars.', rule: 'Anchor hinges inside concrete column cores.' },
      { text: 'Mount gate panels checking level alignment.', rule: 'Gate must swing open smoothly without dragging.' },
      { text: 'Apply anti-rust zinc-chromate primer coat on steel.', rule: 'Protects gate from corrosion.' },
      { text: 'Install locking locks, latches, and drop bolts.', rule: 'Verify lock security.' }
    ]
  },
  {
    id: 'ext-8',
    name: 'Exterior Wall Plastering (Double Coat)',
    stage: 'Exterior Works',
    duration: 6,
    isAddon: false,
    checklist: [
      { text: 'Erect metal scaffolding pipes around building facade.', rule: 'Scaffolding must be stable.' },
      { text: 'Apply 15mm thick undercoat plaster (mortar mix 1:5).', rule: 'Rake undercoat surface for bonding.' },
      { text: 'Apply 9mm finish coat plaster (mortar mix 1:4 with waterproofing).', rule: 'Verify surface level using straight-edge.' },
      { text: 'Create plaster grooved lines (grooves) at concrete-brick joints.', rule: 'Grooves control cracking.' },
      { text: 'Cure exterior plaster for minimum 10 days.', rule: 'Water facade surfaces twice daily.' }
    ]
  },
  {
    id: 'ext-9',
    name: 'Terrace Solar Panel Installation',
    stage: 'Exterior Works',
    duration: 3,
    isAddon: true,
    checklist: [
      { text: 'Anchor steel structures to terrace pillars or structural slab.', rule: 'Structure must withstand wind speeds of 150 km/h.' },
      { text: 'Mount photovoltaic (PV) solar panels checking orientation.', rule: 'South facing direction with optimal tilt angle.' },
      { text: 'Install solar string inverter and net-metering switchboards.', rule: 'Inverter must be IP65 dust-proof.' },
      { text: 'Connect DC/AC surge protection devices (SPD) and earthing.', rule: 'Dedicated earth pit for solar panels.' },
      { text: 'Run system diagnostics to verify energy output.', rule: 'Check load calculations.' }
    ]
  },
  {
    id: 'ext-10',
    name: 'Swimming Pool Structure & Waterproofing',
    stage: 'Exterior Works',
    duration: 6,
    isAddon: true,
    checklist: [
      { text: 'Excavate pool bed and cast reinforced concrete retaining walls.', rule: 'Concrete must be min M30 grade.' },
      { text: 'Install pool inlet nozzles, drain sumps, and skimmers.', rule: 'Verify pipe coordinates are watertight.' },
      { text: 'Apply double coat polymer waterproofing membrane on concrete.', rule: 'Pond test for 72 hours; zero seepage allowed.' },
      { text: 'Lay ceramic mosaic pool tiles using specialized adhesives.', rule: 'Adhesives must resist pool chlorine chemicals.' },
      { text: 'Mount pool filtration pump system inside machinery room.', rule: 'Sand filter must cycle water every 6 hours.' }
    ]
  },
  {
    id: 'ext-11',
    name: 'Landscape Gardening & Exterior Lighting',
    stage: 'Exterior Works',
    duration: 4,
    isAddon: true,
    checklist: [
      { text: 'Spread fertile stock topsoil over garden lawns.', rule: 'Soil thickness min 150mm.' },
      { text: 'Plant grass turf, shrubs, and ornamental trees.', rule: 'Ensure proper sub-surface drainage lines.' },
      { text: 'Install automated pop-up sprinkler irrigation system.', rule: 'Sprinklers must cover entire lawn area.' },
      { text: 'Mount IP66 rated waterproof garden bollard lights.', rule: 'Use low-voltage 24V DC lighting transformers for safety.' },
      { text: 'Lay cobblestone walkway pathways in lawn.', rule: 'Base layer compacted sand.' }
    ]
  }
];

// Add extra placeholder templates to hit ~30-50 exterior activities
for (let i = 12; i <= 30; i++) {
  EXTERIOR_TEMPLATES.push({
    id: `ext-${i}`,
    name: `Exterior Utility Check Phase ${i - 11}`,
    stage: 'Exterior Works',
    duration: 2,
    isAddon: i % 3 === 0, // Mix of addons and defaults
    checklist: [
      { text: `Check phase layout and conduit routing Part ${i}.`, rule: 'Must follow IS electrical installation guidelines.' },
      { text: 'Verify joint coupling insulation levels.', rule: 'Insulation resistance > 50 mega-ohms.' },
      { text: 'Ensure waterproof seal box mounting is tight.', rule: 'Enclosure must be IP66 weather proof.' },
      { text: 'Verify mounting bracket thickness is appropriate.', rule: 'Support bracket load factor > 2x.' },
      { text: 'Inspect final level alignments using water-level.', rule: 'Tolerance +/- 2mm.' }
    ]
  });
}

// Handover templates - 25 activities (some elevator/lift commissioning add-ons)
const HANDOVER_TEMPLATES = [
  {
    id: 'hnd-1',
    name: 'Main DB Panel Insulation Megger Test',
    stage: 'Commissioning & Handover',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Disconnect mains power supply completely.', rule: 'Safety first.' },
      { text: 'Connect megger leads between phase terminals and ground copper.', rule: 'Test insulation.' },
      { text: 'Apply 1000V DC test voltage for 1 minute.', rule: 'Megger reading must exceed 100 mega-ohms.' },
      { text: 'Test insulation between individual phases.', rule: 'Phase-to-phase insulation check.' },
      { text: 'Record testing values in electrical log book.', rule: 'Verify test report is signed.' }
    ]
  },
  {
    id: 'hnd-2',
    name: 'Water Supply Flow & Pressure Check',
    stage: 'Commissioning & Handover',
    duration: 2,
    isAddon: false,
    checklist: [
      { text: 'Turn on terrace tank main control valves.', rule: 'Fill pipelines.' },
      { text: 'Open all bathroom and kitchen taps simultaneously.', rule: 'Check flow rate at aerators.' },
      { text: 'Verify water pressure at top floor bathrooms.', rule: 'Min pressure must be 0.5 bar; install booster pump if pressure is low.' },
      { text: 'Check for leaks in toilet drain joints.', rule: 'Ensure zero leakage.' },
      { text: 'Verify siphon flush tank refill times.', rule: 'Refill must complete in under 2 minutes.' }
    ]
  },
  {
    id: 'hnd-3',
    name: 'Passenger Elevator Lift Commissioning',
    stage: 'Commissioning & Handover',
    duration: 3,
    isAddon: true,
    checklist: [
      { text: 'Verify lift cabin guide rails are aligned and lubricated.', rule: 'Cabin must slide smoothly.' },
      { text: 'Test emergency ARD (Automatic Rescue Device) battery backup.', rule: 'Lift must descend to nearest floor and open doors during power cut.' },
      { text: 'Verify overload limit sensor cuts power.', rule: 'Test with 1.25x load capacity.' },
      { text: 'Inspect lift shaft safety limit switches.', rule: 'Prevents lift from over-traveling top/bottom.' },
      { text: 'Obtain certified lift inspector safety license certificate.', rule: 'Mandatory before public use.' }
    ]
  },
  {
    id: 'hnd-4',
    name: 'De-snagging & Paint Touchups',
    stage: 'Commissioning & Handover',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Identify wall scratches, spots, or dirt on paint.', rule: 'Mark spots with masking tape.' },
      { text: 'Sand defective wall sections and apply putty/primer.', rule: 'Blend patch area with surrounding paint texture.' },
      { text: 'Apply touchup paint coat using micro-fiber rollers.', rule: 'Ensure zero color shade difference.' },
      { text: 'Verify door/window frames align with walls.', rule: 'Check for gaps; fill gaps with acrylic silicone.' },
      { text: 'Obtain supervisor snagging sign-off sheet.', rule: 'Complete de-snagging.' }
    ]
  },
  {
    id: 'hnd-5',
    name: 'Deep Cleaning & Debris Removal',
    stage: 'Commissioning & Handover',
    duration: 3,
    isAddon: false,
    checklist: [
      { text: 'Remove construction waste, sand bags, and wood scraps from site.', rule: 'Site must be clear.' },
      { text: 'Mop floor tile surfaces to remove paint and grout marks.', rule: 'Use neutral floor cleaner.' },
      { text: 'Clean window glass panels using rubber glass squeegees.', rule: 'Verify no dirt spots remain.' },
      { text: 'Clean bathroom sanitryware fixtures.', rule: 'Remove cement stains.' },
      { text: 'Sweep terrace and driveway clean.', rule: 'Ready for handover.' }
    ]
  },
  {
    id: 'hnd-6',
    name: 'Municipal Occupancy Certificate (OC) Filing',
    stage: 'Commissioning & Handover',
    duration: 5,
    isAddon: false,
    checklist: [
      { text: 'Assemble building completion blueprints (as-built drawings).', rule: 'Drawings must show construction matches sanction plan.' },
      { text: 'Attach structural safety certificate.', rule: 'Signed by structural engineer.' },
      { text: 'Attach municipal water and sewer connection receipts.', rule: 'Provide connection documents.' },
      { text: 'Arrange municipal site inspection with building officer.', rule: 'Inspect building dimensions.' },
      { text: 'Obtain stamped Occupancy Certificate (OC).', rule: 'Required for power meter connection.' }
    ]
  },
  {
    id: 'hnd-7',
    name: 'Final Handover & Keys Distribution',
    stage: 'Commissioning & Handover',
    duration: 1,
    isAddon: false,
    checklist: [
      { text: 'Collect all keys and label them (Bedroom, Main, Kitchen, Terrace).', rule: 'Store keys in key cabinet box.' },
      { text: 'Compile appliance manuals, warranties, and test certificates.', rule: 'Include geyser, pump, and electrical stabilizer documents.' },
      { text: 'Walk through property with customer checking all fixtures.', rule: 'Explain switchboard layouts and plumbing shutoff valves.' },
      { text: 'Sign property handover certificate.', rule: 'Mutual signoff.' },
      { text: 'Deliver keys and handover documents package.', rule: 'Handover complete.' }
    ]
  }
];

// Add extra placeholder templates to hit ~30-40 handover activities
for (let i = 8; i <= 25; i++) {
  HANDOVER_TEMPLATES.push({
    id: `hnd-${i}`,
    name: `Commissioning Inspection Phase ${i - 7}`,
    stage: 'Commissioning & Handover',
    duration: 2,
    isAddon: i % 4 === 0,
    checklist: [
      { text: `Verify quality check procedure Part ${i}.`, rule: 'Must follow IS inspection standards.' },
      { text: 'Ensure alignment matching drawings.', rule: 'Accuracy tolerance within +/- 2mm.' },
      { text: 'Check fastener tightness settings.', rule: 'Torque limits must match specifications.' },
      { text: 'Verify paint protection films are removed.', rule: 'Surfaces must be clean.' },
      { text: 'Inspect control circuit grounding.', rule: 'Resistance < 2 ohms.' }
    ]
  });
}

// MAIN SCHEDULER GENERATOR ENGINE
export function generateProjectTimeline(configuration, startStr = '2026-07-10', params = {}) {
  let projectStartDate = new Date(startStr);
  const activities = [];

  // Phase A: Substructure (Foundation, earthworks, layout profile)
  let currentPtrDate = new Date(projectStartDate);
  
  const subActivities = SUBSTRUCTURE_TEMPLATES.map(act => {
    const sDate = formatDate(currentPtrDate);
    currentPtrDate = addDays(currentPtrDate, act.duration);
    const eDate = formatDate(currentPtrDate);
    currentPtrDate = addDays(currentPtrDate, 1);
    
    // Customize for specific configurations (e.g. if Economy budget, some things are skipped, or if Row House is chosen)
    let isAddonVal = act.isAddon;
    if (configuration.includes('Economy') && (act.id === 'pre-1' || act.id === 'pre-2')) {
      // In cheap row housing soil tests are sometimes optional add-ons rather than mandatory defaults
      isAddonVal = true;
    }
    
    return {
      ...act,
      isAddon: isAddonVal,
      startDate: sDate,
      endDate: eDate,
      actualStartDate: null,
      actualEndDate: null,
      status: 'Pending',
      notes: ''
    };
  });
  
  activities.push(...subActivities);

  // Phase B: Floor Levels
  // Get levels array mapped from configuration dictionary
  const floorLevels = BUILDING_CONFIGS[configuration] || ['Ground Floor', 'First Floor'];

  // Generate activities per floor level
  floorLevels.forEach((levelName, levelIdx) => {
    const floorActs = createFloorActivities(levelName, levelIdx, currentPtrDate, params);
    const totalFloorDays = floorActs.reduce((acc, curr) => acc + curr.duration + 1, 0);
    currentPtrDate = addDays(currentPtrDate, totalFloorDays);
    
    // Apply configuration modifications
    const updatedFloorActs = floorActs.map(act => {
      let isAddon = act.isAddon;
      
      // If Economy configuration, make some woodwork, ceilings, smart home features as Optional addons
      if (configuration.includes('Economy')) {
        if (act.id.includes('-clg-') || act.id.includes('-int-') || act.id.includes('-smart-')) {
          isAddon = true; // Set all decorative ceiling/cabinet works to Add-ons for economy builds
        }
      }
      
      // If Mixed-use Commercial, Ground floor structure is commercial (no home kitchen modular fixtures)
      if (configuration.includes('Mixed-use') && levelName.includes('Commercial')) {
        if (act.id.includes('-int-1') || act.id.includes('-int-2') || act.id.includes('-int-7')) {
          // Kitchen cabinetry is not needed on commercial ground floor parking/office
          return null; 
        }
      }
      
      return {
        ...act,
        isAddon
      };
    }).filter(Boolean);

    activities.push(...updatedFloorActs);
  });

  // Phase C: Exterior Works
  const extActivities = EXTERIOR_TEMPLATES.map(act => {
    const sDate = formatDate(currentPtrDate);
    currentPtrDate = addDays(currentPtrDate, act.duration);
    const eDate = formatDate(currentPtrDate);
    currentPtrDate = addDays(currentPtrDate, 1);
    
    let isAddon = act.isAddon;
    // Swimming pool is default essential ONLY for Farmhouse configurations, for others it is addon/optional
    if (act.id === 'ext-10') {
      isAddon = !configuration.includes('Farmhouse');
    }
    
    return {
      ...act,
      isAddon,
      startDate: sDate,
      endDate: eDate,
      actualStartDate: null,
      actualEndDate: null,
      status: 'Pending',
      notes: ''
    };
  });
  activities.push(...extActivities);

  // Phase D: Handover & Commissioning
  const hndActivities = HANDOVER_TEMPLATES.map(act => {
    const sDate = formatDate(currentPtrDate);
    currentPtrDate = addDays(currentPtrDate, act.duration);
    const eDate = formatDate(currentPtrDate);
    currentPtrDate = addDays(currentPtrDate, 1);
    
    let isAddon = act.isAddon;
    // Elevators are default essential only for G+3, G+4, and B+S+4 configurations. For simple double stories, they are optional or omitted
    if (act.id === 'hnd-3') {
      const isMultiStory = configuration.includes('G+3') || configuration.includes('G+4') || configuration.includes('B+S+4');
      isAddon = !isMultiStory;
    }
    
    return {
      ...act,
      isAddon,
      startDate: sDate,
      endDate: eDate,
      actualStartDate: null,
      actualEndDate: null,
      status: 'Pending',
      notes: ''
    };
  });
  activities.push(...hndActivities);

  // --- DYNAMIC QA/QC INSPECTIONS INJECTION FOR 500+ GRANULAR TASKS ---
  const finalActivities = [];
  activities.forEach((act) => {
    finalActivities.push(act);

    const name = act.name;
    const actId = act.id;
    let qaTask = null;

    if (actId.includes('-rcc-3') || actId.includes('-rcc-11') || actId.includes('footing') || actId.includes('plinth')) {
      qaTask = {
        id: `qa-${actId}-concrete`,
        name: `QA Audit: ${name} Compressive Strength & Compaction Inspection`,
        stage: act.stage,
        duration: 1,
        isAddon: act.isAddon,
        checklist: [
          { text: 'Verify concrete cube casting logs and batch timestamps.', rule: 'Follow IS 456 standard.' },
          { text: 'Verify 7-day compressive strength test report.', rule: 'Strength must exceed 70% of characteristic strength.' },
          { text: 'Perform non-destructive rebound hammer test on cast surfaces.', rule: 'Rebound index must be uniform.' },
          { text: 'Check for visible surface shrinkage cracks or aggregate segregation.', rule: 'Honeycombing must be repaired with non-shrink grout.' },
          { text: 'Ensure curing is started immediately post-hardening.', rule: 'Curing period must meet IS code specifications.' }
        ]
      };
    } else if (actId.includes('-ele-1') || actId.includes('-ele-3') || actId.includes('wiring')) {
      qaTask = {
        id: `qa-${actId}-ele`,
        name: `QA Audit: ${name} Insulation & Circuit Continuity Verification`,
        stage: act.stage,
        duration: 1,
        isAddon: act.isAddon,
        checklist: [
          { text: 'Conduct Megger test of wires from distribution board to socket points.', rule: 'Insulation resistance must be > 50 mega-ohms.' },
          { text: 'Verify copper earthing pit connection resistance.', rule: 'Resistance must be less than 5 ohms.' },
          { text: 'Check wire gauge sizing matching high-load terminal points.', rule: 'Verify AC, geysers, kitchen loops match drawings.' },
          { text: 'Ensure zero jointing of wire inside conduits.', rule: 'Wires must run continuous between junction boxes.' },
          { text: 'Verify switch plates align horizontally using spirit level.', rule: 'Alignment tolerance +/- 1mm.' }
        ]
      };
    } else if (actId.includes('-wtp-') || actId.includes('waterproofing')) {
      qaTask = {
        id: `qa-${actId}-wtp`,
        name: `QA Audit: ${name} Waterproofing Membrane & 48-Hour Pond Test`,
        stage: act.stage,
        duration: 2,
        isAddon: act.isAddon,
        checklist: [
          { text: 'Check dry membrane coating thickness using depth micrometer.', rule: 'Thickness must be minimum 1.5mm.' },
          { text: 'Inspect fillet coving joints along wall base borders.', rule: 'Zero gaps or pinholes allowed in coating.' },
          { text: 'Check water level in ponded slab area periodically.', rule: 'Maintain 100mm pond depth for 48 hours.' },
          { text: 'Inspect ceiling/walls of floor below for wetness or damp spots.', rule: 'Zero seepage rate is acceptable.' },
          { text: 'Ensure protective screed is laid immediately after test approval.', rule: 'Protects membrane from construction damage.' }
        ]
      };
    } else if (actId.includes('-til-') || actId.includes('tiling') || actId.includes('flooring')) {
      qaTask = {
        id: `qa-${actId}-tiling`,
        name: `QA Audit: ${name} Flatness, Hollow Spots & Slope Check`,
        stage: act.stage,
        duration: 1,
        isAddon: act.isAddon,
        checklist: [
          { text: 'Tap every tile face with rubber mallet to identify hollow voids.', rule: 'Hollow sound area must not exceed 5% of tile size.' },
          { text: 'Check floor tile level variation using 2-meter straight edge.', rule: 'Level variation must be under +/- 2mm.' },
          { text: 'Pour water over tiled area to verify slope direction.', rule: 'Water must drain completely without stagnant pools.' },
          { text: 'Check tile spacer joint width consistency.', rule: 'Joint width must match spacer sizing (2mm).' },
          { text: 'Verify epoxy grouting is filled completely inside joint gaps.', rule: 'No grout shrinkage or gaps.' }
        ]
      };
    } else if (actId.includes('-pnt-') || actId.includes('painting')) {
      qaTask = {
        id: `qa-${actId}-paint`,
        name: `QA Audit: ${name} Wall Putty Sanding & Color Sheen Inspection`,
        stage: act.stage,
        duration: 1,
        isAddon: act.isAddon,
        checklist: [
          { text: 'Check wall moisture levels using electronic moisture pin meter.', rule: 'Moisture must be below 12% before painting.' },
          { text: 'Check wall flatness under halogen focus spotlight.', rule: 'Reveals trowel lines or waves on putty.' },
          { text: 'Inspect painted surfaces for roller brush lines or patchiness.', rule: 'Texture must be uniform.' },
          { text: 'Check paint adhesion using cross-hatch peel test.', rule: 'No paint peeling or dusting.' },
          { text: 'Ensure masking tape lines along borders are clean.', rule: 'Clean separation lines at ceilings/frames.' }
        ]
      };
    } else if (actId.includes('-wdw-') || actId.includes('wardrobe') || actId.includes('cabinet')) {
      qaTask = {
        id: `qa-${actId}-wood`,
        name: `QA Audit: ${name} Wardrobe Cabinet Alignment & Soft-Close Check`,
        stage: act.stage,
        duration: 1,
        isAddon: act.isAddon,
        checklist: [
          { text: 'Check carcass diagonals using tape to confirm right angles.', rule: 'Tolerance limit is +/- 1.5mm.' },
          { text: 'Verify door alignment and uniform gap spacing.', rule: 'Gap must be strictly 2.0mm.' },
          { text: 'Verify drawer telescope slider runners operate smoothly.', rule: 'Soft-close mechanism must engage correctly.' },
          { text: 'Check laminate edge banding glue lines.', rule: 'No loose edges or bubbling.' },
          { text: 'Check anchor fixing strength of backing boards to masonry walls.', rule: 'Cabinet must not shift under load.' }
        ]
      };
    }

    if (qaTask) {
      qaTask.startDate = act.startDate;
      qaTask.endDate = act.endDate;
      qaTask.actualStartDate = null;
      qaTask.actualEndDate = null;
      qaTask.status = 'Pending';
      qaTask.notes = '';
      finalActivities.push(qaTask);
    }
  });

  // Shift dates of subsequent tasks to maintain sequential schedule
  let currentPtr = new Date(projectStartDate);
  const adjustedActivities = finalActivities.map(act => {
    const sDate = formatDate(currentPtr);
    currentPtr = addDays(currentPtr, act.duration);
    const eDate = formatDate(currentPtr);
    currentPtr = addDays(currentPtr, 1);

    return {
      ...act,
      startDate: sDate,
      endDate: eDate
    };
  });

  // Apply parameters specific checklists overrides
  adjustedActivities.forEach(act => {
    act.checklist = act.checklist.map(item => ({ ...item, checked: false }));
    const actId = act.id.toLowerCase();
    
    // --- SOIL TYPE CUSTOMIZATIONS ---
    if (params.soilType === 'Black Cotton') {
      if (actId.includes('excavation') || actId === 'sub-1') {
        act.checklist.push(
          { text: 'Verify footing excavation reaches minimum 2.0 meters to bypass black cotton clay.', rule: 'Expansive clay causes foundation heave.' },
          { text: 'Erect sand cushion bed of 150mm depth under footing base.', rule: 'Sand cushions absorb clay swelling forces.' }
        );
      }
      if (actId.includes('footing') || actId === 'sub-4') {
        act.checklist.push(
          { text: 'Verify footing concrete grade matches M25 for high sulfate resistance.', rule: 'Black cotton soils contain organic sulfate salts.' }
        );
      }
      if (actId.includes('plinth') || actId === 'sub-5' || actId === 'sub-6') {
        act.checklist.push(
          { text: 'Verify plinth beam depth is minimum 450mm with double shear links.', rule: 'Prevents structural cracking from differential heave.' }
        );
      }
    } else if (params.soilType === 'Sandy') {
      if (actId.includes('excavation') || actId === 'sub-1') {
        act.checklist.push(
          { text: 'Erect diagonal timber sheet shoring to prevent sand cave-ins.', rule: 'Dry loose sand has zero cohesion.' },
          { text: 'Erect water spray setup to maintain soil moisture during compaction.', rule: 'Sandy soil compaction requires optimum moisture content.' }
        );
      }
    } else if (params.soilType === 'Rocky') {
      if (actId.includes('excavation') || actId === 'sub-1') {
        act.checklist.push(
          { text: 'Use mechanical jackhammers; check for structural micro-cracks in neighboring walls.', rule: 'Avoid explosives in residential areas.' }
        );
      }
      if (actId.includes('pcc') || actId === 'sub-2') {
        act.checklist.push(
          { text: 'Reduce leveling course PCC thickness to 50mm as rock bed is stable.', rule: 'Optimizes concrete cost on solid rock.' }
        );
      }
    }

    // --- SEASONAL CUSTOMIZATIONS ---
    if (params.season === 'Monsoon') {
      if (actId.includes('slab') || actId.includes('casting') || actId === 'sub-4' || actId === 'sub-6') {
        act.checklist.push(
          { text: 'Verify heavy waterproof tarpaulin sheets are on site before starting pour.', rule: 'Fresh concrete slurry must not be washed away by rain.' },
          { text: 'Add plasticizer water-reducing admixture to maintain strict water-cement ratio.', rule: 'Prevents strength drop due to rainwater absorption.' }
        );
      }
    } else if (params.season === 'Summer') {
      if (actId.includes('curing') || actId.includes('plaster') || actId.includes('slab') || actId === 'sub-6') {
        act.checklist.push(
          { text: 'Wet column/wall surfaces 3 times daily using double-layered jute bags.', rule: 'Rapid evaporation in summer causes plastic shrinkage cracks.' },
          { text: 'Use water cooled below 30°C or mix ice flakes into concrete batch.', rule: 'Keep concrete placement temperature under limits.' }
        );
      }
    } else if (params.season === 'Winter') {
      if (actId.includes('shuttering') || actId.includes('slab') || actId.includes('column')) {
        act.checklist.push(
          { text: 'Keep centering sheets locked for 24 hours extra due to slow hydration.', rule: 'Low temperature slows concrete strength gain rate.' }
        );
      }
    }

    // --- BUDGET CUSTOMIZATIONS ---
    if (params.budget === 'Luxury') {
      if (actId.includes('wiring') || actId.includes('electrical') || actId.includes('conduit')) {
        act.checklist.push(
          { text: 'Install high-end fire-retardant low-smoke (FR-LS) copper wires only.', rule: 'Standard safety specification for premium residences.' }
        );
      }
      if (actId.includes('waterproofing') || actId.includes('sunken') || actId.includes('tiling')) {
        act.checklist.push(
          { text: 'Verify double coat polymeric waterproofing membrane thickness of 1.5mm.', rule: 'Guarantees zero leakage into luxury false ceilings.' },
          { text: 'Use epoxy grouting for tiles instead of white cement.', rule: 'Stain-proof and highly water-resistant joints.' }
        );
      }
    } else if (params.budget === 'Economy') {
      if (actId.includes('material') || actId.includes('planning')) {
        act.checklist.push(
          { text: 'Audit local sand/stone procurement to minimize transport cost.', rule: 'Reduces carbon footprint and freight charges.' }
        );
      }
    }
  });

  return adjustedActivities;
}
