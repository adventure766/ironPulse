
import React, { useState } from 'react';
import { Coach } from '../types';

const MOCK_COACHES: Coach[] = [
  {
    id: '1',
    name: 'Marcus "Titan" Ray',
    specialty: ['Bodybuilding', 'Strength'],
    rating: 4.9,
    reviews: 124,
    rate: 85,
    image: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&q=80&w=400',
    bio: 'Former Mr. Olympia competitor specializing in hypertrophy and contest prep. Let\'s build a legacy.',
    online: true,
    experience: '12 Years'
  },
  {
    id: '2',
    name: 'Elena Swift',
    specialty: ['HIIT', 'Cardio', 'Fat Loss'],
    rating: 4.8,
    reviews: 98,
    rate: 60,
    image: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?auto=format&fit=crop&q=80&w=400',
    bio: 'High energy interval training coach. I help you shred fat and boost endurance in record time.',
    online: false,
    experience: '6 Years'
  },
  {
    id: '3',
    name: 'Dr. Ken Chen',
    specialty: ['Rehab', 'Mobility', 'Yoga'],
    rating: 5.0,
    reviews: 210,
    rate: 120,
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    bio: 'Physical Therapist and Yoga Master. Fix your pain, improve your range of motion, and train longevity.',
    online: true,
    experience: '15 Years'
  },
  {
    id: '4',
    name: 'Sarah Power',
    specialty: ['Powerlifting', 'Strength'],
    rating: 4.7,
    reviews: 65,
    rate: 75,
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
    bio: 'State champion powerlifter. I focus on the big three: Squat, Bench, and Deadlift. Mechanics first.',
    online: true,
    experience: '8 Years'
  },
  {
    id: '5',
    name: 'Lisa Nutrition',
    specialty: ['Diet', 'Nutrition'],
    rating: 4.9,
    reviews: 312,
    rate: 90,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    bio: 'Certified Sports Nutritionist. Meal plans that don\'t suck. Fuel your performance properly.',
    online: false,
    experience: '10 Years'
  },
  {
    id: '6',
    name: 'Coach Carter',
    specialty: ['Basketball', 'Agility'],
    rating: 4.6,
    reviews: 45,
    rate: 55,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    bio: 'Focus on vertical jump, agility, and sports-specific conditioning. Get game ready.',
    online: true,
    experience: '5 Years'
  }
];

const Coaching: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Booking Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const filters = ['All', 'Bodybuilding', 'Cardio', 'Yoga', 'Strength', 'Diet'];

  const filteredCoaches = MOCK_COACHES.filter(coach => {
    const matchesFilter = filter === 'All' || coach.specialty.some(s => s.includes(filter) || (filter === 'Diet' && s === 'Nutrition'));
    const matchesSearch = coach.name.toLowerCase().includes(search.toLowerCase()) || coach.specialty.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
        setBookingSuccess(false);
        setSelectedCoach(null);
        setDate('');
        setTime('');
    }, 2500);
  };

  return (
    <div className="animate-fade-in pb-12">
      
      {/* 1. Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="w-full md:w-auto">
             <div className="bg-gradient-to-r from-emerald-900 to-gym-900 p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden mb-6 md:mb-0">
                <div className="absolute right-0 top-0 p-8 opacity-10">
                    <i className="fas fa-whistle text-8xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Expert Coaching</h2>
                <p className="text-gray-400 text-sm max-w-md relative z-10">
                    Connect with elite trainers for 1-on-1 sessions, plan reviews, and personalized guidance.
                </p>
             </div>
        </div>

        {/* Search & Filter */}
        <div className="flex-1 w-full md:w-auto flex flex-col gap-4">
             <div className="relative">
                 <i className="fas fa-search absolute left-4 top-3.5 text-gray-500"></i>
                 <input 
                    type="text" 
                    placeholder="Search by name or specialty..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gym-800 border border-gym-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition"
                 />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {filters.map(f => (
                     <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all
                        ${filter === f 
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                            : 'bg-gym-800 text-gray-400 border-gym-700 hover:border-gray-500'}`}
                     >
                         {f}
                     </button>
                 ))}
             </div>
        </div>
      </div>

      {/* 2. Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach, idx) => (
              <div 
                key={coach.id}
                className="group relative bg-gym-800 rounded-2xl border border-gym-700 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 animate-slide-in"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                  {/* Image Header */}
                  <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gym-900 to-transparent z-10 opacity-90"></div>
                      <img src={coach.image} alt={coach.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      
                      {/* Online Badge */}
                      <div className="absolute top-3 left-3 z-20">
                          {coach.online ? (
                              <div className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Online
                              </div>
                          ) : (
                             <div className="bg-gray-800/50 backdrop-blur-md border border-gray-600 text-gray-400 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                                 Offline
                             </div>
                          )}
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                          <i className="fas fa-star text-yellow-400 text-xs"></i>
                          <span className="text-white text-xs font-bold">{coach.rating}</span>
                          <span className="text-gray-400 text-[10px]">({coach.reviews})</span>
                      </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative z-20 -mt-12">
                      <div className="flex justify-between items-end mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">{coach.name}</h3>
                          <div className="text-right">
                              <span className="text-2xl font-bold text-white">${coach.rate}</span>
                              <span className="text-xs text-gray-400">/hr</span>
                          </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                          {coach.specialty.map((s, i) => (
                              <span key={i} className="text-[10px] uppercase font-bold text-gray-300 bg-gym-900 px-2 py-1 rounded border border-gym-700">
                                  {s}
                              </span>
                          ))}
                      </div>

                      <p className="text-sm text-gray-400 line-clamp-2 mb-6 h-10">
                          {coach.bio}
                      </p>

                      <div className="flex items-center justify-between border-t border-gym-700 pt-4">
                          <div className="text-xs text-gray-500 font-mono">
                              <i className="fas fa-briefcase mr-1"></i> {coach.experience} Exp
                          </div>
                          <button 
                            onClick={() => setSelectedCoach(coach)}
                            className="bg-white text-gym-900 hover:bg-emerald-400 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg transform active:scale-95"
                          >
                              Book Now
                          </button>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {filteredCoaches.length === 0 && (
          <div className="text-center py-20 text-gray-500">
              <i className="fas fa-user-slash text-4xl mb-4 opacity-50"></i>
              <p>No coaches found matching your criteria.</p>
          </div>
      )}

      {/* 3. Booking Modal */}
      {selectedCoach && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-gym-800 w-full max-w-md rounded-2xl border border-gym-600 shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                  
                  {/* Modal Header */}
                  <div className="relative h-32">
                      <img src={selectedCoach.image} alt="cover" className="w-full h-full object-cover opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gym-800"></div>
                      <button 
                        onClick={() => setSelectedCoach(null)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-red-500 transition flex items-center justify-center"
                      >
                          <i className="fas fa-times"></i>
                      </button>
                      <div className="absolute bottom-4 left-6">
                          <h3 className="text-2xl font-bold text-white">{selectedCoach.name}</h3>
                          <div className="text-emerald-400 text-sm font-bold">${selectedCoach.rate} / session</div>
                      </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                      {!bookingSuccess ? (
                          <form onSubmit={handleBook} className="space-y-4">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase">Select Date</label>
                                  <div className="relative">
                                     <input 
                                        type="date" 
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-gym-900 border border-gym-700 text-white rounded-xl p-3 outline-none focus:border-emerald-500 appearance-none"
                                     />
                                     <i className="fas fa-calendar absolute right-4 top-3.5 text-gray-500 pointer-events-none"></i>
                                  </div>
                              </div>
                              
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase">Available Time Slots</label>
                                  <div className="grid grid-cols-3 gap-2">
                                      {['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM', '08:00 PM'].map(t => (
                                          <button 
                                            key={t}
                                            type="button"
                                            onClick={() => setTime(t)}
                                            className={`py-2 rounded-lg text-xs font-bold border transition
                                            ${time === t 
                                                ? 'bg-emerald-600 text-white border-emerald-500' 
                                                : 'bg-gym-900 text-gray-400 border-gym-700 hover:border-gray-500'}`}
                                          >
                                              {t}
                                          </button>
                                      ))}
                                  </div>
                              </div>

                              <div className="bg-gym-900 p-4 rounded-xl border border-gym-700 mt-4">
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="text-gray-400">Session Rate</span>
                                      <span className="text-white">${selectedCoach.rate.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="text-gray-400">Service Fee</span>
                                      <span className="text-white">$5.00</span>
                                  </div>
                                  <div className="border-t border-gym-700 my-2 pt-2 flex justify-between font-bold text-white">
                                      <span>Total</span>
                                      <span className="text-emerald-400">${(selectedCoach.rate + 5).toFixed(2)}</span>
                                  </div>
                              </div>

                              <button 
                                type="submit"
                                disabled={!date || !time}
                                className={`w-full py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all mt-4
                                ${!date || !time 
                                    ? 'bg-gym-700 text-gray-500 cursor-not-allowed' 
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20 hover:-translate-y-1'}`}
                              >
                                  Confirm Booking <i className="fas fa-arrow-right"></i>
                              </button>
                          </form>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-8 animate-fade-in text-center">
                              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                  <i className="fas fa-check text-4xl text-emerald-500"></i>
                              </div>
                              <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                              <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                                  You are booked with {selectedCoach.name} on {date} at {time}. Check your email for the meeting link.
                              </p>
                              <div className="w-full bg-gym-900 rounded-full h-1.5 overflow-hidden max-w-[200px]">
                                  <div className="h-full bg-emerald-500 animate-[width_2.5s_linear_forwards]" style={{width: '0%'}}></div>
                              </div>
                              <style>{`
                                @keyframes width { to { width: 100%; } }
                              `}</style>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Coaching;
