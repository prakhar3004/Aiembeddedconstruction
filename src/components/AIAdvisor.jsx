import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, FileText, AlertCircle } from 'lucide-react';
import { askAdvisorQuestion, isLiveMode } from '../services/gemini';
import { UI_TRANSLATIONS, translateContent } from '../utils/translationHelper';
import { apiService } from '../services/api';

const welcomeMessages = {
  en: 'Hello! I am your AI Nirmaan Advisor. Ask me any question about your home construction journey, material quality checks, concrete curing standards, or architectural space layouts.',
  hi: 'नमस्ते! मैं आपका एआई निर्माण सलाहकार हूँ। अपने घर के निर्माण, सामग्री की गुणवत्ता की जाँच, कंक्रीट की तराई के मानकों, या आर्किटेक्चरल लेआउट के बारे में मुझसे कोई भी प्रश्न पूछें।',
  hin: 'Namaste! Main aapka AI Nirmaan Sahayak hoon. 🙏 Ghar banane ki journey se juda koi bhi sawaal, material checking, curing niyam, ya slab mix ratio ke baare me mujhse puchiye. Main live civil standards ke mutabik guide karunga.',
  mr: 'नमस्कार! मी तुमचा एआय निर्माण सल्लागार आहे. तुमच्या घराचे बांधकाम, साहित्याची गुणवत्ता तपासणे, काँक्रीट क्युरिंगचे नियम किंवा आर्किटेक्चरल लेआउटबद्दल काहीही विचारा.',
  te: 'నమస్తే! నేను మీ AI నిర్మాణ సలహాదారుని. మీ ఇంటి నిర్మాణం, మెటీరియల్ క్వాలిటీ చెక్స్, కాంక్రీట్ క్యూరింగ్ నియమాలు లేదా ఆర్కిటెక్చరల్ లేఅవుట్ గురించి ఏదైనా అడగండి.',
  ta: 'வணக்கம்! நான் உங்கள் AI கட்டுமான ஆலோசகர். உங்கள் வீட்டின் கட்டுமானம், பொருட்களின் தரம், கான்கிரீட் பதப்படுத்துதல் (curing) விதிகள் அல்லது கட்டிட வடிவமைப்பு பற்றி ஏதேனும் கேள்விகளைக் கேளுங்கள்.',
  kn: 'ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ AI ನಿರ್ಮಾಣ ಸಲಹೆಗಾರ. ನಿಮ್ಮ ಮನೆ ನಿರ್ಮಾಣ, ಸಿಮೆಂಟ್ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ, ಕಾಂಕ्रीट ಕ್ಯೂರಿಂಗ್ ನಿಯಮಗಳು ಅಥವಾ ವಿನ್ಯಾಸದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.',
  bn: 'নমস্কার! আমি আপনার এআই নির্মাণ উপদেষ্টা। আপনার বাড়ির নির্মাণ, উপকরণের গুণমান যাচাই, কংক্রিট কিউরিং এর নিয়ম বা আর্কিটেকচারাল লেআউট সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন.'
};

export default function AIAdvisor({ 
  activeProjectId,
  activities, 
  riskAssessment, 
  language = 'en',
  prefilledQuery = '',
  setPrefilledQuery
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: welcomeMessages.en
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      const welcomeText = welcomeMessages[language] || welcomeMessages.en;
      if (prev.length > 0 && prev[0].id === 1) {
        return [{ id: 1, sender: 'ai', text: welcomeText }, ...prev.slice(1)];
      }
      return prev;
    });
  }, [language]);

  // Load chat history from the backend database when activeProjectId changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!activeProjectId) return;
      try {
        const history = await apiService.getChats(activeProjectId);
        if (history.length > 0) {
          const formattedHistory = history.map((chat, idx) => ({
            id: `chat-${idx}-${Date.now()}`,
            sender: chat.sender === 'user' ? 'user' : 'ai',
            text: chat.text
          }));
          
          const welcomeText = welcomeMessages[language] || welcomeMessages.en;
          setMessages([
            { id: 1, sender: 'ai', text: welcomeText },
            ...formattedHistory
          ]);
        } else {
          const welcomeText = welcomeMessages[language] || welcomeMessages.en;
          setMessages([{ id: 1, sender: 'ai', text: welcomeText }]);
        }
      } catch (err) {
        console.error('Failed to load chat history from database:', err);
      }
    };
    loadChatHistory();
  }, [activeProjectId, language]);

  // Auto scroll to chat bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Prefilled query detector
  useEffect(() => {
    if (prefilledQuery && prefilledQuery.trim()) {
      handleSendMessage(prefilledQuery);
      if (setPrefilledQuery) {
        setPrefilledQuery('');
      }
    }
  }, [prefilledQuery]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeProjectId) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Save User Message to backend database
      await apiService.sendChatMessage(activeProjectId, textToSend, 'user');

      // Collect message history for context
      const apiHistory = messages
        .filter(m => m.id !== 1)
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const reply = await askAdvisorQuestion(textToSend, apiHistory, language);
      
      // Save Advisor Message to backend database
      await apiService.sendChatMessage(activeProjectId, reply, 'advisor');

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: reply
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Maaf kijiyega, API connect karne me issue aaya. Error: ${err.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputText);
    }
  };

  // Preset pills translated dynamically or kept as context
  const presets = language === 'hi' ? [
    'स्लैब की तराई कितने दिन करनी चाहिए?',
    'M20 कंक्रीट मिक्स रेशियो क्या है?',
    'बारिश में छत की ढलाई कैसे करें?',
    'प्लास्टर वर्क में दरारें कैसे रोकें?'
  ] : language === 'mr' ? [
    'स्लॅब क्युरिंग किती दिवस करावी?',
    'M20 काँक्रीट मिक्स रेशो काय आहे?',
    'पावसात स्लॅब कास्टिंग कसे करावे?',
    'प्लास्टरच्या कामात तडे जाणे कसे रोखावे?'
  ] : [
    'Slab curing kitne din karni chahiye?',
    'M20 concrete mix ratio kya hai?',
    'Baarish me slab cast kaise karein?',
    'Plaster work me crack kaise rokein?'
  ];

  // Helper to format AI replies containing markdown (bullet lists, bold, headings)
  const renderFormattedBubble = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        const title = line.replace(/^(###\s|##\s)/, '');
        return <h4 key={idx} style={{ fontSize: '15px', fontWeight: 'bold', margin: '12px 0 6px', color: 'var(--text-primary)' }}>{title}</h4>;
      }
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        const itemText = line.replace(/^\s*(\*\s|-\s)/, '');
        return <li key={idx} style={{ marginLeft: '16px', fontSize: '13px', listStyleType: 'disc', margin: '4px 0' }}>{renderBoldText(itemText)}</li>;
      }
      if (/^\s*\d+\.\s/.test(line)) {
        return <div key={idx} style={{ marginLeft: '12px', fontSize: '13px', margin: '4px 0' }}>{renderBoldText(line)}</div>;
      }
      return <p key={idx} style={{ margin: '4px 0', fontSize: '13px', color: 'inherit', lineHeight: '1.5' }}>{renderBoldText(line)}</p>;
    });
  };

  const renderBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'var(--primary)' }}>{part}</strong> : part);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', height: 'calc(100vh - var(--header-height) - 48px)' }}>
      
      {/* Left pane: Chat Console */}
      <div className="chat-container">
        {/* Chat History Viewport */}
        <div className="chat-history">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`}>
              <div className="chat-avatar">
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="chat-bubble">
                {msg.sender === 'user' ? msg.text : renderFormattedBubble(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-msg chat-msg-ai">
              <div className="chat-avatar">
                <Bot size={14} />
              </div>
              <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="animate-pulse" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Advisor is typing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt Pills */}
        <div className="presets-container">
          {presets.map((p, idx) => (
            <button 
              key={idx} 
              className="preset-pill" 
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <input 
            type="text" 
            className="chat-input"
            placeholder="Type your construction question here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="btn btn-primary"
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Right pane: Context Advisor Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Help Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
            {t.commonTopics}
          </h3>
          <p style={{ fontSize: '13px' }}>
            Get expert guidance across multi-disciplinary construction layers:
          </p>
          <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <li><strong>Civil Engineering:</strong> Structural rebar designs, concrete compaction, curing standards, soil bearing tests.</li>
            <li><strong>Architecture & Space:</strong> Ventilation layouts, natural light access, door lintel positions, municipal sanction guidelines.</li>
            <li><strong>Interior Designing:</strong> Modular kitchen carcass selections, wardrobe laminates, false ceiling suspensions, wall putty layers.</li>
          </ul>
        </div>

        {/* Schedule Sync Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: 'var(--primary)' }} />
            {t.activeLogs}
          </h3>
          <p style={{ fontSize: '13px' }}>
            AI has analyzed your active construction logs. Current schedule context synced into conversations:
          </p>
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'rgba(120, 120, 120, 0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              <AlertCircle size={14} style={{ color: 'var(--error)' }} />
              Delay: {riskAssessment.estimatedDelayDays} Days predicted
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.4' }}>
              {riskAssessment.summary}
            </p>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            💡 You can ask: <em>"Aise delay case me slab casting shuru karne ke liye kya preventive checks lene chahiye?"</em>
          </p>
        </div>

      </div>

    </div>
  );
}
