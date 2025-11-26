
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (profile?: Partial<UserProfile>) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic Validation
    if (!email || !password) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
    }

    if (isRegistering) {
        if (!name) {
             setError("Display Name is required.");
             setLoading(false);
             return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }
    }

    // Simulate Network Request
    setTimeout(() => {
      setLoading(false);
      // Determine what data to pass back
      if (isRegistering) {
          // Pass new user profile data
          onLogin({ 
              name: name,
              // Default values for new user
              credits: 100,
              earnings: 0,
              level: 'beginner'
          });
      } else {
          // Login existing (mock)
          onLogin(); 
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gym-900 via-gym-900/90 to-transparent"></div>
        
        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md bg-gym-900/60 backdrop-blur-xl border border-gym-700 p-8 rounded-3xl shadow-2xl animate-fade-in">
            
            {/* Branding */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gym-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 animate-float">
                    <i className="fas fa-heartbeat text-white text-3xl"></i>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">IronPulse AI</h1>
                <p className="text-gray-400 text-sm">Elite Fitness Ecosystem</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 flex items-center gap-2 animate-slide-in">
                    <i className="fas fa-exclamation-circle"></i> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {isRegistering && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Display Name</label>
                        <div className="relative">
                            <i className="fas fa-user absolute left-4 top-3.5 text-gray-500"></i>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Iron Arnold"
                                className="w-full bg-gym-800/50 border border-gym-600 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                    <div className="relative">
                        <i className="fas fa-envelope absolute left-4 top-3.5 text-gray-500"></i>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-gym-800/50 border border-gym-600 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                    <div className="relative">
                        <i className="fas fa-lock absolute left-4 top-3.5 text-gray-500"></i>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-gym-800/50 border border-gym-600 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                {isRegistering && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm Password</label>
                        <div className="relative">
                            <i className="fas fa-check-double absolute left-4 top-3.5 text-gray-500"></i>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gym-800/50 border border-gym-600 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] mt-2
                    ${loading ? 'bg-gym-700 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'}`}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i>
                            {isRegistering ? 'Creating Account...' : 'Authenticating...'}
                        </>
                    ) : (
                        <>
                            {isRegistering ? 'Create Account' : 'Sign In'}
                            <i className={`fas ${isRegistering ? 'fa-user-plus' : 'fa-arrow-right'}`}></i>
                        </>
                    )}
                </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                    {isRegistering ? "Already have an account?" : "Don't have an account?"}
                    <button 
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        className="ml-2 text-emerald-400 font-bold hover:underline"
                    >
                        {isRegistering ? "Sign In" : "Register Now"}
                    </button>
                </p>
            </div>
            
            <div className="mt-8 text-[10px] text-gray-600 text-center font-mono">
                SECURE ENCRYPTED CONNECTION • V2.4.0
            </div>
        </div>
    </div>
  );
};

export default Auth;
