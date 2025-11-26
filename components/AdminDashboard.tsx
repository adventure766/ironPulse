
import React, { useState, useEffect } from 'react';
import { 
  fetchAppStats, fetchAdminUsers, fetchSystemLogs, fetchRevenueHistory 
} from '../services/firebaseService';
import { AppStats, AdminUser, SystemLog } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'system'>('overview');
  const [stats, setStats] = useState<AppStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State for Users
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [statsData, usersData, logsData, revData] = await Promise.all([
        fetchAppStats(),
        fetchAdminUsers(),
        fetchSystemLogs(),
        fetchRevenueHistory()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setLogs(logsData);
      setRevenueData(revData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleBanUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u));
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-white">
              <i className="fas fa-circle-notch fa-spin text-4xl text-gym-500 mb-4"></i>
              <p className="animate-pulse">Accessing Secure Mainframe...</p>
          </div>
      );
  }

  const StatCard = ({ title, value, icon, trend, trendVal }: any) => (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
                  <i className={`fas ${icon}`}></i>
              </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
              <span className={`flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <i className={`fas fa-arrow-${trend}`}></i> {trendVal}
              </span>
              <span className="text-gray-500">vs last month</span>
          </div>
      </div>
  );

  return (
    <div className="pb-12 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-slate-800/50 p-1 rounded-xl flex border border-slate-700">
              {(['overview', 'users', 'content', 'system'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all
                    ${activeTab === tab 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
          <div className="flex gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2">
                  <i className="fas fa-file-download"></i> Report
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                  <i className="fas fa-bell"></i>
              </button>
          </div>
      </div>

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === 'overview' && stats && (
          <div className="space-y-6 animate-slide-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon="fa-users" trend="up" trendVal="12%" />
                  <StatCard title="MRR Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="fa-dollar-sign" trend="up" trendVal="8.4%" />
                  <StatCard title="Active Subs" value={stats.premiumUsers.toLocaleString()} icon="fa-crown" trend="up" trendVal="5.2%" />
                  <StatCard title="Churn Rate" value={`${stats.churnRate}%`} icon="fa-chart-line" trend="down" trendVal="0.3%" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Area Chart */}
                  <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 h-[400px] flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-6">Revenue Overview</h3>
                      <div className="flex-1 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={revenueData}>
                                  <defs>
                                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                  <YAxis stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
                                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                                  />
                                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Expenses vs Profit Bar Chart */}
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-[400px] flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-6">Net Profit</h3>
                      <div className="flex-1 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={revenueData}>
                                  <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
                                  />
                                  <Bar dataKey="expenses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                                  <Bar dataKey="revenue" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex justify-center gap-6">
                          <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 bg-emerald-500 rounded"></div> Revenue</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 bg-red-500 rounded"></div> Expenses</div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* ================= USERS TAB ================= */}
      {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden animate-slide-in">
              <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="text-lg font-bold text-white">User Management</h3>
                  <div className="relative">
                      <i className="fas fa-search absolute left-3 top-3.5 text-gray-500"></i>
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:border-blue-500 outline-none w-64"
                      />
                  </div>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-900 text-gray-400 text-xs uppercase font-bold">
                          <tr>
                              <th className="p-4">User</th>
                              <th className="p-4">Role</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Subscription</th>
                              <th className="p-4">Last Active</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                          {users
                            .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                            .map((u) => (
                              <tr key={u.id} className="hover:bg-slate-700/50 transition">
                                  <td className="p-4 flex items-center gap-3">
                                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full border border-slate-600" />
                                      <div>
                                          <div className="font-bold text-white">{u.name}</div>
                                          <div className="text-xs text-gray-500">{u.email}</div>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold border
                                        ${u.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                                          u.role === 'Coach' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 
                                          'bg-slate-600/20 text-gray-400 border-slate-600'}`}>
                                          {u.role}
                                      </span>
                                  </td>
                                  <td className="p-4">
                                      <span className={`flex items-center gap-1.5 text-xs font-bold
                                        ${u.status === 'Active' ? 'text-emerald-400' :
                                          u.status === 'Banned' ? 'text-red-400' : 'text-yellow-400'}`}>
                                          <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : u.status === 'Banned' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                          {u.status}
                                      </span>
                                  </td>
                                  <td className="p-4 text-sm text-white">{u.subscription}</td>
                                  <td className="p-4 text-sm text-gray-400">{u.lastActive}</td>
                                  <td className="p-4 text-right space-x-2">
                                      <button className="text-gray-400 hover:text-white p-2 hover:bg-slate-700 rounded transition"><i className="fas fa-edit"></i></button>
                                      <button 
                                        onClick={() => handleBanUser(u.id)}
                                        className={`${u.status === 'Banned' ? 'text-emerald-400 hover:text-emerald-300' : 'text-red-400 hover:text-red-300'} p-2 hover:bg-slate-700 rounded transition`}
                                        title={u.status === 'Banned' ? 'Unban' : 'Ban'}
                                      >
                                          <i className={`fas ${u.status === 'Banned' ? 'fa-undo' : 'fa-ban'}`}></i>
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* ================= CONTENT TAB ================= */}
      {activeTab === 'content' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
               <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Workout Library CMS</h3>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow flex items-center gap-2">
                            <i className="fas fa-plus"></i> New Module
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {['Bench Press Masterclass', 'HIIT for Beginners', 'Advanced Yoga Flow', 'Keto Diet Guide'].map((item, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center group hover:border-blue-500 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition">
                                        <i className="fas fa-video"></i>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{item}</div>
                                        <div className="text-xs text-gray-500">Last updated: 2 days ago • Published</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition">
                                    <button className="p-2 text-gray-400 hover:text-white"><i className="fas fa-pencil-alt"></i></button>
                                    <button className="p-2 text-gray-400 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
               </div>

               <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Pending Approvals</h3>
                    <div className="space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                            <div className="text-yellow-500 font-bold text-sm mb-1">New Coach Application</div>
                            <div className="text-xs text-gray-400 mb-3">Submitted by Sarah Connor</div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold py-1.5 rounded">Review</button>
                                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-1.5 rounded">Dismiss</button>
                            </div>
                        </div>
                    </div>
               </div>
           </div>
      )}

      {/* ================= SYSTEM TAB ================= */}
      {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
              {/* Live Logs */}
              <div className="bg-black rounded-xl border border-slate-700 overflow-hidden flex flex-col h-[500px]">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-gray-400">System Logs (Live)</span>
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                  </div>
                  <div className="p-4 font-mono text-xs space-y-2 overflow-y-auto flex-1 text-gray-300">
                      {logs.map((log) => (
                          <div key={log.id} className="border-b border-slate-800/50 pb-1">
                              <span className="text-gray-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span> 
                              <span className={`mx-2 font-bold ${
                                  log.level === 'INFO' ? 'text-blue-400' : 
                                  log.level === 'WARN' ? 'text-yellow-400' : 'text-red-500'
                              }`}>{log.level}</span>
                              <span className="text-gray-400 uppercase tracking-wider mr-2 text-[10px] border border-slate-700 px-1 rounded">{log.module}</span>
                              <span className="text-gray-200">{log.message}</span>
                          </div>
                      ))}
                      <div className="animate-pulse text-gray-500 pt-2">_ Awaiting input...</div>
                  </div>
              </div>

              {/* Health Status */}
              <div className="space-y-6">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                      <h3 className="text-lg font-bold text-white mb-6">Server Health</h3>
                      <div className="space-y-6">
                          <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>CPU Usage</span>
                                  <span className="text-emerald-400 font-bold">24%</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-2">
                                  <div className="bg-emerald-500 h-2 rounded-full w-[24%]"></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Memory (RAM)</span>
                                  <span className="text-blue-400 font-bold">58%</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-2">
                                  <div className="bg-blue-500 h-2 rounded-full w-[58%]"></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Storage (SSD)</span>
                                  <span className="text-purple-400 font-bold">82%</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-2">
                                  <div className="bg-purple-500 h-2 rounded-full w-[82%]"></div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center h-[240px]">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                          <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                          <i className="fas fa-check text-4xl text-emerald-500"></i>
                      </div>
                      <h4 className="mt-4 text-white font-bold">All Systems Operational</h4>
                      <p className="text-xs text-gray-500">Uptime: 45 days, 12 hours</p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AdminDashboard;
