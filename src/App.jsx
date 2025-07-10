import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import { MovieDetail } from "./pages/MovieDetail";
import { Booking } from "./pages/Booking";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { Footer } from "./components/Common/Footer";
import AdminRoute from "./components/Core/Auth/AdminRoute";
import UserRoute from "./components/Core/Auth/UserRoute";
import NotFound from "./components/Common/NotFound";


const App = () => {
  return (
    <div className="font-[poppins]">
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          
          {/* Protected User Routes */}
          <Route
            path="/booking/:id"
            element={
              <UserRoute>
                <Booking />
              </UserRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <UserRoute>
                <MyBookings />
              </UserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserRoute>
                <Profile />
              </UserRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<Auth />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
