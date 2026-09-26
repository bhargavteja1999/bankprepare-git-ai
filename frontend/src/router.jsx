import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx"; // fallback monolith
import Dashboard from "./pages/Dashboard.jsx";
import Practice from "./pages/Practice.jsx";
import Quiz from "./pages/Quiz.jsx";
import MockTests from "./pages/MockTests.jsx";
import Syllabus from "./pages/Syllabus.jsx";
import Progress from "./pages/Progress.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Exams from "./pages/Exams.jsx";
import Games from "./pages/Games.jsx";
import CurrentAffairs from "./pages/CurrentAffairs.jsx";
import AITutor from "./pages/AITutor.jsx";
import Profile from "./pages/Profile.jsx";
import StudyPlan from "./pages/StudyPlan.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MistakeNotebook from "./pages/MistakeNotebook.jsx";
import AdaptiveQuiz from "./pages/AdaptiveQuiz.jsx";
import WeeklyTournament from "./pages/WeeklyTournament.jsx";
import CurrentAffairsLearning from "./pages/CurrentAffairsLearning.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// New router-based navigation (gradual migration from App.jsx state routing).
// To enable: change main.jsx to use RouterProvider with this router.
const router = createBrowserRouter([
  { path: "/", element: <App /> }, // legacy state router at root (preserves current UX)
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/practice", element: <ProtectedRoute><Practice /></ProtectedRoute> },
  { path: "/quiz", element: <ProtectedRoute><Quiz /></ProtectedRoute> },
  { path: "/mocks", element: <ProtectedRoute><MockTests /></ProtectedRoute> },
  { path: "/syllabus", element: <ProtectedRoute><Syllabus /></ProtectedRoute> },
  { path: "/progress", element: <ProtectedRoute><Progress /></ProtectedRoute> },
  { path: "/leaderboard", element: <ProtectedRoute><Leaderboard /></ProtectedRoute> },
  { path: "/exams", element: <ProtectedRoute><Exams /></ProtectedRoute> },
  { path: "/games", element: <ProtectedRoute><Games /></ProtectedRoute> },
  { path: "/current-affairs", element: <ProtectedRoute><CurrentAffairs /></ProtectedRoute> },
  { path: "/tutor", element: <ProtectedRoute><AITutor /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: "/study-plan", element: <ProtectedRoute><StudyPlan /></ProtectedRoute> },
  { path: "/mistakes", element: <ProtectedRoute><MistakeNotebook /></ProtectedRoute> },
  { path: "/adaptive", element: <ProtectedRoute><AdaptiveQuiz /></ProtectedRoute> },
  { path: "/tournament", element: <ProtectedRoute><WeeklyTournament /></ProtectedRoute> },
  { path: "/ca-learning", element: <ProtectedRoute><CurrentAffairsLearning /></ProtectedRoute> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
