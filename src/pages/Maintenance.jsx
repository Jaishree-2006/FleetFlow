import React, { useState, useEffect } from 'react';
import { Plus, Wrench as ServiceIcon, Calendar, DollarSign, CheckCircle2, Loader2, AlertTriangle, Clock, Search } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const Maintenance = () => {
  const { vehicles, fetchVehicles, fetchExpenses, subscribeToAll } = useFleetStore();
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchVehicles();
    fetchLogs();
    const unsubscribe = subscribeToAll();
    return () => unsubscribe();
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*, vehicles(*)')
      .eq('type', 'Maintenance')
      .order('created_at', { ascending: false });
    setMaintenanceLogs(data || []);
  };

  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Add Expense
    const { error: expError } = await supabase.from('expenses').insert([
      {
        vehicle_id: formData.vehicle_id,
        type: 'Maintenance',
        amount: parseFloat(formData.amount),
        created_at: formData.date
      }
    ]);

    if (!expError) {
      // 2. AUTO LOGIC: Update Vehicle Status to 'In Shop'
      const { error: vehError } = await supabase.from('vehicles').update({ status: 'In Shop' }).eq('id', formData.vehicle_id);

      if (vehError) {
        alert('Maintenance logged, but failed to update vehicle status: ' + vehError.message);
      }

      setIsModalOpen(false);
      setFormData({ vehicle_id: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
      fetchVehicles();
      fetchLogs();
    } else {
      alert('Error logging maintenance: ' + expError.message);
    }
    setLoading(false);
  };

  const markCompleted = async (vehicleId) => {
    setLoading(true);
    // AUTO LOGIC: Set Vehicle Status back to 'Available'
    await supabase.from('vehicles').update({ status: 'Available' }).eq('id', vehicleId);
    fetchVehicles();
    fetchLogs();
    setLoading(false);
  };

  return (
    <Layout title="Maintenance Logs">
      <div className="space-y-8">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-50 rounded-xl flex items-center justify-center">
              <ServiceIcon className="text-warning-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vehicle Service & Repairs</h2>
              <p className="text-xs text-slate-500 font-medium">Automatic "In Shop" status management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10 w-48 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-warning-500 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Log Maintenance
            </button>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="glass-card bg-white border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Cost</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {maintenanceLogs
                  .filter(log =>
                    log.vehicles?.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900">{log.vehicles?.name}</td>
                      <td className="px-8 py-6 text-slate-500">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-slate-900 font-bold">${log.amount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`status-pill ${log.vehicles?.status === 'In Shop' ? 'status-in-shop' : 'status-available'
                          }`}>
                          {log.vehicles?.status === 'In Shop' ? 'Under Repair' : 'Functional'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {log.vehicles?.status === 'In Shop' && (
                          <button
                            onClick={() => markCompleted(log.vehicles.id)}
                            className="px-4 py-2 bg-success-500 text-white text-xs font-bold rounded-lg hover:bg-success-600 transition-all flex items-center gap-2 ml-auto"
                          >
                            <CheckCircle2 size={14} /> Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Maintenance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Record Maintenance</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <Plus className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddMaintenance} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 font-sans uppercase tracking-wider">Select Vehicle</label>
                <select
                  required
                  value={formData.vehicle_id}
                  onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  <option value="">Select a vehicle...</option>
                  {vehicles.filter(v => v.status !== 'Retired').map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 font-sans uppercase tracking-wider">Cost of Repair ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 font-sans uppercase tracking-wider">Service Date</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-500/20 text-warning-600 rounded-xl flex items-start gap-3">
                <AlertTriangle size={20} className="shrink-0" />
                <p className="text-xs font-bold leading-normal">
                  HEADS UP: This vehicle will be automatically moved to "In Shop" status and hidden from the dispatcher pool until marked as functional.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Log & Update Status'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Maintenance;
