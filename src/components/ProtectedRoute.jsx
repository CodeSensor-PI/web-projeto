import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { environment } from "../../environments/environment";
import { validateSession } from "../provider/api/auth/auth";

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    if (environment.env === "dev") {
      setAuthorized(true);
      return;
    }

    mounted.current = true;
    validateSession()
      .then(() => {
        if (mounted.current) setAuthorized(true);
      })
      .catch(() => {
        if (mounted.current) setAuthorized(false);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  if (authorized === null) return <div>Carregando...</div>;
  if (!authorized) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
