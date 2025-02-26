import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { useAuthStore } from './store/auth';
import Search from './pages/Search';
import CaseForm from './pages/CaseForm';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log("Auth Status:", isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    initializeAuth();
    setIsAuthLoaded(true);
  }, []);

  // Prevent routing until auth is loaded
  if (!isAuthLoaded) {
    return <div>Loading...</div>; // Show a loading screen until auth is checked
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="search" element={<Search />} />
          <Route path="case-form" element={<CaseForm />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
