import React from "react";
import { Navigate } from "react-router-dom";
import { environment } from "../../environments/environment";

const ProtectedRoute = ({ children }) => {
  if (environment.env !== "dev") {
    // Redireciona para login se não for ambiente dev
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
