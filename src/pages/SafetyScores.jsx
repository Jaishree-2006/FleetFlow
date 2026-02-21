import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    AlertTriangle,
    Activity,
    TrendingUp,
    TrendingDown,
    Users,
    Zap,
    Flag
} from 'lucide-react';
import Layout from '../components/Layout';
import { useFleetStore } from '../store/useFleetStore';

// Deterministic "random" score based on driver id/name
const getSafetyScore = (driver) => {
    const seed = driver.name.charCodeAt(0) + driver.name.length;
    return 65 + (seed * 17 + 11) % 35; // 65–99
};
const getSpeedingEvents = (driver) => {
    const seed = driver.name.charCodeAt(1) || driver.name.charCodeAt(0);
    return (seed * 3) % 8;
};
const getIncidents = (driver) => {
    const seed = driver.name.charCodeAt(0);
    return seed % 3;
};

const ScoreBadge = ({ score }) => {
    if (score >= 85) return <span className="status-pill status-available">{score}%</span>;
    if (score >= 70) return <span className="status-pill bg-warning-50 text-warning-600">{score}%</span>;
    return <span className="status-pill status-in-shop">{score}%</span>;
};

const ScoreBar = ({ score }) => {
    const color = score >= 85 ? 'bg-success-500' : score >= 70 ? 'bg-warning-500' : 'bg-error-500';
    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

const SafetyScores = () => {
    const { drivers, fetchDrivers, subscribeToAll } = useFleetStore();

    useEffect(() => {
        fetchDrivers();
        const unsubscribe = subscribeToAll();
        return () => unsubscribe();
    }, []);

    const driversWithScores = drivers.map((d) => ({
        ...d,
        safetyScore: getSafetyScore(d),
        speedingEvents: getSpeedingEvents(d),
        incidents: getIncidents(d),
    })).sort((a, b) => a.safetyScore - b.safetyScore);

    const avgScore = driversWithScores.length
        ? Math.round(driversWithScores.reduce((s, d) => s + d.safetyScore, 0) / driversWithScores.length)
        : 0;
    const highRisk = driversWithScores.filter((d) => d.safetyScore < 70).length;
    const totalIncidents = driversWithScores.reduce((s, d) => s + d.incidents, 0);
    const compliant = driversWithScores.filter((d) => d.safetyScore >= 85).length;

    const kpis = [
        {
            label: 'Fleet Safety Score',
            value: avgScore,
            unit: '%',
            sub: 'Fleet-wide average',
            icon: <ShieldCheck className="text-success-600" />,
            color: 'bg-success-50',
            trend: '+1.2%',
        },
        {
            label: 'High Risk Drivers',
            value: highRisk,
            sub: 'Score below 70%',
            icon: <AlertTriangle className="text-error-600" />,
            color: 'bg-error-50',
            trend: highRisk === 0 ? 'Clear' : `${highRisk} flagged`,
        },
        {
            label: 'Total Incidents',
            value: totalIncidents,
            sub: 'All time reported',
            icon: <Flag className="text-warning-600" />,
            color: 'bg-warning-50',
            trend: 'Stable',
        },
        {
            label: 'Compliant Drivers',
            value: compliant,
            sub: 'Score ≥ 85%',
            icon: <Users className="text-primary-600" />,
            color: 'bg-primary-50',
            trend: `${drivers.length > 0 ? Math.round((compliant / drivers.length) * 100) : 0}%`,
        },
    ];

    return (
        <Layout title="Safety Scores">
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

                {/* Driver Safety Table */}
                <div className="glass-card overflow-hidden bg-white border-slate-100">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900">Driver Behavior Scores</h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Sorted by risk — lowest scores first</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-error-400 inline-block" />High Risk</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning-400 inline-block" />Moderate</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success-400 inline-block" />Safe</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Driver</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 w-48">Safety Score</th>
                                    <th className="px-6 py-4 text-center">Score</th>
                                    <th className="px-6 py-4 text-center">Speeding Events</th>
                                    <th className="px-6 py-4 text-center">Incidents</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {driversWithScores.map((driver, i) => (
                                    <motion.tr
                                        key={driver.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm
                          ${driver.safetyScore >= 85 ? 'bg-success-50 text-success-600' :
                                                        driver.safetyScore >= 70 ? 'bg-warning-50 text-warning-600' :
                                                            'bg-error-50 text-error-600'}`}>
                                                    {driver.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-900">{driver.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`status-pill ${driver.status === 'On Duty' ? 'status-available' :
                                                driver.status === 'Off Duty' ? 'bg-slate-100 text-slate-500' : 'status-in-shop'}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ScoreBar score={driver.safetyScore} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <ScoreBadge score={driver.safetyScore} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {driver.speedingEvents > 0
                                                    ? <><Zap size={13} className="text-warning-500" /><span className="font-bold text-warning-600">{driver.speedingEvents}</span></>
                                                    : <span className="text-slate-300 font-medium">—</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {driver.incidents > 0
                                                    ? <><AlertTriangle size={13} className="text-error-500" /><span className="font-bold text-error-600">{driver.incidents}</span></>
                                                    : <span className="text-slate-300 font-medium">—</span>
                                                }
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {driversWithScores.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-slate-400 italic">
                                            <Activity size={40} className="mx-auto mb-3 text-slate-200" />
                                            No drivers registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SafetyScores;
