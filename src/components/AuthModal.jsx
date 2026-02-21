import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const AuthModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        setError(null);
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    prompt: 'select_account',
                }
            }
        });
        if (oauthError) {
            setError(oauthError.message);
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
            } else {
                alert('Account created! You can now sign in.');
                setIsSignUp(false);
                setLoading(false);
            }
        } else {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (loginError) {
                setError(loginError.message);
                setLoading(false);
            } else {
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500">
                            {isSignUp ? 'Join FleetFlow today' : 'Sign in to manage your fleet'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-error-50 border border-error-500/20 text-error-500 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isSignUp ? 'Join Now' : 'Sign In')}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="flex items-center justify-center gap-3 h-14 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700 w-full"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.4-1.2 1.08-3.08 2.08-5.72 2.08-4.52 0-8.12-3.64-8.12-8.12s3.6-8.12 8.12-8.12c2.48 0 4.36.96 5.72 2.24l2.32-2.32C18.44 2.24 15.68 1 12.48 1 6.64 1 1.92 5.72 1.92 11.56S6.64 22.12 12.48 22.12c3.12 0 5.48-1.04 7.32-2.96 1.88-1.88 2.48-4.52 2.48-6.72 0-.64-.04-1.24-.12-1.84h-9.68z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <span
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-primary-600 font-semibold cursor-pointer"
                            >
                                {isSignUp ? 'Sign In' : 'Create One'}
                            </span>
                        </p>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
