
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('account');
  
  // --- Wizard State ---
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // --- Account Data State (Mock) ---
  const [email, setEmail] = useState('alex.fitness@example.com');
  const [isPublic, setIsPublic] = useState(true);
  const [notifications, setNotifications] = useState({ daily: true, weekly: false, promo: false });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setUser({ ...user, [field]: value });
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Mock Export Data
  const handleExportData = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, notifications }, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "ironpulse_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  // Step Indicators for Wizard
  const StepIndicator = () => (
    <div className="flex justify-center items-center gap-2 mb-8">
      {[1, 2, 3, 4, 5].map((s) => (
        <div 
            key={s} 
            className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-gym-500' : 'w-2 bg-gym-700'}`}
        ></div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 pb-20">
      
      {/* Header & Tabs */}
      <div className="text-center mb-8">
         <h2 className="text-3xl font-extrabold text-white mb-6">Settings</h2>
         
         <div className="inline-flex bg-gym-800 p-1.5 rounded-xl border border-gym-700 shadow-lg">
             <button 
                onClick={() => setActiveTab('account')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                ${activeTab === 'account' ? 'bg-gym-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gym-700'}`}
             >
                 <i className="fas fa-id-card"></i> Account & Data
             </button>
             <button 
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                ${activeTab === 'profile' ? 'bg-gym-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gym-700'}`}
             >
                 <i className="fas fa-sliders-h"></i> Personalization
             </button>
         </div>
      </div>

      {activeTab === 'profile' ? (
        // ================= PERSONALIZATION WIZARD =================
        <div className="max-w-xl mx-auto animate-slide-in">
            <StepIndicator />

            <div className="bg-gym-800 rounded-2xl border border-gym-700 p-8 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">
                
                {/* Step 1: Identity */}
                {step === 1 && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gym-700">
                                <i className="fas fa-user-astronaut text-3xl text-gym-500"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Who are you?</h3>
                            <p className="text-sm text-gray-400">Basics first.</p>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Display Name</label>
                            <input 
                                type="text" 
                                value={user.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full bg-gym-900 border border-gym-700 text-white rounded-lg p-4 focus:border-gym-500 outline-none text-lg transition"
                                placeholder="e.g. Iron Arnold"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Age</label>
                            <input 
                                type="number" 
                                value={user.age}
                                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                                className="w-full bg-gym-900 border border-gym-700 text-white rounded-lg p-4 focus:border-gym-500 outline-none text-lg transition"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Body Stats */}
                {step === 2 && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gym-700">
                                <i className="fas fa-ruler-combined text-3xl text-blue-500"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Body Stats</h3>
                            <p className="text-sm text-gray-400">Used for calorie calculations.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Weight (kg)</label>
                                <input 
                                    type="number" 
                                    value={user.weight}
                                    onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                                    className="w-full bg-gym-900 border border-gym-700 text-white rounded-lg p-4 focus:border-blue-500 outline-none text-xl font-mono text-center transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Height (cm)</label>
                                <input 
                                    type="number" 
                                    value={user.height}
                                    onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                    className="w-full bg-gym-900 border border-gym-700 text-white rounded-lg p-4 focus:border-blue-500 outline-none text-xl font-mono text-center transition"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Experience */}
                {step === 3 && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gym-700">
                                <i className="fas fa-layer-group text-3xl text-purple-500"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Experience Level</h3>
                            <p className="text-sm text-gray-400">Help us adjust your difficulty.</p>
                        </div>
                        <div className="space-y-3">
                            {['beginner', 'intermediate', 'advanced'].map(l => (
                                <button
                                    key={l}
                                    onClick={() => handleChange('level', l)}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between group transition-all duration-300
                                    ${user.level === l 
                                        ? 'bg-gym-700 border-gym-500 shadow-lg' 
                                        : 'bg-gym-900 border-gym-700 hover:border-gray-500'}`}
                                >
                                    <span className="capitalize font-bold text-lg text-white">{l}</span>
                                    {user.level === l && <i className="fas fa-check-circle text-gym-500 text-xl"></i>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Goals */}
                {step === 4 && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gym-700">
                                <i className="fas fa-bullseye text-3xl text-red-500"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Primary Goal</h3>
                            <p className="text-sm text-gray-400">What are we aiming for?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['lose_weight', 'gain_muscle', 'maintain', 'endurance'].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => handleChange('goal', g)}
                                    className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300
                                    ${user.goal === g 
                                        ? 'bg-gym-700 border-red-500 shadow-lg transform scale-105' 
                                        : 'bg-gym-900 border-gym-700 hover:border-gray-500'}`}
                                >
                                    <i className={`text-3xl fas 
                                        ${g === 'lose_weight' ? 'fa-fire-alt' : 
                                        g === 'gain_muscle' ? 'fa-dumbbell' :
                                        g === 'maintain' ? 'fa-balance-scale' : 'fa-running'}
                                        ${user.goal === g ? 'text-white' : 'text-gray-500'}
                                    `}></i>
                                    <span className="capitalize font-bold text-sm text-white">{g.replace('_', ' ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Targets */}
                {step === 5 && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gym-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gym-700">
                                <i className="fas fa-sliders-h text-3xl text-yellow-500"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Fine Tuning</h3>
                            <p className="text-sm text-gray-400">Set your daily targets.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Daily Calories</span>
                                    <span className="text-yellow-500 font-bold">{user.targetDailyCalories} kcal</span>
                                </div>
                                <input 
                                    type="range" min="1200" max="4000" step="50"
                                    value={user.targetDailyCalories}
                                    onChange={(e) => handleChange('targetDailyCalories', parseInt(e.target.value))}
                                    className="w-full accent-yellow-500 h-2 bg-gym-900 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Target Weight</span>
                                    <span className="text-blue-500 font-bold">{user.targetWeight} kg</span>
                                </div>
                                <input 
                                    type="range" min="40" max="150" step="0.5"
                                    value={user.targetWeight}
                                    onChange={(e) => handleChange('targetWeight', parseFloat(e.target.value))}
                                    className="w-full accent-blue-500 h-2 bg-gym-900 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                <div className="bg-gym-900 p-2 rounded border border-gym-700 text-center">
                                    <label className="block text-[10px] text-emerald-400 font-bold uppercase">Protein</label>
                                    <input type="number" value={user.targetDailyProtein} onChange={(e) => handleChange('targetDailyProtein', parseInt(e.target.value))} className="w-full bg-transparent text-center text-white font-bold outline-none"/>
                                </div>
                                <div className="bg-gym-900 p-2 rounded border border-gym-700 text-center">
                                    <label className="block text-[10px] text-blue-400 font-bold uppercase">Carbs</label>
                                    <input type="number" value={user.targetDailyCarbs} onChange={(e) => handleChange('targetDailyCarbs', parseInt(e.target.value))} className="w-full bg-transparent text-center text-white font-bold outline-none"/>
                                </div>
                                <div className="bg-gym-900 p-2 rounded border border-gym-700 text-center">
                                    <label className="block text-[10px] text-rose-400 font-bold uppercase">Fat</label>
                                    <input type="number" value={user.targetDailyFat} onChange={(e) => handleChange('targetDailyFat', parseInt(e.target.value))} className="w-full bg-transparent text-center text-white font-bold outline-none"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between mt-8">
                <button 
                    onClick={prevStep} 
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2
                    ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-gym-800 text-gray-400 hover:text-white hover:bg-gym-700'}`}
                >
                    <i className="fas fa-arrow-left"></i> Back
                </button>

                {step < totalSteps ? (
                    <button 
                        onClick={nextStep}
                        className="px-8 py-3 bg-gym-500 hover:bg-gym-400 text-white rounded-xl font-bold shadow-lg shadow-gym-500/20 transition transform hover:scale-105 flex items-center gap-2"
                    >
                        Next <i className="fas fa-arrow-right"></i>
                    </button>
                ) : (
                    <button 
                        onClick={() => alert("Settings Saved!")}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition transform hover:scale-105 flex items-center gap-2"
                    >
                        Complete Profile <i className="fas fa-check"></i>
                    </button>
                )}
            </div>
        </div>
      ) : (
        // ================= ACCOUNT MANAGEMENT =================
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in max-w-4xl mx-auto">
            
            {/* 1. Account Details */}
            <div className="bg-gym-800 rounded-xl p-6 border border-gym-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-user-circle text-gym-500"></i> Account Details
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gym-900 border border-gym-600 flex items-center justify-center">
                            <i className="fas fa-user text-3xl text-gray-500"></i>
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center border border-gym-800 hover:bg-blue-400">
                            <i className="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                    <div>
                        <div className="text-white font-bold">{user.name}</div>
                        <div className="text-xs text-gray-400">Member since Oct 2023</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Email Address</label>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditingEmail}
                                className={`w-full bg-gym-900 border text-white rounded-lg p-3 outline-none transition
                                ${isEditingEmail ? 'border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-gym-700 opacity-70'}`}
                            />
                            <button 
                                onClick={() => setIsEditingEmail(!isEditingEmail)}
                                className="px-3 bg-gym-700 rounded-lg text-gray-300 hover:bg-gym-600 border border-gym-600"
                            >
                                <i className={`fas ${isEditingEmail ? 'fa-check text-emerald-400' : 'fa-pen'}`}></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <button className="text-blue-400 text-sm hover:text-blue-300 font-bold">
                            <i className="fas fa-key mr-2"></i> Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Preferences */}
            <div className="bg-gym-800 rounded-xl p-6 border border-gym-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-toggle-on text-purple-500"></i> Preferences
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-white">Public Profile</div>
                            <div className="text-xs text-gray-400">Visible on global leaderboards</div>
                        </div>
                        <button 
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isPublic ? 'bg-emerald-500' : 'bg-gym-900 border border-gym-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="h-px bg-gym-700"></div>

                    {deferredPrompt && (
                        <div className="flex items-center justify-between bg-gym-900 p-3 rounded-lg border border-gym-600">
                            <div>
                                <div className="text-sm font-bold text-white">Install App</div>
                                <div className="text-xs text-gray-400">Add to home screen for better performance</div>
                            </div>
                            <button 
                                onClick={handleInstallClick}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                            >
                                Install
                            </button>
                        </div>
                    )}

                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-3">Notifications</div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Daily Workout Reminders</span>
                                <input 
                                    type="checkbox" 
                                    checked={notifications.daily} 
                                    onChange={() => setNotifications({...notifications, daily: !notifications.daily})}
                                    className="accent-gym-500 w-4 h-4"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Weekly Progress Report</span>
                                <input 
                                    type="checkbox" 
                                    checked={notifications.weekly} 
                                    onChange={() => setNotifications({...notifications, weekly: !notifications.weekly})}
                                    className="accent-gym-500 w-4 h-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Data Management */}
            <div className="bg-gym-800 rounded-xl p-6 border border-gym-700">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-database text-blue-400"></i> Data Management
                </h3>
                <div className="space-y-3">
                    <button 
                        onClick={handleExportData}
                        className="w-full flex items-center justify-between p-3 bg-gym-900 border border-gym-600 rounded-lg hover:border-blue-500 group transition"
                    >
                        <span className="text-sm text-gray-300 group-hover:text-white">Export All Data (JSON)</span>
                        <i className="fas fa-download text-gray-500 group-hover:text-blue-400"></i>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gym-900 border border-gym-600 rounded-lg hover:border-yellow-500 group transition">
                        <span className="text-sm text-gray-300 group-hover:text-white">Clear Cached Images</span>
                        <i className="fas fa-eraser text-gray-500 group-hover:text-yellow-400"></i>
                    </button>
                </div>
            </div>

            {/* 4. Danger Zone */}
            <div className="bg-gym-800 rounded-xl p-6 border border-red-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i> Danger Zone
                </h3>
                <p className="text-xs text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                
                <button 
                    onClick={() => confirm("Are you sure you want to delete your account? This action cannot be undone.") && alert("Account deletion simulation started.")}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold rounded-lg border border-red-500/50 transition duration-300"
                >
                    Delete Account
                </button>
            </div>
            
            {/* Version Footer */}
            <div className="col-span-1 md:col-span-2 text-center mt-8 text-gray-600 text-xs font-mono">
                IronPulse AI v2.4.0 (Production Build) • © 2024
            </div>

        </div>
      )}
    </div>
  );
};

export default Settings;
