import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Trash2, Edit2, Loader2, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';

const Vehicles = () => {
  const { vehicles, fetchVehicles, subscribeToAll } = useFleetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterType, setFilterType] = useState('All Types');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    max_load: '',
    odometer: '',
    acquisition_cost: '',
    status: 'Available',
    type: 'Truck'
  });

  useEffect(() => {
    fetchVehicles();
    const unsubscribe = subscribeToAll();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Current Vehicles Data:', vehicles);
  }, [vehicles]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('vehicles').insert([
      { ...formData, max_load: parseInt(formData.max_load), odometer: parseInt(formData.odometer), acquisition_cost: parseFloat(formData.acquisition_cost) }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ name: '', plate: '', max_load: '', odometer: '', acquisition_cost: '', status: 'Available' });
      fetchVehicles(); // Manual refresh after insert
    } else {
      console.error('Error adding vehicle:', error);
      alert('Failed to register vehicle: ' + error.message);
    }
    setLoading(false);
  };

  // Derived State for Filtering
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.plate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All Status' || v.status === filterStatus;

    const vehicleType = v.type || (v.name.toLowerCase().includes('van') || v.name.toLowerCase().includes('ford') ? 'Van' : 'Truck');
    const matchesType = filterType === 'All Types' || (filterType === 'Trucks' && vehicleType === 'Truck') || (filterType === 'Vans' && vehicleType === 'Van');

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to retire this vehicle?')) {
      await supabase.from('vehicles').update({ status: 'Retired' }).eq('id', id);
    }
  };

  return (
    <Layout title="Vehicle Registry">
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 h-12 px-6 shadow-lg shadow-primary-500/20"
          >
            <Plus size={20} />
            Add New Vehicle
          </button>
        </div>

        {/* Filters Bar */}
        <div className="glass-card bg-white border-slate-100 p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Filters:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer min-w-[140px]"
          >
            <option>All Types</option>
            <option>Trucks</option>
            <option>Vans</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer min-w-[140px]"
          >
            <option>All Status</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
            <option>Retired</option>
          </select>
          <button
            onClick={() => { setFilterStatus('All Status'); setFilterType('All Types'); setSearchQuery(''); }}
            className="ml-auto text-xs font-bold text-primary-600 hover:text-primary-700 px-4 py-2 hover:bg-primary-50 rounded-lg transition-all"
          >
            Reset Filters
          </button>
        </div>

        {/* Vehicles Table */}
        <div className="glass-card bg-white border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Vehicle Name / Model</th>
                  <th className="px-8 py-5">License Plate</th>
                  <th className="px-8 py-5">Max Load (kg)</th>
                  <th className="px-8 py-5">Odometer (km)</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => {
                    const vehicleType = vehicle.type || (vehicle.name.toLowerCase().includes('van') || vehicle.name.toLowerCase().includes('ford') ? 'Van' : 'Truck');
                    return (
                      <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{vehicle.name}</div>
                          <div className="text-[10px] text-primary-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                            <Truck size={10} /> {vehicleType}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-slate-500 font-medium">{vehicle.plate}</td>
                        <td className="px-8 py-6 text-slate-500">{vehicle.max_load.toLocaleString()} kg</td>
                        <td className="px-8 py-6 text-slate-500">{vehicle.odometer.toLocaleString()} km</td>
                        <td className="px-8 py-6">
                          <span className={`status-pill ${vehicle.status === 'Available' ? 'status-available' :
                            vehicle.status === 'On Trip' ? 'status-on-trip' :
                              vehicle.status === 'In Shop' ? 'status-in-shop' : 'status-retired'
                            }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="p-2 text-slate-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {vehicles.length === 0 ? (
                          <>
                            <Truck className="w-12 h-12 text-slate-200" />
                            <p className="text-slate-400 italic">No vehicles found in your registry.</p>
                          </>
                        ) : (
                          <>
                            <Search className="w-12 h-12 text-slate-200" />
                            <p className="text-slate-400 italic">No vehicles match your search or filters.</p>
                            <button
                              onClick={() => { setFilterStatus('All Status'); setFilterType('All Types'); setSearchQuery(''); }}
                              className="text-primary-600 font-bold text-xs hover:underline"
                            >
                              Clear All Filters
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Add New Vehicle</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <Plus className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold text-slate-700">Vehicle Name / Model</label>
                  <input
                    required
                    placeholder="e.g. Scania R500"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Vehicle Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">License Plate</label>
                  <input
                    required
                    placeholder="ABC-1234"
                    value={formData.plate}
                    onChange={e => setFormData({ ...formData, plate: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Max Load (kg)</label>
                  <input
                    required
                    type="number"
                    placeholder="25000"
                    value={formData.max_load}
                    onChange={e => setFormData({ ...formData, max_load: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Current Odometer (km)</label>
                  <input
                    required
                    type="number"
                    placeholder="124500"
                    value={formData.odometer}
                    onChange={e => setFormData({ ...formData, odometer: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Acquisition Cost ($)</label>
                  <input
                    required
                    type="number"
                    placeholder="85000"
                    value={formData.acquisition_cost}
                    onChange={e => setFormData({ ...formData, acquisition_cost: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="col-span-2 pt-4 flex gap-4">
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
                    className="btn-primary flex-1 h-12"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Register Vehicle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )
      }
    </Layout >
  );
};

export default Vehicles;
