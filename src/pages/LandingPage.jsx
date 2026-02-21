import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Hammer, BarChart3, ArrowRight, Menu, X } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const LandingPage = ({ onLoginClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        {
            title: 'Real-Time Fleet Tracking',
            description: 'Monitor every vehicle and driver in real-time with precise status updates.',
            icon: <Truck className="w-6 h-6 text-primary-500" />,
        },
        {
            title: 'Maintenance Automation',
            description: 'Automated alerts and status transitions for vehicle repairs and upkeep.',
            icon: <Hammer className="w-6 h-6 text-primary-500" />,
        },
        {
            title: 'Driver Compliance',
            description: 'Ensure safety and compliance with license tracking and performance scores.',
            icon: <Shield className="w-6 h-6 text-primary-500" />,
        },
        {
            title: 'Financial Analytics',
            description: 'Detailed revenue vs. expense tracking and ROI analysis for your fleet.',
            icon: <BarChart3 className="w-6 h-6 text-primary-500" />,
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <Truck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">FleetFlow</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Features</a>
                        <a href="#about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">About</a>
                        <button onClick={onLoginClick} className="btn-primary">Login / Sign In</button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 to-transparent -z-10" />
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-6 inline-block">
                            v1.0 is now live 🚀
                        </span>
                        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] font-sans">
                            Logistics Simplified.<br />
                            <span className="text-primary-600 inline-block mt-2">Fleet Managed Smarter.</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            A centralized rule-based system to manage vehicles, drivers, trips, maintenance, and financial performance — all in one powerful dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onLoginClick}
                                className="btn-primary w-full sm:w-auto h-14 px-10 text-lg flex items-center justify-center gap-2 group"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
            {/* Feature Section */}
            <section id="features" className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise-Grade Fleet Control</h2>
                    <p className="text-slate-600">Powerful tools designed for scale and precision.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="p-8 glass-card border-slate-100 hover:border-primary-100 group transition-all"
                        >
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                {React.cloneElement(feature.icon, { className: 'w-6 h-6 group-hover:text-white' })}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Truck className="text-primary-600 w-5 h-5" />
                    <span className="text-lg font-bold">FleetFlow</span>
                </div>
                <p className="text-slate-400">© 2026 FleetFlow. Built with Supabase & React.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
