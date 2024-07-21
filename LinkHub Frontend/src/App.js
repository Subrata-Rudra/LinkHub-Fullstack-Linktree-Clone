import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import AuthenticationPage from "./pages/authenticationPage";
import DashboardPage from "./pages/dashboardPage";
import InsightsPage from "./pages/insightsPage";
import AccountPage from "./pages/accountPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} exact />
        <Route path="/auth" element={<AuthenticationPage />} exact />
        <Route path="/dashboard" element={<DashboardPage />} exact />
        <Route path="/insights" element={<InsightsPage />} exact />
        <Route path="/account" element={<AccountPage />} exact />
      </Routes>
    </div>
  );
}

export default App;
