import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

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
import SocialLogin from "./pages/SocialLogin";
import Onboarding from "./pages/Onboarding";
import Leaderboard from "./pages/Leaderboard";
import Profilepage from "./pages/Profilepage";
import SubscriptionPage from "./pages/subscription";
import Settings from "./pages/Settings";
import QuizPage from "./pages/QuizPage";
import UserList from "./pages/admin/UserList";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import UserAuthRoute from "./components/UserAuthRoute";
import ResetPassword from "./pages/ResetPassword";
import BillingSuccess from "./pages/BillingSuccess";

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
      />

      <HashRouter>
        <LayoutWrapper>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <UserAuthRoute type="public">
                  <Homepage />
                </UserAuthRoute>
              }
            />
            <Route
              path="/login"
              element={
                <UserAuthRoute type="public">
                  <LoginPage />
                </UserAuthRoute>
              }
            />
            <Route
              path="/social-login"
              element={
                <UserAuthRoute type="public">
                  <SocialLogin />
                </UserAuthRoute>
              }
            />
            {/* PRIVATE ROUTES */}
            <Route
              path="/problems"
              element={
                <UserAuthRoute type="public">
                  <Problems />
                </UserAuthRoute>
              }
            />
            <Route
              path="/problems/:id"
              element={
                <UserAuthRoute type="public">
                  <ProblemDetail />
                </UserAuthRoute>
              }
            />

            <Route path="/billing/success" element={<BillingSuccess />} />
            <Route path="/billing/cancel" element={<BillingCancel />} />
            <Route
              path="/dashboard"
              element={
                <UserAuthRoute type="private">
                  <Dashboard />
                </UserAuthRoute>
              }
            />
            <Route
              path="/join-room"
              element={
                <UserAuthRoute type="private">
                  <JoinRoom />
                </UserAuthRoute>
              }
            />
            <Route
              path="/coding-room"
              element={
                <UserAuthRoute type="private">
                  <CodingRoom />
                </UserAuthRoute>
              }
            />
            <Route
              path="/coding-room/:roomId"
              element={
                <UserAuthRoute type="private">
                  <CodingRoom />
                </UserAuthRoute>
              }
            />
            <Route
              path="/playground"
              element={
                <UserAuthRoute type="private">
                  <CodingRoom />
                </UserAuthRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <UserAuthRoute type="private">
                  <Onboarding />
                </UserAuthRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <UserAuthRoute type="private">
                  <Leaderboard />
                </UserAuthRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <UserAuthRoute type="private">
                  <Profilepage />
                </UserAuthRoute>
              }
            />
            <Route
              path="/subscribe"
              element={
                <UserAuthRoute type="private">
                  <SubscriptionPage />
                </UserAuthRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <UserAuthRoute type="private">
                  <Settings />
                </UserAuthRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <UserAuthRoute type="private">
                  <QuizPage />
                </UserAuthRoute>
              }
            />
            {/* ADMIN ROUTES */}
            <Route
              path="/admin/add-problem"
              element={
                <UserAuthRoute type="private">
                  <AddProblem />
                </UserAuthRoute>
              }
            />
            <Route
              path="/admin/problems"
              element={
                <UserAuthRoute type="private">
                  <ProblemList />
                </UserAuthRoute>
              }
            />
            <Route
              path="/admin/problems/edit/:id"
              element={
                <UserAuthRoute type="private">
                  <EditProblem />
                </UserAuthRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <UserAuthRoute type="private">
                  <UserList />
                </UserAuthRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={<h1 className="text-center mt-10">🚫 Unauthorized</h1>}
            />
          </Routes>
        </LayoutWrapper>
      </HashRouter>
    </>
  );
}

export default App;
