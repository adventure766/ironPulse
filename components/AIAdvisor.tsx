import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { createAdvisorChat, analyzeImageWithGemini, AIPersona } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Chat } from '@google/genai';

interface AIAdvisorProps {
  user: UserProfile;
}

interface QuickAction {
  emoji: string;
  text: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { emoji: '🏋️', text: 'Generate Workout', prompt: 'Create a high-intensity workout for today.' },
  { emoji: '🥗', text: 'Meal Idea', prompt: 'Suggest a high-protein post-workout meal.' },
  { emoji: '😴', text: 'Recovery', prompt: 'How can I recover faster after a heavy leg day?' },
  { emoji: '💊', text: 'Supplements', prompt: 'What supplements should I take for muscle gain?' },
];

const AIAdvisor: React.FC<AIAdvisorProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [persona, setPersona] = useState<AIPersona>('standard');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Simulated Live Stats
  const [latency, setLatency] = useState(12);
  const [cpuLoad, setCpuLoad] = useState(34);

  // Live Stats Interval
  useEffect(() => {
    const interval = setInterval(() => {
        setLatency(prev => Math.max(5, Math.min(45, prev + (Math.random() > 0.5 ? 2 : -2))));
        setCpuLoad(prev => Math.max(10, Math.min(80, prev + (Math.random() > 0.5 ? 5 : -5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Chat
  useEffect(() => {
    const chat = createAdvisorChat(user, persona);
    setChatSession(chat);
    
    if (messages.length > 0) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: `*SYSTEM UPDATE: Persona switched to ${persona.toUpperCase()}*. Calibration complete.`,
            timestamp: Date.now()
        }]);
    } else {
        setMessages([{
            id: 'welcome',
            role: 'model',
            text: `System Online. Welcome, ${user.name}. I am ready to optimize your ${user.goal.replace('_', ' ')} protocol.`,
            timestamp: Date.now()
        }]);
    }
  }, [persona, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: textToSend + (selectedImage ? " [Image Attached]" : ""),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (selectedImage) {
        const prompt = textToSend || "Analyze this image and provide fitness/nutrition feedback.";
        responseText = await analyzeImageWithGemini(selectedImage, prompt);
        setSelectedImage(null);
      } else if (chatSession) {
        const result = await chatSession.sendMessage({ message: textToSend });
        responseText = result.text || "Data stream interrupted.";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Connection lost. Re-establishing link...",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const Waveform = () => (
      <div className="flex items-center justify-center gap-1 h-8 px-4">
          {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-gym-400 rounded-full animate-wave" 
                style={{ 
                    height: '20%',
                    animationDelay: `${i * 0.1}s`,
                    backgroundColor: persona === 'drill_sergeant' ? '#f87171' : persona === 'scientist' ? '#60a5fa' : '#34d399'
                }}
              ></div>
          ))}
      </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-black rounded-3xl overflow-hidden border border-gym-700 shadow-2xl relative hologram-border">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="scanline"></div>
      
      {/* Dynamic Glows */}
      <div className={`absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 animate-pulse-slow pointer-events-none
        ${persona === 'drill_sergeant' ? 'bg-red-600' : persona === 'scientist' ? 'bg-blue-600' : 'bg-gym-500'}
      `}></div>

      {/* Header / Command Deck */}
      <div className="relative z-20 bg-gym-900/90 backdrop-blur-xl p-3 border-b border-gym-700 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10
                ${persona === 'standard' ? 'bg-gradient-to-br from-gym-600 to-gym-800' : ''}
                ${persona === 'drill_sergeant' ? 'bg-gradient-to-br from-red-600 to-red-800' : ''}
                ${persona === 'scientist' ? 'bg-gradient-to-br from-blue-600 to-blue-800' : ''}
                ${persona === 'zen_master' ? 'bg-gradient-to-br from-teal-500 to-teal-800' : ''}
            `}>
                <i className={`fas text-white text-xl animate-pulse
                     ${persona === 'standard' ? 'fa-microchip' : ''}
                     ${persona === 'drill_sergeant' ? 'fa-biohazard' : ''}
                     ${persona === 'scientist' ? 'fa-atom' : ''}
                     ${persona === 'zen_master' ? 'fa-yin-yang' : ''}
                `}></i>
            </div>
            <div>
                <h2 className="text-white font-bold text-lg tracking-wider uppercase font-mono">IronPulse Core</h2>
                <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> LIVE</span>
                    <span>LATENCY: {latency}ms</span>
                    <span>CPU: {cpuLoad}%</span>
                </div>
            </div>
        </div>

        {/* Persona Toggles */}
        <div className="hidden md:flex gap-2">
            {(['standard', 'drill_sergeant', 'scientist', 'zen_master'] as AIPersona[]).map((p) => (
                <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border
                    ${persona === p 
                        ? 'bg-gym-800 text-white border-gym-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                        : 'bg-transparent text-gray-500 border-transparent hover:border-gray-700'}`}
                >
                    {p === 'drill_sergeant' ? 'Combat' : p === 'zen_master' ? 'Zen' : p === 'scientist' ? 'Lab' : 'Base'}
                </button>
            ))}
        </div>
      </div>

      {/* Chat Stream */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        
        {messages.length <= 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in mt-10">
                {QUICK_ACTIONS.map((action, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSend(action.prompt)}
                        className="bg-gym-800/40 hover:bg-gym-700/60 border border-gym-700 hover:border-gym-500 p-4 rounded-xl text-left transition-all hover:-translate-y-1 group backdrop-blur-sm"
                    >
                        <div className="text-2xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform">{action.emoji}</div>
                        <div className="text-xs font-bold text-gym-100 uppercase tracking-wide group-hover:text-white">{action.text}</div>
                    </button>
                ))}
            </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex animate-slide-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs border border-white/10 mt-1 shadow-lg
                    ${msg.role === 'user' ? 'bg-indigo-900/80 text-indigo-300' : 'bg-gym-900/80 text-gym-300'}`}>
                    <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-terminal'}`}></i>
                </div>

                {/* Message Box */}
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-mono mb-1 uppercase opacity-70">
                        {msg.role === 'user' ? 'You' : `AI // ${persona}`}
                    </span>
                    <div
                    className={`rounded-xl px-5 py-3.5 shadow-lg backdrop-blur-md border text-sm leading-relaxed relative overflow-hidden
                        ${
                        msg.role === 'user'
                            ? 'bg-indigo-600/20 text-indigo-50 border-indigo-500/30 rounded-tr-none'
                            : 'bg-gym-800/60 text-gym-50 border-gym-600/30 rounded-tl-none'
                        }`}
                    >
                        {/* Decorative Corner */}
                        <div className={`absolute w-2 h-2 border-t border-l ${msg.role === 'user' ? 'border-indigo-400 top-0 left-0' : 'border-gym-400 top-0 right-0'} opacity-50`}></div>

                        <ReactMarkdown 
                            className="prose prose-invert prose-sm max-w-none 
                            prose-p:mb-2 prose-headings:text-white prose-strong:text-gym-400 prose-ul:list-disc prose-ol:list-decimal"
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
          </div>
        ))}
        
        {/* Thinking Indicator */}
        {isLoading && (
           <div className="flex justify-start animate-fade-in pl-11">
             <div className="bg-gym-900/50 rounded-xl rounded-tl-none px-6 py-4 border border-gym-700/50 flex items-center gap-3 backdrop-blur-sm">
                 <span className="text-xs font-mono text-gym-400 animate-pulse">PROCESSING</span>
                 <Waveform />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Deck */}
      <div className="relative z-20 p-4 bg-black/60 border-t border-gym-800 backdrop-blur-xl">
        
        {selectedImage && (
            <div className="absolute bottom-full left-4 mb-4 animate-slide-in">
                <div className="relative group p-1 bg-gym-800 rounded-lg border border-gym-600 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <img 
                        src={`data:image/png;base64,${selectedImage}`} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-md opacity-80"
                    />
                    <div className="absolute inset-0 bg-gym-500/10 rounded-md pointer-events-none border border-gym-400/30"></div>
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md transition"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
        )}

        <div className="flex gap-3 items-end max-w-5xl mx-auto">
          {/* File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-xl bg-gym-900 hover:bg-gym-800 text-gym-400 hover:text-white flex flex-col items-center justify-center transition-all border border-gym-700 hover:border-gym-500 shrink-0 group"
            title="Scan Image"
          >
            <i className="fas fa-expand text-lg mb-1 group-hover:scale-110 transition"></i>
            <span className="text-[9px] font-mono uppercase">Scan</span>
          </button>

          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gym-500/5 rounded-xl blur-sm group-focus-within:bg-gym-500/10 transition-colors"></div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={selectedImage ? "Add context for visual analysis..." : "Enter command or query..."}
                className="w-full relative bg-gym-900/90 border border-gym-700 text-white rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:border-gym-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all placeholder-gray-600 font-mono text-sm"
                disabled={isLoading}
            />
            {/* Enter Key Visual */}
            <div className="absolute right-3 bottom-3 text-[10px] text-gray-600 font-mono border border-gray-700 rounded px-2 py-1">
                RET ⏎
            </div>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg transform hover:scale-105
                ${isLoading || (!input.trim() && !selectedImage) 
                    ? 'bg-gym-900 text-gray-600 border border-gym-800 cursor-not-allowed' 
                    : 'bg-gym-600 hover:bg-gym-500 text-white border border-gym-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
          >
            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;