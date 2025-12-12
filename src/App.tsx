// App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
// 🛑 Import React Spring components
import { useTransition, animated } from "react-spring"; // Assuming you are using an older version or have this package structure
// For modern React Spring, it's typically: import { useTransition, animated } from '@react-spring/web';

import { useEffect } from "react"; // <-- Import useEffect hook!

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import EventPage from "./pages/Event";
import DetailsPage from "./pages/Details";
import GalleryPage from "./pages/Gallery";
import GamesPage from "./pages/Games";
import LeaderboardPage from "./pages/Leaderboard";


// -------------------------------------------------------------------------
// Component that uses React Router hooks and manages transitions
// -------------------------------------------------------------------------
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
            <Route path="/event" element={<EventPage />} />
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

// -------------------------------------------------------------------------
// Exported component that provides the Router and handles global side effects
// -------------------------------------------------------------------------
export default function App() {
  
  // 🎯 Service Worker useEffect is added here
  useEffect(() => {
    let newWorker;
    let refreshing = false; // Flag to prevent an infinite reload loop

    if ('serviceWorker' in navigator) {
      
      // 1. Register the Service Worker
      navigator.serviceWorker.register('/sw.js').then(registration => {
        
        // 2. Listen for an update (new sw.js found)
        registration.addEventListener('updatefound', () => {
          newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              // New worker is installed and waiting (old one is still controlling the page)
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                
                // 3. Prompt the User for a refresh
                const shouldRefresh = window.confirm(
                  'A new app update is ready! Refresh now to get the latest details?'
                );

                if (shouldRefresh) {
                  // 4. Send the message to the waiting Service Worker to force activation
                  newWorker.postMessage({ action: 'skipWaiting' });
                }
              }
            });
          }
        });
      });

      // 5. Final Reload Handler
      // This event fires when the Service Worker controller changes (the new one just took over).
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        
        // The single, clean, programmatic reload to load content from the newly active SW.
        window.location.reload(); 
      });
    }

  }, []); // <-- Empty dependency array ensures this runs only once on mount


  return (
    <Router>
      <Main />
    </Router>
  );
}
