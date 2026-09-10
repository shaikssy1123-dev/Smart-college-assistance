import React, { useState } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  AlertOctagon,
  Megaphone,
  Radio,
  CheckCircle2,
  Cpu,
  Server,
  Activity,
  Send,
  ShieldCheck
} from 'lucide-react';
import { SmartAlert } from '../../types';

interface AdminPortalProps {
  onBroadcastAlert: (alert: SmartAlert) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBroadcastAlert }) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'danger' | 'success'>('info');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const newAlert: SmartAlert = {
      id: `alert_${Date.now()}`,
      title: broadcastTitle,
      message: broadcastMessage,
      type: broadcastType,
      time: 'Just now',
      read: false,
      category: 'general',
    };

    onBroadcastAlert(newAlert);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              University Directorate & Admin Command
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Apex Institute of Technology & Science - Executive Console
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Campus-wide telemetric telemetry, departmental compliance monitoring, and broadcast notifications for 4,200+ students and staff.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Campus ERP Online: 99.98%
            </span>
          </div>
        </div>
      </div>

      {/* Campus Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2">4,280</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs last academic year
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Faculty & Instructors</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2">215</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 8 Engineering Depts
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Campus Avg. Attendance</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">82.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Threshold Compliant (&gt; 75%)
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fee Collection Rate</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-teal-300 mt-2">94.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            ₹24.8 Cr Collected for 2026
          </div>
        </div>
      </div>

      {/* Main Grid: Broadcast Emergency Circular + Departmental Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast System */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-cyan-400" />
                Push Emergency Broadcast Circular
              </h2>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Pushes to Student & Parent Feeds
              </span>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Alert Headline</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  placeholder="e.g., Campus Closed Tomorrow due to Regional Rain Advisory"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Severity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['info', 'warning', 'danger', 'success'] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setBroadcastType(type)}
                      className={`py-1.5 rounded-lg border capitalize font-semibold transition ${
                        broadcastType === type
                          ? type === 'danger'
                            ? 'bg-rose-500 text-white border-rose-400'
                            : type === 'warning'
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : type === 'success'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Detailed Message</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="Enter the official administrative announcement instructions..."
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {broadcastSent && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Circular broadcasted successfully across mobile apps and web portals!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!broadcastTitle.trim() || !broadcastMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>Transmit Broadcast Immediately</span>
              </button>
            </form>
          </div>
        </div>

        {/* Departmental Health Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                Departmental Health & Attendance
              </h2>
              <span className="text-xs text-slate-400 font-mono">Real-Time Sync</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Computer Science & Engineering', students: 1140, avgAtt: 84.6, labsFree: '41 / 85' },
                { name: 'Artificial Intelligence & Data Science', students: 680, avgAtt: 86.2, labsFree: '24 / 40' },
                { name: 'Electronics & Communication', students: 820, avgAtt: 79.8, labsFree: '18 / 60' },
                { name: 'Mechanical & Automation', students: 640, avgAtt: 78.4, labsFree: '12 / 50' },
                { name: 'Civil & Infrastructure Eng.', students: 520, avgAtt: 81.1, labsFree: '20 / 45' },
              ].map((dept, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-white">{dept.name}</span>
                    <span className="font-mono text-cyan-400">{dept.avgAtt}% Att.</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{dept.students} Students Enrolled</span>
                    <span>Free Workstations: {dept.labsFree}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dept.avgAtt >= 85 ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${dept.avgAtt}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
