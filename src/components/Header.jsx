import React, { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Header = ({ title }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setProfile(user);
        });
    }, []);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="w-64 h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>

                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                    <Bell size={20} className="text-slate-500" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full border-2 border-white" />
                </button>

                <div className="h-10 w-[1px] bg-slate-200 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                            {profile?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                            {profile ? localStorage.getItem(`role_${profile.id}`) || 'Fleet Manager' : 'Fleet Manager'}
                        </p>
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
