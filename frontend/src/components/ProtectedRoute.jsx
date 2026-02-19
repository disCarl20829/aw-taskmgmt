import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import api from "../config/api";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (location.pathname === "/signin" || location.pathname === "/signup") {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/check");

        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/signin", { replace: true });
        } else {
          console.error(err);
        }
      }
    };

    checkUser();
  }, [location.pathname, navigate]);

  if (loading) return <div>Loading...</div>

  return <Outlet />;
};

export default ProtectedRoute;
