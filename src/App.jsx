import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegisterPage from "./auth/RegisterPage";
import Footer from "./components/Footer";
import UserSettingsPage from "./pages/UserSettingsPage";
import LocationsPage from "./pages/LocationsPage";
import LocationInfoPage from "./pages/LocationsInfoPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/:id" element={<LocationInfoPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<UserSettingsPage />} />
            <Route path="/bookings/me" element={<MyBookingsPage />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/manage-bookings" element={<AdminBookingsPage />} />
          </Route>

          <Route
            path="*"
            element={<div className="container-app py-6">404</div>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
