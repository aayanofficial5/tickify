
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.admin !== true ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
