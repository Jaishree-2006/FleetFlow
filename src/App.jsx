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
import SafetyScores from './pages/SafetyScores';
import Compliance from './pages/Compliance';
import AuthModal from './components/AuthModal';
import RoleSelectionModal from './components/RoleSelectionModal';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showRoleSelection, setShowRoleSelection] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(session);

                if (session?.user) {
                    const savedRole = localStorage.getItem(`role_${session.user.id}`);
                    if (!savedRole) {
                        setShowRoleSelection(true);
                    }
                }
            } catch (err) {
                console.error('Session check failed:', err);
            } finally {
                setLoading(false);
            }
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

    if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="p-8 max-w-md text-center bg-white rounded-2xl shadow-2xl border border-red-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Configuration Missing</h2>
                    <p className="text-slate-600 mb-6">Supabase API keys are not detected on Vercel. Please add them to your Project Settings.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white/50 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing FleetFlow...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen font-sans">
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
                    <Route path="/safety" element={session ? <SafetyScores /> : <Navigate to="/" replace />} />
                    <Route path="/compliance" element={session ? <Compliance /> : <Navigate to="/" replace />} />

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