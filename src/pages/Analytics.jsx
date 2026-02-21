import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useFleetStore } from '../store/useFleetStore';
import Layout from '../components/Layout';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Analytics = () => {
  const { vehicles, trips, expenses, fetchVehicles, fetchTrips, fetchExpenses } = useFleetStore();

  useEffect(() => {
    fetchVehicles();
    fetchTrips();
    fetchExpenses();
  }, []);

  // ROI Calculation
  const vehicleROI = vehicles.map(v => {
    const revenue = trips.filter(t => t.vehicle_id === v.id && t.status === 'Completed').reduce((sum, t) => sum + parseFloat(t.revenue || 0), 0);
    const cost = expenses.filter(e => e.vehicle_id === v.id).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const roi = v.acquisition_cost > 0 ? ((revenue - cost) / v.acquisition_cost) * 100 : 0;
    return { name: v.name, revenue, cost, roi: Math.round(roi) };
  }).filter(v => v.revenue > 0);

  const exportCSV = () => {
    const headers = ['Vehicle', 'Revenue', 'Cost', 'ROI %'];
    const rows = vehicleROI.map(v => [v.name, v.revenue, v.cost, `${v.roi}%`]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "fleet_roi_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("FleetFlow ROI Report", 14, 15);
    doc.autoTable({
      head: [['Vehicle', 'Revenue ($)', 'Operational Cost ($)', 'ROI (%)']],
      body: vehicleROI.map(v => [v.name, v.revenue.toLocaleString(), v.cost.toLocaleString(), `${v.roi}%`]),
      startY: 20,
    });
    doc.save("fleet_roi_report.pdf");
  };

  return (
    <Layout title="Analytics & Reports">
      <div className="space-y-10">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 bg-white border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Efficiency Rate</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <Activity className="text-primary-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">8.4 km/L</span>
                <p className="text-xs text-success-500 font-bold">+1.2% v. Prev Month</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 bg-white border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Total Net Profit</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
                <DollarSign className="text-success-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">
                  ${(trips.reduce((s, t) => s + parseFloat(t.revenue || 0), 0) - expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)).toLocaleString()}
                </span>
                <p className="text-xs text-success-500 font-bold">+18.5% v. Prev Month</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 bg-white border-slate-100 flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Reports & Archive</p>
              <p className="text-xs text-slate-500 mb-6">Extract operational data to CSV or PDF formats.</p>
              <div className="flex gap-3">
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-xl transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <Download size={14} /> CSV
                </button>
                <button
                  onClick={exportPDF}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20 uppercase tracking-wider"
                >
                  <Download size={14} /> PDF
                </button>
              </div>
            </div>
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={32} className="text-primary-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8 bg-white border-slate-100">
            <h3 className="font-bold text-slate-900 mb-8">Revenue vs. Expense Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vehicleROI}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                  <Area type="monotone" dataKey="cost" stroke="#ef4444" fillOpacity={0} borderDash="10 10" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8 bg-white border-slate-100">
            <h3 className="font-bold text-slate-900 mb-8">Vehicle ROI Analysis (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleROI}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="roi" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROI Table */}
        <div className="glass-card bg-white border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Vehicle ROI Breakdown</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-Time Aggregation</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Vehicle Name</th>
                  <th className="px-8 py-5">Total Revenue</th>
                  <th className="px-8 py-5">Operational Cost</th>
                  <th className="px-8 py-5 text-right">ROI %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vehicleROI.map((v) => (
                  <tr key={v.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">{v.name}</td>
                    <td className="px-8 py-6 text-slate-900 font-medium">${v.revenue.toLocaleString()}</td>
                    <td className="px-8 py-6 text-slate-500">${v.cost.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`font-black text-lg ${v.roi > 0 ? 'text-success-500' : 'text-error-500'}`}>
                        {v.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
