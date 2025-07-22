import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/Login";
import Navbar from "./components/Navbar/Navbar";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import AddProblem from "./pages/admin/AddProblem";
import ProblemList from "./pages/admin/ProblemList";
import EditProblem from "./pages/admin/EditProblem";
import JoinRoom from "./pages/JoinRoom";
import CodingRoom from "./pages/CodingRoom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import SocialLogin from "./pages/SocialLogin";
import Onboarding from "./pages/Onboarding";
import Leaderboard from "./pages/Leaderboard";
import Profilepage from "./pages/Profilepage";
import SubscriptionPage from "./pages/subscription";
import Settings from "./pages/Settings";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <>
      <ToastContainer
        transition={Slide}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            {/* USER ROUTES */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/coding-room" element={<CodingRoom />} />
            <Route path="/coding-room/:roomId" element={<CodingRoom />} />
            <Route path="/playground" element={<CodingRoom />} />
            <Route path="/social-login" element={<SocialLogin />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/subscribe" element={<SubscriptionPage />} />
            <Route path="/settings" element={<Settings />} />

            {/* ADMIN ROUTES */}
            <Route path="/admin/add-problem" element={<AddProblem />} />
            <Route path="/admin/problems" element={<ProblemList />} />
            <Route path="/admin/problems/edit/:id" element={<EditProblem />} />
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
    </>
  );
}

export default App;
