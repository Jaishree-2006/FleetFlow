import React, { useEffect, useState } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';

const Header = ({ title }) => {
    const [profile, setProfile] = useState(null);
    const { searchQuery, setSearchQuery, notifications, userRole, setUserRole } = useFleetStore();
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setProfile(user);
            if (user) {
                const savedRole = localStorage.getItem(`role_${user.id}`);
                setUserRole(savedRole || 'Fleet Manager');
            }
        });
    }, [setUserRole]);

    const handleChangePersona = () => {
        if (profile) {
            localStorage.removeItem(`role_${profile.id}`);
            window.location.reload();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // The search query is already being updated via setSearchQuery in the input onChange
    };

    const handleBellClick = () => {
        setNotificationsOpen(!notificationsOpen);
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                <form onSubmit={handleSearch} className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </form>

                <div className="relative">
                    <button
                        onClick={handleBellClick}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
                    >
                        <Bell size={20} className="text-slate-500" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full border-2 border-white" />
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                <span className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold">
                                    {notifications.length} New
                                </span>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                {notifications.map(n => (
                                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                                        <p className="text-xs text-slate-700 leading-relaxed mb-1">{n.text}</p>
                                        <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-10 w-[1px] bg-slate-200 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                                {profile?.email?.split('@')[0] || 'User'}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleChangePersona}
                                    className="text-[9px] font-bold text-primary-500 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2 py-0.5 rounded transition-colors uppercase tracking-tight"
                                >
                                    Change Persona
                                </button>
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                                    {userRole || 'Fleet Manager'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100">
                        <User size={20} className="text-primary-600" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
