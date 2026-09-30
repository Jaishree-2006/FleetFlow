import React, { useEffect, useState } from 'react';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';

const Header = ({ title }) => {
    const [profile, setProfile] = useState(null);
    const { searchQuery, setSearchQuery, notifications, userRole, setUserRole } = useFleetStore();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setProfile(user);
            if (user) {
                const savedRole = localStorage.getItem(`role_${user.id}`) || user.user_metadata?.role;
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
    };

    const handleBellClick = () => {
        setNotificationsOpen(!notificationsOpen);
    };

    return (
        <>
            <header
                className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-10"
                style={{
                    height: '64px',
                    background: 'rgba(255,255,255,0.90)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(226,232,240,0.7)',
                    paddingTop: 'env(safe-area-inset-top)',
                }}
            >
                {/* Left: Title */}
                <div className="flex items-center gap-3">
                    <h1 className="text-lg md:text-2xl font-bold text-slate-900 truncate max-w-[180px] md:max-w-none">
                        {title}
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-6">
                    {/* Search - expandable on mobile */}
                    {searchOpen ? (
                        <div className="flex items-center gap-2 md:hidden">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-40 h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button onClick={() => setSearchOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                                <X size={18} className="text-slate-500" />
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Search icon on mobile */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
                            >
                                <Search size={19} className="text-slate-500" />
                            </button>

                            {/* Full search bar on desktop */}
                            <form onSubmit={handleSearch} className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </form>
                        </>
                    )}

                    {/* Bell */}
                    {!searchOpen && (
                        <div className="relative">
                            <button
                                onClick={handleBellClick}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors relative"
                            >
                                <Bell size={19} className="text-slate-500" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                )}
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 z-50">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                            {notifications.length} New
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {notifications.map(n => (
                                            <div key={n.id} className="p-3 bg-slate-50 rounded-xl">
                                                <p className="text-xs text-slate-700 leading-relaxed mb-1">{n.text}</p>
                                                <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Divider - desktop only */}
                    {!searchOpen && <div className="hidden md:block h-8 w-px bg-slate-200" />}

                    {/* Avatar / Profile */}
                    {!searchOpen && (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                                    {localStorage.getItem(`name_${profile?.id}`) || localStorage.getItem('name_demo-user') || profile?.user_metadata?.full_name || profile?.email?.split('@')[0] || 'User'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleChangePersona}
                                        className="text-[9px] font-bold text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors uppercase tracking-tight"
                                    >
                                        Change Persona
                                    </button>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                        {userRole || 'Fleet Manager'}
                                    </p>
                                </div>
                            </div>
                            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                <User size={18} className="text-blue-600" />
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
