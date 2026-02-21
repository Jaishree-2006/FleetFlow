import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Users, BarChart3, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const roles = [
    {
        id: 'fleet_manager',
        title: 'Fleet Manager',
        description: 'Oversee vehicle health, asset lifecycle, and scheduling.',
        icon: <Truck className="w-6 h-6" />,
        color: 'bg-primary-50',
        textColor: 'text-primary-600',
        borderColor: 'border-primary-100',
        hoverColor: 'hover:border-primary-500'
    },
    {
        id: 'dispatcher',
        title: 'Dispatcher',
        description: 'Create trips, assign drivers, and validate cargo loads.',
        icon: <ArrowRight className="w-6 h-6" />,
        color: 'bg-success-50',
        textColor: 'text-success-600',
        borderColor: 'border-success-100',
        hoverColor: 'hover:border-success-500'
    },
    {
        id: 'safety_officer',
        title: 'Safety Officer',
        description: 'Monitor driver compliance and safety scores.',
        icon: <ShieldCheck className="w-6 h-6" />,
        color: 'bg-warning-50',
        textColor: 'text-warning-600',
        borderColor: 'border-warning-100',
        hoverColor: 'hover:border-warning-500'
    },
    {
        id: 'financial_analyst',
        title: 'Financial Analyst',
        description: 'Audit fuel spend, ROI, and operational costs.',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-slate-100',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-200',
        hoverColor: 'hover:border-slate-500'
    }
];

const RoleSelectionModal = ({ isOpen, onRoleSelected }) => {
    const handleSelect = async (role) => {
        const { data: { user } } = await supabase.auth.getUser();

        // In a real app we'd save to a 'profiles' table. 
        // For this demo, we'll store it in localStorage or just pass it up.
        // We'll simulate a profile update.
        localStorage.setItem(`role_${user.id}`, role.title);
        onRoleSelected(role.title);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-12"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                            Define Your Persona
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">
                            Welcome to the FleetFlow ecosystem. Select your primary responsibility to customize your command center experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleSelect(role)}
                                className={`flex items-start text-left p-6 bg-white border-2 ${role.borderColor} rounded-3xl ${role.hoverColor} transition-all group hover:shadow-xl hover:shadow-slate-200/50`}
                            >
                                <div className={`w-14 h-14 ${role.color} ${role.textColor} rounded-2xl flex items-center justify-center mr-6 shrink-0 group-hover:scale-110 transition-transform`}>
                                    {role.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{role.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{role.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 text-center text-slate-400 text-sm font-medium">
                        You can change your persona later in settings.
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RoleSelectionModal;
