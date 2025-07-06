import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShowDetails from "./pages/ShowDetails";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Reciept";
import MyBookings from "./pages/MyBookings";
import NavBar from "./components/NavBar";
import { MovieDetail } from "./pages/MovieDetail";
import { Booking } from "./pages/Booking";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

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
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
