import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Compass,
  Award,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ShieldCheck,
  Bell,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserRole, SmartAlert } from '../types';

interface DashboardLayoutProps {
  currentUser: UserProfile;
  activeView: string;
  onSelectView: (view: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  onOpenChat: () => void;
  alerts: SmartAlert[];
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeView,
  onSelectView,
  onSwitchRole,
  onLogout,
  onOpenChat,
  alerts,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const navigationItems = [
    {
      id: 'dashboard',
      label: currentUser.role === 'student' ? 'Student Portal' : currentUser.role === 'faculty' ? 'Faculty Portal' : currentUser.role === 'parent' ? 'Parent Portal' : 'Admin Portal',
      icon: GraduationCap,
      category: 'core',
    },
    {
      id: 'attendance_predictor',
      label: 'AI Attendance Predictor',
      icon: Sparkles,
      badge: 'Smart ML',
      category: 'tools',
    },
    {
      id: 'cgpa_planner',
      label: 'CGPA & Study Planner',
      icon: Award,
      badge: 'Smart Tasks',
      category: 'tools',
    },
    {
      id: 'campus_navigation',
      label: 'Campus Map & Lab Tracker',
      icon: Compass,
      badge: 'Live GPS',
      category: 'tools',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Hackathon Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => onSelectView('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/25">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                  Smart College Assistant
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    AQVH 2025
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Team Avengers • Digital Campus</div>
              </div>
            </div>
          </div>

          {/* Center Role Quick Switches */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
            {(['student', 'faculty', 'parent', 'admin'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => onSwitchRole(role)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition ${
                  currentUser.role === role
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Drawer Trigger */}
            <button
              onClick={onOpenChat}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">AI Chatbot</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* Profile Dropdown / Log out */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-cyan-500/30"
                />
                <div className="hidden xl:block">
                  <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs">
                  <div className="p-2 border-b border-slate-800 mb-1">
                    <div className="font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-cyan-400">{currentUser.email}</div>
                  </div>

                  <div className="py-1">
                    <span className="px-2 text-[10px] text-slate-500 uppercase font-semibold">Switch Persona</span>
                    {(['student', 'faculty', 'parent', 'admin'] as UserRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          onSwitchRole(role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize transition flex items-center justify-between ${
                          currentUser.role === role
                            ? 'bg-cyan-500/15 text-cyan-300 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{role} Portal</span>
                        {currentUser.role === role && <span className="text-[10px] text-cyan-400 font-mono">Active</span>}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Left Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>

            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        isActive
                          ? 'bg-slate-950/30 text-slate-950'
                          : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Campus Assistant Callout Card */}
          <div className="glass-panel p-4 rounded-2xl border border-purple-500/20 bg-purple-950/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Ask Campus Assistant</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Instant clarification for syllabus, exam timetables, fee receipts, or hall ticket rules.
            </p>
            <button
              onClick={onOpenChat}
              className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>Open AI Chatbot</span>
            </button>
          </div>

          {/* Hackathon Credentials Badge */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>AQVH 2025 Prototype</span>
            </div>
            <div>Built by Team Avengers</div>
            <div className="text-cyan-400 font-mono text-[10px]">Digital Campus Ecosystem</div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
            <div className="w-72 bg-slate-900 border-r border-slate-800 p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">Campus Navigation</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navigationItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectView(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Switch Persona:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['student', 'faculty', 'parent', 'admin'] as UserRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          onSwitchRole(role);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs capitalize ${
                          currentUser.role === role
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Central Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
