import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Award, AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const Drivers = () => {
  const { userRole, drivers, fetchDrivers, subscribeToAll, searchQuery, setSearchQuery, updateDriverRank, updateDriverField } = useFleetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    license_expiry: '',
    status: 'On Duty'
  });

  useEffect(() => {
    fetchDrivers();
    const unsubscribe = subscribeToAll();
    return () => unsubscribe();
  }, []);

  const handleAddDriver = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('drivers').insert([formData]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ name: '', license_expiry: '', status: 'On Duty' });
      fetchDrivers();
    } else {
      alert('Error registering driver: ' + error.message);
    }
    setLoading(false);
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <Layout title="Driver Management">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Operator Registry</h2>
            <p className="text-sm text-slate-500">Monitoring compliance and performance scores</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Driver
          </button>
        </div>

        {/* Global Search Feedback */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Enabled</div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers
            .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((driver) => (
              <motion.div
                key={driver.id}
                whileHover={{ y: -5 }}
                className="glass-card bg-white border-slate-100 p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-black text-xl border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-all">
                      {driver.name.charAt(0)}
                    </div>
                    <span className={`status-pill ${driver.status === 'On Duty' ? 'status-available' :
                      driver.status === 'Off Duty' ? 'bg-slate-100 text-slate-500' : 'status-retired'
                      }`}>
                      {driver.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">{driver.name}</h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rank:</span>
                    {userRole === 'Safety Officer' ? (
                      <select
                        value={driver.rank || 'Unassigned'}
                        onChange={(e) => updateDriverRank(driver.id, e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                      >
                        <option value="Unassigned">Unassigned</option>
                        <option value="Novice">Novice</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    ) : (
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{driver.rank || 'Unassigned'}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <Calendar size={14} /> License:
                    {userRole === 'Safety Officer' ? (
                      <input
                        type="date"
                        value={driver.license_expiry}
                        onChange={(e) => updateDriverField(driver.id, 'license_expiry', e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    ) : (
                      <span className={isExpired(driver.license_expiry) ? 'text-error-500' : 'text-slate-600'}>
                        {new Date(driver.license_expiry).toLocaleDateString()}
                      </span>
                    )}
                    {isExpired(driver.license_expiry) && (
                      <span className="bg-error-50 text-error-500 px-2 py-0.5 rounded text-[8px]">EXPIRED</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safety Score</span>
                        {userRole === 'Safety Officer' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number" min="0" max="100"
                              value={driver.safety_score ?? 90}
                              onChange={(e) => updateDriverField(driver.id, 'safety_score', parseInt(e.target.value) || 0)}
                              className="w-16 text-right text-sm font-black text-slate-900 bg-slate-50 border border-slate-200 rounded px-1 outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <span className="text-sm font-black text-slate-900">%</span>
                          </div>
                        ) : (
                          <span className="text-sm font-black text-slate-900">{driver.safety_score ?? 90}%</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-success-500" style={{ width: `${driver.safety_score ?? 90}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion Rate</span>
                        {userRole === 'Safety Officer' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number" min="0" max="100"
                              value={driver.completion_rate ?? 90}
                              onChange={(e) => updateDriverField(driver.id, 'completion_rate', parseInt(e.target.value) || 0)}
                              className="w-16 text-right text-sm font-black text-slate-900 bg-slate-50 border border-slate-200 rounded px-1 outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <span className="text-sm font-black text-slate-900">%</span>
                          </div>
                        ) : (
                          <span className="text-sm font-black text-slate-900">{driver.completion_rate ?? 90}%</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500" style={{ width: `${driver.completion_rate ?? 90}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  {userRole === 'Safety Officer' ? (
                    <button
                      onClick={() => updateDriverField(driver.id, 'elite_status', !(driver.elite_status ?? false))}
                      className={`flex items-center gap-2 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors ${driver.elite_status ? 'text-success-500 bg-success-50' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                    >
                      <Award size={14} /> {driver.elite_status ? 'Elite Status' : 'Mark as Elite'}
                    </button>
                  ) : (
                    driver.elite_status ? (
                      <div className="flex items-center gap-2 text-success-500 font-bold text-xs bg-success-50 px-3 py-1.5 rounded-lg">
                        <Award size={14} /> Elite Status
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-lg">
                        Standard Status
                      </div>
                    )
                  )}
                  <button className="text-slate-400 hover:text-primary-600 transition-colors">
                    <Plus className="rotate-45 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}

          {drivers.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 italic">
              <Users size={48} className="mb-4 text-slate-200" />
              No drivers registered yet.
            </div>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Register Driver</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <Plus className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">License Expiry Date</label>
                <input
                  required
                  type="date"
                  value={formData.license_expiry}
                  onChange={e => setFormData({ ...formData, license_expiry: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Initial Status</label>
                <select
                  required
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="p-4 bg-primary-50 border border-primary-500/20 text-primary-600 rounded-xl flex items-start gap-3">
                <CheckCircle2 size={20} className="shrink-0" />
                <p className="text-xs font-bold leading-normal">
                  Compliance check will be active immediately. Expired licenses automatically block driver assignment.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Register Operator'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Drivers;
