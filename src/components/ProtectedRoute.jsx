import React from "react";
import { Navigate } from "react-router-dom";
import { environment } from "../../environments/environment";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => !!localStorage.getItem("authToken");

  if (environment.env !== "dev" && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
