
import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';

const MOCK_LEADERBOARD_WEEKLY: LeaderboardEntry[] = [
  { rank: 1, user: 'SarahStaysFit', points: 2500, streak: 7, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', badges: ['🔥', '⚡'], change: 'same', country: 'USA', flag: '🇺🇸' },
  { rank: 2, user: 'IronMike', points: 2350, streak: 5, avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', badges: ['🏋️'], change: 'up', country: 'Canada', flag: '🇨🇦' },
  { rank: 3, user: 'GymRat99', points: 2100, streak: 6, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', badges: ['🥗'], change: 'down', country: 'UK', flag: '🇬🇧' },
  { rank: 4, user: 'Alex Fitness', points: 1950, streak: 12, avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', badges: ['⭐'], change: 'up', country: 'USA', flag: '🇺🇸' },
  { rank: 5, user: 'YogaQueen', points: 1800, streak: 4, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', badges: ['🧘'], change: 'same', country: 'India', flag: '🇮🇳' },
  { rank: 6, user: 'CardioKing', points: 1650, streak: 3, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d', badges: [], change: 'down', country: 'USA', flag: '🇺🇸' },
  { rank: 7, user: 'BeastMode', points: 1500, streak: 2, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708d', badges: ['💪'], change: 'up', country: 'Germany', flag: '🇩🇪' },
  { rank: 8, user: 'FitBrit', points: 1450, streak: 1, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026709d', badges: [], change: 'down', country: 'UK', flag: '🇬🇧' },
  { rank: 9, user: 'AussieLifter', points: 1400, streak: 8, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026710d', badges: ['🦘'], change: 'up', country: 'Australia', flag: '🇦🇺' },
];

const MOCK_LEADERBOARD_ALL_TIME: LeaderboardEntry[] = [
    { rank: 1, user: 'IronMike', points: 152000, streak: 145, avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', badges: ['👑', '🏋️'], change: 'same', country: 'Canada', flag: '🇨🇦' },
    { rank: 2, user: 'SarahStaysFit', points: 148000, streak: 90, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', badges: ['🔥'], change: 'up', country: 'USA', flag: '🇺🇸' },
    { rank: 3, user: 'BeastMode', points: 130500, streak: 60, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708d', badges: ['💪', '🦁'], change: 'up', country: 'Germany', flag: '🇩🇪' },
    { rank: 4, user: 'GymRat99', points: 125000, streak: 45, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', badges: ['🥗'], change: 'down', country: 'UK', flag: '🇬🇧' },
    { rank: 5, user: 'Alex Fitness', points: 98000, streak: 12, avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', badges: ['⭐'], change: 'same', country: 'USA', flag: '🇺🇸' },
];

// Mock mapping for continents
const CONTINENT_MAP: Record<string, string> = {
    'USA': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'UK': 'Europe',
    'Germany': 'Europe',
    'France': 'Europe',
    'India': 'Asia',
    'Japan': 'Asia',
    'Australia': 'Oceania'
};

const USER_LOCATION = { country: 'USA', continent: 'North America' };

const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'all_time'>('weekly');
  const [regionFilter, setRegionFilter] = useState<'global' | 'continent' | 'country'>('global');
  
  // 1. Get Base Data
  const baseData = timeframe === 'weekly' ? MOCK_LEADERBOARD_WEEKLY : MOCK_LEADERBOARD_ALL_TIME;

  // 2. Filter Logic
  const filteredData = baseData.filter(entry => {
      if (regionFilter === 'global') return true;
      if (regionFilter === 'country') return entry.country === USER_LOCATION.country;
      if (regionFilter === 'continent') return CONTINENT_MAP[entry.country] === USER_LOCATION.continent;
      return true;
  });

  // 3. Sort and Re-Rank for Display
  // (Data is already mock sorted by points, but good practice to ensure)
  const sortedData = [...filteredData].sort((a, b) => b.points - a.points);
  
  // Assign new display rank based on filtered list
  const displayData = sortedData.map((entry, index) => ({
      ...entry,
      displayRank: index + 1
  }));

  const top3 = displayData.slice(0, 3);
  const rest = displayData.slice(3);

  // League Progress
  const currentLeague = "Diamond League";
  
  const PodiumStep = ({ entry, place }: { entry: LeaderboardEntry & { displayRank: number }, place: number }) => {
      let height = 'h-32';
      let color = 'bg-gym-700';
      let borderColor = 'border-gym-600';
      let glow = '';
      let crown = null;
      let order = 'order-2'; // Default

      if (place === 1) {
          height = 'h-48';
          color = 'bg-gradient-to-t from-yellow-600 to-yellow-400';
          borderColor = 'border-yellow-300';
          glow = 'shadow-[0_0_30px_rgba(250,204,21,0.4)]';
          crown = <i className="fas fa-crown text-3xl text-yellow-200 absolute -top-10 animate-bounce"></i>;
          order = 'order-2'; // Center
      } else if (place === 2) {
          height = 'h-36';
          color = 'bg-gradient-to-t from-gray-500 to-gray-300';
          borderColor = 'border-gray-200';
          order = 'order-1'; // Left
      } else if (place === 3) {
          height = 'h-28';
          color = 'bg-gradient-to-t from-amber-800 to-amber-600';
          borderColor = 'border-amber-500';
          order = 'order-3'; // Right
      }

      return (
          <div className={`flex flex-col items-center justify-end ${order} w-1/3 relative z-10`}>
              <div className="relative mb-4 flex flex-col items-center">
                  {crown}
                  <img 
                    src={entry.avatar} 
                    alt={entry.user} 
                    className={`rounded-full border-4 ${borderColor} ${place === 1 ? 'w-24 h-24' : 'w-16 h-16'} object-cover shadow-xl`} 
                  />
                  <div className="bg-gym-900 text-xs font-bold px-2 py-0.5 rounded absolute -bottom-2 border border-gym-600 text-white truncate max-w-[90px] flex items-center gap-1">
                      <span>{entry.flag}</span>
                      <span>{entry.user}</span>
                  </div>
              </div>
              <div className={`w-full ${height} ${color} rounded-t-xl flex flex-col items-center justify-start pt-4 border-t border-white/20 relative ${glow}`}>
                  <span className={`text-4xl font-black text-white/90 drop-shadow-md`}>{place}</span>
                  <div className="mt-2 text-xs font-bold text-white/80 bg-black/20 px-2 py-1 rounded">
                      {entry.points.toLocaleString()} pts
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* 1. League Status Header */}
      <div className="bg-gradient-to-r from-gym-800 to-indigo-900 rounded-2xl p-6 border border-gym-700 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-trophy text-9xl text-white"></i>
        </div>
        <div className="relative z-10">
            <h2 className="text-sm text-indigo-300 font-bold uppercase tracking-wider mb-1">Current Standing</h2>
            <div className="flex justify-between items-end mb-2">
                <h1 className="text-3xl font-extrabold text-white">{currentLeague}</h1>
                <span className="text-white font-mono font-bold">Top 5%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[75%] relative">
                    <div className="absolute top-0 right-0 h-full w-2 bg-white/50 animate-pulse"></div>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">1,250 points to Master League</p>
        </div>
      </div>

      {/* 2. Controls & Podium */}
      <div className="animate-fade-in space-y-6">
          {/* Controls Container */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gym-800/50 p-2 rounded-xl border border-gym-700 backdrop-blur-sm">
            
            {/* Timeframe Switcher */}
            <div className="flex bg-gym-900 rounded-lg p-1 w-full md:w-auto">
                <button 
                    onClick={() => setTimeframe('weekly')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${timeframe === 'weekly' ? 'bg-gym-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    This Week
                </button>
                <button 
                    onClick={() => setTimeframe('all_time')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-bold transition-all ${timeframe === 'all_time' ? 'bg-gym-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    All Time
                </button>
            </div>

             {/* Regional Switcher */}
             <div className="flex items-center gap-1 bg-gym-900 rounded-lg p-1 w-full md:w-auto overflow-x-auto">
                {(['global', 'continent', 'country'] as const).map(r => (
                    <button
                        key={r}
                        onClick={() => setRegionFilter(r)}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all capitalize whitespace-nowrap
                        ${regionFilter === r 
                            ? 'bg-indigo-600 text-white shadow' 
                            : 'text-gray-400 hover:text-white hover:bg-gym-800'}`}
                    >
                        {r === 'global' && <i className="fas fa-globe-americas mr-2"></i>}
                        {r === 'continent' && <i className="fas fa-map mr-2"></i>}
                        {r === 'country' && <i className="fas fa-flag mr-2"></i>}
                        {r === 'continent' ? USER_LOCATION.continent : r === 'country' ? USER_LOCATION.country : 'Global'}
                    </button>
                ))}
             </div>
          </div>

          {/* Podium Component */}
          {displayData.length > 0 ? (
            <div className="flex items-end justify-center gap-4 mb-4 px-4 h-64">
                {top3[1] && <PodiumStep entry={top3[1]} place={2} />}
                {top3[0] && <PodiumStep entry={top3[0]} place={1} />}
                {top3[2] && <PodiumStep entry={top3[2]} place={3} />}
            </div>
          ) : (
             <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <i className="fas fa-ghost text-4xl mb-2"></i>
                <p>No athletes found in this region yet.</p>
             </div>
          )}
      </div>

      {/* 3. The List */}
      <div className="bg-gym-800/50 backdrop-blur-md rounded-2xl border border-gym-700 overflow-hidden animate-slide-in">
         {rest.map((entry) => (
             <div 
                key={entry.rank} 
                className={`flex items-center p-4 border-b border-gym-700/50 hover:bg-gym-700/40 transition group ${entry.user === 'Alex Fitness' ? 'bg-gym-700/30 border-l-4 border-l-gym-500' : ''}`}
             >
                 {/* Display Rank */}
                 <div className="w-12 text-center font-bold text-gray-500 text-lg flex flex-col items-center justify-center">
                     {entry.displayRank}
                     {entry.change === 'up' && <i className="fas fa-caret-up text-emerald-500 text-xs"></i>}
                     {entry.change === 'down' && <i className="fas fa-caret-down text-rose-500 text-xs"></i>}
                     {entry.change === 'same' && <span className="text-gray-700 text-[10px]">-</span>}
                 </div>

                 {/* Avatar */}
                 <img src={entry.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-gym-600 mx-4" />

                 {/* Info */}
                 <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.flag}</span>
                        <h3 className={`font-bold ${entry.user === 'Alex Fitness' ? 'text-gym-400' : 'text-white'}`}>{entry.user}</h3>
                        {entry.badges.map((b, i) => (
                            <span key={i} className="text-xs" title="Badge">{b}</span>
                        ))}
                     </div>
                     <div className="text-xs text-gray-400 flex items-center gap-3 mt-0.5">
                         <span><i className="fas fa-fire text-orange-500 mr-1"></i>{entry.streak} Day Streak</span>
                         <span className="hidden sm:inline">• {entry.country}</span>
                     </div>
                 </div>

                 {/* Points */}
                 <div className="text-right">
                     <div className="font-mono font-bold text-white text-lg">{entry.points.toLocaleString()}</div>
                     <div className="text-[10px] text-gray-500 uppercase tracking-wider">Points</div>
                 </div>
             </div>
         ))}
         {rest.length === 0 && top3.length > 0 && (
             <div className="p-8 text-center text-gray-500 text-sm">
                 That's everyone in the top tier!
             </div>
         )}
      </div>

      {/* 4. Sticky User Stats (Mobile Friendly) */}
      <div className="fixed bottom-20 md:bottom-8 left-0 w-full px-4 md:px-0 pointer-events-none">
         <div className="max-w-4xl mx-auto pointer-events-auto">
             <div className="bg-gym-900 border border-gym-500 rounded-xl p-3 flex items-center shadow-2xl shadow-gym-500/20">
                 <div className="bg-gym-500 text-white w-8 h-8 rounded flex items-center justify-center font-bold mr-3">
                     {displayData.find(u => u.user === 'Alex Fitness')?.displayRank || '-'}
                 </div>
                 <div className="flex-1">
                     <div className="text-white font-bold text-sm">Your Rank ({regionFilter === 'continent' ? USER_LOCATION.continent : regionFilter === 'country' ? USER_LOCATION.country : 'Global'})</div>
                     <div className="text-xs text-gray-400">Top 15% of athletes</div>
                 </div>
                 <div className="text-right">
                    <span className="text-emerald-400 font-bold text-sm">+150</span>
                    <span className="text-gray-500 text-xs ml-1">today</span>
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default Leaderboard;
