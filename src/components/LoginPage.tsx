import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Users,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aarav.sharma@apex.edu');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // When role changes, prefill demo credentials
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_USERS[role];
    if (demo) {
      setEmail(demo.email);
      setPassword('apex2026@demo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter a valid institutional email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      const user = DEMO_USERS[selectedRole];
      onLoginSuccess(user);
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const user = DEMO_USERS[role];
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Hackathon Brand Bar */}
      <header className="p-6 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
            <GraduationCap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              Smart College Assistant
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                AQVH 2025
              </span>
            </div>
            <div className="text-xs text-slate-400">Team Avengers • Digital Campus Ecosystem</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hackathon Finalist Prototype</span>
        </div>
      </header>

      {/* Center Auth Box */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Card Container */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />

            <div className="text-center space-y-1 mb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Single Sign-On Portal
              </h2>
              <p className="text-xs text-slate-400">
                Access your personalized role-specific dashboard
              </p>
            </div>

            {/* Role Selection Segmented Control */}
            <div className="space-y-1.5 mb-5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Select Your Role
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                {(['student', 'faculty', 'parent', 'admin'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2 rounded-lg font-semibold capitalize transition ${
                      selectedRole === role
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@apex.edu"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-medium text-slate-300">Password / PIN</label>
                  <span className="text-slate-500 text-[11px] cursor-pointer hover:text-cyan-400 transition">
                    Forgot PIN?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter {selectedRole} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo 1-Click Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                ⚡ Instant Demo Persona Access:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('student')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                    S
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white leading-tight">Aarav (Student)</div>
                    <div className="text-[9px] text-slate-400 font-mono">Sem 6 • CS602 alert</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('faculty')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">
                    F
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white leading-tight">Dr. Gupta (Faculty)</div>
                    <div className="text-[9px] text-slate-400 font-mono">HOD & Marks logger</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('parent')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
                    P
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white leading-tight">Sunita (Parent)</div>
                    <div className="text-[9px] text-slate-400 font-mono">Fee & Attendance</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white leading-tight">Dr. Jenkins (Dean)</div>
                    <div className="text-[9px] text-slate-400 font-mono">Campus Broadcasts</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 relative z-10 border-t border-slate-900">
        Team Avengers • AQVH 2025 Hackathon • Smart College Assistant • Apex Institute of Technology & Science
      </footer>
    </div>
  );
};
