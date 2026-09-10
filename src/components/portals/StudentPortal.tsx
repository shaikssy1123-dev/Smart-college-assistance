import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  Check
} from 'lucide-react';
import {
  SubjectAttendance,
  SubjectMarks,
  ExamScheduleItem,
  AssignmentItem,
  SmartAlert,
  UserProfile,
} from '../../types';

interface StudentPortalProps {
  user: UserProfile;
  attendance: SubjectAttendance[];
  marks: SubjectMarks[];
  exams: ExamScheduleItem[];
  assignments: AssignmentItem[];
  alerts: SmartAlert[];
  onOpenPredictor: () => void;
  onOpenPlanner: () => void;
  onOpenChat: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  user,
  attendance,
  marks,
  exams,
  assignments,
  alerts,
  onOpenPredictor,
  onOpenPlanner,
  onOpenChat,
}) => {
  const [assignmentList, setAssignmentList] = useState<AssignmentItem[]>(assignments);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Overall attendance stats
  const totalClasses = attendance.reduce((acc, s) => acc + s.total, 0);
  const totalAttended = attendance.reduce((acc, s) => acc + s.attended, 0);
  const aggregatePct = totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;
  const criticalCount = attendance.filter(s => s.percentage < 75).length;

  const handleSimulateSubmit = (id: string) => {
    setSubmittingId(id);
    setTimeout(() => {
      setAssignmentList(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'submitted', submittedOn: 'Just now' } : a))
      );
      setSubmittingId(null);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-cyan-400/40 object-cover shadow-lg shadow-cyan-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                  {user.rollNo}
                </span>
                <span className="text-xs text-slate-400">Semester {user.semester} • CSE</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Welcome back, {user.name}!
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Here is your real-time academic pulse, upcoming exams, and smart compliance status.
              </p>
            </div>
          </div>

          {/* Quick AI Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenPredictor}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              AI Attendance Predictor
            </button>
            <button
              onClick={onOpenPlanner}
              className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs border border-purple-500/40 flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4" />
              CGPA & Study Planner
            </button>
          </div>
        </div>

        {/* High-Level Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Aggregate Attendance</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-extrabold font-mono ${
                aggregatePct >= 80 ? 'text-emerald-400' : aggregatePct >= 75 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {aggregatePct}%
              </span>
              <span className="text-xs text-slate-400 font-mono">({totalAttended}/{totalClasses})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Critical Subjects</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-extrabold font-mono ${criticalCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {criticalCount}
              </span>
              <span className="text-xs text-slate-400">Below 75% rule</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Next Examination</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-cyan-400">
                14 Days
              </span>
              <span className="text-xs text-slate-400">CS601 (Algorithms)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Pending Tasks</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-amber-400">
                {assignmentList.filter(a => a.status === 'pending').length}
              </span>
              <span className="text-xs text-slate-400">Assignments due</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Attendance & Smart Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-time Attendance Subject Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Subject Attendance Cards */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white">
                  Real-Time Subject Attendance Breakdown
                </h2>
              </div>
              <button
                onClick={onOpenPredictor}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                <span>Run Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {attendance.map(sub => {
                const isCritical = sub.percentage < 75;
                const isBorderline = sub.percentage >= 75 && sub.percentage < 80;

                return (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCritical
                        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                        : isBorderline
                        ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                            {sub.code}
                          </span>
                          <span className="font-semibold text-white text-sm">
                            {sub.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Faculty: {sub.facultyName} • Room: {sub.room} • {sub.credits} Credits
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className={`font-mono text-lg font-bold ${
                            isCritical ? 'text-rose-400' : isBorderline ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {sub.percentage}%
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {sub.attended} / {sub.total} classes
                          </div>
                        </div>

                        {isCritical && (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Deficit
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="relative h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCritical
                              ? 'bg-rose-500'
                              : isBorderline
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Min required: 75%</span>
                        {isCritical ? (
                          <span className="text-rose-400 font-semibold">
                            ⚠️ Must attend next 4 classes to recover
                          </span>
                        ) : (
                          <span className="text-emerald-400">Safe compliance</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exam Timetable Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-white">
                  End-Semester Examination Schedule (Autumn 2026)
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Verified Hall Ticket Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exams.map(ex => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/30 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
                        {ex.code}
                      </span>
                      <h4 className="font-semibold text-white text-xs mt-1.5 line-clamp-1">
                        {ex.subject}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300">
                      In {ex.daysRemaining} days
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800/60 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ex.date} • {ex.time}</span>
                    </div>
                    <div className="truncate text-slate-400">
                      Venue: {ex.venue} (Seat: <strong className="text-white">{ex.seatNo}</strong>)
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {ex.syllabusUnits.slice(0, 2).map((unit, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400"
                      >
                        {unit}
                      </span>
                    ))}
                    {ex.syllabusUnits.length > 2 && (
                      <span className="text-[9px] text-slate-500 pt-0.5">
                        +{ex.syllabusUnits.length - 2} more units
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Smart Alerts & Assignments Tracker */}
        <div className="lg:col-span-4 space-y-6">
          {/* Smart Alerts Feed */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Smart Alerts & Notices</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">4 Unread</span>
            </div>

            <div className="space-y-2.5">
              {alerts.map(alt => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs transition ${
                    alt.type === 'danger'
                      ? 'bg-rose-950/25 border-rose-500/30 text-rose-200'
                      : alt.type === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                      : alt.type === 'info'
                      ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate">{alt.title}</span>
                    <span className="text-[10px] opacity-70 font-mono shrink-0 ml-1">{alt.time}</span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
                    {alt.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments Tracker */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Assignment Submissions</h3>
              </div>
              <span className="text-xs text-slate-400">Semester 6</span>
            </div>

            <div className="space-y-3">
              {assignmentList.map(asg => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400">{asg.code}</span>
                      <h4 className="font-semibold text-white text-xs">{asg.title}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      asg.status === 'graded'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : asg.status === 'submitted'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {asg.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {asg.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-mono">Due: {asg.dueDate}</span>
                    {asg.status === 'pending' ? (
                      <button
                        onClick={() => handleSimulateSubmit(asg.id)}
                        disabled={submittingId === asg.id}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center gap-1"
                      >
                        {submittingId === asg.id ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <Upload className="w-3 h-3" />
                            <span>Submit Work</span>
                          </>
                        )}
                      </button>
                    ) : asg.status === 'graded' ? (
                      <span className="font-mono text-emerald-400 font-bold">
                        Score: {asg.points} / {asg.maxPoints}
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                        <Check className="w-3 h-3 text-cyan-400" /> Submitted
                      </span>
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
