// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Check if the current URL path is for the details or gallery pages and scroll to top
    if (
      location.pathname === "/details" ||
      location.pathname === "/gallery" ||
      location.pathname === "/games" ||
      location.pathname === "/leaderboard"
    ) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return null;
}
