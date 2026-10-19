import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Assessment from "./pages/Assessment.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Jobs from "./pages/Jobs.jsx";
import { Loading } from "./components/UI.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading/>;
  return user ? children : <Navigate to="/login" replace/>;
}
export default function App() {
  return <Routes>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/register" element={<Auth mode="register"/>}/>
    <Route path="/" element={<Protected><Layout/></Protected>}>
      <Route index element={<Dashboard/>}/>
      <Route path="assessment" element={<Assessment/>}/>
      <Route path="roadmap" element={<Roadmap/>}/>
      <Route path="jobs" element={<Jobs/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
