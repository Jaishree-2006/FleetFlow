import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = ({ children, title }) => {
    return (
        <div className="flex">
            {/* Sidebar: visible only on desktop (md+) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main content */}
            <main className="flex-1 w-full min-w-0 overflow-x-hidden md:ml-72 min-h-screen min-h-dvh">
                <Header title={title} />
                {/* Extra bottom padding on mobile for the bottom nav */}
                <div className="p-3 sm:p-4 md:p-10 pb-24 md:pb-10 max-w-full">
                    {children}
                </div>
            </main>

            {/* Bottom navigation: visible only on mobile */}
            <BottomNav />
        </div>
    );
};

export default Layout;
