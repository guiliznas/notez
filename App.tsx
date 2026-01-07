import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import QuickNotePage from "./pages/QuickNotePage";
import AgendaPage from "./pages/AgendaPage";
import SettingsPage from "./pages/SettingsPage";
import ArchivedGroupsPage from "./pages/ArchivedGroupsPage";
import LoginPage from "./pages/LoginPage";
import BottomNav from "./components/BottomNav";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith("/quick-note");

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      {/* Mobile Container Simulation */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative overflow-hidden">
        {children}
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

// Fix: Change children to optional to satisfy TS when used in Route element prop
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user, loading } = useApp();

  console.log(
    "[APPROUTES] Renderizando rotas - loading:",
    loading,
    "user:",
    user ? user.email : "sem usuário"
  );

  if (loading) {
    console.log("[APPROUTES] Mostrando tela de loading");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log("[APPROUTES] Renderizando sistema de rotas");
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <GroupsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:id"
        element={
          <ProtectedRoute>
            <GroupDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quick-note"
        element={
          <ProtectedRoute>
            <QuickNotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agenda"
        element={
          <ProtectedRoute>
            <AgendaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/archived"
        element={
          <ProtectedRoute>
            <ArchivedGroupsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  console.log("[APP] Renderizando componente App");
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
