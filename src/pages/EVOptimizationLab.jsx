import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Map as MapIcon,
    Navigation,
    Battery,
    TrendingUp,
    AlertCircle,
    Download,
    Play,
    RefreshCw,
    Truck,
    MapPin
} from 'lucide-react';
import Layout from '../components/Layout';
import { useFleetStore } from '../store/useFleetStore';

const EVOptimizationLab = () => {
    const { vehicles, fetchVehicles } = useFleetStore();
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationData, setSimulationData] = useState(null);
    const [droppedVehicles, setDroppedVehicles] = useState([]);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const evVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes('ev') ||
        v.type === 'Electric' ||
        v.name.toLowerCase().includes('tesla') ||
        v.name.toLowerCase().includes('e-')
    );

    // Fallback if no specific EVs found
    const displayVehicles = evVehicles.length > 0 ? evVehicles : vehicles.slice(0, 5);

    const handleSimulate = () => {
        setIsSimulating(true);
        // Simulate VA-GAT / MILP calculation delay
        setTimeout(() => {
            const profit = (Math.random() * 5000 + 2000).toFixed(2);
            const energyCredits = (Math.random() * 800 + 200).toFixed(2);
            setSimulationData({
                energySavings: (Math.random() * 25 + 15).toFixed(1),
                costReduction: (Math.random() * 1000 + 500).toFixed(2),
                profit: profit,
                gridTrading: energyCredits,
                efficiencyGain: (Math.random() * 15 + 10).toFixed(1),
                riskLevel: Math.random() > 0.8 ? 'Moderate' : 'Low',
                dispatchStatus: 'Optimized',
                timestamp: new Date().toLocaleString()
            });
            setIsSimulating(false);
        }, 2000);
    };

    const handleExport = () => {
        if (!simulationData) return;

        const csvRows = [
            ['Metric', 'Optimization Result'],
            ['Projected Net Profit', `"$${simulationData.profit}"`],
            ['Grid Energy Trade Credits', `"$${simulationData.gridTrading}"`],
            ['Energy Consumption Savings', `"${simulationData.energySavings}%"`],
            ['Efficiency Delta (GAT)', `"+${simulationData.efficiencyGain}%"`],
            ['Simulated Emergency Dispatch', `"${simulationData.dispatchStatus}"`],
            ['Risk Assessment', `"${simulationData.riskLevel}"`]
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `MCF_Optimizer_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout title="AI Fleet Optimization Lab">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">

                {/* Main Map / Planning Area */}
                <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
                    <div className="glass-card bg-white border-slate-100 min-h-[360px] relative overflow-hidden rounded-2xl md:rounded-[2rem] shadow-xl border-2 border-primary-50">
                        {/* Map Placeholder Background */}
                        <div className="absolute inset-0 bg-slate-50 opacity-50 overflow-hidden">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}></div>
                            <div className="w-full h-full flex items-center justify-center">
                                <MapIcon className="w-64 h-64 md:w-96 md:h-96 text-slate-100 opacity-20" />
                            </div>
                        </div>

                        {/* Interactive Layer */}
                        <div className="relative z-10 p-4 md:p-8 h-full flex flex-col justify-between">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-6">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Navigation className="text-primary-600" size={22} />
                                        Dynamic Route Simulation
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Drag vehicles to optimize deployment zones</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        VA-GAT Live
                                    </div>
                                </div>
                            </div>

                            {/* Draggable Area */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pointer-events-none mb-4">
                                {displayVehicles.map((v, i) => (
                                    <motion.div
                                        key={v.id}
                                        drag
                                        dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
                                        whileDrag={{ scale: 1.05, zIndex: 50 }}
                                        className="pointer-events-auto h-28 md:h-32 bg-white rounded-xl md:rounded-2xl shadow-md border border-slate-100 p-3 md:p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing w-full"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                                                <Truck size={18} />
                                            </div>
                                            <div className="text-[9px] md:text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase">
                                                {Math.floor(Math.random() * 40 + 60)}% SOC
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-xs md:text-sm truncate">{v.name}</div>
                                            <div className="text-[9px] md:text-[10px] text-slate-400 font-medium uppercase tracking-wider">{v.plate}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Map Controls */}
                            <div className="flex justify-end gap-2">
                                <button className="p-2.5 bg-white shadow-md border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
                                    <RefreshCw size={18} />
                                </button>
                                <button className="p-2.5 bg-white shadow-md border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
                                    <MapPin size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Insights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                        <div className="glass-card bg-white border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                                <Battery size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Power</div>
                                <div className="text-lg md:text-xl font-bold text-slate-900">1.2 MW/h</div>
                            </div>
                        </div>
                        <div className="glass-card bg-white border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Potential</div>
                                <div className="text-lg md:text-xl font-bold text-slate-900">+18.5%</div>
                            </div>
                        </div>
                        <div className="glass-card bg-white border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</div>
                                <div className="text-lg md:text-xl font-bold text-slate-900">Minimal</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls & Simulation */}
                <div className="flex flex-col gap-4 md:gap-6 lg:col-span-2">
                    <div className="glass-card bg-white border-slate-100 flex-1 rounded-2xl md:rounded-[2rem] shadow-xl p-5 md:p-8 flex flex-col">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
                            <Zap className="text-primary-600" size={22} />
                            Simulation Engine
                        </h3>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Simulation Mode</label>
                                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-semibold">
                                    <option>Energy Efficiency Max</option>
                                    <option>Rapid Delivery Protocol</option>
                                    <option>Emergency Dispatch Sim</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vehicle Density</label>
                                <input type="range" className="w-full accent-primary-600" />
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                {!simulationData ? (
                                    <button
                                        onClick={handleSimulate}
                                        disabled={isSimulating}
                                        className="w-full btn-primary h-14 rounded-2xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-3 text-lg"
                                    >
                                        {isSimulating ? (
                                            <><RefreshCw className="animate-spin" size={20} /> Calculating...</>
                                        ) : (
                                            <><Play fill="currentColor" size={20} /> Run Simulation</>
                                        )}
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-bold">Projected Profit</span>
                                                <span className="text-xl font-bold text-emerald-600">${simulationData.profit}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-bold">Grid Trading Credits</span>
                                                <span className="text-lg font-bold text-blue-600">${simulationData.gridTrading}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                                <span className="text-xs text-slate-500 font-bold">VA-GAT Efficiency</span>
                                                <span className="text-lg font-bold text-indigo-600">+{simulationData.energySavings}%</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                                <span className="text-xs text-slate-500">Risk Assessment</span>
                                                <span className={`text-xs font-black uppercase px-2 py-1 rounded-full ${simulationData.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>{simulationData.riskLevel}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSimulationData(null)}
                                            className="w-full py-3 text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors"
                                        >
                                            Reset Parameters
                                        </button>

                                        <button
                                            onClick={handleExport}
                                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold transition-all"
                                        >
                                            <Download size={20} /> Export Lab Results
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-primary-50 text-primary-600 rounded-2xl border border-primary-100 text-xs text-center font-bold">
                            AI Recommendation: Deploy 3 more Tesla Semis in Zone A to maximize 23% energy trade credits.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EVOptimizationLab;
