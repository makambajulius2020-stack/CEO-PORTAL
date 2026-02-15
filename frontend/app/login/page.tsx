'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const primaryUrl = apiUrl ? `${apiUrl}/api/auth/login` : `/api/auth/login`;

            const attempt = async (url: string) => {
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
            };

            let response: Response;
            try {
                response = await attempt(primaryUrl);
            } catch {
                response = await attempt('/api/auth/login');
            }

            if (!response.ok && apiUrl) {
                response = await attempt('/api/auth/login');
            }

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
            {/* Abstract Background Patterns */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#d97706]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d97706]/5 rounded-full blur-3xl"></div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-0 ring-0 bg-transparent">
                            <Image src="/ceo-logo.jpeg" alt="Hugamara" fill className="object-contain" sizes="80px" quality={100} priority />
                        </div>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-[#d97706] mb-2">Hugamara</h1>
                    <p className="text-white/75 font-light tracking-widest text-sm uppercase">CEO Executive Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#d97706] transition-all"
                            placeholder="ceo@hugamara.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder:text-white/40 focus:outline-none focus:border-[#d97706] transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter Executive Portal'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/40 text-xs">
                        Restricted Access. Authorized Personnel Only.
                    </p>
                </div>
            </div>
        </div>
    );
}
