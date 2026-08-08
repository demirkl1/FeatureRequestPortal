import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { POLICIES } from './auth/policies';
import { LanguageProvider } from './i18n';
import { ToastProvider } from './components/ToastProvider';
import { Layout } from './components/Layout';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';
import { CreatePage } from './pages/CreatePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { PendingApprovalPage } from './pages/PendingApprovalPage';
import { AdminRegistrationsPage } from './pages/AdminRegistrationsPage';

function RequireAuth({ children }: { children: ReactElement }) {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!currentUser.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAdmin({ children }: { children: ReactElement }) {
  const { currentUser, hasPolicy, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!currentUser.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!hasPolicy(POLICIES.Approve)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ListPage />} />
        <Route path="/requests/:id" element={<DetailPage />} />
        <Route
          path="/new"
          element={
            <RequireAuth>
              <CreatePage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email/:userId" element={<VerifyEmailPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route
          path="/admin/registrations"
          element={
            <RequireAdmin>
              <AdminRegistrationsPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
