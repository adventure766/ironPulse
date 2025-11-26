
import React, { useState } from 'react';
import { UserProfile, SleepData, WeightEntry } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from 'recharts';

interface WellnessProps {
  user: UserProfile;
  sleepData: SleepData[];
  weightHistory: WeightEntry[];
}

const Wellness: React.FC<WellnessProps> = ({ user, sleepData, weightHistory }) => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [stressLevel, setStressLevel] = useState(35); // 0-100

  // Toggle Breathing Exercise
  const toggleBreathing = () => {
    if (breathingActive) {
      setBreathingActive(false);
      setBreathingPhase('Inhale');
    } else {
      setBreathingActive(true);
      // Simple cycle simulation
      let cycle = 0;
      const interval = setInterval(() => {
        cycle = (cycle + 1) % 3;
        if (cycle === 0) setBreathingPhase('Inhale');
        if (cycle === 1) setBreathingPhase('Hold');
        if (cycle === 2) setBreathingPhase('Exhale');
      }, 3000); 
      // In a real app, clear interval on cleanup
    }
  };

  const latestSleep = sleepData[sleepData.length - 1];
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

  // Sleep Chart Data Preparation
  const sleepChartData = sleepData.slice(-7).map(d => ({
    name: d.date.split('-').slice(1).join('/'),
    hours: d.hours,
    score: d.score
  }));

  const getBMIStatus = (bmiVal: string) => {
      const b = parseFloat(bmiVal);
      if (b < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
      if (b < 25) return { text: 'Healthy', color: 'text-emerald-400' };
      if (b < 30) return { text: 'Overweight', color: 'text-yellow-400' };
      return { text: 'Obese', color: 'text-red-400' };
  };

  const bmiInfo = getBMIStatus(bmi);

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      
      {/* 1. Sleep Analysis Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-gym-900 to-gym-800 rounded-2xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 p-10 opacity-5">
             <i className="fas fa-moon text-9xl text-white"></i>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <i className="fas fa-bed text-indigo-400"></i> Sleep Quality
                </h2>
                <p className="text-sm text-gray-400 mb-6">Last night's analysis</p>
                
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-extrabold text-white">{latestSleep.hours}</span>
                    <span className="text-xl text-gray-400 mb-2 font-medium">hrs</span>
                    <div className={`ml-4 px-3 py-1 rounded-lg text-sm font-bold border ${latestSleep.score > 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        Score: {latestSleep.score}
                    </div>
                </div>

                {/* Sleep Stages Bar */}
                <div className="w-full flex h-4 rounded-full overflow-hidden mt-4">
                    <div style={{width: `${latestSleep.stages.rem}%`}} className="bg-purple-400" title="REM"></div>
                    <div style={{width: `${latestSleep.stages.light}%`}} className="bg-indigo-400" title="Light"></div>
                    <div style={{width: `${latestSleep.stages.deep}%`}} className="bg-blue-600" title="Deep"></div>
                    <div style={{width: `${latestSleep.stages.awake}%`}} className="bg-orange-400" title="Awake"></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400"></div> REM {latestSleep.stages.rem}%</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> Light {latestSleep.stages.light}%</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Deep {latestSleep.stages.deep}%</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Awake {latestSleep.stages.awake}%</span>
                </div>
            </div>

            <div className="w-full md:w-1/2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sleepChartData}>
                         <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} 
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: '#ffffff10' }}
                        />
                         <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* 2. Grid: Stress, Breathing, Body Comp */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Stress Monitor */}
          <div className="bg-gym-800 rounded-xl p-6 border border-gym-700 flex flex-col justify-between">
              <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <i className="fas fa-brain text-pink-500"></i> Stress Level
                  </h3>
                  <p className="text-xs text-gray-400">Based on HRV & Activity</p>
              </div>
              
              <div className="flex flex-col items-center py-6">
                  <div className="relative w-48 h-24 overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-full bg-gym-700 rounded-t-full"></div>
                       <div 
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 rounded-t-full origin-bottom transition-transform duration-1000"
                        style={{ transform: `rotate(${(stressLevel / 100) * 180 - 180}deg)` }}
                       ></div>
                       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-gym-800 rounded-t-full flex items-end justify-center pb-2">
                           <span className="text-3xl font-bold text-white">{stressLevel}</span>
                       </div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-emerald-400">Low / Balanced</div>
              </div>
              
              <div className="flex gap-2">
                  <button onClick={() => setStressLevel(Math.max(0, stressLevel - 10))} className="flex-1 bg-gym-700 hover:bg-gym-600 py-2 rounded text-xs text-white">Log Mood</button>
                  <button className="flex-1 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 py-2 rounded text-xs">Self Check</button>
              </div>
          </div>

          {/* Breathing Coach */}
          <div className="bg-gradient-to-b from-cyan-900 to-gym-800 rounded-xl p-6 border border-cyan-700/30 flex flex-col items-center justify-center relative overflow-hidden text-center">
              {!breathingActive ? (
                  <>
                    <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 animate-float">
                        <i className="fas fa-wind text-4xl text-cyan-400"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Mindfulness</h3>
                    <p className="text-xs text-gray-400 mb-6 px-4">Take a moment to center yourself. 1 min session.</p>
                    <button 
                        onClick={toggleBreathing}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-full shadow-lg shadow-cyan-500/20 transition"
                    >
                        Start
                    </button>
                  </>
              ) : (
                  <>
                     <div className="relative flex items-center justify-center w-40 h-40 mb-6">
                         {/* Growing Circle */}
                         <div className={`absolute w-full h-full rounded-full bg-cyan-500/30 animate-breathe blur-xl`}></div>
                         <div className={`absolute w-24 h-24 rounded-full bg-cyan-400/80 animate-breathe flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.6)]`}></div>
                         <span className="relative z-10 text-xl font-bold text-white drop-shadow-md">{breathingPhase}</span>
                     </div>
                     <button 
                        onClick={toggleBreathing}
                        className="text-gray-400 hover:text-white text-sm underline"
                    >
                        End Session
                    </button>
                  </>
              )}
          </div>

          {/* Body Composition */}
          <div className="bg-gym-800 rounded-xl p-6 border border-gym-700 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <i className="fas fa-weight text-emerald-500"></i> Body Comp
                      </h3>
                      <p className="text-xs text-gray-400">Weight & BMI Trend</p>
                  </div>
                  <div className="text-right">
                      <div className="text-2xl font-bold text-white">{bmi}</div>
                      <div className={`text-xs font-bold ${bmiInfo.color}`}>BMI: {bmiInfo.text}</div>
                  </div>
              </div>
              
              <div className="flex-1 w-full h-32">
                   <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weightHistory}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px' }} 
                                itemStyle={{ color: '#10b981' }}
                            />
                            <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" />
                            <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
                        </AreaChart>
                   </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-between items-center bg-gym-900 p-3 rounded-lg">
                   <div className="text-xs text-gray-400">Current Weight</div>
                   <div className="text-lg font-bold text-white">{user.weight} <span className="text-xs font-normal text-gray-500">kg</span></div>
              </div>
          </div>

      </div>

    </div>
  );
};

export default Wellness;
