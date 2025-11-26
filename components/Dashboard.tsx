
import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutLog, DietLog, WeightEntry } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

interface DashboardProps {
  user: UserProfile;
  workoutLogs: WorkoutLog[];
  dietLogs: DietLog[];
  steps?: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b']; // Green, Blue, Red, Amber

const Dashboard: React.FC<DashboardProps> = ({ user, workoutLogs, dietLogs, steps = 8432 }) => {
  // --- Local Interactive State ---
  const [waterIntake, setWaterIntake] = useState(1750); // ml
  const waterGoal = 3000;
  
  // Holistic Metrics
  const [mood, setMood] = useState(75);
  const [energy, setEnergy] = useState(60);
  const [stress, setStress] = useState(30);
  const [recoveryScore, setRecoveryScore] = useState(82);

  // Live Vitals Simulation
  const [heartRate, setHeartRate] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [greeting, setGreeting] = useState('');

  // --- Calculations ---
  
  // 1. Metabolic Calculations (Mifflin-St Jeor)
  const calculateBMR = () => {
      // Men: 10W + 6.25H - 5A + 5
      // Women: 10W + 6.25H - 5A - 161
      const base = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
      return user.gender === 'male' ? base + 5 : base - 161;
  };
  const bmr = Math.floor(calculateBMR());
  
  // TDEE (Total Daily Energy Expenditure) - Assuming 'Intermediate' is moderate activity (x1.55)
  const tdee = Math.floor(bmr * 1.55);
  
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

  // 2. Nutrition Aggregation
  const today = new Date().toISOString().split('T')[0];
  const todayDietLogs = dietLogs.filter(d => d.date === today); // In real app, filter by date properly
  
  const currentCalories = dietLogs.reduce((acc, log) => acc + log.calories, 0);
  const currentProtein = dietLogs.reduce((acc, log) => acc + log.protein, 0);
  const currentCarbs = dietLogs.reduce((acc, log) => acc + log.carbs, 0);
  const currentFat = dietLogs.reduce((acc, log) => acc + log.fat, 0);
  const currentFiber = dietLogs.reduce((acc, log) => acc + (log.fiber || 0), 0);

  const activeMacroData = [
    { name: 'Protein', value: currentProtein },
    { name: 'Carbs', value: currentCarbs },
    { name: 'Fat', value: currentFat },
  ];

  // 3. Heart Rate Zones (Mock based on WorkoutLogs)
  const cardioZoneData = [
      { name: 'Fat Burn', minutes: 25, fill: '#10b981' }, // Green
      { name: 'Cardio', minutes: 45, fill: '#f59e0b' },   // Amber
      { name: 'Peak', minutes: 15, fill: '#ef4444' },     // Red
  ];

  // 4. Weight Trend Data (Mock)
  const weightTrendData = [
      { date: 'Mon', weight: 78.5 },
      { date: 'Tue', weight: 78.2 },
      { date: 'Wed', weight: 78.0 },
      { date: 'Thu', weight: 78.1 },
      { date: 'Fri', weight: 77.9 },
      { date: 'Sat', weight: 77.8 },
      { date: 'Sun', weight: 78.0 },
  ];

  // --- Effects ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const interval = setInterval(() => {
      setHeartRate(prev => Math.max(60, Math.min(100, prev + (Math.random() > 0.5 ? 2 : -2))));
      setSpo2(prev => Math.random() > 0.8 ? (Math.random() > 0.5 ? 99 : 97) : 98);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- Helper Components ---

  const MetricCard = ({ label, value, unit, subtext, color }: any) => (
      <div className="bg-gym-800 p-4 rounded-xl border border-gym-700 flex flex-col items-center justify-center text-center hover:border-gym-500 transition duration-300">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</div>
          <div className={`text-2xl font-black ${color}`}>{value} <span className="text-xs text-gray-500 font-normal">{unit}</span></div>
          {subtext && <div className="text-[10px] text-gray-500 mt-1">{subtext}</div>}
      </div>
  );

  const SliderInput = ({ label, value, onChange, colorClass, icon }: any) => (
      <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-bold flex items-center gap-1"><i className={`fas ${icon}`}></i> {label}</span>
              <span className={colorClass}>{value}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gym-900 rounded-lg appearance-none cursor-pointer"
          />
      </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. TOP HEADER: Status & Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-gym-800 to-indigo-900 p-6 rounded-2xl border border-gym-700 shadow-xl relative overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-6 opacity-10"><i className="fas fa-heartbeat text-9xl text-white"></i></div>
               <h1 className="text-2xl font-bold text-white relative z-10">{greeting}, {user.name.split(' ')[0]}</h1>
               <p className="text-indigo-200 text-sm mb-4 relative z-10">Your metabolic engine is running efficiently today.</p>
               <div className="flex gap-4 relative z-10">
                   <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                       <i className="fas fa-fire text-orange-500"></i>
                       <span className="text-white font-bold">{tdee} <span className="text-xs font-normal text-gray-400">TDEE</span></span>
                   </div>
                   <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                       <i className="fas fa-leaf text-emerald-500"></i>
                       <span className="text-white font-bold">{bmr} <span className="text-xs font-normal text-gray-400">BMR</span></span>
                   </div>
               </div>
          </div>
          
          <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700 flex flex-col items-center justify-center relative">
              <div className="text-xs text-gray-400 uppercase font-bold mb-2">Recovery Score</div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="50%" cy="50%" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle cx="50%" cy="50%" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - recoveryScore/100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-2xl font-black text-white">{recoveryScore}</div>
              </div>
              <div className="text-[10px] text-emerald-400 mt-2 font-bold">Ready to Train</div>
          </div>

          <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700 flex flex-col justify-between">
               <div>
                   <div className="flex justify-between items-center mb-2">
                       <span className="text-xs text-gray-400 font-bold uppercase">Live Vitals</span>
                       <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                   </div>
                   <div className="flex justify-between items-end border-b border-gym-700 pb-2 mb-2">
                       <span className="text-3xl font-bold text-white">{heartRate}</span>
                       <span className="text-xs text-red-400 font-bold mb-1"><i className="fas fa-heart"></i> BPM</span>
                   </div>
                   <div className="flex justify-between items-end">
                       <span className="text-3xl font-bold text-white">{spo2}%</span>
                       <span className="text-xs text-blue-400 font-bold mb-1"><i className="fas fa-wind"></i> SpO2</span>
                   </div>
               </div>
          </div>
      </div>

      {/* 2. BODY COMPOSITION & METABOLICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Weight Trend */}
           <div className="lg:col-span-2 bg-gym-800 p-6 rounded-2xl border border-gym-700">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-white"><i className="fas fa-weight text-blue-500 mr-2"></i>Weight Trend</h3>
                   <div className="flex gap-4">
                       <div className="text-right">
                           <div className="text-xs text-gray-400 uppercase">Current</div>
                           <div className="text-white font-bold">{user.weight} kg</div>
                       </div>
                       <div className="text-right">
                           <div className="text-xs text-gray-400 uppercase">Goal</div>
                           <div className="text-emerald-400 font-bold">{user.targetWeight} kg</div>
                       </div>
                   </div>
               </div>
               <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={weightTrendData}>
                           <defs>
                               <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                           </defs>
                           <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3"/>
                           <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                           <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748b" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                           <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} itemStyle={{color: '#3b82f6'}} />
                           <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fill="url(#colorWeight)" />
                       </AreaChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Body Stats */}
           <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700 flex flex-col justify-between">
                <h3 className="text-lg font-bold text-white mb-4"><i className="fas fa-ruler-combined text-yellow-500 mr-2"></i>Body Stats</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <MetricCard label="Body Fat" value={`${user.bodyFat}%`} unit="" color="text-yellow-400" />
                    <MetricCard label="BMI" value={bmi} unit="" color={parseFloat(bmi) < 25 ? "text-emerald-400" : "text-yellow-400"} />
                </div>

                <div className="space-y-3 bg-gym-900 p-4 rounded-xl border border-gym-600">
                    <div className="flex justify-between items-center text-sm border-b border-gym-700 pb-2">
                        <span className="text-gray-400">Waist</span>
                        <span className="text-white font-bold">{user.waist} cm</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gym-700 pb-2">
                        <span className="text-gray-400">Chest</span>
                        <span className="text-white font-bold">{user.chest} cm</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gym-700 pb-2">
                        <span className="text-gray-400">Arms</span>
                        <span className="text-white font-bold">{user.arms} cm</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Thighs</span>
                        <span className="text-white font-bold">{user.thighs} cm</span>
                    </div>
                </div>
           </div>
      </div>

      {/* 3. PERFORMANCE & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Cardio Zones */}
           <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700">
               <h3 className="text-lg font-bold text-white mb-4"><i className="fas fa-tachometer-alt text-red-500 mr-2"></i>Heart Rate Zones</h3>
               <div className="h-48">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={cardioZoneData} margin={{left: 20}}>
                           <CartesianGrid horizontal={true} vertical={false} stroke="#334155" strokeDasharray="3 3" />
                           <XAxis type="number" stroke="#64748b" tick={{fontSize: 10}} hide />
                           <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{fontSize: 10}} width={60} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                           <Bar dataKey="minutes" radius={[0, 4, 4, 0]} barSize={20}>
                               {cardioZoneData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.fill} />
                               ))}
                           </Bar>
                       </BarChart>
                   </ResponsiveContainer>
               </div>
               <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                   <span>Lower Intensity</span>
                   <span>Peak Performance</span>
               </div>
           </div>

           {/* Steps & Activity */}
           <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700 flex flex-col items-center justify-center">
               <h3 className="text-lg font-bold text-white mb-4 w-full text-left"><i className="fas fa-shoe-prints text-emerald-500 mr-2"></i>Steps Activity</h3>
               <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="60" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                        <circle 
                            cx="50%" cy="50%" r="60" 
                            stroke="#10b981" strokeWidth="12" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 60} 
                            strokeDashoffset={2 * Math.PI * 60 * (1 - Math.min(steps/user.targetDailySteps, 1))} 
                            strokeLinecap="round" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{steps.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">/ {user.targetDailySteps.toLocaleString()}</span>
                    </div>
               </div>
               <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center">
                   <div className="bg-gym-900 p-2 rounded border border-gym-700">
                       <div className="text-[10px] text-gray-400">Distance</div>
                       <div className="text-white font-bold">6.2 km</div>
                   </div>
                   <div className="bg-gym-900 p-2 rounded border border-gym-700">
                       <div className="text-[10px] text-gray-400">Calories</div>
                       <div className="text-white font-bold">340 kcal</div>
                   </div>
               </div>
           </div>

           {/* Workout Consistency */}
           <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700 flex flex-col">
               <h3 className="text-lg font-bold text-white mb-4"><i className="fas fa-calendar-check text-purple-500 mr-2"></i>Consistency</h3>
               <div className="flex-1 grid grid-cols-7 gap-2 content-center">
                   {[...Array(28)].map((_, i) => (
                       <div 
                         key={i} 
                         className={`aspect-square rounded-sm transition-all hover:scale-125
                         ${Math.random() > 0.7 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 
                           Math.random() > 0.5 ? 'bg-emerald-800' : 'bg-gym-900'}`}
                       ></div>
                   ))}
               </div>
               <div className="flex justify-between items-center mt-4 bg-gym-900 p-3 rounded-xl border border-gym-600">
                   <div>
                       <div className="text-xs text-gray-400">Current Streak</div>
                       <div className="text-xl font-bold text-white">12 Days</div>
                   </div>
                   <i className="fas fa-fire text-3xl text-orange-500 animate-pulse"></i>
               </div>
           </div>
      </div>

      {/* 4. NUTRITION & HOLISTIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* Detailed Nutrition */}
           <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white"><i className="fas fa-utensils text-orange-500 mr-2"></i>Advanced Nutrition</h3>
                    <span className="text-white font-bold">{currentCalories} / {user.targetDailyCalories} kcal</span>
                </div>
                
                <div className="space-y-4">
                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Protein', current: currentProtein, target: user.targetDailyProtein, color: 'bg-emerald-500', text: 'text-emerald-500' },
                            { label: 'Carbs', current: currentCarbs, target: user.targetDailyCarbs, color: 'bg-blue-500', text: 'text-blue-500' },
                            { label: 'Fat', current: currentFat, target: user.targetDailyFat, color: 'bg-rose-500', text: 'text-rose-500' },
                        ].map(m => (
                            <div key={m.label} className="bg-gym-900 p-3 rounded-xl border border-gym-600">
                                <div className={`text-xs font-bold uppercase mb-1 ${m.text}`}>{m.label}</div>
                                <div className="text-lg font-bold text-white mb-1">{m.current}g</div>
                                <div className="w-full bg-gym-800 h-1.5 rounded-full">
                                    <div className={`h-1.5 rounded-full ${m.color}`} style={{width: `${Math.min((m.current/m.target)*100, 100)}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Micros & Water */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-gym-900 p-3 rounded-xl border border-gym-600 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-purple-400 font-bold uppercase">Fiber</div>
                                <div className="text-white font-bold">{currentFiber} / {user.targetDailyFiber}g</div>
                            </div>
                            <i className="fas fa-seedling text-2xl text-purple-500/50"></i>
                        </div>
                        <div className="bg-gym-900 p-3 rounded-xl border border-gym-600 flex flex-col justify-center">
                            <div className="flex justify-between text-xs text-blue-400 font-bold uppercase mb-1">
                                <span>Water</span>
                                <span>{Math.round((waterIntake/waterGoal)*100)}%</span>
                            </div>
                            <div className="w-full bg-gym-800 h-2 rounded-full mb-2">
                                <div className="h-2 bg-blue-500 rounded-full transition-all duration-500" style={{width: `${Math.min((waterIntake/waterGoal)*100, 100)}%`}}></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setWaterIntake(w => w + 250)} className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-[10px] font-bold py-1 rounded transition">+250ml</button>
                            </div>
                        </div>
                    </div>
                </div>
           </div>

           {/* Holistic Wellness Tracker */}
           <div className="bg-gym-800 p-6 rounded-2xl border border-gym-700 flex flex-col justify-between">
               <h3 className="text-lg font-bold text-white mb-4"><i className="fas fa-yin-yang text-white mr-2"></i>Wellness Check-in</h3>
               
               <div className="space-y-2">
                   <SliderInput label="Energy Level" value={energy} onChange={setEnergy} colorClass="text-yellow-400" icon="fa-bolt" />
                   <SliderInput label="Mood" value={mood} onChange={setMood} colorClass="text-purple-400" icon="fa-smile" />
                   <SliderInput label="Stress" value={stress} onChange={setStress} colorClass="text-rose-400" icon="fa-brain" />
               </div>

               <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="bg-gym-900 p-3 rounded-xl border border-gym-600">
                       <div className="text-xs text-gray-400 uppercase">Sleep Duration</div>
                       <div className="text-xl font-bold text-white flex items-center gap-2">
                           <i className="fas fa-moon text-indigo-400"></i> 7h 45m
                       </div>
                   </div>
                   <div className="bg-gym-900 p-3 rounded-xl border border-gym-600">
                       <div className="text-xs text-gray-400 uppercase">Digestion</div>
                       <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                           <i className="fas fa-leaf"></i> Good
                       </div>
                   </div>
               </div>
           </div>
      </div>

    </div>
  );
};

export default Dashboard;
