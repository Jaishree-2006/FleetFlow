import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen">
                <Header title={title} />
                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
