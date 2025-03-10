import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import Login from "./pages/Login";


import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Home from "./pages/dashboardPages/Home";
import CreateAgent from "./pages/dashboardPages/CreateAgents";
import "./App.css";
import ManageAgents from "./pages/dashboardPages/ManageAgents";
import ManageTickets from "./pages/dashboardPages/ManageTickets";
import Transactions from "./pages/dashboardPages/Transactions";
// import Login from "./pages/Login";

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Redirect to Dashboard if logged in, otherwise show Login */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Protected route for Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} >
          <Route path="home" element={<Home />} />
          <Route path="create-agent" element={<CreateAgent />} />
          <Route path="manage-agents" element={<ManageAgents />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="tickets" element={<ManageTickets />} />
          <Route index element={<Navigate to="home" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
