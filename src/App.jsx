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

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
