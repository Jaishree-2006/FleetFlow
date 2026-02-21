import React, { useState, useEffect } from 'react';
import { Plus, Fuel, DollarSign, Loader2, TrendingDown, ArrowUpRight, Search } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const Expenses = () => {
  const { vehicles, fetchVehicles, fetchExpenses, subscribeToAll } = useFleetStore();
  const [expenseLogs, setExpenseLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    vehicle_id: '',
    liters: '',
    price_per_liter: '',
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
      .order('created_at', { ascending: false });
    setExpenseLogs(data || []);
  };

  const handleAddFuel = async (e) => {
    e.preventDefault();
    setLoading(true);

    const amount = parseFloat(formData.liters) * parseFloat(formData.price_per_liter);

    const { error } = await supabase.from('expenses').insert([
      {
        vehicle_id: formData.vehicle_id,
        type: 'Fuel',
        liters: parseFloat(formData.liters),
        amount: amount,
        created_at: formData.date
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ vehicle_id: '', liters: '', price_per_liter: '', date: new Date().toISOString().split('T')[0] });
      fetchExpenses(); // Manual refresh (Zustand store fetch)
      fetchLogs();     // Local fetchLogs call
    } else {
      alert('Error logging fuel: ' + error.message);
    }
    setLoading(false);
  };

  // Calculations for Summary
  const vehicleStats = vehicles.map(v => {
    const total = expenseLogs
      .filter(e => e.vehicle_id === v.id)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    return { name: v.name, total };
  }).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

  return (
    <Layout title="Expenses & Fuel">
      <div className="space-y-10">
        {/* Header Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-8 bg-white border-slate-100 col-span-2 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Operational Cost</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">
                  ${expenseLogs.reduce((sum, e) => sum + parseFloat(e.amount), 0).toLocaleString()}
                </span>
                <span className="text-success-500 font-bold flex items-center gap-1 text-sm bg-success-50 px-2 py-0.5 rounded-full">
                  <TrendingDown size={14} /> 12%
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-4 font-medium italic">Aggregated from all logged fuel and maintenance entries.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary h-14 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary-500/10"
            >
              <Plus size={24} /> Log Fuel Entry
            </button>
          </div>

          <div className="glass-card p-6 bg-slate-900 text-white border-none">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Spending Vehicle</h3>
            {vehicleStats[0] ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{vehicleStats[0].name}</span>
                  <span className="text-2xl font-black text-primary-400">${vehicleStats[0].total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-[85%]" />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic">No data yet.</p>
            )}
          </div>
        </div>

        {/* Expense History */}
        <div className="glass-card bg-white border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-bold text-slate-900">Expense History</h2>
            <div className="flex flex-col sm:flex-row border border-slate-100 rounded-xl overflow-hidden p-1 gap-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-9 w-full sm:w-48 bg-slate-50 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="status-pill status-available cursor-pointer">Fuel</span>
              <span className="status-pill status-in-shop cursor-pointer">Maintenance</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Details</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenseLogs
                  .filter(e =>
                    e.vehicles?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.type.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900">{log.vehicles?.name}</td>
                      <td className="px-8 py-6">
                        <span className={`status-pill ${log.type === 'Fuel' ? 'status-available' : 'status-in-shop'}`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-slate-500">
                        {log.type === 'Fuel' ? `${log.liters} Liters` : 'Maintenance Service'}
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900">${log.amount.toLocaleString()}</td>
                      <td className="px-8 py-6 text-slate-400 text-xs font-medium">
                        {new Date(log.created_at).toDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fuel Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">New Fuel Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <Plus className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddFuel} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Vehicle</label>
                <select
                  required
                  value={formData.vehicle_id}
                  onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select a vehicle...</option>
                  {vehicles.filter(v => v.status !== 'Retired').map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Liters</label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    value={formData.liters}
                    onChange={e => setFormData({ ...formData, liters: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">$/Liter</label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    value={formData.price_per_liter}
                    onChange={e => setFormData({ ...formData, price_per_liter: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Calculated Total</p>
                <p className="text-3xl font-black text-slate-900">
                  ${(parseFloat(formData.liters || 0) * parseFloat(formData.price_per_liter || 0)).toFixed(2)}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Log Entry'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Expenses;
