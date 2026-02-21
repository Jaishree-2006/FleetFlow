import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    MapPin,
    Wrench,
    Fuel,
    Users,
    BarChart3,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';

const Sidebar = () => {
    const { userRole } = useFleetStore();

    const getMenuItems = () => {
        const baseItems = [
            { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        ];

        switch (userRole) {
            case 'Fleet Manager':
                return [
                    ...baseItems,
                    { name: 'Vehicle Registry', path: '/vehicles', icon: <Truck size={20} /> },
                    { name: 'Maintenance Logs', path: '/maintenance', icon: <Wrench size={20} /> },
                    { name: 'Reports', path: '/analytics', icon: <BarChart3 size={20} /> },
                ];
            case 'Dispatcher':
                return [
                    ...baseItems,
                    { name: 'Trip Dispatcher', path: '/trips', icon: <MapPin size={20} /> },
                    { name: 'Live Tracking', path: '/tracking', icon: <MapPin size={20} /> },
                    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
                ];
            case 'Safety Officer':
                return [
                    ...baseItems,
                    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
                    { name: 'Safety Scores', path: '/safety', icon: <BarChart3 size={20} /> },
                    { name: 'Compliance', path: '/compliance', icon: <Wrench size={20} /> },
                ];
            case 'Financial Analyst':
                return [
                    ...baseItems,
                    { name: 'Expenses & Fuel', path: '/expenses', icon: <Fuel size={20} /> },
                    { name: 'Cost Summary', path: '/analytics', icon: <BarChart3 size={20} /> },
                ];
            default:
                return [
                    ...baseItems,
                    { name: 'Vehicle Registry', path: '/vehicles', icon: <Truck size={20} /> },
                    { name: 'Drivers', path: '/drivers', icon: <Users size={20} /> },
                    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
                ];
        }
    };

    const menuItems = getMenuItems();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col z-40">
            <div className="h-20 flex items-center px-8 border-b border-slate-50 gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <Truck className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">FleetFlow</span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all group
              ${isActive
                                ? 'bg-primary-50 text-primary-600 font-semibold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                        <ChevronRight size={16} className={`opacity-0 transition-all ${'group-hover:opacity-100 group-hover:translate-x-1'}`} />
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-error-500 hover:bg-error-50 rounded-xl transition-all group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
