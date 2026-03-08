import React, { useState } from 'react';
import { Lock, UserPlus, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
    const { login, register } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = isLoginMode
            ? await login(email, password)
            : await register(email, password);

        setLoading(false);

        if (result.success) {
            setEmail('');
            setPassword('');
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } else {
            setError(result.message || (isLoginMode ? 'Login failed.' : 'Registration failed.'));
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <div className="glass max-w-sm w-full relative overflow-hidden animate-in fade-in zoom-in duration-200"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--accent), #fb923c)' }} />

                <div className="p-8 pb-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
                        style={{
                            background: 'rgba(99,102,241,0.1)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            boxShadow: '0 0 30px rgba(99,102,241,0.2)',
                        }}>
                        <Lock className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                    </div>

                    <h2 className="text-xl font-bold mb-2">
                        {isLoginMode ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm px-4 mb-6" style={{ color: 'var(--text-muted)' }}>
                        {isLoginMode
                            ? 'Please log in to configure the test target and access your dashboard.'
                            : 'Sign up for a new account to start running load tests.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full px-4 py-3 rounded-xl text-center font-mono glass-input placeholder:text-white/20 transition-all duration-200 focus:outline-none"
                                autoFocus
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-xl text-center font-mono tracking-widest glass-input placeholder:text-white/20 placeholder:tracking-normal transition-all duration-200 focus:outline-none"
                                style={{
                                    border: error ? '1px solid rgba(248,113,113,0.5)' : undefined,
                                    boxShadow: error ? '0 0 10px rgba(248,113,113,0.2)' : undefined,
                                }}
                            />
                        </div>

                        {error && (
                            <div className="text-xs font-medium text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full py-3 mt-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden group flex justify-center items-center gap-2"
                            style={{
                                background: loading || !email || !password ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
                                color: loading || !email || !password ? 'var(--text-muted)' : '#fff',
                                boxShadow: loading || !email || !password ? 'none' : '0 10px 25px -5px rgba(99,102,241,0.4)',
                            }}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLoginMode ? 'Log In' : 'Sign Up')}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="font-bold hover:text-white transition-colors cursor-pointer"
                            style={{ color: 'var(--accent)' }}
                        >
                            {isLoginMode ? 'Register here' : 'Log in here'}
                        </button>
                    </div>
                </div>

                {onClose && (
                    <div className="border-t border-white/5 p-4 flex justify-center">
                        <button
                            onClick={onClose}
                            className="text-xs font-semibold hover:text-white transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
