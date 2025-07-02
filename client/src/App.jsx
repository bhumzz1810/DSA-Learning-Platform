import { BrowserRouter, Routes, Route } from "react-router-dom";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/Login";
import RadialNav from "./components/RadialNav";
import Navbar from "./components/Navbar/Navbar";
import AddProblem from "./pages/admin/AddProblem";
import ProblemList from "./pages/admin/ProblemList";
import EditProblem from "./pages/admin/EditProblem";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        {/* <RadialNav /> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Add more routes as needed */}
          {/* ADMIN ROUTES */}
          <Route path="/admin/add-problem" element={<AddProblem />} />
          <Route path="/admin/problems" element={<ProblemList />} />
          <Route path="/admin/problems/edit/:id" element={<EditProblem />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
