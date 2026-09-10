import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Phone,
  Mail,
  User,
  ShieldCheck,
  FileCheck,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import { SubjectAttendance, FeeItem, UserProfile } from '../../types';

interface ParentPortalProps {
  user: UserProfile;
  attendance: SubjectAttendance[];
  fees: FeeItem[];
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ user, attendance, fees }) => {
  const [feeList, setFeeList] = useState<FeeItem[]>(fees);
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);
  const [downloadedReceiptId, setDownloadedReceiptId] = useState<string | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryText, setInquiryText] = useState('');

  // Child statistics
  const totalClasses = attendance.reduce((acc, s) => acc + s.total, 0);
  const totalAttended = attendance.reduce((acc, s) => acc + s.attended, 0);
  const aggregatePct = totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;
  const criticalSubjects = attendance.filter(s => s.percentage < 75);

  const totalFeeAmount = feeList.reduce((acc, f) => acc + f.amount, 0);
  const paidFeeAmount = feeList.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0);
  const pendingFeeAmount = totalFeeAmount - paidFeeAmount;

  const handlePayFee = (id: string) => {
    setPayingFeeId(id);
    setTimeout(() => {
      setFeeList(prev =>
        prev.map(f =>
          f.id === id
            ? {
                ...f,
                status: 'paid',
                paidDate: new Date().toISOString().split('T')[0],
                receiptNo: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              }
            : f
        )
      );
      setPayingFeeId(null);
    }, 1000);
  };

  const handleDownloadReceipt = (id: string) => {
    setDownloadedReceiptId(id);
    setTimeout(() => setDownloadedReceiptId(null), 2500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setInquirySent(true);
    setInquiryText('');
    setTimeout(() => setInquirySent(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-teal-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Guardian & Parent Portal
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Guardian Dashboard: {user.childName} ({user.childRollNo})
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Official institutional portal for real-time attendance verification, fee invoice settlements, and direct faculty advisor correspondence.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Child's Standing</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xl font-extrabold font-mono ${
                aggregatePct >= 75 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {aggregatePct}% Aggregate
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({totalAttended}/{totalClasses} classes)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if attendance < 75% */}
      {criticalSubjects.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-rose-300 font-semibold text-sm block">
              Critical Institutional Notice: Attendance Deficit in {criticalSubjects.length} Subject(s)
            </strong>
            <p className="opacity-90 leading-relaxed">
              Your ward, {user.childName}, currently has attendance below the mandatory 75% university benchmark in{' '}
              <span className="font-semibold text-white">
                {criticalSubjects.map(s => `${s.name} (${s.percentage}%)`).join(', ')}
              </span>
              . Failure to recover attendance by September 20, 2026 will lead to debarment from End-Term Examinations.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Attendance Summary & Fee Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attendance Verification Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                Verified Subject Attendance Record
              </h2>
              <span className="text-xs text-slate-400 font-mono">Semester 6 CSE</span>
            </div>

            <div className="space-y-3">
              {attendance.map(s => {
                const isBelow75 = s.percentage < 75;
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{s.name}</span>
                          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {s.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Faculty Mentor: {s.facultyName}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono text-base font-bold ${
                          isBelow75 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {s.percentage}%
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {s.attended} / {s.total} attended
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isBelow75 ? 'bg-rose-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Mentor Communication */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" />
              Faculty Mentor / Class Advisor Direct Message
            </h3>
            <p className="text-xs text-slate-400">
              Advisor: <strong className="text-white">Dr. Ramesh Gupta</strong> (Associate Professor & HOD-in-Charge, Dept of CSE)
            </p>

            {inquirySent ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your message has been officially registered with the Academic Directorate. Dr. Gupta will respond within 24 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-2">
                <textarea
                  rows={3}
                  value={inquiryText}
                  onChange={e => setInquiryText(e.target.value)}
                  placeholder="Request an appointment, discuss attendance progress, or ask about academic performance..."
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  disabled={!inquiryText.trim()}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-teal-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Official Message to Faculty</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Fee Structure & Invoices */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white">
                  University Fee Ledger & Dues
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Academic Year 2025-26</span>
            </div>

            {/* Fee summary badge */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                <div className="text-[10px] text-emerald-400 font-semibold uppercase">Total Paid</div>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                  ₹{paidFeeAmount.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40">
                <div className="text-[10px] text-amber-400 font-semibold uppercase">Outstanding Dues</div>
                <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">
                  ₹{pendingFeeAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3">
              {feeList.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.term}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      item.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-base font-bold text-cyan-400">
                      ₹{item.amount.toLocaleString()}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Due: {item.dueDate}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    {item.status === 'paid' ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Receipt: {item.receiptNo}
                        </span>
                        <button
                          onClick={() => handleDownloadReceipt(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-cyan-400" />
                          <span>
                            {downloadedReceiptId === item.id ? 'Receipt Saved!' : 'Download PDF'}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due in 12 days
                        </span>
                        <button
                          onClick={() => handlePayFee(item.id)}
                          disabled={payingFeeId === item.id}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
                        >
                          {payingFeeId === item.id ? 'Processing...' : 'Pay Online Now'}
                        </button>
                      </div>
                    )}
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
