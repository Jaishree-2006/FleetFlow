import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Drivers from './pages/Drivers';
import Analytics from './pages/Analytics';
import AuthModal from './components/AuthModal';
import RoleSelectionModal from './components/RoleSelectionModal';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showRoleSelection, setShowRoleSelection] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session?.user) {
                const savedRole = localStorage.getItem(`role_${session.user.id}`);
                if (!savedRole) {
                    setShowRoleSelection(true);
                }
            }
            setLoading(false);
        };

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                const savedRole = localStorage.getItem(`role_${session.user.id}`);
                if (!savedRole) {
                    setShowRoleSelection(true);
                }
            } else {
                setShowRoleSelection(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return null;

    return (
        <Router>
            <div className="min-h-screen bg-slate-50 font-sans">
                <Routes>
                    <Route
                        path="/"
                        element={
                            session ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <>
                                    <LandingPage onLoginClick={() => setIsAuthModalOpen(true)} />
                                    <AuthModal
                                        isOpen={isAuthModalOpen}
                                        onClose={() => setIsAuthModalOpen(false)}
                                    />
                                </>
                            )
                        }
                    />

                    <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" replace />} />
                    <Route path="/vehicles" element={session ? <Vehicles /> : <Navigate to="/" replace />} />
                    <Route path="/trips" element={session ? <Trips /> : <Navigate to="/" replace />} />
                    <Route path="/maintenance" element={session ? <Maintenance /> : <Navigate to="/" replace />} />
                    <Route path="/expenses" element={session ? <Expenses /> : <Navigate to="/" replace />} />
                    <Route path="/drivers" element={session ? <Drivers /> : <Navigate to="/" replace />} />
                    <Route path="/analytics" element={session ? <Analytics /> : <Navigate to="/" replace />} />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <RoleSelectionModal
                    isOpen={showRoleSelection}
                    onRoleSelected={(role) => {
                        setShowRoleSelection(false);
                        window.location.reload(); // Refresh to update Header
                    }}
                />
            </div>
        </Router>
    );
}

export default App;