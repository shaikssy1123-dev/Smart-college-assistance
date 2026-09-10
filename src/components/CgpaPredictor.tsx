import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  BarChart3,
  ListTodo,
  RefreshCw
} from 'lucide-react';
import { SubjectMarks, MicroStudyTask } from '../types';
import { INITIAL_MICRO_TASKS } from '../data/mockData';

interface CgpaPredictorProps {
  initialMarks: SubjectMarks[];
}

export const CgpaPredictor: React.FC<CgpaPredictorProps> = ({ initialMarks }) => {
  const [subjects, setSubjects] = useState<SubjectMarks[]>(initialMarks);
  const [priorCgpa, setPriorCgpa] = useState<number>(8.12);
  const [priorCredits, setPriorCredits] = useState<number>(104);
  const [dailyHours, setDailyHours] = useState<number>(3);
  const [studyTasks, setStudyTasks] = useState<MicroStudyTask[]>(INITIAL_MICRO_TASKS);

  // Update specific subject marks
  const handleMarkChange = (id: string, field: keyof SubjectMarks, val: number) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== id) return sub;
        const updated = { ...sub, [field]: val };
        
        // Recalculate internal total (Mid1/30 + Mid2/30 / 2 => scaled to 25) + (Quiz/20 + Lab/20 => scaled to 25)
        const midAvg = ((updated.midTerm1 + updated.midTerm2) / 60) * 25;
        const coursework = ((updated.assignmentQuiz + updated.labPractical) / 40) * 25;
        const totalInternal = Math.round(midAvg + coursework);
        
        // Target end-term (50% weight) + internal (50% weight)
        const totalOverall = totalInternal + (updated.targetEndSem * 0.5);
        
        let grade = 'B';
        let gradePoint = 6;
        if (totalOverall >= 90) { grade = 'O'; gradePoint = 10; }
        else if (totalOverall >= 80) { grade = 'A+'; gradePoint = 9; }
        else if (totalOverall >= 70) { grade = 'A'; gradePoint = 8; }
        else if (totalOverall >= 60) { grade = 'B+'; gradePoint = 7; }
        else if (totalOverall >= 50) { grade = 'B'; gradePoint = 6; }
        else if (totalOverall >= 40) { grade = 'C'; gradePoint = 5; }
        else { grade = 'F'; gradePoint = 0; }

        return {
          ...updated,
          totalInternal,
          predictedGrade: grade,
          predictedGradePoint: gradePoint,
          isWeakSubject: gradePoint <= 7,
        };
      })
    );
  };

  // GPA and CGPA calculations
  const { currentSemCredits, predictedGpa, predictedCumulativeCgpa, weakSubjects } = useMemo(() => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    const weakList: SubjectMarks[] = [];

    subjects.forEach(s => {
      totalGradePoints += s.predictedGradePoint * s.credits;
      totalCredits += s.credits;
      if (s.predictedGradePoint <= 7) {
        weakList.push(s);
      }
    });

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    const totalAllCredits = priorCredits + totalCredits;
    const cumCgpa =
      totalAllCredits > 0
        ? (priorCgpa * priorCredits + gpa * totalCredits) / totalAllCredits
        : gpa;

    return {
      currentSemCredits: totalCredits,
      predictedGpa: Number(gpa.toFixed(2)),
      predictedCumulativeCgpa: Number(cumCgpa.toFixed(2)),
      weakSubjects: weakList,
    };
  }, [subjects, priorCgpa, priorCredits]);

  // Toggle study task completed
  const toggleTask = (taskId: string) => {
    setStudyTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Regenerate micro study schedule dynamically
  const regenerateSchedule = () => {
    const primaryWeak = weakSubjects[0] || subjects[1];
    const secondaryWeak = weakSubjects[1] || subjects[0];

    const newTasks: MicroStudyTask[] = [
      {
        id: `gen_1_${Date.now()}`,
        day: 'Today',
        timeSlot: '04:30 PM - 05:15 PM (45m)',
        subject: primaryWeak.name,
        topic: 'Foundational Theory & Weak Concept Diagnostics',
        durationMinutes: 45,
        priority: 'high',
        completed: false,
      },
      {
        id: `gen_2_${Date.now()}`,
        day: 'Today',
        timeSlot: '06:00 PM - 06:45 PM (45m)',
        subject: primaryWeak.name,
        topic: 'Past 5-Year End-Term Question Solving (15 Marks Focus)',
        durationMinutes: 45,
        priority: 'high',
        completed: false,
      },
      {
        id: `gen_3_${Date.now()}`,
        day: 'Tomorrow',
        timeSlot: '09:00 AM - 09:45 AM (45m)',
        subject: secondaryWeak.name,
        topic: 'High-Weightage Numerical Problems & Algorithm Dry Runs',
        durationMinutes: 45,
        priority: 'medium',
        completed: false,
      },
      {
        id: `gen_4_${Date.now()}`,
        day: 'Tomorrow',
        timeSlot: '05:00 PM - 06:00 PM (60m)',
        subject: primaryWeak.name,
        topic: 'Formula Sheet Revision & Timed Mock Quiz',
        durationMinutes: 60,
        priority: 'normal',
        completed: false,
      },
    ];
    setStudyTasks(newTasks);
  };

  return (
    <div id="cgpa-predictor" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI CGPA Predictor & Personalized Planner
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Academic Performance Forecast & Micro-Study Schedule
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Adjust expected internal scores and end-term exam targets. Our algorithm estimates your SGPA/CGPA, isolates vulnerable subjects, and synthesizes an actionable daily study roadmap.
            </p>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Current Sem GPA</div>
              <div className="text-2xl font-extrabold font-mono text-cyan-400">{predictedGpa}</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-center">
              <div className="text-[11px] uppercase tracking-wider text-purple-300">Predicted CGPA</div>
              <div className="text-2xl font-extrabold font-mono text-purple-300">{predictedCumulativeCgpa}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Subjects Table + Score Forecast */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Subjects Score Inputs */}
        <div className="xl:col-span-8 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Subject-Wise Internal & Target Simulation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Internal scale: Mid 1 (30), Mid 2 (30), Assignments (20), Labs (20), End-Sem (100).
                </p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Total Credits: <strong className="text-white">{currentSemCredits}</strong>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold text-center">Credits</th>
                    <th className="pb-3 font-semibold text-center">Mid 1 (30)</th>
                    <th className="pb-3 font-semibold text-center">Mid 2 (30)</th>
                    <th className="pb-3 font-semibold text-center">Coursework (40)</th>
                    <th className="pb-3 font-semibold text-center">Target End-Sem (100)</th>
                    <th className="pb-3 font-semibold text-right">Predicted Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pr-2">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {s.name}
                          {s.isWeakSubject && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              Weak
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.code}</div>
                      </td>
                      <td className="py-3.5 text-center font-mono text-slate-300">
                        {s.credits}
                      </td>
                      <td className="py-3.5 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={s.midTerm1}
                          onChange={e => handleMarkChange(s.id, 'midTerm1', parseInt(e.target.value) || 0)}
                          className="w-14 text-center bg-slate-950/80 border border-slate-700/80 rounded-lg py-1 text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-3.5 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={s.midTerm2}
                          onChange={e => handleMarkChange(s.id, 'midTerm2', parseInt(e.target.value) || 0)}
                          className="w-14 text-center bg-slate-950/80 border border-slate-700/80 rounded-lg py-1 text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-3.5 text-center">
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={s.assignmentQuiz + s.labPractical}
                          onChange={e => {
                            const half = Math.floor((parseInt(e.target.value) || 0) / 2);
                            handleMarkChange(s.id, 'assignmentQuiz', half);
                            handleMarkChange(s.id, 'labPractical', half);
                          }}
                          className="w-14 text-center bg-slate-950/80 border border-slate-700/80 rounded-lg py-1 text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-3.5 text-center">
                        <input
                          type="number"
                          min="30"
                          max="100"
                          value={s.targetEndSem}
                          onChange={e => handleMarkChange(s.id, 'targetEndSem', parseInt(e.target.value) || 0)}
                          className="w-16 text-center bg-cyan-950/40 border border-cyan-700/60 rounded-lg py-1 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                          s.predictedGradePoint >= 9
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : s.predictedGradePoint >= 8
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : s.predictedGradePoint >= 7
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {s.predictedGrade} ({s.predictedGradePoint}.0)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cumulative CGPA Parameters */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Prior Academic Foundation</div>
                <div className="text-xs text-slate-400">Cumulative GPA from Semesters 1 to 5</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Prior CGPA</span>
                <input
                  type="number"
                  step="0.01"
                  min="4.0"
                  max="10.0"
                  value={priorCgpa}
                  onChange={e => setPriorCgpa(parseFloat(e.target.value) || 0)}
                  className="w-20 text-center bg-slate-950/80 border border-slate-700 rounded-lg py-1 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Prior Credits</span>
                <input
                  type="number"
                  min="20"
                  max="160"
                  value={priorCredits}
                  onChange={e => setPriorCredits(parseInt(e.target.value) || 0)}
                  className="w-20 text-center bg-slate-950/80 border border-slate-700 rounded-lg py-1 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Daily Micro-Study Schedule */}
        <div className="xl:col-span-4 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Smart Micro-Study Schedule
                </h3>
              </div>
              <button
                onClick={regenerateSchedule}
                title="Regenerate schedule based on weakest subjects"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px]">Refresh</span>
              </button>
            </div>

            {/* AI Focus Diagnosis */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
              <div className="font-semibold text-purple-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Vulnerability Diagnosis
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {weakSubjects.length > 0 ? (
                  <>
                    Vulnerable subjects detected:{' '}
                    <strong className="text-rose-300">
                      {weakSubjects.map(w => w.name.split(' ')[0]).join(', ')}
                    </strong>
                    . High priority study slots allocated to lift predicted grade points from B+ to A.
                  </>
                ) : (
                  'All subjects are comfortably on track for A/O grades! Maintaining revision consistency.'
                )}
              </p>
            </div>

            {/* Micro Tasks List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {studyTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      : task.priority === 'high'
                      ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center transition ${
                        task.completed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-semibold text-slate-300 truncate">
                          {task.subject}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                          task.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 text-slate-200 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                        {task.topic}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {task.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Hours Slider */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Target Study Capacity</span>
                <span className="font-mono text-cyan-400 font-bold">{dailyHours} hrs / day</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={dailyHours}
                onChange={e => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
