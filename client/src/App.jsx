import { BrowserRouter, Routes, Route } from "react-router-dom";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/Login";
import RadialNav from "./components/RadialNav";

function App() {
  return (
    <BrowserRouter>
      <RadialNav />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
