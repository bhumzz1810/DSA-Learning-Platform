import { BrowserRouter, Routes, Route } from "react-router-dom";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/Login";
import RadialNav from "./components/RadialNav";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import { ThemeProvider } from './components/ThemeContext';
import JoinRoom from './pages/JoinRoom';
import CodingRoom from './pages/CodingRoom';

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
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/coding-room" element={<CodingRoom />} />
          <Route path="/coding-room/:roomId" element={<CodingRoom />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
