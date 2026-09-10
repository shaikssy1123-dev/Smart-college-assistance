import React, { useState } from 'react';
import { UserProfile, UserRole, SmartAlert } from './types';
import {
  DEMO_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_EXAM_SCHEDULE,
  INITIAL_ASSIGNMENTS,
  INITIAL_ALERTS,
  INITIAL_FEES,
} from './data/mockData';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { StudentPortal } from './components/portals/StudentPortal';
import { FacultyPortal } from './components/portals/FacultyPortal';
import { ParentPortal } from './components/portals/ParentPortal';
import { AdminPortal } from './components/portals/AdminPortal';
import { AttendancePredictor } from './components/AttendancePredictor';
import { CgpaPredictor } from './components/CgpaPredictor';
import { CampusNavigation } from './components/CampusNavigation';
import { ChatbotDrawer } from './components/ChatbotDrawer';

export default function App() {
  // Authentication State (default logged in as student for instant preview, can logout to LoginPage anytime)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS.student);
  
  // Navigation & UI States
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Core Data Collections
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [marks, setMarks] = useState(INITIAL_MARKS);
  const [exams, setExams] = useState(INITIAL_EXAM_SCHEDULE);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_ALERTS);
  const [fees, setFees] = useState(INITIAL_FEES);

  // Switch role seamlessly
  const handleSwitchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role];
    setCurrentUser(newUser);
    setActiveView('dashboard');
  };

  // Broadcast alert from Admin portal
  const handleBroadcastAlert = (newAlert: SmartAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  // If user is logged out, show Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={user => setCurrentUser(user)} />;
  }

  return (
    <DashboardLayout
      currentUser={currentUser}
      activeView={activeView}
      onSelectView={setActiveView}
      onSwitchRole={handleSwitchRole}
      onLogout={() => setCurrentUser(null)}
      onOpenChat={() => setIsChatOpen(true)}
      alerts={alerts}
    >
      {/* View 1: Main Dashboard (Role-specific Portal) */}
      {activeView === 'dashboard' && (
        <>
          {currentUser.role === 'student' && (
            <StudentPortal
              user={currentUser}
              attendance={attendance}
              marks={marks}
              exams={exams}
              assignments={assignments}
              alerts={alerts}
              onOpenPredictor={() => setActiveView('attendance_predictor')}
              onOpenPlanner={() => setActiveView('cgpa_planner')}
              onOpenChat={() => setIsChatOpen(true)}
            />
          )}

          {currentUser.role === 'faculty' && (
            <FacultyPortal user={currentUser} />
          )}

          {currentUser.role === 'parent' && (
            <ParentPortal
              user={currentUser}
              attendance={attendance}
              fees={fees}
            />
          )}

          {currentUser.role === 'admin' && (
            <AdminPortal onBroadcastAlert={handleBroadcastAlert} />
          )}
        </>
      )}

      {/* View 2: AI Attendance Predictor */}
      {activeView === 'attendance_predictor' && (
        <AttendancePredictor initialSubjects={attendance} />
      )}

      {/* View 3: CGPA & Smart Study Planner */}
      {activeView === 'cgpa_planner' && (
        <CgpaPredictor initialMarks={marks} />
      )}

      {/* View 4: Campus Navigation & Lab Tracker */}
      {activeView === 'campus_navigation' && (
        <CampusNavigation />
      )}

      {/* Persistent AI Academic Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeRole={currentUser.role}
      />
    </DashboardLayout>
  );
}
