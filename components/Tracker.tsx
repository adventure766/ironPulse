
import React, { useState, useEffect, useRef } from 'react';
import { WorkoutLog, DietLog, Routine, MuscleGroup } from '../types';

interface TrackerProps {
  addWorkout: (log: WorkoutLog) => void;
  addMeal: (log: DietLog) => void;
  workoutLogs: WorkoutLog[];
  dietLogs: DietLog[];
}

// --- MOCK ROUTINES ---
const PRESET_ROUTINES: Routine[] = [
    {
        id: 'push_day', name: 'Push Power', difficulty: 'Intermediate', duration: 60,
        muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.ARMS],
        exercises: [
            { exerciseId: '1', name: 'Barbell Bench Press', targetSets: 4, targetReps: '5-8' },
            { exerciseId: '2', name: 'Overhead Press', targetSets: 3, targetReps: '8-10' },
            { exerciseId: '3', name: 'Incline Dumbbell Press', targetSets: 3, targetReps: '10-12' },
            { exerciseId: '4', name: 'Tricep Pushdowns', targetSets: 3, targetReps: '12-15' },
        ]
    },
    {
        id: 'pull_day', name: 'Back & Biceps', difficulty: 'Intermediate', duration: 55,
        muscleGroups: [MuscleGroup.BACK, MuscleGroup.ARMS],
        exercises: [
            { exerciseId: '5', name: 'Deadlift', targetSets: 3, targetReps: '5' },
            { exerciseId: '6', name: 'Pull Ups', targetSets: 3, targetReps: 'AMRAP' },
            { exerciseId: '7', name: 'Barbell Rows', targetSets: 4, targetReps: '8-10' },
            { exerciseId: '8', name: 'Hammer Curls', targetSets: 3, targetReps: '12' },
        ]
    },
    {
        id: 'leg_day', name: 'Leg Destruction', difficulty: 'Advanced', duration: 70,
        muscleGroups: [MuscleGroup.LEGS, MuscleGroup.ABS],
        exercises: [
            { exerciseId: '9', name: 'Squat', targetSets: 4, targetReps: '5-8' },
            { exerciseId: '10', name: 'Lunges', targetSets: 3, targetReps: '12' },
            { exerciseId: '11', name: 'Leg Press', targetSets: 3, targetReps: '15-20' },
            { exerciseId: '12', name: 'Plank', targetSets: 3, targetReps: '60s' },
        ]
    }
];

const PRESET_MEALS = [
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, icon: '🍌' },
  { name: 'Protein Shake', calories: 150, protein: 25, carbs: 5, fat: 2, icon: '🥤' },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3, icon: '🍗' },
  { name: 'Rice (1 cup)', calories: 200, protein: 4, carbs: 45, fat: 0, icon: '🍚' },
  { name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fat: 0, icon: '🥣' },
  { name: 'Avocado Toast', calories: 250, protein: 6, carbs: 20, fat: 15, icon: '🥑' },
];

const Tracker: React.FC<TrackerProps> = ({ addWorkout, addMeal, workoutLogs, dietLogs }) => {
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition' | 'history'>('workout');
  
  // --- WORKOUT HUD STATE ---
  const [hudState, setHudState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0); // seconds
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({}); // exId -> array of reps completed
  const [restTimer, setRestTimer] = useState(0); // seconds
  const [isResting, setIsResting] = useState(false);
  const [sessionVolume, setSessionVolume] = useState(0);
  
  // Input for active set
  const [weightInput, setWeightInput] = useState('60');
  const [repsInput, setRepsInput] = useState('10');

  // --- NUTRITION STATE ---
  const [dMeal, setDMeal] = useState('');
  const [dCalories, setDCalories] = useState('');
  const [dProtein, setDProtein] = useState('');
  const [dCarbs, setDCarbs] = useState('');
  const [dFat, setDFat] = useState('');

  // --- TIMERS ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hudState === 'active') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        if (isResting && restTimer > 0) {
            setRestTimer(prev => prev - 1);
        } else if (isResting && restTimer === 0) {
            setIsResting(false);
            // Play sound?
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hudState, isResting, restTimer]);

  const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- ACTIONS ---

  const startRoutine = (routine: Routine) => {
      setActiveRoutine(routine);
      setHudState('active');
      setSessionDuration(0);
      setCurrentExerciseIndex(0);
      setCompletedSets({});
      setSessionVolume(0);
  };

  const logSet = () => {
      if (!activeRoutine) return;
      
      const ex = activeRoutine.exercises[currentExerciseIndex];
      const reps = parseInt(repsInput);
      const weight = parseInt(weightInput);
      
      const newSets = completedSets[ex.exerciseId] ? [...completedSets[ex.exerciseId], reps] : [reps];
      setCompletedSets({ ...completedSets, [ex.exerciseId]: newSets });
      
      setSessionVolume(prev => prev + (reps * weight));

      // Auto start rest
      setRestTimer(60); 
      setIsResting(true);
  };

  const finishWorkout = () => {
      if (!activeRoutine) return;
      setHudState('finished');
      
      const log: WorkoutLog = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: activeRoutine.name,
          duration: Math.ceil(sessionDuration / 60),
          caloriesBurned: Math.floor(sessionDuration / 60 * 8), // roughly 8cal/min
          intensity: 'High',
          volume: sessionVolume,
          sets: Object.values(completedSets).flat().length
      };
      addWorkout(log);
  };

  const handleDietSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dMeal || !dCalories) return;
    addMeal({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      meal: dMeal,
      calories: parseInt(dCalories),
      protein: dProtein ? parseInt(dProtein) : 0,
      carbs: dCarbs ? parseInt(dCarbs) : 0,
      fat: dFat ? parseInt(dFat) : 0
    });
    setDMeal(''); setDCalories(''); setDProtein(''); setDCarbs(''); setDFat('');
  };

  // --- RENDER HELPERS ---

  const RoutineCard = ({ routine }: { routine: Routine }) => (
      <div 
        onClick={() => startRoutine(routine)}
        className="group relative bg-gym-800 rounded-2xl p-6 border border-gym-700 hover:border-emerald-500 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-emerald-900/20"
      >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition duration-500">
              <i className="fas fa-dumbbell text-8xl text-white"></i>
          </div>
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${routine.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {routine.difficulty}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1"><i className="fas fa-clock"></i> {routine.duration}m</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition">{routine.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{routine.muscleGroups.join(', ')}</p>
              
              <div className="space-y-1">
                  {routine.exercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="text-xs text-gray-500 flex justify-between">
                          <span>{ex.name}</span>
                          <span className="text-gray-600">{ex.targetSets} x {ex.targetReps}</span>
                      </div>
                  ))}
                  {routine.exercises.length > 3 && <div className="text-xs text-gray-600 italic">+{routine.exercises.length - 3} more...</div>}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gym-700 flex justify-center">
                  <span className="text-emerald-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      START WORKOUT <i className="fas fa-arrow-right"></i>
                  </span>
              </div>
          </div>
      </div>
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* 0. Top Navigation */}
      <div className="flex justify-center mb-8">
          <div className="bg-gym-800 p-1.5 rounded-xl border border-gym-700 inline-flex shadow-lg">
              <button 
                onClick={() => setActiveTab('workout')} 
                className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'workout' ? 'bg-gym-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  <i className="fas fa-running"></i> Workout
              </button>
              <button 
                onClick={() => setActiveTab('nutrition')} 
                className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'nutrition' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  <i className="fas fa-utensils"></i> Nutrition
              </button>
              <button 
                onClick={() => setActiveTab('history')} 
                className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${activeTab === 'history' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  <i className="fas fa-history"></i> History
              </button>
          </div>
      </div>

      {/* ================= WORKOUT TAB ================= */}
      {activeTab === 'workout' && (
        <>
            {/* IDLE: Routine Selection */}
            {hudState === 'idle' && (
                <div className="animate-slide-in">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Ready to Train?</h2>
                        <p className="text-gray-400">Select a routine to launch the Active HUD.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRESET_ROUTINES.map(routine => (
                            <RoutineCard key={routine.id} routine={routine} />
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-gym-800 rounded-2xl border border-dashed border-gym-600 text-center">
                        <div className="w-16 h-16 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <i className="fas fa-plus text-2xl"></i>
                        </div>
                        <h3 className="text-white font-bold mb-1">Create Custom Routine</h3>
                        <p className="text-gray-500 text-sm mb-4">Design your own split from scratch.</p>
                        <button className="px-6 py-2 bg-gym-700 hover:bg-gym-600 text-white rounded-lg font-bold text-sm transition">
                            Builder Tool
                        </button>
                    </div>
                </div>
            )}

            {/* ACTIVE: Live HUD */}
            {hudState === 'active' && activeRoutine && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
                    {/* HUD Header */}
                    <div className="p-4 bg-gym-900 border-b border-gym-700 flex justify-between items-center z-10">
                        <div>
                            <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider animate-pulse">Live Session</div>
                            <h2 className="text-white font-bold text-lg">{activeRoutine.name}</h2>
                        </div>
                        <div className="text-right">
                             <div className="font-mono text-2xl font-bold text-white">{formatTime(sessionDuration)}</div>
                             <div className="text-xs text-gray-500">Duration</div>
                        </div>
                    </div>

                    {/* Exercise View */}
                    <div className="flex-1 overflow-y-auto relative">
                        {/* Current Exercise Card */}
                        <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[50vh]">
                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Exercise {currentExerciseIndex + 1} of {activeRoutine.exercises.length}</div>
                            <h1 className="text-3xl md:text-5xl font-black text-white text-center mb-6 leading-tight">
                                {activeRoutine.exercises[currentExerciseIndex].name}
                            </h1>
                            
                            <div className="grid grid-cols-2 gap-8 w-full max-w-md mb-8">
                                <div className="bg-gym-800 p-4 rounded-2xl border border-gym-700 text-center">
                                    <div className="text-xs text-gray-500 uppercase font-bold">Target Sets</div>
                                    <div className="text-2xl font-bold text-white">{activeRoutine.exercises[currentExerciseIndex].targetSets}</div>
                                </div>
                                <div className="bg-gym-800 p-4 rounded-2xl border border-gym-700 text-center">
                                    <div className="text-xs text-gray-500 uppercase font-bold">Target Reps</div>
                                    <div className="text-2xl font-bold text-white">{activeRoutine.exercises[currentExerciseIndex].targetReps}</div>
                                </div>
                            </div>

                            {/* Sets Tracker */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                {Array.from({ length: activeRoutine.exercises[currentExerciseIndex].targetSets }).map((_, idx) => {
                                    const exId = activeRoutine.exercises[currentExerciseIndex].exerciseId;
                                    const isDone = completedSets[exId] && completedSets[exId].length > idx;
                                    return (
                                        <div 
                                            key={idx}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
                                            ${isDone 
                                                ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_#10b981]' 
                                                : 'bg-transparent border-gray-600 text-gray-500'}`}
                                        >
                                            {isDone ? <i className="fas fa-check"></i> : idx + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controls Container */}
                        <div className="bg-gym-900 border-t border-gym-700 p-6 md:p-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                            
                            {/* Input Row */}
                            <div className="flex justify-center gap-4 mb-6">
                                <div className="flex flex-col items-center">
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1">Weight (kg)</label>
                                    <div className="flex items-center bg-gym-800 rounded-xl border border-gym-600 overflow-hidden">
                                        <button onClick={() => setWeightInput((parseInt(weightInput)-5).toString())} className="p-3 hover:bg-gym-700 text-gray-400"><i className="fas fa-minus"></i></button>
                                        <input className="w-16 bg-transparent text-center text-white font-bold outline-none" value={weightInput} onChange={e => setWeightInput(e.target.value)} />
                                        <button onClick={() => setWeightInput((parseInt(weightInput)+5).toString())} className="p-3 hover:bg-gym-700 text-gray-400"><i className="fas fa-plus"></i></button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1">Reps</label>
                                    <div className="flex items-center bg-gym-800 rounded-xl border border-gym-600 overflow-hidden">
                                        <button onClick={() => setRepsInput((parseInt(repsInput)-1).toString())} className="p-3 hover:bg-gym-700 text-gray-400"><i className="fas fa-minus"></i></button>
                                        <input className="w-16 bg-transparent text-center text-white font-bold outline-none" value={repsInput} onChange={e => setRepsInput(e.target.value)} />
                                        <button onClick={() => setRepsInput((parseInt(repsInput)+1).toString())} className="p-3 hover:bg-gym-700 text-gray-400"><i className="fas fa-plus"></i></button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Action Button */}
                            <button 
                                onClick={logSet}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition transform uppercase tracking-wide flex items-center justify-center gap-3"
                            >
                                <i className="fas fa-check-circle"></i> Log Set
                            </button>

                            {/* Nav Controls */}
                            <div className="flex justify-between mt-6">
                                <button 
                                    onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                                    disabled={currentExerciseIndex === 0}
                                    className="text-gray-500 hover:text-white disabled:opacity-30 transition flex items-center gap-2"
                                >
                                    <i className="fas fa-arrow-left"></i> Prev Exercise
                                </button>

                                {currentExerciseIndex < activeRoutine.exercises.length - 1 ? (
                                    <button 
                                        onClick={() => { setCurrentExerciseIndex(currentExerciseIndex + 1); setIsResting(false); }}
                                        className="text-white hover:text-emerald-400 transition flex items-center gap-2 font-bold"
                                    >
                                        Next Exercise <i className="fas fa-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={finishWorkout}
                                        className="text-red-500 hover:text-red-400 transition flex items-center gap-2 font-bold"
                                    >
                                        Finish Workout <i className="fas fa-flag-checkered"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* REST OVERLAY */}
                    {isResting && (
                        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="120" stroke="#1f2937" strokeWidth="12" fill="none" />
                                    <circle 
                                        cx="50%" cy="50%" r="120" 
                                        stroke="#10b981" strokeWidth="12" fill="none"
                                        strokeDasharray={2 * Math.PI * 120}
                                        strokeDashoffset={2 * Math.PI * 120 * (1 - restTimer / 60)}
                                        strokeLinecap="round"
                                        className="transition-[stroke-dashoffset] duration-1000 linear"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-6xl font-black text-white font-mono">{restTimer}</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-2">Rest</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setRestTimer(t => t + 30)} className="px-6 py-2 bg-gym-800 text-white rounded-lg border border-gym-600">+30s</button>
                                <button onClick={() => setIsResting(false)} className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-500 transition">Skip Rest</button>
                            </div>
                            <div className="mt-8 text-gray-500 text-sm animate-pulse">Next: {activeRoutine.exercises[currentExerciseIndex].name}</div>
                        </div>
                    )}
                </div>
            )}

            {/* FINISHED: Summary Screen */}
            {hudState === 'finished' && activeRoutine && (
                <div className="animate-slide-in text-center py-10">
                    <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(234,179,8,0.4)] animate-pop">
                        <i className="fas fa-trophy text-5xl text-white"></i>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-2 uppercase">Workout Complete!</h2>
                    <p className="text-gray-400 mb-8">Great job crushing {activeRoutine.name}</p>

                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
                        <div className="bg-gym-800 p-4 rounded-xl border border-gym-700">
                            <div className="text-2xl font-bold text-white">{Math.floor(sessionDuration/60)}m</div>
                            <div className="text-xs text-gray-500 uppercase">Duration</div>
                        </div>
                        <div className="bg-gym-800 p-4 rounded-xl border border-gym-700">
                            <div className="text-2xl font-bold text-white">{sessionVolume.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 uppercase">Vol (kg)</div>
                        </div>
                        <div className="bg-gym-800 p-4 rounded-xl border border-gym-700">
                            <div className="text-2xl font-bold text-emerald-400">+{Object.values(completedSets).flat().length * 10}</div>
                            <div className="text-xs text-gray-500 uppercase">XP Gained</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setHudState('idle')}
                        className="px-8 py-3 bg-gym-700 hover:bg-gym-600 text-white font-bold rounded-xl transition"
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}
        </>
      )}

      {/* ================= NUTRITION TAB ================= */}
      {activeTab === 'nutrition' && (
          <div className="animate-slide-in space-y-6">
               <div className="bg-gym-800 rounded-2xl p-6 border border-gym-700">
                   <h3 className="text-xl font-bold text-white mb-6">Quick Log</h3>
                   
                   {/* Quick Add Presets */}
                   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
                        {PRESET_MEALS.map((preset, idx) => (
                            <button
                                key={idx}
                                onClick={() => addMeal({
                                    id: Date.now().toString(),
                                    date: new Date().toISOString().split('T')[0],
                                    meal: preset.name,
                                    calories: preset.calories,
                                    protein: preset.protein,
                                    carbs: preset.carbs,
                                    fat: preset.fat
                                })}
                                className="flex flex-col items-center min-w-[100px] bg-gym-900 border border-gym-700 hover:border-blue-500 rounded-xl p-3 transition group"
                            >
                                <div className="text-3xl mb-2 group-hover:scale-110 transition">{preset.icon}</div>
                                <div className="text-xs font-bold text-white">{preset.name}</div>
                                <div className="text-[10px] text-gray-400">{preset.calories} kcal</div>
                            </button>
                        ))}
                   </div>

                   <form onSubmit={handleDietSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                value={dMeal} onChange={e => setDMeal(e.target.value)}
                                placeholder="Meal Name (e.g., Salmon Salad)" 
                                className="bg-gym-900 border border-gym-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                            />
                            <input 
                                type="number" 
                                value={dCalories} onChange={e => setDCalories(e.target.value)}
                                placeholder="Calories" 
                                className="bg-gym-900 border border-gym-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" value={dProtein} onChange={e => setDProtein(e.target.value)} placeholder="Protein (g)" className="bg-gym-900 border border-gym-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" />
                            <input type="number" value={dCarbs} onChange={e => setDCarbs(e.target.value)} placeholder="Carbs (g)" className="bg-gym-900 border border-gym-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                            <input type="number" value={dFat} onChange={e => setDFat(e.target.value)} placeholder="Fat (g)" className="bg-gym-900 border border-gym-700 rounded-xl p-3 text-white outline-none focus:border-red-500" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition">
                            Log Meal
                        </button>
                   </form>
               </div>

               {/* Today's Log */}
               <div className="bg-gym-800 rounded-2xl p-6 border border-gym-700">
                   <h3 className="text-xl font-bold text-white mb-4">Today's Intake</h3>
                   <div className="space-y-3">
                       {dietLogs.map(log => (
                           <div key={log.id} className="flex justify-between items-center p-3 bg-gym-900 rounded-xl border border-gym-700">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                       <i className="fas fa-utensils"></i>
                                   </div>
                                   <div>
                                       <div className="font-bold text-white text-sm">{log.meal}</div>
                                       <div className="text-[10px] text-gray-500 flex gap-2">
                                           <span>P: {log.protein}g</span>
                                           <span>C: {log.carbs}g</span>
                                           <span>F: {log.fat}g</span>
                                       </div>
                                   </div>
                               </div>
                               <div className="font-bold text-white">{log.calories} kcal</div>
                           </div>
                       ))}
                   </div>
               </div>
          </div>
      )}

      {/* ================= HISTORY TAB ================= */}
      {activeTab === 'history' && (
          <div className="animate-slide-in space-y-4">
               {workoutLogs.slice().reverse().map(log => (
                   <div key={log.id} className="bg-gym-800 rounded-2xl p-5 border border-gym-700 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center text-xl">
                               <i className="fas fa-dumbbell"></i>
                           </div>
                           <div>
                               <h4 className="font-bold text-white text-lg">{log.type}</h4>
                               <div className="text-xs text-gray-400">{log.date} • {log.duration} mins</div>
                           </div>
                       </div>
                       <div className="text-right">
                           <div className="text-emerald-400 font-bold text-xl">{log.caloriesBurned}</div>
                           <div className="text-[10px] text-gray-500 uppercase">Calories</div>
                       </div>
                   </div>
               ))}
               {workoutLogs.length === 0 && <div className="text-center text-gray-500 py-10">No workout history yet.</div>}
          </div>
      )}

    </div>
  );
};

export default Tracker;
