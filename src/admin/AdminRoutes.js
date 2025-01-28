import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Calculators from './pages/Calculators';

// Placeholder components for other pages
const Submissions = () => <div>Submissions Page</div>;
const Agents = () => <div>Agents Page</div>;
const Settings = () => <div>Settings Page</div>;

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="calculators" element={<Calculators />} />
                <Route path="submissions" element={<Submissions />} />
                <Route path="agents" element={<Agents />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
        </Routes>
    );
}
