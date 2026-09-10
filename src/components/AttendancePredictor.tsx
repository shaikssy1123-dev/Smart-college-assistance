import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Calendar,
  Info,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { SubjectAttendance } from '../types';

interface AttendancePredictorProps {
  subjects: SubjectAttendance[];
}

export const AttendancePredictor: React.FC<AttendancePredictorProps> = ({ subjects }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[1]?.id || 'custom'); // default to CS602 (critical)
  
  // Custom or selected subject values
  const [totalClasses, setTotalClasses] = useState<number>(35);
  const [currentPct, setCurrentPct] = useState<number>(71.4);
  
  // Simulation inputs
  const [classesToAttend, setClassesToAttend] = useState<number>(5);
  const [classesToSkip, setClassesToSkip] = useState<number>(0);

  // When subject changes, populate values
  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    if (id === 'custom') {
      setTotalClasses(40);
      setCurrentPct(75);
      setClassesToAttend(0);
      setClassesToSkip(0);
    } else {
      const sub = subjects.find(s => s.id === id);
      if (sub) {
        setTotalClasses(sub.total);
        setCurrentPct(sub.percentage);
        setClassesToAttend(4);
        setClassesToSkip(0);
      }
    }
  };

  // Calculations
  const {
    currentAttended,
    predictedAttended,
    predictedTotal,
    predictedPct,
    statusLevel,
    classesNeededFor75,
    classesAffordableToSkip,
    classesNeededFor85,
  } = useMemo(() => {
    const attended = Math.round((currentPct / 100) * totalClasses);
    const simulatedAttended = attended + classesToAttend;
    const simulatedTotal = totalClasses + classesToAttend + classesToSkip;
    const pPct = simulatedTotal > 0 ? (simulatedAttended / simulatedTotal) * 100 : 0;

    let status: 'danger' | 'warning' | 'safe' = 'safe';
    if (pPct < 75) status = 'danger';
    else if (pPct < 80) status = 'warning';

    // Formula for required consecutive classes for 75%
    // (attended + x) / (total + x) >= 0.75  =>  x >= 3*total - 4*attended
    const needed75 = Math.max(0, Math.ceil(3 * totalClasses - 4 * attended));
    
    // Formula for required consecutive classes for 85%
    // (attended + x) / (total + x) >= 0.85  =>  0.15*x >= 0.85*total - attended => x >= (0.85*total - attended)/0.15
    const needed85 = Math.max(0, Math.ceil((0.85 * totalClasses - attended) / 0.15));

    // Affordable skips without falling below 75%
    // attended / (total + s) >= 0.75  =>  s <= (4*attended - 3*total) / 3
    const affordableSkip = Math.max(0, Math.floor((4 * attended - 3 * totalClasses) / 3));

    return {
      currentAttended: attended,
      predictedAttended: simulatedAttended,
      predictedTotal: simulatedTotal,
      predictedPct: Number(pPct.toFixed(2)),
      statusLevel: status,
      classesNeededFor75: needed75,
      classesAffordableToSkip: affordableSkip,
      classesNeededFor85: needed85,
    };
  }, [totalClasses, currentPct, classesToAttend, classesToSkip]);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div id="ai-attendance-predictor" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI Attendance Engine • 75% Compliance Guard
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive Attendance Predictor & Risk Simulator
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Simulate upcoming lecture attendance or safe absences. Receive AI recommendations to avoid exam debarment and protect your hall ticket eligibility.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setClassesToAttend(0);
                setClassesToSkip(0);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </button>
          </div>
        </div>

        {/* Quick Subject Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            Quick Select:
          </span>
          {subjects.map(s => {
            const isSelected = selectedSubjectId === s.id;
            const isCritical = s.percentage < 75;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSubject(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                <span>{s.code}: {s.name.split(' ')[0]}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  isSelected
                    ? 'bg-slate-950/20 text-slate-950'
                    : isCritical
                    ? 'bg-rose-500/20 text-rose-400 font-bold'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {s.percentage}%
                </span>
              </button>
            );
          })}
          <button
            onClick={() => handleSelectSubject('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              selectedSubjectId === 'custom'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700/50'
            }`}
          >
            Custom Inputs
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calculator Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Current Baseline Inputs
              </h3>
              {activeSubject && (
                <span className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                  {activeSubject.code}
                </span>
              )}
            </div>

            {/* Total Classes Held Input */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="text-slate-300 font-medium">Total Classes Held</label>
                <span className="text-slate-400 font-mono">{totalClasses} classes</span>
              </div>
              <input
                type="number"
                min="5"
                max="120"
                value={totalClasses}
                onChange={e => setTotalClasses(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>

            {/* Current Attendance Percentage Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="text-slate-300 font-medium">Current Attendance %</label>
                <span className={`font-mono font-bold ${currentPct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {currentPct.toFixed(1)}% ({currentAttended} / {totalClasses})
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="0.5"
                value={currentPct}
                onChange={e => setCurrentPct(parseFloat(e.target.value) || 0)}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>20%</span>
                <span className="text-rose-400 font-semibold">75% Critical Bar</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-3 border-b border-slate-800/80">
              <Zap className="w-4 h-4 text-amber-400" />
              Simulate Future Actions
            </h3>

            {/* Classes to Attend */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Upcoming Classes to ATTEND
                </label>
                <span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                  +{classesToAttend} classes
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={classesToAttend}
                onChange={e => setClassesToAttend(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[0, 3, 5, 8, 12].map(num => (
                  <button
                    key={num}
                    onClick={() => setClassesToAttend(num)}
                    className={`flex-1 py-1 text-xs rounded-lg border transition ${
                      classesToAttend === num
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Classes to Skip */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="text-rose-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Classes to SKIP (Simulate Absence)
                </label>
                <span className="font-mono text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded">
                  {classesToSkip} classes
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={classesToSkip}
                onChange={e => setClassesToSkip(parseInt(e.target.value) || 0)}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[0, 1, 2, 4, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => setClassesToSkip(num)}
                    className={`flex-1 py-1 text-xs rounded-lg border transition ${
                      classesToSkip === num
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Gauge & AI Recommendations */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prediction Status Card */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all ${
            statusLevel === 'danger'
              ? 'bg-gradient-to-b from-rose-950/50 via-slate-900/90 to-slate-900 border-rose-500/30'
              : statusLevel === 'warning'
              ? 'bg-gradient-to-b from-amber-950/50 via-slate-900/90 to-slate-900 border-amber-500/30'
              : 'bg-gradient-to-b from-emerald-950/50 via-slate-900/90 to-slate-900 border-emerald-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                  Predicted Outcome
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${
                    statusLevel === 'danger'
                      ? 'text-rose-400'
                      : statusLevel === 'warning'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {predictedPct}%
                  </span>
                  <div className="text-xs text-slate-400">
                    <div>Attended: <strong className="text-white">{predictedAttended}</strong> / {predictedTotal} total</div>
                    <div className="text-[11px] text-slate-500">Shift from baseline: {predictedPct >= currentPct ? `+${(predictedPct - currentPct).toFixed(1)}%` : `${(predictedPct - currentPct).toFixed(1)}%`}</div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center">
                {statusLevel === 'danger' ? (
                  <div className="px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">CRITICAL RISK</div>
                      <div className="text-[11px] text-rose-300/80">Below 75% Threshold</div>
                    </div>
                  </div>
                ) : statusLevel === 'warning' ? (
                  <div className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">BORDERLINE SAFE</div>
                      <div className="text-[11px] text-amber-300/80">75% - 80% Range</div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">SECURE & ELIGIBLE</div>
                      <div className="text-[11px] text-emerald-300/80">Above 80% Safe Zone</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Progress Bar with Marker at 75% */}
            <div className="mt-5">
              <div className="relative h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    statusLevel === 'danger'
                      ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                      : statusLevel === 'warning'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, predictedPct))}%` }}
                />
                {/* 75% threshold indicator line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-md"
                  style={{ left: '75%' }}
                />
              </div>
              <div className="relative text-[11px] text-slate-400 mt-1.5 h-4">
                <span className="absolute left-0">0%</span>
                <span className="absolute left-[75%] -translate-x-1/2 text-white font-bold flex items-center gap-0.5">
                  ▲ 75% Minimum Gate
                </span>
                <span className="absolute right-0">100%</span>
              </div>
            </div>

            {/* Mathematical Action Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium">Consecutive Classes for 75%</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                  {classesNeededFor75 === 0 ? (
                    <span className="text-emerald-400 text-sm font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Already achieved!
                    </span>
                  ) : (
                    `Must attend ${classesNeededFor75} more`
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Required in sequence without missing any class.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium">Safe Absence Allowance</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {classesAffordableToSkip === 0 ? (
                    <span className="text-rose-400 text-sm font-sans flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> 0 classes (Zero buffer)
                    </span>
                  ) : (
                    `Can safely skip ${classesAffordableToSkip} classes`
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Without falling below the 75% mandatory line.
                </div>
              </div>
            </div>
          </div>

          {/* Actionable AI Recommendations */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Actionable AI Recommendations & Strategy</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              {currentPct < 75 ? (
                <>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300">Immediate Action Required:</strong> You are currently below 75%. Submit any pending Medical Certificates or Hackathon On-Duty (OD) forms within 48 hours to Dean Academics to claim condonation credits.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Upcoming 4-Class Lock:</strong> Attend all remaining lecture slots this week for this course. That will boost your percentage to {( ( (currentAttended + 4) / (totalClasses + 4) ) * 100).toFixed(1)}%, successfully crossing the hall ticket barrier.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300">Safe Standing:</strong> Your current attendance is in good standing. Maintain this buffer so unforeseen medical emergencies or campus hackathon travel won't impact your exam eligibility.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Aim for Distinction ({classesNeededFor85} more classes):</strong> Reaching 85%+ grants automated internal marks bonus (+3 bonus points) in end-semester grading evaluation.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
