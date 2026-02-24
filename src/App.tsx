import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Toaster } from "./components/ui/sonner";

const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const UserDashboard = React.lazy(() => import("./pages/dashboards/UserDashboard"));
const DeptAdminDashboard = React.lazy(() => import("./pages/dashboards/DeptAdminDashboard"));
const SystemAdminDashboard = React.lazy(() => import("./pages/dashboards/SystemAdminDashboard"));

// System Admin Pages
const BuildingsPage = React.lazy(() => import("./features/systemAdmin/pages/BuildingsPage"));
const FloorsPage = React.lazy(() => import("./features/systemAdmin/pages/FloorsPage"));
const DepartmentsPage = React.lazy(() => import("./features/systemAdmin/pages/DepartmentsPage"));
const ResourcesPage = React.lazy(() => import("./features/systemAdmin/pages/ResourcesPage"));
const DeskModesPage = React.lazy(() => import("./features/systemAdmin/pages/DeskModesPage"));
const DeskAssignmentsPage = React.lazy(() => import("./features/systemAdmin/pages/DeskAssignmentsPage"));
const AllBookingsPage = React.lazy(() => import("./features/systemAdmin/pages/AllBookingsPage"));
const WaitlistsPage = React.lazy(() => import("./features/systemAdmin/pages/WaitlistsPage"));
const ReportsPage = React.lazy(() => import("./features/systemAdmin/pages/ReportsPage"));
const JobHistoryPage = React.lazy(() => import("./features/systemAdmin/pages/JobHistoryPage"));
const BatchJobsPage = React.lazy(() => import("./features/systemAdmin/pages/BatchJobsPage"));
const SettingsPage = React.lazy(() => import("./features/systemAdmin/pages/SettingsPage"));

// User Pages (To be implemented)
// const DiscoveryPage = React.lazy(() => import("./features/user/pages/DiscoveryPage"));
// const MyBookingsPage = React.lazy(() => import("./features/user/pages/MyBookingsPage"));
// const MyWaitlistPage = React.lazy(() => import("./features/user/pages/MyWaitlistPage"));
// const BestSlotsPage = React.lazy(() => import("./features/user/pages/BestSlotsPage"));

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole?: 'USER' | 'DEPARTMENT_ADMIN' | 'SYSTEM_ADMIN' 
}) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { user } = useAuth();

  if (isLoading) {
    return <>loading...</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // SYSTEM_ADMIN and DEPARTMENT_ADMIN can access lower-level dashboards if needed, 
    // but the logic here is strict. Let's allow admins to access USER routes.
    if (requiredRole === 'USER' && (user?.role === 'SYSTEM_ADMIN' || user?.role === 'DEPARTMENT_ADMIN')) {
      return <>{children}</>;
    }
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const HomeRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <>loading...</>;

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'SYSTEM_ADMIN':
      return <Navigate to="/system-admin" />;
    case 'DEPARTMENT_ADMIN':
      return <Navigate to="/dept-admin" />;
    case 'USER':
    default:
      return <Navigate to="/dashboard" />;
  }
};

export default function App() {
  return (
    <Suspense fallback={<>loading...</>}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* System Admin Routes */}
            <Route
              path="/register"
              element={
                <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/system-admin"
              element={
                <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                  <SystemAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/system-admin/buildings" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><BuildingsPage /></ProtectedRoute>} />
            <Route path="/system-admin/floors" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><FloorsPage /></ProtectedRoute>} />
            <Route path="/system-admin/departments" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><DepartmentsPage /></ProtectedRoute>} />
            <Route path="/system-admin/resources" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><ResourcesPage /></ProtectedRoute>} />
            <Route path="/system-admin/desk-modes" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><DeskModesPage /></ProtectedRoute>} />
            <Route path="/system-admin/desk-assignments" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><DeskAssignmentsPage /></ProtectedRoute>} />
            <Route path="/system-admin/bookings" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><AllBookingsPage /></ProtectedRoute>} />
            <Route path="/system-admin/waitlists" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><WaitlistsPage /></ProtectedRoute>} />
            <Route path="/system-admin/reports" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><ReportsPage /></ProtectedRoute>} />
            <Route path="/system-admin/job-history" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><JobHistoryPage /></ProtectedRoute>} />
            <Route path="/system-admin/batch-jobs" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><BatchJobsPage /></ProtectedRoute>} />
            <Route path="/system-admin/settings" element={<ProtectedRoute requiredRole="SYSTEM_ADMIN"><SettingsPage /></ProtectedRoute>} />

            {/* Dept Admin Routes */}
            <Route
              path="/dept-admin"
              element={
                <ProtectedRoute requiredRole="DEPARTMENT_ADMIN">
                  <DeptAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            {/* User Sub-routes can be added here or inside UserDashboard with nested routes */}

            <Route path="/" element={<HomeRedirect />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </Suspense>
  );
}
