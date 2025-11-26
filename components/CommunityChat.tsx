

import React, { useState, useEffect, useRef } from 'react';
import { ChatChannel, ChatFriend, FriendRequest, ChatMessage, Coach } from '../types';

// --- MOCK DATA ---

const INITIAL_CHANNELS: ChatChannel[] = [
  { id: 'general', name: 'General Lounge', type: 'system', icon: 'fa-hashtag', description: 'Global hangout', members: 1420 },
  { id: 'workouts', name: 'Workout Tips', type: 'system', icon: 'fa-dumbbell', description: 'Technique check', members: 890 },
  { id: 'nutrition', name: 'Nutrition', type: 'system', icon: 'fa-utensils', description: 'Recipes & Macros', members: 650 },
  { id: 'yoga', name: 'Yoga & Flex', type: 'system', icon: 'fa-spa', description: 'Mobility work', members: 320 },
];

const BOOKED_COACHES: Coach[] = [
    {
        id: '1', name: 'Marcus "Titan" Ray', specialty: ['Bodybuilding'], rating: 4.9, reviews: 124, rate: 85,
        image: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&q=80&w=400',
        bio: '', online: true, experience: '12 Years'
    },
    {
        id: '4', name: 'Sarah Power', specialty: ['Powerlifting'], rating: 4.7, reviews: 65, rate: 75,
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
        bio: '', online: false, experience: '8 Years'
    }
];

// Database of "all" users for search simulation
const USER_DATABASE = [
    { id: 'u1', username: 'GymRat99', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'u2', username: 'SarahStaysFit', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 'u3', username: 'BeastMode', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708d' },
    { id: 'u4', username: 'YogaQueen', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    { id: 'u5', username: 'IronMike', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
];

const CommunityChat: React.FC = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'channels' | 'dms' | 'coaches'>('channels');
  
  // Data State
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [friends, setFriends] = useState<ChatFriend[]>([
      { id: 'u1', username: 'GymRat99', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'online', lastMessage: 'See you at the gym?' }
  ]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
      { id: 'r1', fromUser: 'IronMike', fromAvatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', status: 'pending' }
  ]);
  
  // Selection State (Chat Window)
  const [selectedChatId, setSelectedChatId] = useState<string>('general');
  const [chatType, setChatType] = useState<'channel' | 'dm' | 'coach'>('channel');
  
  // Messages Map (ChatID -> Messages[])
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
      'general': [{ id: '1', role: 'model', user: 'System', avatar: '', text: 'Welcome to the IronPulse Community!', timestamp: 'Now', isMe: false, channelId: 'general' }],
      'u1': [{ id: '2', role: 'user', user: 'GymRat99', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', text: 'Yo! Hitting chest today?', timestamp: '10:00 AM', isMe: false, channelId: 'u1' }],
      '1': [{ id: '3', role: 'user', user: 'Marcus "Titan" Ray', avatar: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&q=80&w=400', text: 'Your form check video looked solid. Keep elbows tucked.', timestamp: 'Yesterday', isMe: false, channelId: '1' }]
  });

  const [inputText, setInputText] = useState('');
  
  // Modal States
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState(''); // Friend Search
  const [searchResult, setSearchResult] = useState<typeof USER_DATABASE[0] | null>(null);
  const [channelSearchQuery, setChannelSearchQuery] = useState(''); // Channel Search

  // Creation Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- EFFECT: Auto-scroll ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChatId]);

  // --- ACTIONS ---

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      user: 'You',
      avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', // Me
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      channelId: selectedChatId
    };

    setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));
    setInputText('');
  };

  const handleCreateGroup = () => {
      if (!newGroupName) return;
      const newChannel: ChatChannel = {
          id: `custom_${Date.now()}`,
          name: newGroupName,
          type: 'user',
          icon: 'fa-users',
          description: newGroupDesc || 'Community Group',
          members: 1,
          ownerId: 'me' // Set current user as owner
      };
      setChannels(prev => [...prev, newChannel]);
      setShowCreateGroup(false);
      setNewGroupName('');
      setNewGroupDesc('');
      
      // Auto switch to new group
      setSelectedChatId(newChannel.id);
      setChatType('channel');
      setActiveTab('channels');
  };

  const handleSearchFriend = () => {
      const found = USER_DATABASE.find(u => u.username.toLowerCase() === searchQuery.toLowerCase());
      setSearchResult(found || null);
  };

  const handleSendFriendRequest = () => {
      if (!searchResult) return;
      // Simulate sending request
      alert(`Request sent to ${searchResult.username}`);
      setSearchResult(null);
      setSearchQuery('');
      setShowAddFriend(false);
  };

  const handleAcceptRequest = (req: FriendRequest) => {
      // 1. Add to friends list
      const newFriend: ChatFriend = {
          id: `u_${Date.now()}`, // Simulated ID
          username: req.fromUser,
          avatar: req.fromAvatar,
          status: 'online',
          lastMessage: 'Now connected!'
      };
      setFriends(prev => [...prev, newFriend]);
      
      // 2. Remove from requests
      setFriendRequests(prev => prev.filter(r => r.id !== req.id));

      // 3. Initialize chat
      setMessages(prev => ({
          ...prev,
          [newFriend.id]: [{ id: 'init', role: 'model', user: 'System', text: 'You are now friends. Say hi!', timestamp: 'Now', isMe: false, channelId: newFriend.id, avatar: '' }]
      }));
  };

  const handleAddMember = (friend: ChatFriend) => {
      // Logic to add a friend to the current channel
      const channel = channels.find(c => c.id === selectedChatId);
      if (channel) {
          // Update member count
          setChannels(prev => prev.map(c => c.id === selectedChatId ? { ...c, members: c.members + 1 } : c));
          
          // Add system message
          const sysMsg: ChatMessage = {
              id: Date.now().toString(),
              role: 'model',
              user: 'System',
              avatar: '',
              text: `You added ${friend.username} to the group.`,
              timestamp: 'Now',
              isMe: false,
              channelId: selectedChatId
          };
          setMessages(prev => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), sysMsg]
          }));
          
          setShowAddMember(false);
      }
  };

  // Get current chat info for header
  const getHeaderInfo = () => {
      if (chatType === 'channel') {
          const ch = channels.find(c => c.id === selectedChatId);
          return { name: ch?.name || 'Unknown', sub: ch?.description, icon: ch?.icon || 'fa-hashtag', avatar: null, isOwner: ch?.ownerId === 'me' };
      } else if (chatType === 'dm') {
          const fr = friends.find(f => f.id === selectedChatId);
          return { name: fr?.username || 'Unknown', sub: fr?.status, icon: null, avatar: fr?.avatar, isOwner: false };
      } else {
          const co = BOOKED_COACHES.find(c => c.id === selectedChatId);
          return { name: `Coach ${co?.name}` || 'Coach', sub: 'Pro Session Chat', icon: null, avatar: co?.image, isOwner: false };
      }
  };

  const headerInfo = getHeaderInfo();
  const currentMessages = messages[selectedChatId] || [];

  // Filtered Channels based on search
  const filteredChannels = channels.filter(c => 
      c.name.toLowerCase().includes(channelSearchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(channelSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-fade-in relative">
      
      {/* ================= SIDEBAR ================= */}
      <div className="lg:w-1/4 bg-gym-800 rounded-2xl border border-gym-700 flex flex-col overflow-hidden shadow-xl">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-gym-700 bg-gym-900">
              <button 
                onClick={() => setActiveTab('channels')}
                className={`flex-1 py-4 text-center text-sm font-bold transition hover:bg-gym-800 relative
                ${activeTab === 'channels' ? 'text-white' : 'text-gray-500'}`}
              >
                  <i className="fas fa-layer-group mb-1 block text-lg"></i> Channels
                  {activeTab === 'channels' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('dms')}
                className={`flex-1 py-4 text-center text-sm font-bold transition hover:bg-gym-800 relative
                ${activeTab === 'dms' ? 'text-white' : 'text-gray-500'}`}
              >
                  <i className="fas fa-comment-alt mb-1 block text-lg relative">
                      {friendRequests.length > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
                  </i> Friends
                  {activeTab === 'dms' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('coaches')}
                className={`flex-1 py-4 text-center text-sm font-bold transition hover:bg-gym-800 relative
                ${activeTab === 'coaches' ? 'text-white' : 'text-gray-500'}`}
              >
                  <i className="fas fa-user-tie mb-1 block text-lg"></i> Coaches
                  {activeTab === 'coaches' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"></div>}
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gym-800/50">
              
              {/* CHANNELS LIST */}
              {activeTab === 'channels' && (
                  <div className="animate-slide-in">
                      {/* Search Bar */}
                      <div className="relative mb-3">
                        <i className="fas fa-search absolute left-3 top-3.5 text-gray-500 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Search groups..." 
                            value={channelSearchQuery}
                            onChange={(e) => setChannelSearchQuery(e.target.value)}
                            className="w-full bg-gym-900 border border-gym-700 rounded-xl pl-9 pr-4 py-2.5 text-white focus:border-emerald-500 outline-none transition text-sm placeholder-gray-600"
                        />
                      </div>

                      {/* Create Button */}
                      <button 
                        onClick={() => setShowCreateGroup(true)}
                        className="w-full mb-3 py-3 border border-dashed border-emerald-500/50 rounded-xl text-emerald-400 font-bold hover:bg-emerald-500/10 transition flex items-center justify-center gap-2 text-sm"
                      >
                          <i className="fas fa-plus-circle"></i> Create New Group
                      </button>

                      <div className="space-y-1">
                        {filteredChannels.filter(c => c.type === 'system').length > 0 && (
                            <>
                                <div className="px-3 text-xs font-bold text-gray-500 uppercase mt-2 mb-1">Official Channels</div>
                                {filteredChannels.filter(c => c.type === 'system').map(channel => (
                                    <button
                                        key={channel.id}
                                        onClick={() => { setSelectedChatId(channel.id); setChatType('channel'); }}
                                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3
                                        ${selectedChatId === channel.id 
                                            ? 'bg-gym-700 text-white border border-emerald-500/30 shadow' 
                                            : 'text-gray-400 hover:bg-gym-700/50 hover:text-white'}`}
                                    >
                                        <div className="w-8 h-8 rounded bg-gym-900 flex items-center justify-center text-sm"><i className={`fas ${channel.icon}`}></i></div>
                                        <div>
                                            <div className="font-bold text-sm">#{channel.name}</div>
                                            <div className="text-[10px] opacity-60">{channel.members} members</div>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {filteredChannels.filter(c => c.type === 'user').length > 0 && (
                            <>
                                <div className="px-3 text-xs font-bold text-gray-500 uppercase mt-4 mb-1">Community Groups</div>
                                {filteredChannels.filter(c => c.type === 'user').map(channel => (
                                    <button
                                        key={channel.id}
                                        onClick={() => { setSelectedChatId(channel.id); setChatType('channel'); }}
                                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3
                                        ${selectedChatId === channel.id 
                                            ? 'bg-gym-700 text-white border border-emerald-500/30 shadow' 
                                            : 'text-gray-400 hover:bg-gym-700/50 hover:text-white'}`}
                                    >
                                        <div className="w-8 h-8 rounded bg-indigo-900 flex items-center justify-center text-sm"><i className={`fas ${channel.icon}`}></i></div>
                                        <div>
                                            <div className="font-bold text-sm">{channel.name}</div>
                                            <div className="text-[10px] opacity-60">{channel.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}
                        
                        {filteredChannels.length === 0 && (
                             <div className="text-center text-gray-500 text-xs py-4">No channels found.</div>
                        )}
                      </div>
                  </div>
              )}

              {/* FRIENDS / DMs LIST */}
              {activeTab === 'dms' && (
                  <div className="animate-slide-in">
                       {/* Add Friend Button */}
                       <button 
                        onClick={() => setShowAddFriend(true)}
                        className="w-full mb-3 py-3 border border-dashed border-blue-500/50 rounded-xl text-blue-400 font-bold hover:bg-blue-500/10 transition flex items-center justify-center gap-2 text-sm"
                      >
                          <i className="fas fa-user-plus"></i> Add Friend
                      </button>
                      
                      {/* Friend Requests */}
                      {friendRequests.length > 0 && (
                          <div className="mb-4 bg-gym-900/50 rounded-xl p-3 border border-gym-700">
                              <div className="text-xs font-bold text-gray-400 uppercase mb-2">Requests</div>
                              {friendRequests.map(req => (
                                  <div key={req.id} className="flex items-center justify-between mb-2 last:mb-0">
                                      <div className="flex items-center gap-2">
                                          <img src={req.fromAvatar} className="w-8 h-8 rounded-full" alt="" />
                                          <span className="text-sm text-white font-bold">{req.fromUser}</span>
                                      </div>
                                      <div className="flex gap-1">
                                          <button onClick={() => handleAcceptRequest(req)} className="w-6 h-6 rounded bg-emerald-500 text-white text-xs hover:bg-emerald-400"><i className="fas fa-check"></i></button>
                                          <button className="w-6 h-6 rounded bg-red-500 text-white text-xs hover:bg-red-400"><i className="fas fa-times"></i></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}

                      <div className="px-3 text-xs font-bold text-gray-500 uppercase mt-2 mb-1">Direct Messages</div>
                      {friends.map(friend => (
                          <button
                            key={friend.id}
                            onClick={() => { setSelectedChatId(friend.id); setChatType('dm'); }}
                            className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3
                            ${selectedChatId === friend.id 
                                ? 'bg-gym-700 text-white border border-blue-500/30 shadow' 
                                : 'text-gray-400 hover:bg-gym-700/50 hover:text-white'}`}
                          >
                              <div className="relative">
                                  <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full border border-gym-600" />
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gym-800 ${friend.status === 'online' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                              </div>
                              <div className="overflow-hidden">
                                  <div className="font-bold text-sm truncate">{friend.username}</div>
                                  <div className="text-[10px] opacity-60 truncate">{friend.lastMessage}</div>
                              </div>
                          </button>
                      ))}
                  </div>
              )}

              {/* COACHES LIST */}
              {activeTab === 'coaches' && (
                  <div className="animate-slide-in">
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-4 text-xs text-yellow-200">
                          <i className="fas fa-info-circle mr-1"></i> Chats with coaches are private and secure.
                      </div>
                      
                      {BOOKED_COACHES.map(coach => (
                           <button
                                key={coach.id}
                                onClick={() => { setSelectedChatId(coach.id); setChatType('coach'); }}
                                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 mb-2
                                ${selectedChatId === coach.id 
                                    ? 'bg-gym-700 text-white border border-yellow-500/30 shadow' 
                                    : 'text-gray-400 hover:bg-gym-700/50 hover:text-white'}`}
                            >
                                <div className="relative">
                                    <img src={coach.image} alt={coach.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[8px] font-bold px-1 rounded">PRO</div>
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{coach.name}</div>
                                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Available
                                    </div>
                                </div>
                            </button>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* ================= MAIN CHAT AREA ================= */}
      <div className="flex-1 bg-gym-800 rounded-2xl border border-gym-700 flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* Header */}
          <div className="p-4 bg-gym-900/90 backdrop-blur-md border-b border-gym-700 flex items-center gap-4 z-10">
              {headerInfo.avatar ? (
                  <img src={headerInfo.avatar} className="w-10 h-10 rounded-full border border-gym-600" alt="avatar" />
              ) : (
                  <div className="w-10 h-10 rounded-lg bg-gym-700 flex items-center justify-center text-xl text-gray-400">
                      <i className={`fas ${headerInfo.icon}`}></i>
                  </div>
              )}
              
              <div className="flex-1">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      {chatType === 'channel' && <span className="text-emerald-500">#</span>} {headerInfo.name}
                  </h3>
                  <p className="text-xs text-gray-400">{headerInfo.sub}</p>
              </div>

              {headerInfo.isOwner && (
                 <button 
                   onClick={() => setShowAddMember(true)}
                   className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 p-2 rounded-lg text-xs font-bold flex items-center gap-2 transition"
                 >
                     <i className="fas fa-user-plus"></i> Add Member
                 </button>
              )}

              {chatType === 'channel' && (
                  <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gym-700 border-2 border-gym-800 flex items-center justify-center text-[10px] text-white font-bold">
                          120+
                      </div>
                  </div>
              )}
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20"
          >
              {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                      <i className="fas fa-comment-dots text-6xl mb-4"></i>
                      <p>No messages yet. Start the conversation!</p>
                  </div>
              ) : (
                  currentMessages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 animate-slide-in ${msg.isMe ? 'flex-row-reverse' : ''}`}
                    >
                        {!msg.isMe && msg.avatar && (
                            <img src={msg.avatar} alt="user" className="w-8 h-8 rounded-full self-end mb-1" />
                        )}
                        {!msg.isMe && !msg.avatar && (
                            <div className="w-8 h-8 rounded-full bg-gym-700 flex items-center justify-center self-end mb-1 text-xs">
                                <i className="fas fa-user"></i>
                            </div>
                        )}
                        
                        <div className={`flex flex-col max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                            {!msg.isMe && (
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-gray-300">{msg.user}</span>
                                    <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                                </div>
                            )}
                            
                            <div className={`px-4 py-2 rounded-2xl text-sm shadow-md break-words
                                ${msg.user === 'System' 
                                    ? 'bg-gym-700/30 text-gray-400 text-xs italic w-full text-center rounded-lg border border-gym-700 border-dashed' 
                                    : msg.isMe 
                                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-none' 
                                        : 'bg-gym-700 text-gray-200 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                  ))
              )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-gym-900 border-t border-gym-700 relative z-20">
              <div className="relative group">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${headerInfo.name}...`}
                    className="w-full bg-gym-800/80 border border-gym-600 text-white rounded-xl pl-4 pr-12 py-3 focus:border-emerald-500 outline-none transition shadow-inner relative z-10"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`absolute right-2 top-2 p-1.5 rounded-lg transition z-20
                    ${inputText.trim() ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-transparent text-gray-600'}`}
                  >
                      <i className="fas fa-paper-plane"></i>
                  </button>
              </div>
          </form>
      </div>

      {/* ================= MODALS ================= */}

      {/* Create Group Modal */}
      {showCreateGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-gym-800 rounded-2xl p-6 w-full max-w-md border border-gym-600 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Group</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Group Name</label>
                          <input 
                            type="text" 
                            value={newGroupName} 
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full bg-gym-900 border border-gym-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500 mt-1"
                            placeholder="e.g. Early Birds"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                          <input 
                            type="text" 
                            value={newGroupDesc} 
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                            className="w-full bg-gym-900 border border-gym-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500 mt-1"
                            placeholder="e.g. For people who workout at 5am"
                          />
                      </div>
                      <div className="flex gap-3 mt-6">
                          <button onClick={() => setShowCreateGroup(false)} className="flex-1 py-3 rounded-lg bg-gym-700 text-gray-300 font-bold hover:bg-gym-600">Cancel</button>
                          <button onClick={handleCreateGroup} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500">Create</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-gym-800 rounded-2xl p-6 w-full max-w-md border border-gym-600 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Add Friend</h3>
                  
                  <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-gym-900 border border-gym-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                        placeholder="Search username..."
                      />
                      <button onClick={handleSearchFriend} className="px-4 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-500">
                          <i className="fas fa-search"></i>
                      </button>
                  </div>

                  {searchResult ? (
                      <div className="bg-gym-900 p-4 rounded-xl flex items-center justify-between border border-gym-700 animate-slide-in">
                          <div className="flex items-center gap-3">
                              <img src={searchResult.avatar} className="w-10 h-10 rounded-full" alt="" />
                              <span className="text-white font-bold">{searchResult.username}</span>
                          </div>
                          <button onClick={handleSendFriendRequest} className="px-3 py-1.5 bg-emerald-500 rounded-lg text-white text-xs font-bold hover:bg-emerald-400">
                              Send Request
                          </button>
                      </div>
                  ) : searchQuery && (
                      <div className="text-center text-gray-500 text-sm">No user found. Try 'GymRat99' or 'BeastMode'.</div>
                  )}

                  <button onClick={() => { setShowAddFriend(false); setSearchResult(null); setSearchQuery(''); }} className="w-full mt-6 py-3 rounded-lg bg-gym-700 text-gray-300 font-bold hover:bg-gym-600">
                      Close
                  </button>
              </div>
          </div>
      )}

      {/* Add Member to Group Modal */}
      {showAddMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-gym-800 rounded-2xl p-6 w-full max-w-md border border-gym-600 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Add Member to Group</h3>
                  <p className="text-sm text-gray-400 mb-4">Select a friend to add to <strong>{headerInfo.name}</strong></p>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {friends.length === 0 ? (
                          <div className="text-center text-gray-500 py-4">No friends to add.</div>
                      ) : (
                          friends.map(friend => (
                              <div key={friend.id} className="flex items-center justify-between p-3 bg-gym-900 rounded-lg border border-gym-700">
                                  <div className="flex items-center gap-3">
                                      <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full" />
                                      <span className="text-white font-bold text-sm">{friend.username}</span>
                                  </div>
                                  <button 
                                    onClick={() => handleAddMember(friend)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                                  >
                                      Add
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
                  
                  <button onClick={() => setShowAddMember(false)} className="w-full mt-6 py-3 rounded-lg bg-gym-700 text-gray-300 font-bold hover:bg-gym-600">
                      Cancel
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default CommunityChat;