/* eslint-disable */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import NewUserForm from "./components/NewUserForm.jsx";
import ForgotPasswordForm from "./components/ForgotPasswordForm.jsx";
import Dashboard from './components/Dashboard/Dashboard.jsx';

const App = () => {
  return (
        <Routes>
            {/* Перенаправлення на логін за замовчуванням */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<NewUserForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
  );
};

export default App;
