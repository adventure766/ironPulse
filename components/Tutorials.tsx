
import React, { useState, useEffect } from 'react';
import { MuscleGroup, Exercise } from '../types';

// Enhanced Mock Data
const EXERCISE_DB: Exercise[] = [
  { 
    id: '1', name: 'Bench Press', muscleGroup: MuscleGroup.CHEST, difficulty: 'Intermediate', equipment: 'Barbell',
    description: 'The king of chest exercises. Builds raw power and size.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
    steps: ['Lie on bench', 'Grip bar shoulder width', 'Lower to chest', 'Press up explosively']
  },
  { 
    id: '2', name: 'Explosive Push Up', muscleGroup: MuscleGroup.CHEST, difficulty: 'Beginner', equipment: 'Bodyweight',
    description: 'Dynamic variation to build fast-twitch fibers.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1598971639058-211a73287138?auto=format&fit=crop&q=80&w=800',
    steps: ['Start in plank', 'Lower chest to floor', 'Push up hard enough to lift hands', 'Land softly']
  },
  { 
    id: '3', name: 'Pull Up', muscleGroup: MuscleGroup.BACK, difficulty: 'Advanced', equipment: 'Bodyweight',
    description: 'The ultimate upper body builder.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800',
    steps: ['Hang from bar', 'Engage lats', 'Pull chin over bar', 'Lower slowly']
  },
  { 
    id: '4', name: 'Deadlift', muscleGroup: MuscleGroup.BACK, difficulty: 'Advanced', equipment: 'Barbell',
    description: 'Full body compound movement for posterior chain.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    steps: ['Feet hip width', 'Grip bar outside legs', 'Keep back straight', 'Drive through heels']
  },
  { 
    id: '5', name: 'Barbell Squat', muscleGroup: MuscleGroup.LEGS, difficulty: 'Intermediate', equipment: 'Barbell',
    description: 'Essential for leg development and core strength.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
    steps: ['Bar on traps', 'Feet shoulder width', 'Sit back and down', 'Drive up']
  },
  { 
    id: '6', name: 'Walking Lunges', muscleGroup: MuscleGroup.LEGS, difficulty: 'Beginner', equipment: 'Bodyweight',
    description: 'Great for unilateral strength and balance.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=800',
    steps: ['Step forward', 'Lower back knee', 'Keep torso upright', 'Push through front heel']
  },
  { 
    id: '7', name: 'Bicep Curl', muscleGroup: MuscleGroup.ARMS, difficulty: 'Beginner', equipment: 'Dumbbell',
    description: 'Isolate the biceps for peak definition.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    steps: ['Hold dumbbells', 'Elbows by sides', 'Curl up', 'Squeeze at top']
  },
  { 
    id: '8', name: 'Tricep Dip', muscleGroup: MuscleGroup.ARMS, difficulty: 'Intermediate', equipment: 'Bodyweight',
    description: 'Target all three heads of the triceps.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    steps: ['Support on bars', 'Lower body', 'Keep elbows in', 'Press back up']
  },
  { 
    id: '9', name: 'Plank', muscleGroup: MuscleGroup.ABS, difficulty: 'Beginner', equipment: 'Bodyweight',
    description: 'Isometric core stability hold.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&q=80&w=800',
    steps: ['Forearms on floor', 'Body straight line', 'Engage glutes', 'Hold']
  },
  { 
    id: '10', name: 'Military Press', muscleGroup: MuscleGroup.SHOULDERS, difficulty: 'Intermediate', equipment: 'Barbell',
    description: 'Overhead strength and shoulder mass.', 
    videoPlaceholder: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    steps: ['Bar at shoulders', 'Press overhead', 'Head through at top', 'Lower control']
  },
];

// --- SKILL TREE DATA ---
const SKILL_TREES = [
    {
        id: 'calisthenics',
        title: 'Calisthenics Master',
        description: 'Master your bodyweight. From pushups to the planche.',
        nodes: [
            { id: '1', name: 'Push Up', status: 'unlocked', level: 1 },
            { id: '2', name: 'Diamond Push Up', status: 'locked', level: 2 },
            { id: '3', name: 'L-Sit', status: 'locked', level: 3 },
            { id: '4', name: 'Handstand', status: 'locked', level: 4 },
            { id: '5', name: 'Planche', status: 'locked', level: 5, isBoss: true }
        ]
    },
    {
        id: 'power',
        title: 'Powerlifting Pro',
        description: 'Build raw strength in the big three lifts.',
        nodes: [
            { id: '1', name: 'Goblet Squat', status: 'unlocked', level: 1 },
            { id: '2', name: 'Barbell Back Squat', status: 'locked', level: 2 },
            { id: '3', name: 'Deadlift Form', status: 'locked', level: 3 },
            { id: '4', name: 'Bench Press', status: 'locked', level: 4 },
            { id: '5', name: '1000lb Club', status: 'locked', level: 5, isBoss: true }
        ]
    }
];

// --- ANATOMY INFO ---
const MUSCLE_INTEL: Record<string, { func: string, risk: string, tip: string }> = {
    [MuscleGroup.CHEST]: { func: 'Pushing, Adduction', risk: 'Rotator Cuff strain', tip: 'Retract scapula during presses' },
    [MuscleGroup.BACK]: { func: 'Pulling, Extension', risk: 'Lower back rounding', tip: 'Lead with elbows, not hands' },
    [MuscleGroup.LEGS]: { func: 'Extension, Flexion', risk: 'Knee valgus (caving in)', tip: 'Drive knees outward during squats' },
    [MuscleGroup.ARMS]: { func: 'Flexion, Extension', risk: 'Tendonitis', tip: 'Control the eccentric (lowering) phase' },
    [MuscleGroup.SHOULDERS]: { func: 'Rotation, Elevation', risk: 'Impingement', tip: 'Avoid flaring elbows too wide' },
    [MuscleGroup.ABS]: { func: 'Stabilization, Flexion', risk: 'Neck strain', tip: 'Engage core, not hip flexors' },
};


const Tutorials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'mastery' | 'ai_form'>('library');
  
  // Library State
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<Exercise | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  
  // AI Form State
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Filter Logic
  const filteredExercises = EXERCISE_DB.filter(ex => {
    const matchMuscle = selectedMuscle ? ex.muscleGroup === selectedMuscle : true;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff = filterDifficulty === 'All' ? true : ex.difficulty === filterDifficulty;
    return matchMuscle && matchSearch && matchDiff;
  });

  const handleScan = () => {
      if (!selectedFile) return;
      setScanning(true);
      setScanResult(null);
      
      // Simulate analysis
      setTimeout(() => {
          setScanning(false);
          setScanResult({
              score: 87,
              issues: ['Knees slightly caving inward', 'Good back alignment'],
              correction: 'Focus on driving your knees out as you ascend from the squat.'
          });
      }, 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setSelectedFile(ev.target?.result as string);
              setScanResult(null);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  // --- SUB-COMPONENTS ---

  const VideoModal = ({ exercise, onClose }: { exercise: Exercise, onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-gym-800 w-full max-w-4xl rounded-2xl overflow-hidden border border-gym-600 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-red-500 transition flex items-center justify-center">
                <i className="fas fa-times"></i>
            </button>
            <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                <div className="w-full md:w-2/3 bg-black relative flex items-center justify-center group">
                     <img src={exercise.videoPlaceholder} alt={exercise.name} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gym-500/80 flex items-center justify-center text-white text-3xl pl-1 cursor-pointer hover:scale-110 hover:bg-gym-400 transition shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                            <i className="fas fa-play"></i>
                        </div>
                     </div>
                </div>
                <div className="w-full md:w-1/3 p-6 md:p-8 bg-gym-800 flex flex-col overflow-y-auto">
                    <h2 className="text-3xl font-bold text-white mb-2">{exercise.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-xs border border-gym-600 text-gym-400 px-2 py-1 rounded">{exercise.muscleGroup}</span>
                        <span className="text-xs border border-gym-600 text-blue-400 px-2 py-1 rounded">{exercise.equipment}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {exercise.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-gray-300">
                                <span className="w-6 h-6 rounded-full bg-gym-900 flex items-center justify-center text-gym-500 font-bold text-xs shrink-0 border border-gym-700">{idx + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-6 relative pb-10">
      {activeModal && <VideoModal exercise={activeModal} onClose={() => setActiveModal(null)} />}

      {/* TOP NAV TABS */}
      <div className="flex justify-center mb-4">
          <div className="bg-gym-800 p-1 rounded-xl border border-gym-700 shadow-lg flex">
              {(['library', 'mastery', 'ai_form'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                    ${activeTab === tab 
                        ? 'bg-gym-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-gym-700'}`}
                  >
                      {tab === 'library' && <i className="fas fa-book"></i>}
                      {tab === 'mastery' && <i className="fas fa-project-diagram"></i>}
                      {tab === 'ai_form' && <i className="fas fa-crosshairs"></i>}
                      <span className="capitalize">{tab.replace('_', ' ')}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* ==================== 1. LIBRARY VIEW ==================== */}
      {activeTab === 'library' && (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 animate-slide-in">
            {/* Holographic Body Scanner */}
            <div className="lg:w-1/3 bg-gym-900 rounded-2xl border border-gym-700 p-6 flex flex-col items-center relative overflow-hidden group min-h-[500px]">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>
                
                {selectedMuscle ? (
                    <div className="animate-fade-in w-full h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <button onClick={() => setSelectedMuscle(null)} className="text-gray-400 hover:text-white text-sm"><i className="fas fa-arrow-left"></i> Back to Scan</button>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-white">{selectedMuscle}</h3>
                                <div className="text-emerald-400 text-xs font-mono uppercase tracking-widest">Analysis Active</div>
                            </div>
                        </div>
                        
                        <div className="bg-gym-800/50 rounded-xl p-4 border border-gym-700 mb-6 backdrop-blur-sm relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                             <h4 className="text-sm font-bold text-white mb-2"><i className="fas fa-info-circle text-emerald-500 mr-2"></i>Primary Function</h4>
                             <p className="text-sm text-gray-300 mb-4">{MUSCLE_INTEL[selectedMuscle]?.func}</p>
                             
                             <h4 className="text-sm font-bold text-white mb-2"><i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>Injury Risk</h4>
                             <p className="text-sm text-gray-300 mb-4">{MUSCLE_INTEL[selectedMuscle]?.risk}</p>

                             <h4 className="text-sm font-bold text-white mb-2"><i className="fas fa-lightbulb text-blue-500 mr-2"></i>Pro Tip</h4>
                             <p className="text-sm text-gray-300 italic">"{MUSCLE_INTEL[selectedMuscle]?.tip}"</p>
                        </div>

                        <div className="mt-auto flex justify-center">
                            <i className="fas fa-fingerprint text-6xl text-emerald-500/20 animate-pulse"></i>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
                        <h3 className="text-xl font-bold text-white tracking-widest uppercase mb-6">System Ready</h3>
                        {/* SVG Body Map (Simplified for brevity, same as before but centered) */}
                        <div className="relative w-48 h-80 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <svg viewBox="0 0 200 400" className="w-full h-full">
                                {/* ... (SVG paths from previous iteration) ... */}
                                <g stroke="#334155" strokeWidth="1" fill="none">
                                    <path d="M100 20 L100 380" opacity="0.2" />
                                </g>
                                <path d="M60 60 Q100 60 140 60 L150 90 L50 90 Z" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.SHOULDERS)} />
                                <path d="M65 95 L135 95 L125 130 L75 130 Z" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.CHEST)} />
                                <rect x="80" y="135" width="40" height="50" rx="5" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.ABS)} />
                                <rect x="35" y="90" width="20" height="80" rx="5" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.ARMS)} />
                                <rect x="145" y="90" width="20" height="80" rx="5" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.ARMS)} />
                                <path d="M75 190 L95 190 L95 300 L80 300 Z" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.LEGS)} />
                                <path d="M105 190 L125 190 L120 300 L105 300 Z" fill="#1e293b" className="hover:fill-emerald-500 cursor-pointer transition" onClick={() => setSelectedMuscle(MuscleGroup.LEGS)} />
                            </svg>
                             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_15px_#10b981] animate-scan-down"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 animate-pulse">Select muscle group for intel</p>
                    </div>
                )}
            </div>

            {/* Exercise Grid */}
            <div className="lg:w-2/3 flex flex-col min-h-0">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                     <div className="relative w-full sm:w-64">
                        <i className="fas fa-search absolute left-3 top-3.5 text-gray-500 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Search exercises..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gym-800 border border-gym-700 rounded-xl pl-9 pr-4 py-2 text-white focus:border-gym-500 outline-none transition text-sm"
                        />
                     </div>
                     <div className="flex gap-2">
                        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                             <button 
                                key={lvl} onClick={() => setFilterDifficulty(lvl as any)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${filterDifficulty === lvl ? 'bg-gym-600 text-white border-gym-500' : 'bg-gym-900 text-gray-400 border-gym-800'}`}
                             >
                                 {lvl}
                             </button>
                        ))}
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-thin">
                     {filteredExercises.map((ex) => (
                         <div 
                            key={ex.id} 
                            onClick={() => setActiveModal(ex)}
                            className="group bg-gym-800 rounded-xl overflow-hidden border border-gym-700 hover:border-emerald-500 transition-all cursor-pointer relative hover:shadow-xl hover:shadow-emerald-900/20"
                         >
                             <div className="h-32 relative overflow-hidden">
                                 <img src={ex.videoPlaceholder} alt={ex.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500" />
                                 <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">{ex.difficulty}</div>
                             </div>
                             <div className="p-4">
                                 <h4 className="font-bold text-white text-md mb-1">{ex.name}</h4>
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                     <span><i className="fas fa-dumbbell text-gym-500"></i> {ex.equipment}</span>
                                     <span>•</span>
                                     <span>{ex.muscleGroup}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
      )}

      {/* ==================== 2. MASTERY PATHS (SKILL TREES) ==================== */}
      {activeTab === 'mastery' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-in">
              {SKILL_TREES.map(tree => (
                  <div key={tree.id} className="bg-gym-800 rounded-2xl border border-gym-700 p-6 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h3 className="text-xl font-bold text-white">{tree.title}</h3>
                              <p className="text-sm text-gray-400">{tree.description}</p>
                          </div>
                          <div className="bg-gym-900 p-2 rounded-lg border border-gym-700">
                              <i className="fas fa-trophy text-yellow-500"></i>
                          </div>
                      </div>

                      {/* Tree Visualization */}
                      <div className="relative pl-8 space-y-8 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gym-700">
                          {tree.nodes.map((node, index) => (
                              <div key={node.id} className="relative group">
                                  {/* Node Dot */}
                                  <div className={`absolute -left-[23px] top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 z-10
                                    ${node.status === 'unlocked' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-gym-900 border-gray-600'}`}>
                                  </div>
                                  
                                  {/* Card */}
                                  <div className={`p-4 rounded-xl border transition-all flex justify-between items-center
                                    ${node.status === 'unlocked' 
                                        ? 'bg-gym-700/50 border-emerald-500/30 text-white' 
                                        : 'bg-gym-900/50 border-gym-700 text-gray-500 opacity-70'}`}>
                                      <div>
                                          <div className="text-xs font-bold uppercase mb-1 opacity-70">Level {node.level}</div>
                                          <div className="font-bold text-lg flex items-center gap-2">
                                              {node.name}
                                              {node.isBoss && <i className="fas fa-skull text-red-500"></i>}
                                          </div>
                                      </div>
                                      <div className="text-2xl">
                                          {node.status === 'unlocked' ? <i className="fas fa-check-circle text-emerald-500"></i> : <i className="fas fa-lock"></i>}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* ==================== 3. AI FORM GUARD ==================== */}
      {activeTab === 'ai_form' && (
          <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px] animate-slide-in">
              
              {/* Visualizer */}
              <div className="lg:w-2/3 bg-black rounded-2xl border border-gym-700 relative overflow-hidden flex items-center justify-center group">
                   
                   {!selectedFile ? (
                       <div className="text-center p-8">
                           <div className="w-20 h-20 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gym-700 group-hover:border-emerald-500 transition shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                               <i className="fas fa-video text-3xl text-gray-500 group-hover:text-emerald-500 transition"></i>
                           </div>
                           <h3 className="text-xl font-bold text-white mb-2">Upload Workout Footage</h3>
                           <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">AI will analyze your biomechanics, identify joint misalignment, and provide safety scoring.</p>
                           
                           <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition inline-block">
                               <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                               Select File
                           </label>
                       </div>
                   ) : (
                       <div className="relative w-full h-full bg-gym-900">
                           <img src={selectedFile} alt="analysis" className="w-full h-full object-contain opacity-60" />
                           
                           {/* Scanning Overlay */}
                           {scanning && (
                               <>
                                   <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_#10b981] animate-scan-down z-20"></div>
                                   <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
                                       {[...Array(20)].map((_, i) => (
                                           <div key={i} className="border border-emerald-500/10"></div>
                                       ))}
                                   </div>
                                   <div className="absolute top-4 left-4 bg-black/70 backdrop-blur text-emerald-400 font-mono text-xs px-2 py-1 rounded border border-emerald-500/30">
                                       <span className="animate-pulse">●</span> TRACKING SKELETON...
                                   </div>
                               </>
                           )}

                           {/* Result Overlay */}
                           {scanResult && !scanning && (
                               <div className="absolute inset-0 pointer-events-none">
                                   {/* Mock Skeleton Points */}
                                   <div className="absolute top-[30%] left-[50%] w-3 h-3 bg-emerald-500 rounded-full animate-ping-slow"></div>
                                   <div className="absolute top-[45%] left-[48%] w-3 h-3 bg-emerald-500 rounded-full"></div>
                                   <div className="absolute top-[45%] left-[52%] w-3 h-3 bg-emerald-500 rounded-full"></div>
                                   <div className="absolute top-[70%] left-[45%] w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_red] animate-pulse"></div>
                                   
                                   {/* Connecting Lines (Mock) */}
                                   <svg className="absolute inset-0 w-full h-full">
                                       <line x1="50%" y1="30%" x2="48%" y2="45%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
                                       <line x1="50%" y1="30%" x2="52%" y2="45%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
                                       <line x1="48%" y1="45%" x2="45%" y2="70%" stroke="#ef4444" strokeWidth="2" />
                                   </svg>
                               </div>
                           )}
                       </div>
                   )}
              </div>

              {/* Controls / Results Panel */}
              <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-gym-800 rounded-2xl border border-gym-700 p-6 flex-1 flex flex-col">
                       <h3 className="text-lg font-bold text-white mb-4 border-b border-gym-700 pb-2">Analysis Report</h3>
                       
                       {scanning ? (
                           <div className="flex-1 flex flex-col items-center justify-center text-emerald-500 gap-4">
                               <i className="fas fa-circle-notch fa-spin text-4xl"></i>
                               <div className="font-mono text-sm">PROCESSING BIOMECHANICS...</div>
                           </div>
                       ) : scanResult ? (
                           <div className="space-y-6 animate-fade-in">
                               <div className="flex items-center justify-between">
                                   <span className="text-gray-400 text-sm">Safety Score</span>
                                   <span className={`text-3xl font-bold ${scanResult.score > 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>{scanResult.score}%</span>
                               </div>
                               
                               <div>
                                   <div className="text-xs font-bold text-red-400 uppercase mb-2">Detected Issues</div>
                                   <ul className="space-y-2">
                                       {scanResult.issues.map((issue: string, idx: number) => (
                                           <li key={idx} className="flex gap-2 text-sm text-gray-300 bg-red-900/20 p-2 rounded border border-red-900/50">
                                               <i className="fas fa-times-circle text-red-500 mt-0.5"></i> {issue}
                                           </li>
                                       ))}
                                   </ul>
                               </div>

                               <div>
                                   <div className="text-xs font-bold text-blue-400 uppercase mb-2">AI Correction</div>
                                   <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-900/50 text-sm text-blue-100 italic">
                                       "{scanResult.correction}"
                                   </div>
                               </div>
                               
                               <button onClick={() => { setSelectedFile(null); setScanResult(null); }} className="w-full py-3 bg-gym-700 hover:bg-gym-600 text-white font-bold rounded-xl transition">
                                   New Scan
                               </button>
                           </div>
                       ) : (
                           <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm text-center">
                               <p>Upload a video to see detailed breakdown.</p>
                           </div>
                       )}

                       {selectedFile && !scanResult && !scanning && (
                           <button onClick={handleScan} className="w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                               <i className="fas fa-microchip"></i> Run AI Diagnostics
                           </button>
                       )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Tutorials;
