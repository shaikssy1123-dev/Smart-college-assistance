import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  Upload,
  BarChart2,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Save,
  Check,
  Eye
} from 'lucide-react';
import { LeaveRequest, UserProfile } from '../../types';
import { INITIAL_LEAVE_REQUESTS } from '../../data/mockData';

interface StudentAttendanceRecord {
  rollNo: string;
  name: string;
  isPresent: boolean;
  priorPercentage: number;
}

const INITIAL_STUDENT_ROSTER: StudentAttendanceRecord[] = [
  { rollNo: '21CS1001', name: 'Aakash Verma', isPresent: true, priorPercentage: 88.5 },
  { rollNo: '21CS1015', name: 'Ananya Roy', isPresent: true, priorPercentage: 92.0 },
  { rollNo: '21CS1042', name: 'Aarav Sharma', isPresent: false, priorPercentage: 71.4 },
  { rollNo: '21CS1056', name: 'Dhruv Kapoor', isPresent: true, priorPercentage: 79.2 },
  { rollNo: '21CS1077', name: 'Meera Iyer', isPresent: true, priorPercentage: 85.0 },
  { rollNo: '21CS1088', name: 'Pooja Verma', isPresent: false, priorPercentage: 68.0 },
  { rollNo: '21CS1094', name: 'Rahul Singhania', isPresent: true, priorPercentage: 81.3 },
  { rollNo: '21CS1112', name: 'Vikramaditya Rao', isPresent: true, priorPercentage: 74.5 },
];

export const FacultyPortal: React.FC<{ user: UserProfile }> = ({ user }) => {
  // Attendance logger states
  const [selectedSubject, setSelectedSubject] = useState('CS602: Machine Learning');
  const [lectureSlot, setLectureSlot] = useState('Period 3 (11:30 AM - 12:30 PM)');
  const [roster, setRoster] = useState<StudentAttendanceRecord[]>(INITIAL_STUDENT_ROSTER);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Leave requests state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'leaves'>('attendance');

  // Quick mark upload modal state
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markSubject, setMarkSubject] = useState('CS602: Machine Learning');
  const [assessmentType, setAssessmentType] = useState('Mid-Term Examination 2 (Max 30)');
  const [batchMarks, setBatchMarks] = useState<{ [rollNo: string]: number }>({
    '21CS1001': 27,
    '21CS1015': 29,
    '21CS1042': 19,
    '21CS1056': 24,
    '21CS1077': 26,
    '21CS1088': 16,
    '21CS1094': 25,
    '21CS1112': 21,
  });
  const [marksSubmitted, setMarksSubmitted] = useState(false);

  // Attendance actions
  const toggleAttendance = (rollNo: string) => {
    setRoster(prev =>
      prev.map(s => (s.rollNo === rollNo ? { ...s, isPresent: !s.isPresent } : s))
    );
  };

  const markAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, isPresent: true })));
  };

  const markAllAbsent = () => {
    setRoster(prev => prev.map(s => ({ ...s, isPresent: false })));
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Leave approval actions
  const handleLeaveAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setLeaveRequests(prev =>
      prev.map(l =>
        l.id === id
          ? {
              ...l,
              status: newStatus,
              actionRemarks: newStatus === 'approved' ? 'Approved by Dr. Ramesh Gupta (HOD)' : 'Insufficient medical proof',
            }
          : l
      )
    );
  };

  // Marks statistics
  const markValues: number[] = Object.values(batchMarks);
  const averageMark = markValues.length > 0 ? (markValues.reduce((a, b) => a + b, 0) / markValues.length).toFixed(1) : '0';
  const atRiskCount = markValues.filter(m => m < 18).length; // below 60%

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              Faculty Command Portal
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {user.name} ({user.designation})
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Conduct instant 1-tap attendance logs, evaluate mid-term internal scores, and sanction digital medical/on-duty student leaves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMarkModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/25"
            >
              <Upload className="w-4 h-4" />
              <span>Quick-Upload Marks</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'attendance'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Digital Attendance Logger
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'leaves'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>Leave Requests Queue</span>
            {leaveRequests.filter(l => l.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono">
                {leaveRequests.filter(l => l.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'marks'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Internal Marks & Analytics
          </button>
        </div>
      </div>

      {/* Tab Content 1: Digital Attendance Logger */}
      {activeTab === 'attendance' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>CS601: Design & Analysis of Algorithms</option>
                  <option>CS602: Machine Learning & Neural Nets</option>
                  <option>CS603: Operating Systems Architecture</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Slot & Time</label>
                <select
                  value={lectureSlot}
                  onChange={e => setLectureSlot(e.target.value)}
                  className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Period 3 (11:30 AM - 12:30 PM)</option>
                  <option>Period 4 (01:30 PM - 02:30 PM)</option>
                  <option>Lab Session (02:30 PM - 04:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllPresent}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Student Roster Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {roster.map(student => (
              <div
                key={student.rollNo}
                onClick={() => toggleAttendance(student.rollNo)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  student.isPresent
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-rose-950/25 border-rose-500/40 hover:border-rose-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {student.rollNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    student.isPresent
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {student.isPresent ? 'Present' : 'ABSENT'}
                  </span>
                </div>

                <div className="font-semibold text-white text-xs mt-1.5 truncate">
                  {student.name}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>Prior Avg:</span>
                  <span className={`font-mono font-bold ${
                    student.priorPercentage < 75 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {student.priorPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Attendance Toolbar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Present: <strong className="text-emerald-400 font-mono">{roster.filter(s => s.isPresent).length}</strong> | 
              Absent: <strong className="text-rose-400 font-mono"> {roster.filter(s => !s.isPresent).length}</strong>
            </div>

            <button
              onClick={handleSaveAttendance}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
            >
              {attendanceSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Attendance Published to ERP!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Confirm & Save Attendance Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 2: Leave Requests Queue */}
      {activeTab === 'leaves' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Student Digital Leave Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review verified medical certificates and hackathon/sports On-Duty representations. Approved leaves credit attendance automatically.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {leaveRequests.length} Total Applications
            </span>
          </div>

          <div className="space-y-3">
            {leaveRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{req.studentName}</span>
                      <span className="font-mono text-cyan-400 text-xs">({req.rollNo})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.leaveType === 'Medical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : req.leaveType === 'On-Duty'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {req.leaveType} Leave
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Period: <strong className="text-slate-300">{req.fromDate}</strong> to <strong className="text-slate-300">{req.toDate}</strong> • Applied: {req.appliedDate}
                    </div>
                  </div>

                  <span className={`self-start sm:self-auto px-2.5 py-1 rounded text-[11px] font-bold capitalize ${
                    req.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : req.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300">
                  <span className="text-slate-500 text-[10px] block mb-0.5">Application Reason:</span>
                  {req.reason}
                </div>

                {req.attachmentName && (
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 pt-1">
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      Attachment: {req.attachmentName}
                    </span>
                    {req.actionRemarks && (
                      <span className="text-slate-400 italic">
                        Note: {req.actionRemarks}
                      </span>
                    )}
                  </div>
                )}

                {req.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleLeaveAction(req.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Credit Attendance</span>
                    </button>
                    <button
                      onClick={() => handleLeaveAction(req.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Internal Marks & Analytics */}
      {activeTab === 'marks' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Course Internal Marks Overview</h2>
              <p className="text-xs text-slate-400">Class Performance Analytics & Grade Distribution</p>
            </div>
            <button
              onClick={() => setShowMarkModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Enter New Test Marks</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[11px] uppercase text-slate-400">Class Average Score</div>
              <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">{averageMark} / 30</div>
              <div className="text-[10px] text-slate-500 mt-1">Mid-Term Assessment 2</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[11px] uppercase text-slate-400">Highest Score</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">29 / 30</div>
              <div className="text-[10px] text-slate-500 mt-1">Ananya Roy (21CS1015)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[11px] uppercase text-slate-400">At-Risk Students</div>
              <div className="text-3xl font-extrabold font-mono text-rose-400 mt-1">{atRiskCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">Scored below 60% mark</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Mark Upload Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Batch Internal Marks Upload</h3>
                <p className="text-xs text-slate-400">Enter marks to sync with semester grading system</p>
              </div>
              <button
                onClick={() => setShowMarkModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  disabled
                  value={markSubject}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Assessment Target</label>
                <input
                  type="text"
                  disabled
                  value={assessmentType}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            {/* Students marks table */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-xs">
              {roster.map(s => (
                <div
                  key={s.rollNo}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800"
                >
                  <div>
                    <span className="font-mono text-cyan-400 font-bold">{s.rollNo}</span>
                    <span className="text-white ml-2">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={batchMarks[s.rollNo] || 0}
                      onChange={e =>
                        setBatchMarks(prev => ({
                          ...prev,
                          [s.rollNo]: Math.min(30, Math.max(0, parseInt(e.target.value) || 0)),
                        }))
                      }
                      className="w-16 text-center bg-slate-900 border border-slate-700 rounded-md py-1 font-mono text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-slate-500 font-mono">/ 30</span>
                  </div>
                </div>
              ))}
            </div>

            {marksSubmitted && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Marks published successfully to Student & Parent Portals!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowMarkModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setMarksSubmitted(true);
                  setTimeout(() => {
                    setMarksSubmitted(false);
                    setShowMarkModal(false);
                  }, 1500);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20"
              >
                Publish All Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
