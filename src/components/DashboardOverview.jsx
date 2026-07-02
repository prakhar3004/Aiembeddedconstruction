import React, { useState } from 'react';
import { Clock, Percent, Wrench, CheckSquare, Sparkles, AlertTriangle, Lightbulb, Compass, ClipboardList, Layers, Home, Key, Bot, HelpCircle, FileText, Activity } from 'lucide-react';
import { isLiveMode } from '../services/gemini';
import { UI_TRANSLATIONS, translateContent } from '../utils/translationHelper';
import { BUILDING_CONFIGS } from '../utils/activityGenerator';

// Deep structural construction stages grouped logically
const CONSTRUCTION_GROUPS = [
  {
    id: 'planning',
    title: {
      en: '1. Pre-Con & Permits',
      hi: '1. योजना एवं अनुमति'
    },
    icon: ClipboardList,
    phases: [
      {
        title: {
          en: '1. Soil & Site Survey',
          hi: '1. मिट्टी और भूमि परीक्षण'
        },
        desc: {
          en: 'Verify Safe Bearing Capacity (SBC) of soil to design correct foundation width.',
          hi: 'नींव की चौड़ाई का सही डिजाइन करने के लिए मिट्टी की असर क्षमता (SBC) की जांच करें।'
        },
        civil: {
          en: 'SBC Soil test is mandatory to design footing depth. Never skip soil testing.',
          hi: 'फुटिंग की गहराई तय करने के लिए एसबीसी मिट्टी का परीक्षण (SBC Soil Test) अनिवार्य है। इसे कभी न छोड़ें।'
        },
        arch: {
          en: 'Check road width, setbacks, and local zoning laws before drawing blueprints.',
          hi: 'ब्लूप्रिंट बनाने से पहले सड़क की चौड़ाई, सेटबैक और स्थानीय क्षेत्र नियमों की जांच करें।'
        },
        interior: {
          en: 'Identify load-bearing walls vs partition walls to optimize open-floor planning.',
          hi: 'ओपन-फ्लोर प्लानिंग को अनुकूलित करने के लिए लोड-बेयरिंग दीवारों बनाम विभाजन दीवारों की पहचान करें।'
        }
      },
      {
        title: {
          en: '2. Blueprints & Permits',
          hi: '2. नक्शा और सरकारी मंजूरी'
        },
        desc: {
          en: 'Draft architectural drawings, elevations, structural designs, and municipal clearance.',
          hi: 'वास्तुशिल्प चित्र, ऊंचाई, संरचनात्मक डिजाइन और नगरपालिका मंजूरी का मसौदा तैयार करें।'
        },
        civil: {
          en: 'Ensure structural drawings are signed by a certified structural engineer.',
          hi: 'सुनिश्चित करें कि संरचनात्मक चित्र एक प्रमाणित संरचनात्मक इंजीनियर द्वारा हस्ताक्षरित हों।'
        },
        arch: {
          en: 'Set target spaces for rooms, shafts, ducts, light, and cross-ventilation rules.',
          hi: 'कमरों, शाफ्ट, नलिकाओं, प्रकाश और क्रॉस-वेंटिलेशन नियमों के लिए लक्ष्य स्थान निर्धारित करें।'
        },
        interior: {
          en: 'Draft detailed furniture electrical plans before final column layout freezing.',
          hi: 'कॉलम लेआउट को अंतिम रूप से फ्रीज करने से पहले विस्तृत फर्नीचर और बिजली योजनाओं का मसौदा तैयार करें।'
        }
      }
    ]
  },
  {
    id: 'substructure',
    title: {
      en: '2. Substructure',
      hi: '2. नींव और बुनियादी ढांचा'
    },
    icon: Wrench,
    phases: [
      {
        title: {
          en: '3. Excavation & Anti-termite',
          hi: '3. खुदाई और दीमक नियंत्रण'
        },
        desc: {
          en: 'Excavate up to hard strata. Apply anti-termite chemical spray at bottom & sides.',
          hi: 'कठोर सतह तक खुदाई करें। तल और किनारों पर दीमक रोधी रासायनिक स्प्रे का छिड़काव करें।'
        },
        civil: {
          en: 'Keep excavation pits dry. Mud water weakens concrete foundation strength.',
          hi: 'खुदाई के गड्ढों को सूखा रखें। कीचड़ का पानी कंक्रीट फाउंडेशन की ताकत को कमजोर करता है।'
        },
        arch: {
          en: 'Re-check column center lines on site using standard surveying threads.',
          hi: 'मानक सर्वेक्षण धागे का उपयोग करके साइट पर कॉलम की केंद्र लाइनों की दोबारा जांच करें।'
        },
        interior: {
          en: 'Ensure main sewage line pipe exits are clear of column footings.',
          hi: 'सुनिश्चित करें कि मुख्य सीवर लाइन के पाइप निकास कॉलम फुटिंग से दूर हों।'
        }
      },
      {
        title: {
          en: '4. PCC & Footing Casting',
          hi: '4. कच्चा कंक्रीट और फुटिंग'
        },
        desc: {
          en: 'Lay M10 PCC bed. Place footing mesh on concrete cover blocks of minimum 50mm.',
          hi: 'M10 PCC बेड बिछाएं। न्यूनतम 50 मिमी के कंक्रीट कवर ब्लॉक पर फुटिंग मेश रखें।'
        },
        civil: {
          en: 'Use concrete cover blocks under steel rebars. Minimum cover for footings must be 50mm.',
          hi: 'सरिया के नीचे कंक्रीट कवर ब्लॉक का उपयोग करें। फुटिंग के लिए न्यूनतम कवर 50 मिमी होना चाहिए।'
        },
        arch: {
          en: 'Verify vertical column alignment (plumb line) during steel binding.',
          hi: 'स्टील बाइंडिंग के दौरान वर्टिकल कॉलम एलाइनमेंट (साहुल लाइन) को सत्यापित करें।'
        },
        interior: {
          en: 'Plan external landscape drainage pipe slopes.',
          hi: 'बाहरी लैंडस्केप जल निकासी पाइप की ढलान की योजना बनाएं।'
        }
      },
      {
        title: {
          en: '5. Plinth Beam & DPC',
          hi: '5. प्लिंथ बीम और डीपीसी'
        },
        desc: {
          en: 'Cast plinth beam with M20 concrete. Lay Damp-Proof Course (DPC) layer to prevent rising damp.',
          hi: 'M20 कंक्रीट के साथ प्लिंथ बीम की ढलाई करें। नमी को रोकने के लिए डैम-प्रूफ कोर्स (DPC) की परत बिछाएं।'
        },
        civil: {
          en: 'Apply a bitumen coat on top of the DPC layer for enhanced moisture resistance.',
          hi: 'बढ़ी हुई नमी प्रतिरोध के लिए डीपीसी परत के ऊपर बिटुमेन का एक कोट लगाएं।'
        },
        arch: {
          en: 'Plinth height must be min 1.5-2 feet above road level to prevent flooding.',
          hi: 'जलभराव से बचने के लिए प्लिंथ की ऊंचाई सड़क स्तर से कम से कम 1.5-2 फीट ऊपर होनी चाहिए।'
        },
        interior: {
          en: 'Plan electrical conduit paths rising from floor level.',
          hi: 'फर्श के स्तर से ऊपर उठने वाले बिजली के कंड्यूट पाइपों की योजना बनाएं।'
        }
      }
    ]
  },
  {
    id: 'superstructure',
    title: {
      en: '3. Superstructure',
      hi: '3. सुपर-स्ट्रक्चर'
    },
    icon: Layers,
    phases: [
      {
        title: {
          en: '6. Column Reinforcement',
          hi: '6. कॉलम सुदृढीकरण'
        },
        desc: {
          en: 'Check stirrup spacing (spacing closer near joints). Use 12mm minimum vertical bars.',
          hi: 'रिंगों (stirrups) की दूरी की जाँच करें (जोड़ों के पास दूरी कम होनी चाहिए)। 12 मिमी से मोटे वर्टिकल सरिया का उपयोग करें।'
        },
        civil: {
          en: 'Lap joints of columns must be staggered and placed only at mid-height.',
          hi: 'कॉलम के लैप जोड़ कंपकंपी से बचने के लिए बिखरे (staggered) और केवल मध्य-ऊंचाई पर होने चाहिए।'
        },
        arch: {
          en: 'Ensure column orientation matches structural blueprint limits.',
          hi: 'सुनिश्चित करें कि कॉलम का ओरिएंटेशन स्ट्रक्चरल ब्लूप्रिंट सीमाओं से मेल खाता हो।'
        },
        interior: {
          en: 'Check that structural pillars do not block modular wardrobe alignments.',
          hi: 'जांचें कि संरचनात्मक खंभे अलमारी के संरेखण को अवरुद्ध न करें।'
        }
      },
      {
        title: {
          en: '7. Brickwork & Lintels',
          hi: '7. दीवारों की चिनाई और लिंटेल'
        },
        desc: {
          en: 'Soak bricks in water. Place lintel beam over doors/windows with 150mm bearing.',
          hi: 'ईंटों को पानी में भिगोएं। दरवाजों/खिड़कियों के ऊपर 150 मिमी असर वाली लिंटेल बीम रखें।'
        },
        civil: {
          en: 'Build 4-inch partition walls with horizontal concrete bands at every 4 feet height for stability.',
          hi: 'स्थिरता के लिए हर 4 फीट की ऊंचाई पर कंक्रीट बैंड के साथ 4 इंच की विभाजन दीवारें बनाएं।'
        },
        arch: {
          en: 'Check window sill levels (typically 3 feet) and door heights (7 feet).',
          hi: 'खिड़की की सिल ऊंचाई (आमतौर पर 3 फीट) और दरवाजे की ऊंचाई (7 फीट) की जांच करें।'
        },
        interior: {
          en: 'Mark locations for bathroom exhaust fans and air-conditioning ducts.',
          hi: 'बाथरूम के एग्जॉस्ट फैन और एयर-कंडीशनिंग डक्ट के स्थानों को चिह्नित करें।'
        }
      },
      {
        title: {
          en: '8. Roof Slab & Curing',
          hi: '8. छत की ढलाई और तराई'
        },
        desc: {
          en: 'Place cover blocks of 20mm for slab. Cure the slab by ponding for 14-21 days.',
          hi: 'छत के सरिया के नीचे 20 मिमी के कवर ब्लॉक रखें। 14-21 दिनों तक पानी भरकर स्लैब की तराई करें।'
        },
        civil: {
          en: 'Ensure M20 concrete mix (1:1.5:3) is thoroughly compacted using needle vibrators.',
          hi: 'सुनिश्चित करें कि सुई वाइब्रेटर का उपयोग करके M20 कंक्रीट मिक्स (1:1.5:3) को अच्छी तरह से कॉम्पैक्ट किया गया है।'
        },
        arch: {
          en: 'Verify slab levels, fan box positioning, and electrical pipe drops.',
          hi: 'स्लैब के स्तर, पंखे के बॉक्स की स्थिति और बिजली के पाइपों के गिराए जाने की जांच करें।'
        },
        interior: {
          en: 'Design false ceiling height drops according to beam depths.',
          hi: 'बीम की गहराई के अनुसार फॉल्स सीलिंग की ऊंचाई की योजना बनाएं।'
        }
      }
    ]
  },
  {
    id: 'mep',
    title: {
      en: '4. MEP & Plaster',
      hi: '4. बिजली, प्लंबिंग और प्लास्टर'
    },
    icon: Activity,
    phases: [
      {
        title: {
          en: '9. Concealed Conduit Routing',
          hi: '9. छिपी हुई पाइपिंग और नाली'
        },
        desc: {
          en: 'Avoid horizontal grooving in structural walls. Use vertical cuts only.',
          hi: 'संरचनात्मक दीवारों में क्षैतिज खांचे काटने से बचें। केवल ऊर्ध्वाधर कटों का उपयोग करें।'
        },
        civil: {
          en: 'Use heavy-duty PVC conduit pipes to prevent damage during plastering work.',
          hi: 'प्लास्टर के काम के दौरान नुकसान को रोकने के लिए भारी-भरकम पीवीसी कंड्यूट पाइप का उपयोग करें।'
        },
        arch: {
          en: 'Ensure switchboards are not hidden behind door swings.',
          hi: 'सुनिश्चित करें कि स्विचबोर्ड दरवाजों के खुलने के पीछे न छिपें।'
        },
        interior: {
          en: 'Place modular kitchen socket points (16A for heavy appliances, 6A for others).',
          hi: 'मॉड्यूलर किचन सॉकेट पॉइंट व्यवस्थित करें (भारी उपकरणों के लिए 16A, अन्य के लिए 6A)।'
        }
      },
      {
        title: {
          en: '10. Plastering & Joint Mesh',
          hi: '10. भीतरी और बाहरी प्लास्टर'
        },
        desc: {
          en: 'Fix chicken mesh at concrete-brick joints to prevent cracks. Cure plaster for 7-10 days.',
          hi: 'दरारें रोकने के लिए कॉलम-ईंट के जोड़ों पर मुर्गा जाली लगाएं। प्लास्टर की 7-10 दिनों तक तराई करें।'
        },
        civil: {
          en: 'Ensure plaster ratios: wall plaster must be 1:4 (cement:sand), ceiling 1:3.',
          hi: 'प्लास्टर का अनुपात सुनिश्चित करें: दीवार का प्लास्टर 1:4 और छत का प्लास्टर 1:3 होना चाहिए।'
        },
        arch: {
          en: 'Wall plaster thickness must not exceed 15mm; check wall verticality.',
          hi: 'दीवार के प्लास्टर की मोटाई 15 मिमी से अधिक नहीं होनी चाहिए; दीवार के साहुल की जांच करें।'
        },
        interior: {
          en: 'Check window frame plaster finishes for smooth slide tracks.',
          hi: 'सुचारू स्लाइड ट्रैक के लिए खिड़की के फ्रेम के प्लास्टर फिनिश की जांच करें।'
        }
      },
      {
        title: {
          en: '11. Plumbing Pressure Test',
          hi: '11. प्लंबिंग लीक टेस्ट'
        },
        desc: {
          en: 'Fill water lines and run a pressure test at 10 bar for 1 hour.',
          hi: 'पानी की लाइनों को भरें और 1 घंटे के लिए 10 बार दबाव पर दबाव रिसाव परीक्षण चलाएं।'
        },
        civil: {
          en: 'Use pneumatic pressure pump to check leaks in concealed bathroom wall fittings.',
          hi: 'दीवार में छिपे प्लंबिंग फिटिंग्स में रिसाव की जांच के लिए वायवीय दबाव पंप का उपयोग करें।'
        },
        arch: {
          en: 'Keep drainage pipes separate from freshwater supply lines.',
          hi: 'जल निकासी पाइपों को ताजे पानी की आपूर्ति लाइनों से पूरी तरह अलग रखें।'
        },
        interior: {
          en: 'Verify floor trap slopes in bathrooms to prevent stagnant pools.',
          hi: 'बाथरूम में पानी जमा होने से रोकने के लिए फर्श के जाल के ढलान को सत्यापित करें।'
        }
      }
    ]
  },
  {
    id: 'interiors',
    title: {
      en: '5. Interior Fit-outs',
      hi: '5. आंतरिक सज्जा'
    },
    icon: Home,
    phases: [
      {
        title: {
          en: '12. Waterproofing Wet Zones',
          hi: '12. बाथरूम वॉटरप्रूफिंग'
        },
        desc: {
          en: 'Apply 2 coats of elastomeric waterproofing chemical in bathroom and balcony slabs.',
          hi: 'बाथरूम और बालकनी स्लैब में इलास्टोमेरिक वॉटरप्रूफिंग केमिकल के 2 कोट लगाएं।'
        },
        civil: {
          en: 'Sunken slab pond testing must be done for 48 hours to confirm zero leak.',
          hi: 'शून्य रिसाव की पुष्टि करने के लिए डूबी हुई (sunken) स्लैब में 48 घंटे तक पानी भरकर परीक्षण किया जाना चाहिए।'
        },
        arch: {
          en: 'Ensure proper slope in slab base before applying waterproofing paint coats.',
          hi: 'वॉटरप्रूफिंग पेंट लगाने से पहले स्लैब बेस में उचित ढलान सुनिश्चित करें।'
        },
        interior: {
          en: 'Select high-durability anti-skid tiles for bathroom flooring.',
          hi: 'बाथरूम के फर्श के लिए उच्च-टिकाऊ एंटी-स्किड टाइल्स का चयन करें।'
        }
      },
      {
        title: {
          en: '13. Floor Tiling & Cladding',
          hi: '13. फर्श की टाइलें और क्लैडिंग'
        },
        desc: {
          en: 'Use high-quality tile adhesives; tap tiles with rubber mallet to prevent hollow spots.',
          hi: 'उच्च गुणवत्ता वाले टाइल चिपकने वाले (adhesives) का उपयोग करें; खोखले स्थानों को रोकने के लिए रबर के हथौड़े से ठोकें।'
        },
        civil: {
          en: 'Ensure 24 hours of curing for tile joints before applying grout fillers.',
          hi: 'ग्राउट फिलर लगाने से पहले टाइल के जोड़ों की 24 घंटे की तराई सुनिश्चित करें।'
        },
        arch: {
          en: 'Ensure tile alignment lines (joints) match across room thresholds.',
          hi: 'सुनिश्चित करें कि टाइल संरेखण लाइनें (जोड़) कमरे की सीमाओं के पार मेल खाती हों।'
        },
        interior: {
          en: 'Select epoxy grout for kitchen and bathroom tile joints for water resistance.',
          hi: 'पानी प्रतिरोध के लिए रसोई और बाथरूम के टाइल जोड़ों के लिए एपॉक्सी ग्राउट चुनें।'
        }
      },
      {
        title: {
          en: '14. False Ceiling & Carpentry',
          hi: '14. फॉल्स सीलिंग और लकड़ी काम'
        },
        desc: {
          en: 'Fix GI channel framing securely to the concrete roof slab using anchors.',
          hi: 'एंकर का उपयोग करके कंक्रीट छत स्लैब पर जीआई चैनल फ्रेमिंग को सुरक्षित रूप से ठीक करें।'
        },
        civil: {
          en: 'Use rust-resistant zinc-coated fasteners for framing grid.',
          hi: 'फ्रेमिंग ग्रिड के लिए जंग प्रतिरोधी जस्ता-लेपित फास्टनरों का उपयोग करें।'
        },
        arch: {
          en: 'Keep false ceiling clearance height at least 8.5 feet for comfort.',
          hi: 'आराम के लिए फॉल्स सीलिंग की ऊंचाई कम से कम 8.5 फीट रखें।'
        },
        interior: {
          en: 'Use BWR (Boiling Water Resistant) plywood in the kitchen and damp zones.',
          hi: 'रसोई और नम क्षेत्रों में बीडब्ल्यूआर (उबलते पानी प्रतिरोधी) प्लाईवुड का उपयोग करें।'
        }
      }
    ]
  },
  {
    id: 'handover',
    title: {
      en: '6. Finishes & Handover',
      hi: '6. अंतिम फिनिश और हैंडओवर'
    },
    icon: Key,
    phases: [
      {
        title: {
          en: '15. Putty & Base Paint Coat',
          hi: '15. पुट्टी और बेस पेंट कोट'
        },
        desc: {
          en: 'Wall moisture content must be less than 12% before applying putty.',
          hi: 'पुट्टी लगाने से पहले दीवार में नमी की मात्रा 12% से कम होनी चाहिए।'
        },
        civil: {
          en: 'Use a moisture meter to check walls; wet walls cause paint flaking within months.',
          hi: 'दीवारों की जांच के लिए नमी मीटर का उपयोग करें; गीली दीवारें कुछ ही महीनों में पेंट को छील देती हैं।'
        },
        arch: {
          en: 'Sand the putty layers to achieve a perfectly flat, plumb surface.',
          hi: 'एकदम सपाट और सुंदर सतह प्राप्त करने के लिए पुट्टी की परतों को सैंडपेपर से घिसें।'
        },
        interior: {
          en: 'Choose low-VOC (volatile organic compound) paints to ensure healthy indoor air quality.',
          hi: 'स्वस्थ इनडोर वायु गुणवत्ता सुनिश्चित करने के लिए कम-वीओसी (volatile organic compound) पेंट चुनें।'
        }
      },
      {
        title: {
          en: '16. Sanitary & Electrical Fitments',
          hi: '16. नल और बिजली फिटिंग'
        },
        desc: {
          en: 'Verify water flow in all washbasins and check for leaks in waste pipes.',
          hi: 'सभी वॉशबेसिन में पानी के प्रवाह को सत्यापित करें और वेस्ट पाइप में रिसाव की जांच करें।'
        },
        civil: {
          en: 'Verify earthing wire connection in mains switchboard before installing appliances.',
          hi: 'उपकरण स्थापित करने से पहले मुख्य स्विचबोर्ड में अर्थिंग वायर कनेक्शन सत्यापित करें।'
        },
        arch: {
          en: 'Install switchplates, cover panels, and check for correct phase wiring.',
          hi: 'स्विचप्लेट, कवर पैनल स्थापित करें और सही चरण तारों (phase wiring) की जांच करें।'
        },
        interior: {
          en: 'Mount premium washbasin counters, mirrors, and designer lamps.',
          hi: 'प्रीमियम वॉशबेसिन काउंटर, दर्पण और डिजाइनर लैंप स्थापित करें।'
        }
      },
      {
        title: {
          en: '17. Final Paint & Handover',
          hi: '17. गृह प्रवेश और चाबी'
        },
        desc: {
          en: 'Test mains electrical circuit breakers (MCB/RCCB) for trip safety.',
          hi: 'यात्रा सुरक्षा के लिए मुख्य विद्युत सर्किट ब्रेकर (MCB/RCCB) का परीक्षण करें।'
        },
        civil: {
          en: 'Ensure main electrical meter connection is fully load tested with full house loads.',
          hi: 'सुनिश्चित करें कि मुख्य विद्युत मीटर कनेक्शन पूरे घर के लोड के साथ पूरी तरह से लोड टेस्ट किया गया है।'
        },
        arch: {
          en: 'Obtain municipal occupancy certificate (OC) and structural stability certificate.',
          hi: 'नगरपालिका अधिभोग प्रमाणपत्र (OC) और संरचनात्मक स्थिरता प्रमाणपत्र प्राप्त करें।'
        },
        interior: {
          en: 'Program digital door locks and deliver keys to the owner.',
          hi: 'डिजिटल डोर लॉक प्रोग्राम करें और मालिक को चाबियां सौंपें।'
        }
      }
    ]
  }
];

export default function DashboardOverview({ 
  activities, 
  riskAssessment, 
  isAnalyzing, 
  onRunAnalysis,
  projectParams,
  setProjectParams,
  isGenerating,
  onGenerateChecklist,
  language = 'en',
  onAskAI
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  
  // Calculations
  const totalCheckpoints = activities.reduce((acc, curr) => acc + (curr.checklist?.length || 0), 0);
  const checkedCheckpoints = activities.reduce((acc, curr) => 
    acc + (curr.checklist?.filter(item => item.checked).length || 0), 0);
  
  const progressPercent = totalCheckpoints > 0 
    ? Math.round((checkedCheckpoints / totalCheckpoints) * 100)
    : (activities.length > 0 ? Math.round((activities.filter(a => a.status === 'Completed').length / activities.length) * 100) : 0);
  
  const activeActivity = activities.find(a => a.status === 'In Progress') || 
                         activities.find(a => a.status === 'Pending') || 
                         { name: 'None (Completed)' };

  const checklistRatio = totalCheckpoints > 0 
    ? `${checkedCheckpoints}/${totalCheckpoints}` 
    : '0/0';

  const getRiskBorderClass = (risk) => {
    if (risk === 'High') return 'risk-card';
    if (risk === 'Medium') return 'risk-card warning-border';
    return 'risk-card success-border';
  };

  const getRiskBadgeColor = (risk) => {
    if (risk === 'High') return 'badge-delayed';
    if (risk === 'Medium') return 'badge-pending';
    return 'badge-completed';
  };

  const selectedGroup = CONSTRUCTION_GROUPS[activeGroupIndex];
  const selectedPhase = selectedGroup.phases[activePhaseIndex] || selectedGroup.phases[0];

  return (
    <div>
      {/* KPI Cards Row */}
      <div className="grid-4">
        {/* KPI 1 */}
        <div className="card kpi-card">
          <div className="kpi-header">
            <span>{t.progress}</span>
            <Percent size={16} />
          </div>
          <div className="kpi-value">{progressPercent}%</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card kpi-card">
          <div className="kpi-header">
            <span>{t.estimatedDelay}</span>
            <Clock size={16} />
          </div>
          <div className="kpi-value">{riskAssessment.estimatedDelayDays} Days</div>
          <span className={`kpi-trend ${riskAssessment.estimatedDelayDays > 7 ? 'trend-negative' : riskAssessment.estimatedDelayDays > 0 ? 'trend-neutral' : 'trend-positive'}`}>
            {riskAssessment.estimatedDelayDays > 0 ? `+${riskAssessment.estimatedDelayDays}d delay risk` : 'On schedule'}
          </span>
        </div>

        {/* KPI 3 */}
        <div className="card kpi-card">
          <div className="kpi-header">
            <span>{t.currentStage}</span>
            <Wrench size={16} />
          </div>
          <div className="kpi-value" style={{ fontSize: '16px', margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {translateContent(activeActivity.name, language)}
          </div>
          <span className="badge badge-progress" style={{ marginTop: '2px' }}>
            {translateContent(activeActivity.status || 'Active', language)}
          </span>
        </div>

        {/* KPI 4 */}
        <div className="card kpi-card">
          <div className="kpi-header">
            <span>{t.checklistStatus}</span>
            <CheckSquare size={16} />
          </div>
          <div className="kpi-value">{checklistRatio}</div>
          <span className="badge badge-pending">
            {totalCheckpoints > 0 ? `${Math.round((checkedCheckpoints / totalCheckpoints) * 100)}% ${t.verified}` : `0% ${t.verified}`}
          </span>
        </div>
      </div>

      {/* Grid wrapper for Predictor and customizer - fully responsive */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }} className="dashboard-grid-row">
        
        {/* Left Column: AI Delay Predictor */}
        <div className="card" style={{ flex: '1.2 1 340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-title" style={{ margin: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              {language === 'hi' ? 'एआई समय-सीमा और जोखिम संकेतक' : 'AI Timeline & Risk Predictor'}
            </span>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? t.analyzing : t.analyzeRisk}
            </button>
          </div>

          <div className={`alert ${getRiskBorderClass(riskAssessment.overallRisk)}`} style={{ margin: 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{t.overallRisk}:</span>
                <span className={`badge ${getRiskBadgeColor(riskAssessment.overallRisk)}`}>
                  {translateContent(riskAssessment.overallRisk, language)}
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                {riskAssessment.summary || (language === 'hi' ? 'एआई समय-सीमा डायग्नोस्टिक्स चलाने के लिए "देरी जोखिम का विश्लेषण" पर क्लिक करें।' : 'Click "Analyze Delay Risk" to run AI timeline diagnostics.')}
              </p>
            </div>
          </div>

          {/* Critical Path Risks */}
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
              {t.obstacles}
            </h3>
            {riskAssessment.criticalPathRisks && riskAssessment.criticalPathRisks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {riskAssessment.criticalPathRisks.map((risk, idx) => {
                  const act = activities.find(a => a.id === risk.activityId);
                  return (
                    <div key={idx} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(120,120,120,0.02)' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {language === 'hi' ? 'चरण:' : 'Stage:'} {act ? translateContent(act.name, language) : risk.activityId}
                      </div>
                      <p style={{ fontSize: '13px', margin: '4px 0 2px' }}>
                        <strong>{language === 'hi' ? 'जोखिम:' : 'Risk:'}</strong> {translateContent(risk.riskDescription, language)}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        <strong>{language === 'hi' ? 'प्रभाव:' : 'Downstream Impact:'}</strong> {translateContent(risk.impact, language)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'कोई सक्रिय क्रिटिकल पाथ देरी ब्लॉक नहीं मिला।' : 'No active critical path delay blocks detected.'}
              </div>
            )}
          </div>

          {/* AI Advisor Recommendations */}
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={16} style={{ color: 'var(--warning)' }} />
              {t.remedialSteps}
            </h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {riskAssessment.recommendations && riskAssessment.recommendations.length > 0 ? (
                riskAssessment.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{translateContent(rec, language)}</li>
                ))
              ) : (
                <li style={{ fontSize: '13px', color: 'var(--text-muted)', listStyleType: 'none' }}>
                  {language === 'hi' ? 'कोई कार्रवाई आवश्यक नहीं है। परियोजना शेड्यूल अनुकूलित है।' : 'No actions suggested. Project schedule is optimized.'}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: AI Checklist Customizer */}
        <div className="card" style={{ flex: '0.8 1 280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
            <Compass size={20} style={{ color: 'var(--primary)' }} />
            {t.customizerTitle}
          </h3>
          
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t.customizerDesc}
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="soilType">{t.soilType}</label>
            <select 
              id="soilType" 
              className="form-select"
              value={projectParams.soilType}
              onChange={(e) => setProjectParams(prev => ({ ...prev, soilType: e.target.value }))}
            >
              <option value="Black Cotton">
                {language === 'hi' ? 'काली कपास मिट्टी (Expansive Clay)' : 'Black Cotton Soil (Expansive Clay)'}
              </option>
              <option value="Sandy">
                {language === 'hi' ? 'रेतीली मिट्टी (Loose Sand)' : 'Sandy Soil (Loose Sand)'}
              </option>
              <option value="Clayey">
                {language === 'hi' ? 'चिकनी मिट्टी (Heavy Mud)' : 'Clayey Soil (Heavy Mud)'}
              </option>
              <option value="Rocky">
                {language === 'hi' ? 'चट्टानी / कठोर सतह' : 'Rocky / Hard Strata'}
              </option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="season">{t.season}</label>
            <select 
              id="season" 
              className="form-select"
              value={projectParams.season}
              onChange={(e) => setProjectParams(prev => ({ ...prev, season: e.target.value }))}
            >
              <option value="Monsoon">
                {language === 'hi' ? 'मानसून / वर्षा ऋतु' : 'Monsoon / Rainy Season'}
              </option>
              <option value="Summer">
                {language === 'hi' ? 'गर्मी / ग्रीष्म ऋतु' : 'Summer / Garmi'}
              </option>
              <option value="Winter">
                {language === 'hi' ? 'सर्दी / शीत ऋतु' : 'Winter / Sardi'}
              </option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stories">{t.stories}</label>
            <select 
              id="stories" 
              className="form-select"
              value={projectParams.stories}
              onChange={(e) => setProjectParams(prev => ({ ...prev, stories: e.target.value }))}
            >
              {Object.keys(BUILDING_CONFIGS).map(cfg => (
                <option key={cfg} value={cfg}>{cfg}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="budget">{t.budget}</label>
            <select 
              id="budget" 
              className="form-select"
              value={projectParams.budget}
              onChange={(e) => setProjectParams(prev => ({ ...prev, budget: e.target.value }))}
            >
              <option value="Economy">
                {language === 'hi' ? 'इकोनॉमी (सामान्य सामग्री)' : 'Economy (Standard Materials)'}
              </option>
              <option value="Premium">
                {language === 'hi' ? 'प्रीमियम (उन्नत गुणवत्ता नियंत्रण)' : 'Premium (Enhanced QA/QC)'}
              </option>
              <option value="Luxury">
                {language === 'hi' ? 'लक्जरी (भारी इंजीनियरिंग विशिष्टता)' : 'Luxury (Heavy Engineering Spec)'}
              </option>
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            onClick={onGenerateChecklist}
            disabled={isGenerating}
          >
            {isGenerating ? t.generating : t.generateCustom}
          </button>
          
          <div style={{ padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-color)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            💡 <strong>{language === 'hi' ? 'सुझाव:' : 'Pro Tip:'}</strong>{' '}
            {language === 'hi' 
              ? 'काली कपास मिट्टी (Black Cotton Soil) में नींव की जांच और मानसून ढलाई के दिशा-निर्देश काफी कड़े होते हैं। अधिक सुरक्षा के लिए पैरामीटर बदलें।'
              : 'Black Cotton soil foundation checking and monsoon casting guidelines are rigid. Modify parameters to see checklist updates.'}
          </div>
        </div>

      </div>
    </div>
  );
}
