import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutLog, DietLog, SleepData, WeightEntry } from './types';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import Tutorials from './components/Tutorials';
import AIAdvisor from './components/AIAdvisor';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import Wellness from './components/Wellness';
import Outdoor from './components/Outdoor';
import Coaching from './components/Coaching';
import CommunityChat from './components/CommunityChat';
import LiveClasses from './components/LiveClasses';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Initial Mock State (Used as default if no localStorage)
  const defaultUser: UserProfile = {
    name: 'Alex Fitness',
    age: 28,
    gender: 'male',
    weight: 78,
    height: 180,
    goal: 'gain_muscle',
    level: 'intermediate',
    
    // Body Comp
    bodyFat: 15,
    waist: 82,
    chest: 105,
    arms: 38,
    thighs: 58,

    // Targets
    targetWeight: 82, 
    targetWeeklyWorkouts: 5,
    targetDailyCalories: 2800,
    targetDailyProtein: 180,
    targetDailyCarbs: 300,
    targetDailyFat: 80,
    targetDailyFiber: 35,
    targetDailySteps: 10000,
    
    credits: 500,
    earnings: 1250
  };

  const [user, setUser] = useState<UserProfile>(defaultUser);

  // --- Persistence Logic ---
  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('ironpulse_user');
    const savedAuth = localStorage.getItem('ironpulse_auth');
    
    if (savedAuth === 'true' && savedUser) {
        try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        } catch (e) {
            console.error("Failed to parse saved user data");
        }
    }
  }, []);

  useEffect(() => {
    // Save user data whenever it changes if authenticated
    if (isAuthenticated) {
        localStorage.setItem('ironpulse_user', JSON.stringify(user));
        localStorage.setItem('ironpulse_auth', 'true');
    }
  }, [user, isAuthenticated]);

  // --- Mock Data ---
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([
    { id: '1', date: '2023-10-25', type: 'Strength', duration: 45, caloriesBurned: 320, intensity: 'High' },
    { id: '2', date: '2023-10-26', type: 'Cardio', duration: 30, caloriesBurned: 250, intensity: 'Moderate' },
    { id: '3', date: '2023-10-27', type: 'Strength', duration: 50, caloriesBurned: 350, intensity: 'Peak' },
  ]);

  const [dietLogs, setDietLogs] = useState<DietLog[]>([
     { id: '1', date: new Date().toISOString().split('T')[0], meal: 'Oatmeal', calories: 300, protein: 10, carbs: 45, fat: 5, fiber: 6 },
     { id: '2', date: new Date().toISOString().split('T')[0], meal: 'Chicken Salad', calories: 450, protein: 35, carbs: 12, fat: 20, fiber: 4 },
     { id: '3', date: '2023-10-26', meal: 'Protein Shake', calories: 150, protein: 25, carbs: 5, fat: 2, fiber: 1 },
  ]);

  const [sleepData] = useState<SleepData[]>([
      { date: '2023-10-21', hours: 7.2, score: 78, stages: { deep: 15, light: 55, rem: 20, awake: 10 } },
      { date: '2023-10-22', hours: 6.5, score: 65, stages: { deep: 10, light: 60, rem: 15, awake: 15 } },
      { date: '2023-10-23', hours: 8.0, score: 92, stages: { deep: 25, light: 45, rem: 25, awake: 5 } },
      { date: '2023-10-24', hours: 7.5, score: 85, stages: { deep: 20, light: 50, rem: 25, awake: 5 } },
      { date: '2023-10-25', hours: 7.8, score: 88, stages: { deep: 22, light: 48, rem: 25, awake: 5 } },
  ]);

  const [weightHistory] = useState<WeightEntry[]>([
      { date: '2023-09-01', weight: 76.5 },
      { date: '2023-09-15', weight: 77.0 },
      { date: '2023-10-01', weight: 77.5 },
      { date: '2023-10-15', weight: 77.8 },
      { date: '2023-10-25', weight: 78.0 },
  ]);

  const handleAuthSuccess = (profileData?: Partial<UserProfile>) => {
    if (profileData) {
        setUser(prev => ({ ...prev, ...profileData }));
    }
    setIsAuthenticated(true);
    // Persistence handled by useEffect
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('ironpulse_auth');
      // Optional: localStorage.removeItem('ironpulse_user'); // Keep user settings or clear them? Usually keep.
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard user={user} workoutLogs={workoutLogs} dietLogs={dietLogs} steps={8432} />;
      case 'tracker': return <Tracker addWorkout={(l) => setWorkoutLogs([...workoutLogs, l])} addMeal={(l) => setDietLogs([...dietLogs, l])} workoutLogs={workoutLogs} dietLogs={dietLogs} />;
      case 'tutorials': return <Tutorials />;
      case 'advisor': return <AIAdvisor user={user} />;
      case 'leaderboard': return <Leaderboard />;
      case 'wellness': return <Wellness user={user} sleepData={sleepData} weightHistory={weightHistory} />;
      case 'outdoor': return <Outdoor />;
      case 'coaching': return <Coaching />;
      case 'community': return <CommunityChat />;
      case 'live-classes': return <LiveClasses user={user} setUser={setUser} />;
      case 'settings': return <Settings user={user} setUser={setUser} />;
      default: return <Dashboard user={user} workoutLogs={workoutLogs} dietLogs={dietLogs} />;
    }
  };

  const NavItem = ({ id, icon, label }: { id: string, icon: string, label: string }) => (
    <button 
      onClick={() => setCurrentView(id)}
      className={`flex flex-col items-center justify-center p-3 w-full rounded-xl transition-all duration-300 ${currentView === id ? 'bg-gym-500 text-white shadow-lg shadow-gym-500/20 scale-105' : 'text-gray-400 hover:bg-gym-800 hover:text-gray-200'}`}
    >
      <i className={`fas ${icon} text-xl mb-1`}></i>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  if (!isAuthenticated) {
    return <Auth onLogin={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen flex text-gray-100 bg-gym-900 font-sans selection:bg-gym-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-24 bg-gym-900 border-r border-gym-800 fixed h-full z-20 overflow-y-auto scrollbar-hide">
        <div className="p-4 flex justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-gym-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <i className="fas fa-heartbeat text-white text-xl"></i>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 pb-4">
            <NavItem id="dashboard" icon="fa-chart-line" label="Dash" />
            <NavItem id="tracker" icon="fa-edit" label="Track" />
            <NavItem id="wellness" icon="fa-leaf" label="Health" />
            <NavItem id="outdoor" icon="fa-map-marked-alt" label="Outdoor" />
            <NavItem id="coaching" icon="fa-chalkboard-teacher" label="Coach" />
            <NavItem id="live-classes" icon="fa-broadcast-tower" label="Live" />
            <NavItem id="tutorials" icon="fa-dumbbell" label="Learn" />
            <NavItem id="advisor" icon="fa-robot" label="AI" />
            <NavItem id="community" icon="fa-comments" label="Chat" />
            <NavItem id="leaderboard" icon="fa-trophy" label="Rank" />
            <NavItem id="settings" icon="fa-cog" label="Set" />
            
            <button 
                onClick={handleLogout}
                className="mt-4 flex flex-col items-center justify-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
            >
                <i className="fas fa-sign-out-alt text-xl mb-1"></i>
                <span className="text-xs font-medium">Logout</span>
            </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gym-800 border-t border-gym-700 z-50 px-4 py-2 flex justify-between overflow-x-auto">
            <button onClick={() => setCurrentView('dashboard')} className={`p-2 ${currentView === 'dashboard' ? 'text-gym-500' : 'text-gray-400'}`}><i className="fas fa-chart-line text-lg"></i></button>
            <button onClick={() => setCurrentView('tracker')} className={`p-2 ${currentView === 'tracker' ? 'text-gym-500' : 'text-gray-400'}`}><i className="fas fa-edit text-lg"></i></button>
            <button onClick={() => setCurrentView('live-classes')} className={`p-2 ${currentView === 'live-classes' ? 'text-gym-500' : 'text-gray-400'}`}><i className="fas fa-broadcast-tower text-lg"></i></button>
            <button onClick={() => setCurrentView('community')} className={`p-2 ${currentView === 'community' ? 'text-gym-500' : 'text-gray-400'}`}><i className="fas fa-comments text-lg"></i></button>
            <button onClick={() => setCurrentView('advisor')} className={`p-2 ${currentView === 'advisor' ? 'text-gym-500' : 'text-gray-400'}`}><i className="fas fa-robot text-lg"></i></button>
            <button onClick={() => setCurrentView('leaderboard')} className={`p-2 ${currentView === 'leaderboard' ? 'text-gym-500' : 'text-gray-400'}`}><i className="fas fa-trophy text-lg"></i></button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-24 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full animate-fade-in">
         <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {currentView === 'wellness' ? 'Wellness Hub' : 
                 currentView === 'outdoor' ? 'Outdoor Activity' : 
                 currentView === 'coaching' ? 'Pro Coaching' :
                 currentView === 'community' ? 'Community Chat' :
                 currentView === 'live-classes' ? 'Live Studio' :
                 currentView.charAt(0).toUpperCase() + currentView.slice(1)}
              </h1>
              <p className="text-gray-400 text-sm">
                  {currentView === 'community' ? 'Connect with athletes worldwide' :
                   currentView === 'live-classes' ? 'Watch, Learn, and Earn' :
                   `Welcome back, ${user.name.split(' ')[0]}`}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-gym-700 border-gym-600">
               <i className="fas fa-user text-gym-400"></i>
            </div>
         </header>

         {renderView()}
      </main>
    </div>
  );
};

export default App;