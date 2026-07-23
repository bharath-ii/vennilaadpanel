import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductManager from './pages/ProductManager';
import Login from './pages/Login';
import Technicians from './pages/Technicians';
import EnquiriesManager from './pages/EnquiriesManager';

// Protected Route Component (Bypassed)
const ProtectedRoute = ({ children }) => {
  return children;
};


// Layout Component (Sidebar + Content)
const AdminLayout = ({ children }) => (
  <div className="flex h-screen bg-[#f3f4f6] text-gray-800 font-sans overflow-hidden selection:bg-[#00b894] selection:text-white">
    <Sidebar />
    <main className="flex-1 overflow-hidden relative flex flex-col">
      {/* Top decorative loading line (static for design) */}
      <div className="h-1 bg-gray-200 w-full">
        <div className="h-full bg-[#00b894] w-0 animate-[load_1s_ease-out_forwards]"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/temper" replace />} />
        <Route path="/temper" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="Temper" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/combo" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="Combo Folder" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/frame" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="Frame" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/battery" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="Battery" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/cc-board" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="CC Board" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/on-off-volume" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="On Off Volume Strip" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/back-case" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="Back Case" /></AdminLayout>
          </ProtectedRoute>
        } />
        {/* Legacy redirect fallbacks */}
        <Route path="/screen-guard" element={<Navigate to="/temper" replace />} />
        <Route path="/phone-case" element={<Navigate to="/back-case" replace />} />
        <Route path="/center-panel" element={<Navigate to="/frame" replace />} />
        <Route path="/pc-build" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="PC Build" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/mobile-services" element={
          <ProtectedRoute>
            <AdminLayout><ProductManager category="Mobile Services" /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/technicians" element={
          <ProtectedRoute>
            <AdminLayout><Technicians /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/enquiries" element={
          <ProtectedRoute>
            <AdminLayout><EnquiriesManager /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/temper" replace />} />
      </Routes>
    </Router>
  );
}

export default App;