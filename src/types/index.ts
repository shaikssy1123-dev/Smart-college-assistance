export type UserRole = 'student' | 'faculty' | 'parent' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  rollNo?: string;
  semester?: number;
  designation?: string;
  childName?: string;
  childRollNo?: string;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  facultyName: string;
  credits: number;
  room: string;
  riskLevel: 'safe' | 'warning' | 'critical';
}

export interface SubjectMarks {
  id: string;
  code: string;
  name: string;
  credits: number;
  midTerm1: number; // out of 30
  midTerm2: number; // out of 30
  assignmentQuiz: number; // out of 20
  labPractical: number; // out of 20
  targetEndSem: number; // out of 100
  totalInternal: number; // scaled
  predictedGrade: string;
  predictedGradePoint: number;
  isWeakSubject?: boolean;
}

export interface ExamScheduleItem {
  id: string;
  code: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  seatNo: string;
  syllabusUnits: string[];
  daysRemaining: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  code: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  points: number;
  maxPoints?: number;
  submittedOn?: string;
  description: string;
}

export interface SmartAlert {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  time: string;
  read: boolean;
  category: 'attendance' | 'exam' | 'fee' | 'general';
}

export interface FeeItem {
  id: string;
  title: string;
  term: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptNo?: string;
  paidDate?: string;
}

export interface LeaveRequest {
  id: string;
  studentName: string;
  rollNo: string;
  subject: string;
  fromDate: string;
  toDate: string;
  reason: string;
  leaveType: 'Medical' | 'On-Duty' | 'Personal';
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  attachmentName?: string;
  actionRemarks?: string;
}

export interface CampusRoom {
  id: string;
  roomNumber: string;
  name: string;
  type: 'lab' | 'classroom' | 'study_lounge' | 'seminar_hall';
  capacity: number;
  occupied: number;
  isFree: boolean;
  facilities: string[];
  currentActivity?: string;
  nextFreeAt?: string;
  powerSocketsAvailable: boolean;
}

export interface CampusFloor {
  floorNumber: number;
  floorName: string;
  rooms: CampusRoom[];
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  category: 'Academic' | 'Computing' | 'Library' | 'Admin' | 'Recreation';
  floors: CampusFloor[];
  coordinates: { x: number; y: number }; // map svg percentage
  description: string;
}

export interface MicroStudyTask {
  id: string;
  day: string;
  timeSlot: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  priority: 'high' | 'medium' | 'normal';
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  isAiResponse?: boolean;
}
