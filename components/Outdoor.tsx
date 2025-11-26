
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getOutdoorRoute } from '../services/geminiService';

const Outdoor: React.FC = () => {
  // --- Weather State (Mocked) ---
  const [currentTemp, setCurrentTemp] = useState(22);
  const [condition, setCondition] = useState('Partly Cloudy');
  
  // --- Route Finder State ---
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState<'Running' | 'Cycling' | 'Walking' | 'Hiking'>('Running');
  const [distance, setDistance] = useState(5); // km
  const [preferences, setPreferences] = useState('');
  const [routeResult, setRouteResult] = useState<{ text: string, chunks: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Forecast Data
  const forecast = [
    { time: 'Now', temp: 22, icon: 'fa-cloud-sun' },
    { time: '14:00', temp: 24, icon: 'fa-sun' },
    { time: '16:00', temp: 23, icon: 'fa-sun' },
    { time: '18:00', temp: 20, icon: 'fa-cloud' },
    { time: '20:00', temp: 18, icon: 'fa-moon' },
  ];

  const handleRouteSearch = async () => {
    if (!location) return;
    setIsLoading(true);
    const result = await getOutdoorRoute(location, activity, `${distance}km`, preferences);
    setRouteResult(result);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in pb-10 space-y-6">
      
      {/* 1. Weather & Conditions Header */}
      <div className="bg-gradient-to-r from-blue-900 to-gym-900 rounded-2xl p-6 border border-blue-700/30 shadow-2xl relative overflow-hidden">
         {/* Background Animation */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             {/* Current Status */}
             <div className="flex items-center gap-6">
                 <div className="text-center">
                    <div className="text-6xl text-white mb-2"><i className={`fas ${condition === 'Sunny' ? 'fa-sun text-yellow-400' : 'fa-cloud-sun text-blue-300'}`}></i></div>
                    <div className="text-4xl font-bold text-white">{currentTemp}°</div>
                    <div className="text-sm text-blue-200">{condition}</div>
                 </div>
                 <div className="space-y-2 border-l border-blue-700/50 pl-6">
                     <div className="flex items-center gap-3 text-sm text-gray-300">
                         <i className="fas fa-wind w-5 text-center text-blue-400"></i> Wind: 12 km/h NW
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-300">
                         <i className="fas fa-tint w-5 text-center text-blue-400"></i> Humidity: 45%
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-300">
                         <i className="fas fa-sun w-5 text-center text-yellow-400"></i> UV Index: Moderate
                     </div>
                 </div>
             </div>

             {/* Hourly Forecast */}
             <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto">
                 {forecast.map((f, i) => (
                     <div key={i} className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10 min-w-[70px]">
                         <span className="text-xs text-gray-400 mb-2">{f.time}</span>
                         <i className={`fas ${f.icon} text-lg text-white mb-2`}></i>
                         <span className="text-sm font-bold text-white">{f.temp}°</span>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* 2. Route Finder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls */}
          <div className="bg-gym-800 rounded-xl p-6 border border-gym-700 h-fit">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-map-marked-alt text-gym-500"></i> Route Planner
              </h2>
              
              <div className="space-y-4">
                  {/* Activity Selector */}
                  <div className="grid grid-cols-2 gap-2">
                      {(['Running', 'Cycling', 'Walking', 'Hiking'] as const).map(act => (
                          <button
                            key={act}
                            onClick={() => setActivity(act)}
                            className={`p-3 rounded-lg text-sm font-bold flex flex-col items-center gap-1 border transition-all
                            ${activity === act 
                                ? 'bg-gym-600 text-white border-gym-500 shadow-md' 
                                : 'bg-gym-900 text-gray-400 border-gym-800 hover:border-gray-600'}`}
                          >
                              <i className={`fas ${act === 'Running' ? 'fa-running' : act === 'Cycling' ? 'fa-bicycle' : act === 'Walking' ? 'fa-walking' : 'fa-hiking'}`}></i>
                              {act}
                          </button>
                      ))}
                  </div>

                  {/* Inputs */}
                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Location</label>
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Central Park, NY" 
                        className="w-full bg-gym-900 border border-gym-700 text-white rounded-lg p-3 focus:border-gym-500 outline-none"
                      />
                  </div>

                   <div>
                      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-1">
                          <span>Distance</span>
                          <span className="text-gym-500">{distance} km</span>
                      </div>
                      <input 
                        type="range" min="1" max="50" step="0.5"
                        value={distance}
                        onChange={(e) => setDistance(parseFloat(e.target.value))}
                        className="w-full accent-gym-500 h-2 bg-gym-900 rounded-lg appearance-none cursor-pointer"
                      />
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Preferences</label>
                      <input 
                        type="text" 
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder="e.g. Flat, Scenic, Trail..." 
                        className="w-full bg-gym-900 border border-gym-700 text-white rounded-lg p-3 focus:border-gym-500 outline-none"
                      />
                  </div>

                  <button 
                    onClick={handleRouteSearch}
                    disabled={isLoading || !location}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all
                    ${isLoading || !location ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:-translate-y-1'}`}
                  >
                      {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-location-arrow"></i>}
                      Generate Route
                  </button>
              </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 bg-gym-800 rounded-xl border border-gym-700 overflow-hidden flex flex-col min-h-[500px]">
              
              {/* Map Placeholder Visualization */}
              <div className="h-48 bg-gym-900 relative overflow-hidden group">
                  {/* Pattern to simulate map */}
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#475569 2px, transparent 2px)', backgroundSize: '30px 30px'}}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gym-700 rotate-45"></div>
                  <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-300 font-mono">
                          {location ? `TARGET: ${location.toUpperCase()}` : 'AWAITING TARGET COORDINATES...'}
                      </div>
                  </div>
              </div>

              {/* AI Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                  {routeResult ? (
                      <div className="animate-slide-in">
                           <div className="flex items-center justify-between mb-4 border-b border-gym-700 pb-2">
                               <h3 className="font-bold text-white text-lg">Recommended Path</h3>
                               <div className="flex gap-2">
                                   <span className="text-xs bg-gym-700 px-2 py-1 rounded text-white">{activity}</span>
                                   <span className="text-xs bg-gym-700 px-2 py-1 rounded text-white">{distance}km</span>
                               </div>
                           </div>
                           
                           <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                               <ReactMarkdown>{routeResult.text}</ReactMarkdown>
                           </div>

                           {/* Google Maps Links (Grounding) */}
                           {routeResult.chunks.length > 0 && (
                               <div className="mt-6 space-y-3">
                                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Map Sources</h4>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                       {routeResult.chunks.map((chunk: any, idx: number) => (
                                           chunk.googleMapsMetadata && (
                                               <a 
                                                 key={idx} 
                                                 href={chunk.googleMapsMetadata.placeUrl} 
                                                 target="_blank" 
                                                 rel="noopener noreferrer"
                                                 className="flex items-center gap-3 p-3 bg-gym-900 border border-gym-600 rounded-lg hover:bg-gym-700 hover:border-gym-500 transition group"
                                               >
                                                   <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:text-white group-hover:bg-blue-500 transition">
                                                       <i className="fas fa-map-marker-alt"></i>
                                                   </div>
                                                   <div className="flex-1 min-w-0">
                                                       <div className="text-sm font-bold text-white truncate">{chunk.googleMapsMetadata.placeName || "View on Maps"}</div>
                                                       <div className="text-xs text-gray-500 truncate">Open in Google Maps</div>
                                                   </div>
                                                   <i className="fas fa-external-link-alt text-gray-600 group-hover:text-white"></i>
                                               </a>
                                           )
                                       ))}
                                   </div>
                               </div>
                           )}
                      </div>
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                          <i className="fas fa-route text-5xl mb-4"></i>
                          <p>Enter location preferences to generate a route.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Outdoor;
