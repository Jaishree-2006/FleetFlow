import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Wrench,
  Users,
  TrendingUp,
  Package,
  Activity,
  Search,
  Fuel,
  Box,
  Calendar,
  Clock,
  ShieldCheck,
  FileWarning,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { vehicles, trips, fetchVehicles, fetchTrips, subscribeToAll, searchQuery, userRole } = useFleetStore();
  const [filterType, setFilterType] = React.useState('All Vehicle Types');
  const [filterStatus, setFilterStatus] = React.useState('All Statuses');

  useEffect(() => {
    fetchVehicles();
    fetchTrips();
    const unsubscribe = subscribeToAll();
    return () => unsubscribe();
  }, []);

  const getKPIs = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const fleetTrend = vehicles.length > 0
      ? `+${Math.round((vehicles.filter(v => new Date(v.created_at) > lastWeek).length / vehicles.length) * 100)}%`
      : '0%';

    const tripTrend = trips.length > 0
      ? `+${Math.round((trips.filter(t => new Date(t.created_at) > lastWeek).length / trips.length) * 100)}%`
      : '0%';

    switch (userRole) {
      case 'Fleet Manager':
        return [
          { label: 'Total Fleet', value: vehicles.length, sub: 'Assets tracked', icon: <Truck className="text-primary-600" />, color: 'bg-primary-50', trend: fleetTrend },
          { label: 'Maintenance', value: vehicles.filter(v => v.status === 'In Shop').length, sub: 'Attention required', icon: <Wrench className="text-warning-600" />, color: 'bg-warning-50', trend: '-12%' },
          { label: 'Utilization', value: vehicles.length > 0 ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / vehicles.length) * 100) : 0, sub: 'Fleet activity %', icon: <Activity className="text-success-600" />, color: 'bg-success-50', unit: '%', trend: '+5.4%' },
          { label: 'Health Score', value: '94', sub: 'Average fleet health', icon: <ShieldCheck className="text-info-600" />, color: 'bg-info-50', unit: '%', trend: '+0.2%' },
        ];
      case 'Dispatcher':
        return [
          { label: 'Active Trips', value: trips.filter(t => t.status === 'In Progress').length, sub: 'Live deliveries', icon: <Package className="text-primary-600" />, color: 'bg-primary-50', trend: tripTrend },
          { label: 'Available Drivers', value: 12, sub: 'Ready for dispatch', icon: <Users className="text-success-600" />, color: 'bg-success-50', trend: '+2' },
          { label: 'Delayed', value: '2', sub: 'Check route status', icon: <Clock className="text-error-600" />, color: 'bg-error-50', trend: '-25%' },
          { label: 'Pending', value: trips.filter(t => t.status === 'Draft').length, sub: 'In pipeline', icon: <Package className="text-slate-600" />, color: 'bg-slate-50', trend: '+14%' },
        ];
      case 'Safety Officer':
        return [
          { label: 'Compliance', value: '98', sub: 'Fleet-wide score', icon: <ShieldCheck className="text-success-600" />, color: 'bg-success-50', unit: '%', trend: '+1.2%' },
          { label: 'Expired Licenses', value: '3', sub: 'Needs urgent action', icon: <FileWarning className="text-error-600" />, color: 'bg-error-50', trend: '-1' },
          { label: 'High Risk', value: '1', sub: 'Monitor driver behavior', icon: <AlertTriangle className="text-warning-600" />, color: 'bg-warning-50', trend: 'Stable' },
          { label: 'Incident Today', value: '0', sub: 'No reports filed', icon: <Activity className="text-slate-400" />, color: 'bg-slate-50', trend: '0%' },
        ];
      case 'Financial Analyst':
        return [
          { label: 'Fuel Spend', value: '12.4k', sub: 'This month (USD)', icon: <Fuel className="text-primary-600" />, color: 'bg-primary-50', unit: '$', trend: '-4.2%' },
          { label: 'Maint. ROI', value: '14.2', sub: 'Historical average', icon: <TrendingUp className="text-success-600" />, color: 'bg-success-50', unit: '%', trend: '+18%' },
          { label: 'Operational Cost', value: '45.2k', sub: 'Total overhead', icon: <Box className="text-info-600" />, color: 'bg-info-50', unit: '$', trend: '+2.1%' },
          { label: 'Cost/Vehicle', value: '850', sub: 'Average per asset', icon: <Truck className="text-slate-600" />, color: 'bg-slate-50', unit: '$', trend: '-6.5%' },
        ];
      default:
        return [
          { label: 'Active Fleet', value: vehicles.filter(v => v.status === 'On Trip').length, sub: 'Currently on mission', icon: <Truck className="text-primary-600" />, color: 'bg-primary-50', trend: fleetTrend },
          { label: 'Maintenance Alerts', value: vehicles.filter(v => v.status === 'In Shop').length, sub: 'Attention required', icon: <Wrench className="text-warning-600" />, color: 'bg-warning-50', trend: '-12%' },
          { label: 'Utilization', value: vehicles.length > 0 ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / vehicles.length) * 100) : 0, sub: 'Fleet activity %', icon: <Activity className="text-success-600" />, color: 'bg-success-50', unit: '%', trend: '+5.4%' },
          { label: 'Ready Cargo', value: trips.filter(t => t.status === 'Draft').length, sub: 'Ready for dispatch', icon: <Package className="text-slate-600" />, color: 'bg-slate-100', trend: '+14%' },
        ];
    }
  };

  const kpis = getKPIs();

  return (
    <Layout title="Command Center">
      <div className="space-y-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 bg-white border-slate-100 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(kpi.icon, { size: 24 })}
                </div>
                <div className={`flex items-center gap-1 font-bold text-sm ${kpi.trend.startsWith('+') ? 'text-success-500' : kpi.trend.startsWith('-') ? 'text-error-500' : 'text-slate-400'}`}>
                  {kpi.trend.startsWith('+') ? <TrendingUp size={16} /> : null}
                  <span>{kpi.trend}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-slate-500 font-medium text-sm">{kpi.label}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">{kpi.value}</span>
                  {kpi.unit && <span className="text-lg font-bold text-slate-400">{kpi.unit}</span>}
                </div>
                <p className="text-xs text-slate-400 font-medium">{kpi.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Filter Bar */}
        <div className="glass-card p-4 bg-white border-slate-100 flex flex-wrap gap-4 items-center shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Global Filters:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option>All Vehicle Types</option>
            <option>Trucks</option>
            <option>Vans</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option>All Statuses</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
          </select>
          <div className="flex-1" />
          <button
            onClick={() => { setFilterType('All Vehicle Types'); setFilterStatus('All Statuses'); }}
            className="h-10 px-6 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
          >
            Reset Filters
          </button>
        </div>

        {/* Overview Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <div className="glass-card overflow-hidden bg-white border-slate-100">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Trips</h2>
              <button className="text-sm font-bold text-primary-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {trips
                    .filter(t => {
                      const v = t.vehicles;
                      if (!v) return true;

                      const matchesStatus = filterStatus === 'All Statuses' || v.status === filterStatus;
                      const vehicleType = v.type || (v.name.toLowerCase().includes('van') || v.name.toLowerCase().includes('ford') ? 'Van' : 'Truck');
                      const matchesType = filterType === 'All Vehicle Types' || (filterType === 'Trucks' && vehicleType === 'Truck') || (filterType === 'Vans' && vehicleType === 'Van');
                      const matchesSearch = !searchQuery ||
                        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.drivers?.name?.toLowerCase().includes(searchQuery.toLowerCase());

                      return matchesStatus && matchesType && matchesSearch;
                    })
                    .slice(0, 5)
                    .map((trip) => (
                      <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{trip.vehicles?.name}</td>
                        <td className="px-6 py-4 text-slate-600">{trip.drivers?.name}</td>
                        <td className="px-6 py-4">
                          <span className={`status-pill ${trip.status === 'Dispatched' ? 'status-on-trip' :
                            trip.status === 'Completed' ? 'status-available' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">${trip.revenue}</td>
                      </tr>
                    ))}
                  {trips.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">No recent trips found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicles Needing Attention */}
          <div className="glass-card overflow-hidden bg-white border-slate-100">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Vehicles Needing Attention</h2>
              <AlertTriangle size={18} className="text-warning-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Issue</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {vehicles
                    .filter(v => {
                      const matchesBase = v.status === 'In Shop';
                      const vehicleType = v.type || (v.name.toLowerCase().includes('van') || v.name.toLowerCase().includes('ford') ? 'Van' : 'Truck');
                      const matchesType = filterType === 'All Vehicle Types' || (filterType === 'Trucks' && vehicleType === 'Truck') || (filterType === 'Vans' && vehicleType === 'Van');
                      const matchesSearch = !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase());

                      return matchesBase && matchesType && matchesSearch;
                    })
                    .map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{v.name}</td>
                        <td className="px-6 py-4 text-warning-600 font-medium">Scheduled Maintenance</td>
                        <td className="px-6 py-4">
                          <span className="status-pill status-in-shop">In Shop</span>
                        </td>
                      </tr>
                    ))}
                  {vehicles.filter(v => v.status === 'In Shop').length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-20 text-center text-slate-400 italic">All vehicles are healthy.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
