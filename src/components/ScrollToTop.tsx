// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const pagesToScrollTop = ["/details", "/gallery", "/games"];

    if (pagesToScrollTop.includes(location.pathname)) {
      // ⏳ Delay to avoid showing previous page's top (HeroSection)
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 350);

      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  return null;
}
