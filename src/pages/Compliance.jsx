import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    FileWarning,
    Clock,
    CheckCircle2,
    TrendingUp,
    Calendar,
    AlertTriangle
} from 'lucide-react';
import Layout from '../components/Layout';
import { useFleetStore } from '../store/useFleetStore';

const getDaysUntilExpiry = (dateStr) => {
    const expiry = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
};

const ExpiryPill = ({ days }) => {
    if (days < 0) return <span className="status-pill status-in-shop">Expired {Math.abs(days)}d ago</span>;
    if (days <= 30) return <span className="status-pill bg-warning-50 text-warning-600">Expires in {days}d</span>;
    return <span className="status-pill status-available">Valid — {days}d left</span>;
};

const Compliance = () => {
    const { drivers, fetchDrivers, subscribeToAll } = useFleetStore();

    useEffect(() => {
        fetchDrivers();
        const unsubscribe = subscribeToAll();
        return () => unsubscribe();
    }, []);

    const driversWithExpiry = drivers.map((d) => ({
        ...d,
        daysLeft: getDaysUntilExpiry(d.license_expiry),
    })).sort((a, b) => a.daysLeft - b.daysLeft);

    const expired = driversWithExpiry.filter((d) => d.daysLeft < 0).length;
    const expiringSoon = driversWithExpiry.filter((d) => d.daysLeft >= 0 && d.daysLeft <= 30).length;
    const compliant = driversWithExpiry.filter((d) => d.daysLeft > 30).length;
    const overallScore = drivers.length
        ? Math.round((compliant / drivers.length) * 100)
        : 100;

    const kpis = [
        {
            label: 'Compliance Score',
            value: overallScore,
            unit: '%',
            sub: 'Fleet-wide score',
            icon: <ShieldCheck className="text-success-600" />,
            color: 'bg-success-50',
            trend: overallScore >= 90 ? '+1.2%' : 'Needs attention',
        },
        {
            label: 'Expired Licenses',
            value: expired,
            sub: 'Urgent action needed',
            icon: <FileWarning className="text-error-600" />,
            color: 'bg-error-50',
            trend: expired === 0 ? 'Clear ✓' : `-${expired}`,
        },
        {
            label: 'Expiring Soon',
            value: expiringSoon,
            sub: 'Within 30 days',
            icon: <Clock className="text-warning-600" />,
            color: 'bg-warning-50',
            trend: expiringSoon === 0 ? 'None' : 'Schedule renewal',
        },
        {
            label: 'Fully Compliant',
            value: compliant,
            sub: 'Valid licenses (>30d)',
            icon: <CheckCircle2 className="text-primary-600" />,
            color: 'bg-primary-50',
            trend: `+${compliant}`,
        },
    ];

    return (
        <Layout title="Compliance">
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

                {/* Compliance Score Bar */}
                <div className="glass-card p-6 bg-white border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900">Overall Compliance Progress</h2>
                        <span className="text-2xl font-black text-slate-900">{overallScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${overallScore >= 90 ? 'bg-success-500' : overallScore >= 70 ? 'bg-warning-500' : 'bg-error-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${overallScore}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                        <span>0%</span>
                        <span className={overallScore >= 90 ? 'text-success-500 font-bold' : overallScore >= 70 ? 'text-warning-500 font-bold' : 'text-error-500 font-bold'}>
                            {overallScore >= 90 ? '✓ Excellent compliance' : overallScore >= 70 ? '⚠ Needs improvement' : '✗ Critical — action required'}
                        </span>
                        <span>100%</span>
                    </div>
                </div>

                {/* License Renewal Table */}
                <div className="glass-card overflow-hidden bg-white border-slate-100">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900">License Renewal Tracker</h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Sorted by most urgent — expired first</p>
                        </div>
                        {expired > 0 && (
                            <div className="flex items-center gap-2 text-error-500 font-bold text-sm bg-error-50 px-4 py-2 rounded-xl">
                                <AlertTriangle size={16} />
                                {expired} license{expired > 1 ? 's' : ''} expired
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Driver</th>
                                    <th className="px-6 py-4">Duty Status</th>
                                    <th className="px-6 py-4">License Expiry</th>
                                    <th className="px-6 py-4">Time Left</th>
                                    <th className="px-6 py-4">Compliance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {driversWithExpiry.map((driver, i) => (
                                    <motion.tr
                                        key={driver.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`hover:bg-slate-50 transition-colors ${driver.daysLeft < 0 ? 'bg-error-50/30' : driver.daysLeft <= 30 ? 'bg-warning-50/20' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm
                          ${driver.daysLeft < 0 ? 'bg-error-50 text-error-600' :
                                                        driver.daysLeft <= 30 ? 'bg-warning-50 text-warning-600' :
                                                            'bg-success-50 text-success-600'}`}>
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
                                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(driver.license_expiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ExpiryPill days={driver.daysLeft} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {driver.daysLeft < 0
                                                ? <span className="flex items-center gap-1.5 text-error-600 font-bold text-xs"><FileWarning size={14} />Action Required</span>
                                                : driver.daysLeft <= 30
                                                    ? <span className="flex items-center gap-1.5 text-warning-600 font-bold text-xs"><Clock size={14} />Schedule Renewal</span>
                                                    : <span className="flex items-center gap-1.5 text-success-600 font-bold text-xs"><CheckCircle2 size={14} />Compliant</span>
                                            }
                                        </td>
                                    </motion.tr>
                                ))}
                                {driversWithExpiry.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">
                                            <ShieldCheck size={40} className="mx-auto mb-3 text-slate-200" />
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

export default Compliance;
