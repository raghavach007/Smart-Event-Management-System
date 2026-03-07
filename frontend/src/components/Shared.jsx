import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Activity, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TELEGRAPH_NEWS } from '../data';

export const GrainOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.07] mix-blend-multiply"
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
  />
);

export const NavTicket = ({ soundEnabled, toggleSound, playClick, playHover, onAuthClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleNav = (path) => { 
    playClick(); 
    navigate(path); 
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-[#F0EAD6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col md:flex-row justify-between items-center px-6 py-3 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_#D4AF37]">

      <div 
        className="flex items-center gap-2 mb-2 md:mb-0 cursor-pointer group"
        onClick={() => handleNav('/')}
      >
        <div className="w-8 h-8 bg-[#1A1A1A] text-[#F0EAD6] flex items-center justify-center font-serif-retro font-bold rounded-sm group-hover:rotate-12 transition-transform">S</div>
        <h1 className="font-serif-retro text-xl font-bold tracking-widest text-[#1A1A1A]">CULTURA</h1>
      </div>

      <div className="flex gap-1 md:gap-6 overflow-x-auto max-w-full scrollbar-hide items-center">

        {[
          {name: 'Events', path: '/events'},
          {name: 'Archives', path: '/gallery'},
          {name: 'Scan Here', path: '/scanner'},
          {name: 'Ledger', path: '/dashboard'}
        ].map((tab) => (

          <button 
            key={tab.name}
            onClick={() => handleNav(tab.path)}
            onMouseEnter={playHover}
            className={`uppercase font-mono-retro text-xs md:text-sm tracking-wider px-3 py-1 transition-all border border-transparent relative overflow-hidden 
            ${location.pathname === tab.path 
              ? 'bg-[#D4AF37] text-white border-[#1A1A1A]' 
              : 'hover:text-[#D4AF37] text-[#1A1A1A] group'}`}
          >
            <span className="relative z-10">{tab.name}</span>
          </button>

        ))}

      </div>

      <div className="hidden md:flex items-center gap-4 font-mono-retro text-xs border-l border-[#1A1A1A] pl-4 ml-4">

        <button 
          onClick={() => { playClick(); toggleSound(); }} 
          className="hover:text-[#D4AF37] transition-colors"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <div className="flex items-center gap-2">
          <Activity size={14} className="text-green-600 animate-pulse" />
          <span>LIVE: 142</span>
        </div>

        {user.role === 'GUEST' ? (
          <button onClick={onAuthClick} className="ml-2 hover:text-[#D4AF37]">
            <Lock size={14}/>
          </button>
        ) : (
          <button 
            onClick={logout} 
            className="ml-2 text-red-600 hover:text-red-800 uppercase"
          >
            Exit
          </button>
        )}

      </div>
    </nav>
  );
};

export const TelegraphTicker = () => (
  <div className="fixed bottom-0 left-0 w-full bg-[#1A1A1A] text-[#D4AF37] font-mono-retro text-xs py-2 z-40 border-t border-[#D4AF37] overflow-hidden whitespace-nowrap flex">
    <div className="animate-marquee flex gap-8 items-center">
      {TELEGRAPH_NEWS.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          {item}
          <span className="w-2 h-2 bg-[#D4AF37] rounded-full opacity-50"></span>
        </span>
      ))}
      {TELEGRAPH_NEWS.map((item, i) => (
        <span key={`d-${i}`} className="flex items-center gap-8">
          {item}
          <span className="w-2 h-2 bg-[#D4AF37] rounded-full opacity-50"></span>
        </span>
      ))}
    </div>
  </div>
);

export const PunchCardAuth = ({ onClose, playClick, playError, playSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleNum = (num) => {
    playClick();
    if (code.length < 4) {
      setCode(prev => prev + num);
      setError(false);
    }
  };

  const handleEnter = () => {
    if (login(code)) {
      playSuccess();
      onClose();
    } else {
      playError();
      setError(true);
      setTimeout(() => {
        setCode("");
        setError(false);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur flex items-center justify-center">
      <div className="bg-[#111] border-2 border-[#333] p-8 rounded-lg shadow-2xl max-w-sm w-full relative">

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <Lock size={40} className={`mx-auto mb-4 ${error ? 'text-red-500 animate-shake' : 'text-[#D4AF37]'}`} />
          <h3 className="font-mono-retro text-[#D4AF37] text-xl tracking-widest">SECURITY GATE</h3>
          <p className="text-[10px] text-gray-500 mt-2 font-mono-retro">ADMIN: 0000 | MEMBER: 1111</p>
        </div>

        <div className="bg-[#000] border border-[#333] p-4 mb-6 text-center">
          <span className={`font-mono-retro text-3xl tracking-[1em] ${error ? 'text-red-500' : 'text-white'}`}>
            {code.padEnd(4, '•')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button
              key={num}
              onClick={() => handleNum(num)}
              className="bg-[#222] text-gray-300 p-4 font-mono-retro hover:bg-[#D4AF37] hover:text-black transition-colors rounded"
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => { playClick(); setCode(""); }}
            className="bg-[#300] text-red-500 p-4 font-mono-retro hover:bg-red-900 rounded"
          >
            CLR
          </button>

          <button
            onClick={() => handleNum(0)}
            className="bg-[#222] text-gray-300 p-4 font-mono-retro hover:bg-[#D4AF37] hover:text-black transition-colors rounded"
          >
            0
          </button>

          <button
            onClick={handleEnter}
            className="bg-[#030] text-green-500 p-4 font-mono-retro hover:bg-green-900 rounded"
          >
            ENT
          </button>
        </div>
      </div>
    </div>
  );
};

export const TypewriterText = ({ text, delay = 50 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
};
