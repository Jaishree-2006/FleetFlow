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
    Zap
} from 'lucide-react';
import { useFleetStore } from '../store/useFleetStore';

const BottomNav = () => {
    const { userRole } = useFleetStore();

    const getMenuItems = () => {
        switch (userRole) {
            case 'Fleet Manager':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { name: 'Vehicles', path: '/vehicles', icon: Truck },
                    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
                    { name: 'Reports', path: '/analytics', icon: BarChart3 },
                    { name: 'EV Lab', path: '/ev-lab', icon: Zap },
                ];
            case 'Dispatcher':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { name: 'Trips', path: '/trips', icon: MapPin },
                    { name: 'Drivers', path: '/drivers', icon: Users },
                    { name: 'EV Lab', path: '/ev-lab', icon: Zap },
                ];
            case 'Safety Officer':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { name: 'Drivers', path: '/drivers', icon: Users },
                    { name: 'Safety', path: '/safety', icon: BarChart3 },
                    { name: 'Compliance', path: '/compliance', icon: Wrench },
                ];
            case 'Financial Analyst':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { name: 'Expenses', path: '/expenses', icon: Fuel },
                    { name: 'Reports', path: '/analytics', icon: BarChart3 },
                ];
            default:
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { name: 'Vehicles', path: '/vehicles', icon: Truck },
                    { name: 'Drivers', path: '/drivers', icon: Users },
                    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
                    { name: 'EV Lab', path: '/ev-lab', icon: Zap },
                ];
        }
    };

    const menuItems = getMenuItems();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(226,232,240,0.8)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
            }}
        >
            <div className="flex items-stretch justify-around">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-all relative ${isActive ? 'text-blue-600' : 'text-slate-400'}`
                            }
                            style={{ minHeight: '56px' }}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span
                                            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-600"
                                        />
                                    )}
                                    <span
                                        className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${isActive ? 'bg-blue-50' : ''}`}
                                    >
                                        <Icon
                                            size={isActive ? 22 : 20}
                                            strokeWidth={isActive ? 2.5 : 1.8}
                                        />
                                    </span>
                                    <span
                                        className="text-[10px] font-semibold leading-none tracking-tight"
                                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                                    >
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
