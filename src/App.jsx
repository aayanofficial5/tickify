import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import { MovieDetail } from "./pages/MovieDetail";
import { Booking } from "./pages/Booking";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { Admin } from "./pages/Admin";

const App = () => {
  return (
    <div className="font-[poppins]">
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/movie/:id" element={<MovieDetail/>} />
          <Route path="/booking/:id" element={<Booking/>} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin" element={<Auth/>}/>     
          <Route path="/admin-dashboard" element={<Admin/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
