
import React, { useState, useEffect, useRef } from 'react';
import { LiveStream, Course, UserProfile } from '../types';

interface LiveClassesProps {
    user: UserProfile;
    setUser: (u: UserProfile) => void;
}

// --- MOCK DATA ---
const MOCK_STREAMS: LiveStream[] = [
  { id: '1', title: 'Morning HIIT Blast 🔥', streamerName: 'Coach Sarah', streamerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', thumbnail: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=600', viewers: 1240, category: 'Cardio', status: 'live', giftsReceived: 450, hypeLevel: 85 },
  { id: '2', title: 'Powerlifting Form Check', streamerName: 'Marcus Ray', streamerAvatar: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&q=80&w=400', thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600', viewers: 850, category: 'Strength', status: 'live', giftsReceived: 120, hypeLevel: 45 },
  { id: '3', title: 'Sunday Yoga Flow 🧘‍♀️', streamerName: 'Dr. Ken', streamerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400', thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=600', viewers: 2300, category: 'Yoga', status: 'live', giftsReceived: 1540, hypeLevel: 98 },
];

const MOCK_COURSES: Course[] = [
  { 
      id: 'c1', title: 'Hypertrophy 101', instructor: 'Marcus Ray', thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600', 
      rating: 4.9, students: 5400, duration: '4 Weeks', level: 'Intermediate',
      modules: [{ title: 'Intro to Muscle Growth', duration: '15:00' }, { title: 'Chest Mechanics', duration: '22:30' }, { title: 'Leg Drive', duration: '18:45' }]
  },
  { 
      id: 'c2', title: 'Mobility Masterclass', instructor: 'Dr. Ken', thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600', 
      rating: 5.0, students: 3200, duration: '2 Weeks', level: 'Beginner',
      modules: [{ title: 'Spine Health', duration: '12:00' }, { title: 'Hip Openers', duration: '20:00' }]
  },
  { 
      id: 'c3', title: 'Shred in 30 Days', instructor: 'Elena Swift', thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600', 
      rating: 4.7, students: 8900, duration: '30 Days', level: 'Advanced',
      modules: [{ title: 'Metabolic Conditioning', duration: '10:00' }, { title: 'Tabata Drills', duration: '15:00' }]
  },
];

const GIFTS = [
    { id: 'rose', name: 'Rose', icon: '🌹', cost: 10, animation: 'float-up' },
    { id: 'flex', name: 'Flex', icon: '💪', cost: 50, animation: 'pop' },
    { id: 'shake', name: 'Shake', icon: '🥤', cost: 100, animation: 'float-up' },
    { id: 'trophy', name: 'Trophy', icon: '🏆', cost: 500, animation: 'float-up' },
];

const LiveClasses: React.FC<LiveClassesProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'courses'>('live');
  const [streams, setStreams] = useState<LiveStream[]>(MOCK_STREAMS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  // Viewer States
  const [viewingStream, setViewingStream] = useState<LiveStream | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  // Go Live Form
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  
  // Upload Course Form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');

  // --- COMPONENT: Floating Reaction ---
  const FloatingReaction = ({ icon, x, y, onComplete }: { icon: string, x: number, y: number, onComplete: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div 
            className="absolute text-4xl animate-float-up pointer-events-none z-50 drop-shadow-md"
            style={{ left: x, bottom: y }}
        >
            {icon}
        </div>
    );
  };

  // --- COMPONENT: Stream Player ---
  const StreamPlayer = ({ stream, onClose, user, setUser }: { stream: LiveStream, onClose: () => void, user: UserProfile, setUser: any }) => {
      const [messages, setMessages] = useState<{user: string, text: string, type?: 'chat' | 'gift', giftIcon?: string}[]>([
          { user: 'GymBro92', text: 'Looking strong! 💪' },
          { user: 'SarahFit', text: 'What is the rest interval?' }
      ]);
      const [input, setInput] = useState('');
      const [reactions, setReactions] = useState<{id: number, icon: string, x: number, y: number}[]>([]);
      const chatRef = useRef<HTMLDivElement>(null);
      const [showGiftShop, setShowGiftShop] = useState(false);

      // Simulate live chat and random gifts from others
      useEffect(() => {
          const interval = setInterval(() => {
              const r = Math.random();
              if (r > 0.7) {
                  // Chat message
                  const randomUsers = ['Alex', 'Mike', 'Jen', 'Chris', 'Taylor'];
                  const randomMsgs = ['Great form!', 'Lets gooo!', 'Need water lol', 'Beast mode 🔥', 'Can you explain that again?'];
                  const newMsg = {
                      user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
                      text: randomMsgs[Math.floor(Math.random() * randomMsgs.length)]
                  };
                  setMessages(prev => [...prev.slice(-15), newMsg]);
              } else if (r > 0.9) {
                  // Random Gift from others
                  triggerReaction('🌹');
              }
          }, 2000);
          return () => clearInterval(interval);
      }, []);

      useEffect(() => {
          if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, [messages]);

      const triggerReaction = (icon: string) => {
          const id = Date.now();
          const x = 50 + Math.random() * 200; // Random X near center
          const y = 50;
          setReactions(prev => [...prev, { id, icon, x, y }]);
      };

      const handleSendGift = (gift: typeof GIFTS[0]) => {
          if (user.credits >= gift.cost) {
              // Deduct credits
              setUser({ ...user, credits: user.credits - gift.cost });
              
              // Trigger visual
              triggerReaction(gift.icon);
              
              // Add system message
              setMessages(prev => [...prev, { 
                  user: 'You', 
                  text: `sent a ${gift.name}`, 
                  type: 'gift', 
                  giftIcon: gift.icon 
              }]);
              setShowGiftShop(false);
          } else {
              alert("Not enough credits!");
          }
      };

      return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row animate-fade-in overflow-hidden">
              {/* Video Area */}
              <div className="flex-1 relative bg-gym-900 flex items-center justify-center">
                   
                   {/* Overlay HUD */}
                   <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                       <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-gym-700 flex items-center justify-center transition backdrop-blur-sm">
                           <i className="fas fa-arrow-left"></i>
                       </button>
                       <div className="bg-red-600 px-3 py-1 rounded text-white text-xs font-bold animate-pulse shadow-lg shadow-red-600/50">LIVE</div>
                       <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-white text-sm font-bold flex items-center gap-2">
                           <i className="fas fa-eye text-emerald-400"></i> {stream.viewers.toLocaleString()}
                       </div>
                   </div>

                   {/* Floating Reactions Layer */}
                   <div className="absolute inset-0 pointer-events-none overflow-hidden">
                       <div className="absolute bottom-20 right-10 w-64 h-96 pointer-events-none">
                           {reactions.map(r => (
                               <FloatingReaction 
                                    key={r.id} 
                                    icon={r.icon} 
                                    x={r.x} 
                                    y={r.y} 
                                    onComplete={() => setReactions(prev => prev.filter(rx => rx.id !== r.id))} 
                               />
                           ))}
                       </div>
                   </div>
                   
                   {/* Simulated Stream Content */}
                   <div className="w-full h-full relative overflow-hidden">
                       <img src={stream.thumbnail} className="w-full h-full object-cover opacity-80" alt="stream" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                       {/* Streamer Cam */}
                       <div className="absolute bottom-4 left-4 flex items-center gap-3 z-10">
                            <div className="relative">
                                <img src={stream.streamerAvatar} className="w-12 h-12 rounded-full border-2 border-red-500 shadow-lg" />
                                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded">HOST</div>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-shadow">{stream.title}</h4>
                                <p className="text-gray-300 text-xs text-shadow">{stream.streamerName}</p>
                            </div>
                       </div>
                   </div>
              </div>

              {/* Chat & Interaction Area */}
              <div className="w-full md:w-96 bg-gym-800 border-l border-gym-700 flex flex-col h-[40vh] md:h-full relative">
                  <div className="p-4 border-b border-gym-700 bg-gym-900 flex justify-between items-center shadow-md z-20">
                      <h3 className="font-bold text-white text-sm">Live Chat</h3>
                      <div className="text-xs font-mono text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 rounded">
                          <i className="fas fa-coins mr-1"></i> {user.credits} Credits
                      </div>
                  </div>
                  
                  {/* Messages */}
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
                      {messages.map((m, i) => (
                          <div key={i} className={`text-sm ${m.type === 'gift' ? 'bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg' : ''}`}>
                              {m.type === 'gift' ? (
                                  <div className="flex items-center gap-2 text-yellow-400 font-bold">
                                      <span>{m.user} sent {m.giftIcon}</span>
                                  </div>
                              ) : (
                                  <>
                                    <span className={`font-bold mr-2 ${m.user === 'You' ? 'text-emerald-400' : 'text-gray-400'}`}>{m.user}:</span>
                                    <span className="text-white">{m.text}</span>
                                  </>
                              )}
                          </div>
                      ))}
                  </div>

                  {/* Gift Shop Overlay */}
                  {showGiftShop && (
                      <div className="absolute bottom-16 left-0 w-full bg-gym-800 border-t border-gym-600 p-4 animate-slide-in shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30">
                          <div className="flex justify-between items-center mb-3">
                              <h4 className="text-white font-bold text-xs uppercase">Send a Gift</h4>
                              <button onClick={() => setShowGiftShop(false)}><i className="fas fa-times text-gray-400"></i></button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                              {GIFTS.map(gift => (
                                  <button 
                                    key={gift.id}
                                    onClick={() => handleSendGift(gift)}
                                    className="flex flex-col items-center bg-gym-900 p-2 rounded-lg border border-gym-700 hover:border-yellow-500 hover:bg-gym-700 transition"
                                  >
                                      <div className="text-2xl mb-1">{gift.icon}</div>
                                      <div className="text-[10px] text-white font-bold">{gift.name}</div>
                                      <div className="text-[9px] text-yellow-400">{gift.cost}c</div>
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Input & Controls */}
                  <div className="p-3 bg-gym-900 border-t border-gym-700 z-20">
                      <div className="flex gap-2">
                          <button 
                             onClick={() => setShowGiftShop(!showGiftShop)}
                             className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
                             title="Send Gift"
                          >
                              <i className="fas fa-gift"></i>
                          </button>
                          <input 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Say something..."
                            className="flex-1 bg-gym-800 text-white text-xs rounded-full px-4 py-2 outline-none focus:border-emerald-500 border border-transparent"
                            onKeyDown={e => {
                                if (e.key === 'Enter' && input) {
                                    setMessages(p => [...p, { user: 'You', text: input }]);
                                    setInput('');
                                }
                            }}
                          />
                          <button 
                            onClick={() => {
                                if (input) {
                                    setMessages(p => [...p, { user: 'You', text: input }]);
                                    setInput('');
                                }
                            }}
                            className="w-10 h-10 rounded-full bg-gym-700 text-emerald-400 hover:text-white hover:bg-emerald-600 flex items-center justify-center transition"
                          >
                              <i className="fas fa-paper-plane"></i>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- COMPONENT: Broadcaster View (HUD) ---
  const BroadcastView = ({ user, setIsBroadcasting }: { user: UserProfile, setIsBroadcasting: (v: boolean) => void }) => {
      const [viewers, setViewers] = useState(0);
      const [duration, setDuration] = useState(0);
      const [gifts, setGifts] = useState<{name: string, icon: string}[]>([]);
      const [sessionEarnings, setSessionEarnings] = useState(0);

      // Simulate incoming viewers and gifts
      useEffect(() => {
          const vInt = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 5)), 2000);
          const dInt = setInterval(() => setDuration(d => d + 1), 1000);
          
          const gInt = setInterval(() => {
              if (Math.random() > 0.7) {
                 const g = GIFTS[Math.floor(Math.random() * GIFTS.length)];
                 setGifts(prev => [...prev.slice(-4), { name: g.name, icon: g.icon }]);
                 setSessionEarnings(prev => prev + g.cost);
              }
          }, 4000);

          return () => { clearInterval(vInt); clearInterval(dInt); clearInterval(gInt); };
      }, []);

      const formatTime = (s: number) => {
          const mins = Math.floor(s / 60);
          const secs = s % 60;
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
              {/* Camera Preview */}
              <div className="w-full h-full absolute inset-0 bg-gray-900">
                  <div className="w-full h-full flex items-center justify-center bg-gym-800 relative overflow-hidden">
                      {/* Fake Video Feed */}
                      <img src={user.name === 'Alex Fitness' ? 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1200' : 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=1200'} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                      <i className="fas fa-video text-6xl text-white/20 animate-pulse relative z-10"></i>
                  </div>
              </div>

              {/* TOP HUD */}
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                   <div className="flex items-center gap-4">
                       <div className="bg-red-600 px-3 py-1 rounded-md text-white text-sm font-bold animate-pulse shadow-lg shadow-red-600/50">ON AIR</div>
                       <div className="text-white font-mono font-bold bg-black/40 px-2 py-1 rounded">{formatTime(duration)}</div>
                   </div>
                   <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                           <i className="fas fa-eye text-emerald-400"></i>
                           <span className="text-white font-bold">{viewers}</span>
                       </div>
                       <button 
                        onClick={() => setIsBroadcasting(false)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold shadow-lg text-sm transition hover:scale-105"
                       >
                           End Stream
                       </button>
                   </div>
              </div>

              {/* BOTTOM HUD */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between bg-gradient-to-t from-black/90 to-transparent z-10">
                   {/* Recent Gifts Feed */}
                   <div className="flex flex-col gap-2">
                       <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Recent Activity</div>
                       {gifts.map((g, i) => (
                           <div key={i} className="flex items-center gap-2 animate-slide-in">
                               <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-lg shadow-lg">
                                   {g.icon}
                               </div>
                               <span className="text-sm font-bold text-white text-shadow">Fan sent {g.name}</span>
                           </div>
                       ))}
                   </div>

                   {/* Earnings Stat */}
                   <div className="bg-gym-900/80 backdrop-blur-md p-4 rounded-xl border border-yellow-500/30 shadow-lg flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xl shadow-lg">
                           <i className="fas fa-coins"></i>
                       </div>
                       <div>
                           <div className="text-xs text-yellow-200 uppercase font-bold">Session Earnings</div>
                           <div className="text-2xl font-black text-white">{sessionEarnings} <span className="text-sm text-gray-400">credits</span></div>
                       </div>
                   </div>
              </div>
          </div>
      );
  };

  // --- MAIN RENDER ---

  return (
    <div className="animate-fade-in pb-12">
        {viewingStream && <StreamPlayer stream={viewingStream} onClose={() => setViewingStream(null)} user={user} setUser={setUser} />}
        {isBroadcasting && <BroadcastView user={user} setIsBroadcasting={setIsBroadcasting} />}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Live Studio</h1>
                <p className="text-gray-400 text-sm">Join live sessions or broadcast your own.</p>
            </div>
            
            <div className="flex bg-gym-800 p-1 rounded-xl border border-gym-700">
                <button 
                    onClick={() => setActiveTab('live')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'live' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <i className="fas fa-broadcast-tower"></i> Live Streams
                </button>
                <button 
                    onClick={() => setActiveTab('courses')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <i className="fas fa-graduation-cap"></i> Courses
                </button>
            </div>
        </div>

        {/* ================= LIVE STREAMS TAB ================= */}
        {activeTab === 'live' && (
            <div className="space-y-8 animate-slide-in">
                
                {/* Hero / Go Live Section */}
                <div className="bg-gradient-to-r from-red-900 via-gym-900 to-gym-900 rounded-2xl p-8 border border-red-900/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                     <div className="relative z-10">
                         <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 border border-red-600/30 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Streaming Now
                         </div>
                         <h2 className="text-3xl font-bold text-white mb-2">You Are The Creator.</h2>
                         <p className="text-red-100/70 text-sm max-w-md">
                             Start a live stream to coach others, earn virtual gifts, and build your fitness community.
                         </p>
                         <div className="mt-4 flex items-center gap-4 text-xs font-mono text-gray-400">
                             <span><i className="fas fa-coins text-yellow-500"></i> Earn Credits</span>
                             <span><i className="fas fa-users text-blue-400"></i> Grow Audience</span>
                         </div>
                     </div>
                     <button 
                        onClick={() => setShowGoLiveModal(true)}
                        className="relative z-10 px-8 py-4 bg-white text-red-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition transform flex items-center gap-3"
                     >
                         <i className="fas fa-video text-xl"></i> 
                         <span className="text-lg">Go Live</span>
                     </button>
                     
                     {/* Background FX */}
                     <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none"></div>
                     <div className="absolute -bottom-10 -right-10 text-[12rem] text-red-500/5 rotate-12 pointer-events-none">
                         <i className="fas fa-wifi"></i>
                     </div>
                </div>

                {/* Stream Grid */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-fire text-orange-500"></i> Trending Now
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {streams.map((stream) => (
                            <div 
                                key={stream.id}
                                onClick={() => setViewingStream(stream)}
                                className="group bg-gym-800 rounded-xl overflow-hidden border border-gym-700 hover:border-red-500 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/20 relative"
                            >
                                <div className="relative aspect-video">
                                    <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                                        Live
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                        <i className="fas fa-user"></i> {stream.viewers}
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition scale-50 group-hover:scale-100 duration-300">
                                        <div className="w-14 h-14 bg-red-600/90 backdrop-blur rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                                            <i className="fas fa-play text-xl ml-1"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex gap-3">
                                    <div className="relative">
                                        <img src={stream.streamerAvatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-gym-600 group-hover:border-red-500 transition" />
                                        {stream.hypeLevel > 80 && <div className="absolute -top-1 -right-1 text-lg">🔥</div>}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-400 transition">{stream.title}</h4>
                                        <p className="text-gray-400 text-xs mb-2">{stream.streamerName}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500 bg-gym-900 px-2 py-0.5 rounded border border-gym-700">
                                                {stream.category}
                                            </span>
                                            <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1">
                                                <i className="fas fa-gift"></i> {stream.giftsReceived}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* ================= COURSES TAB ================= */}
        {activeTab === 'courses' && (
            <div className="space-y-8 animate-slide-in">
                 <div className="flex justify-between items-center bg-gym-800 p-4 rounded-xl border border-gym-700">
                     <div>
                         <h3 className="text-white font-bold text-lg">Course Library</h3>
                         <p className="text-gray-400 text-xs">Premium content from top coaches.</p>
                     </div>
                     <button 
                        onClick={() => setShowUploadModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg"
                     >
                         <i className="fas fa-cloud-upload-alt"></i> Upload Course
                     </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {courses.map(course => (
                         <div key={course.id} className="bg-gym-800 rounded-xl overflow-hidden border border-gym-700 hover:border-blue-500 transition-all group hover:shadow-xl hover:shadow-blue-900/10">
                             <div className="aspect-video relative overflow-hidden">
                                 <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                 <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                                     {course.level}
                                 </div>
                                 <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                                     <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                                         <i className="fas fa-star"></i> {course.rating} <span className="text-gray-400">({course.students})</span>
                                     </div>
                                 </div>
                             </div>
                             <div className="p-4">
                                 <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">{course.title}</h4>
                                 <p className="text-sm text-gray-400 mb-3">By {course.instructor}</p>
                                 
                                 <div className="flex flex-col gap-2 border-t border-gym-700 pt-3">
                                     {course.modules.slice(0, 2).map((mod, idx) => (
                                         <div key={idx} className="flex justify-between text-xs text-gray-400">
                                             <div className="flex items-center gap-2">
                                                 <i className="fas fa-play-circle text-gym-500"></i> {mod.title}
                                             </div>
                                             <span>{mod.duration}</span>
                                         </div>
                                     ))}
                                     {course.modules.length > 2 && (
                                         <div className="text-[10px] text-gray-500 text-center mt-1">
                                             +{course.modules.length - 2} more modules
                                         </div>
                                     )}
                                 </div>

                                 <button className="w-full mt-4 bg-gym-700 hover:bg-blue-600 text-white py-2 rounded-lg font-bold text-sm transition">
                                     Start Course
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        )}

        {/* ================= MODALS ================= */}

        {/* Go Live Setup Modal */}
        {showGoLiveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-gym-800 w-full max-w-md rounded-2xl p-6 border border-gym-600 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Go Live Setup</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Stream Title</label>
                            <input 
                                value={broadcastTitle}
                                onChange={e => setBroadcastTitle(e.target.value)}
                                className="w-full bg-gym-900 border border-gym-700 rounded-lg p-3 text-white outline-none focus:border-red-500 mt-1"
                                placeholder="e.g. Abs Workout Session"
                            />
                        </div>
                        <div className="h-40 bg-black rounded-lg flex items-center justify-center border border-gym-700 text-gray-500 flex-col gap-2 relative overflow-hidden">
                             {/* Mock Preview */}
                             <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                            <i className="fas fa-camera text-2xl relative z-10"></i>
                            <span className="text-xs relative z-10">Camera Preview</span>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowGoLiveModal(false)} className="flex-1 py-3 bg-gym-700 text-gray-300 font-bold rounded-lg hover:bg-gym-600">Cancel</button>
                            <button 
                                onClick={() => { setShowGoLiveModal(false); setIsBroadcasting(true); }}
                                disabled={!broadcastTitle}
                                className={`flex-1 py-3 font-bold rounded-lg text-white ${broadcastTitle ? 'bg-red-600 hover:bg-red-500 shadow-lg' : 'bg-gray-600 cursor-not-allowed'}`}
                            >
                                Start Stream
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Upload Course Modal */}
        {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-gym-800 w-full max-w-lg rounded-2xl p-6 border border-gym-600 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Upload New Course</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Course Title</label>
                            <input 
                                value={newCourseTitle}
                                onChange={e => setNewCourseTitle(e.target.value)}
                                className="w-full bg-gym-900 border border-gym-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 mt-1"
                            />
                        </div>
                        <div className="border-2 border-dashed border-gym-600 rounded-lg p-8 text-center hover:bg-gym-700/50 transition cursor-pointer">
                            <i className="fas fa-cloud-upload-alt text-3xl text-blue-500 mb-2"></i>
                            <p className="text-sm text-gray-300 font-bold">Drag video files here</p>
                            <p className="text-xs text-gray-500">MP4, MOV up to 2GB</p>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setShowUploadModal(false)} className="flex-1 py-3 bg-gym-700 text-gray-300 font-bold rounded-lg hover:bg-gym-600">Cancel</button>
                            <button 
                                onClick={() => { 
                                    if(newCourseTitle) {
                                        setCourses(prev => [...prev, {
                                            id: Date.now().toString(),
                                            title: newCourseTitle,
                                            instructor: 'You',
                                            thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
                                            rating: 0,
                                            students: 0,
                                            duration: '0h',
                                            level: 'Beginner',
                                            modules: []
                                        }]);
                                        setShowUploadModal(false);
                                        setNewCourseTitle('');
                                    }
                                }}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500"
                            >
                                Publish Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default LiveClasses;
