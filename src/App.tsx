// App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
// 🛑 Import React Spring components
import { useTransition, animated } from "@react-spring/web";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import DetailsPage from "./pages/Details";
import GalleryPage from "./pages/Gallery";
import GamesPage from "./pages/Games";
import LeaderboardPage from "./pages/Leaderboard";

// Component that uses React Router hooks and manages transitions
function Main() {
  const location = useLocation();

  // 🛑 useTransition hook is the core of the animation.
  const transitions = useTransition(location, {
    key: location.pathname,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 150, friction: 18 },
  });

  return (
    <>
      <ScrollToTop />
      <Navbar />

      {/* 🛑 Render the transitions managed by React Spring */}
      {transitions((styles, item) => (
        <animated.div
          style={{
            ...styles,
            position: "absolute",
            width: "100%",
            minHeight: "100vh",
            top: 0,
            left: 0,
          }}>
          {/* Routes must receive the location object (item) from the transition hook */}
          <Routes location={item}>
            <Route path="/" element={<HomePage />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </animated.div>
      ))}
    </>
  );
}

// Exported component that provides the Router and handles global side effects
export default function App() {
  // Service Worker useEffect remains here

  return (
    <Router>
      <Main />
    </Router>
  );
}
