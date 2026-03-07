import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useRetroSound } from "./utils/audio";
import {
  GrainOverlay,
  NavTicket,
  TelegraphTicker,
  PunchCardAuth,
} from "./components/Shared";

import { Home } from "./pages/Home";
import { EventsBoard, RetroScanner, Ledger, Gallery } from "./pages/AppPages";
import Arena from "./pages/Arena";   // ✅ Arena page

const MainLayout = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const { playClick, playSuccess, playError, playHover } =
    useRetroSound(soundEnabled);

  return (
    <div className="min-h-screen w-full bg-[#F0EAD6] text-[#1A1A1A] selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      
      <GrainOverlay />

      {/* LOGIN POPUP */}
      {showAuth && (
        <PunchCardAuth
          onClose={() => setShowAuth(false)}
          playClick={playClick}
          playError={playError}
          playSuccess={playSuccess}
        />
      )}

      {/* NAVBAR */}
      <NavTicket
        soundEnabled={soundEnabled}
        toggleSound={() => setSoundEnabled(!soundEnabled)}
        playClick={playClick}
        playHover={playHover}
        onAuthClick={() => setShowAuth(true)}
      />

      {/* PAGES */}
      <main className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={<Home playClick={playClick} playHover={playHover} />}
          />

          <Route
            path="/events"
            element={
              <EventsBoard
                playClick={playClick}
                playHover={playHover}
                playSuccess={playSuccess}
              />
            }
          />

          <Route
            path="/gallery"
            element={<Gallery playClick={playClick} playHover={playHover} />}
          />

          <Route
            path="/scanner"
            element={<RetroScanner playSuccess={playSuccess} />}
          />

          <Route path="/dashboard" element={<Ledger />} />

          {/* ⭐ ARENA REGISTRATION PAGE */}
          <Route path="/arena" element={<Arena />} />

        </Routes>
      </main>

      {/* FOOTER TICKER */}
      <TelegraphTicker />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}