// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Check if the current URL path is for the details or gallery pages and scroll to top
    if (location.pathname === "/details" || location.pathname === "/gallery") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}
