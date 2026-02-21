import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Calendar, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Trips = () => {
  const { vehicles, drivers, trips, fetchVehicles, fetchDrivers, fetchTrips, subscribeToAll } = useFleetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    cargo_weight: '',
    revenue: '',
    status: 'Draft'
  });

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchTrips();
    const unsubscribe = subscribeToAll();
    return () => unsubscribe();
  }, []);

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d =>
    d.status === 'On Duty' && new Date(d.license_expiry) > new Date()
  );

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setValidationError('');
    setLoading(true);

    const vehicle = vehicles.find(v => v.id === formData.vehicle_id);

    // HARD VALIDATION RULE
    if (parseInt(formData.cargo_weight) > vehicle.max_load) {
      setValidationError(`Cargo weight (${formData.cargo_weight}kg) exceeds vehicle max load (${vehicle.max_load}kg)`);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('trips').insert([
      {
        ...formData,
        cargo_weight: parseInt(formData.cargo_weight),
        revenue: parseFloat(formData.revenue)
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ vehicle_id: '', driver_id: '', cargo_weight: '', revenue: '', status: 'Draft' });
      fetchTrips();
    } else {
      alert('Error creating trip: ' + error.message);
    }
    setLoading(false);
  };

  const updateTripStatus = async (trip, nextStatus) => {
    setLoading(true);

    // STATUS AUTOMATION LOGIC
    const { error } = await supabase.from('trips').update({ status: nextStatus }).eq('id', trip.id);

    if (!error) {
      if (nextStatus === 'Dispatched') {
        await supabase.from('vehicles').update({ status: 'On Trip' }).eq('id', trip.vehicle_id);
        // Driver stays 'On Duty' but could have a more specific 'Busy' status if needed
      } else if (nextStatus === 'Completed') {
        await supabase.from('vehicles').update({ status: 'Available' }).eq('id', trip.vehicle_id);
      }
      fetchTrips();
      fetchVehicles();
    }
    setLoading(false);
  };

  return (
    <Layout title="Trip Dispatcher">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Active Shipments</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Vehicle or Driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Create New Trip
            </button>
          </div>
        </div>

        {/* Trips Table */}
        <div className="glass-card bg-white border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Trip ID</th>
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Driver</th>
                  <th className="px-8 py-5">Cargo (kg)</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Revenue</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {trips
                  .filter(t =>
                    t.vehicles?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.vehicles?.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.drivers?.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-xs font-mono text-slate-400">#{trip.id.slice(0, 8)}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{trip.vehicles?.name}</div>
                        <div className="text-xs text-slate-500">{trip.vehicles?.plate}</div>
                      </td>
                      <td className="px-8 py-6 font-medium text-slate-600">{trip.drivers?.name}</td>
                      <td className="px-8 py-6 text-slate-500 font-bold">{trip.cargo_weight.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`status-pill ${trip.status === 'Dispatched' ? 'status-on-trip' :
                          trip.status === 'Completed' ? 'status-available' :
                            trip.status === 'Cancelled' ? 'status-retired' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-900">${trip.revenue?.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        {trip.status === 'Draft' && (
                          <button
                            onClick={() => updateTripStatus(trip, 'Dispatched')}
                            className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-all"
                          >
                            Dispatch
                          </button>
                        )}
                        {trip.status === 'Dispatched' && (
                          <button
                            onClick={() => updateTripStatus(trip, 'Completed')}
                            className="px-4 py-2 bg-success-500 text-white text-xs font-bold rounded-lg hover:bg-success-600 transition-all"
                          >
                            Complete
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

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Dispatch New Trip</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <Plus className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Vehicle (Available)</label>
                <select
                  required
                  value={formData.vehicle_id}
                  onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  <option value="">Select a vehicle...</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.plate}) - Max {v.max_load}kg</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Driver (On Duty)</label>
                <select
                  required
                  value={formData.driver_id}
                  onChange={e => setFormData({ ...formData, driver_id: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                  <option value="">{availableDrivers.length === 0 ? '⚠️ No active drivers found' : 'Select a driver...'}</option>
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {availableDrivers.length === 0 && (
                  <p className="text-[10px] text-error-500 font-bold mt-1">
                    Please register drivers in the "Driver Management" section first.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cargo Weight (kg)</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.cargo_weight}
                  onChange={e => setFormData({ ...formData, cargo_weight: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Estimated Revenue ($)</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 2400"
                  value={formData.revenue}
                  onChange={e => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              {validationError && (
                <div className="md:col-span-2 p-4 bg-error-50 border border-error-500/20 text-error-600 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span className="text-sm font-bold">{validationError}</span>
                </div>
              )}

              <div className="md:col-span-2 pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1 h-12"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 h-12 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Create Trip <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Trips;
