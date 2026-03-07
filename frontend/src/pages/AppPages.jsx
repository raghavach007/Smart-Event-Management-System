import React, { useState } from 'react';
import { MapPin, QrCode, CheckCircle, Users, Upload, Maximize2, X } from 'lucide-react';
import { UPCOMING_EVENTS, MOCK_STUDENTS } from '../data';

export const EventsBoard = ({ playClick, playHover, playSuccess }) => (
  <div className="min-h-screen bg-[#1A1A1A] text-[#F0EAD6] pt-24 px-6 pb-24">
    <div className="max-w-6xl mx-auto">
      <h2 className="font-serif-retro text-5xl text-[#D4AF37] mb-12 text-center">Official Proclamations</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {UPCOMING_EVENTS.map((event) => (
          <div key={event.id} className="bg-[#252525] border border-[#D4AF37] p-8 relative hover:bg-[#2a2a2a] transition-all group hover:-translate-y-2 duration-300" onMouseEnter={playHover}>
            <div className="absolute -top-3 left-1/2 w-4 h-4 rounded-full bg-red-700 shadow-md transform -translate-x-1/2 border border-black z-10"></div>
            <div className="flex justify-between items-start mb-6">
              <div><span className="font-mono-retro text-[#D4AF37] text-xs tracking-widest block mb-1 opacity-70 group-hover:opacity-100">{event.club} PRESENTS</span>
              <h3 className="font-serif-retro text-3xl group-hover:text-white transition-colors">{event.title}</h3></div>
              <div className="text-center border border-[#555] p-2 rounded bg-[#1a1a1a] group-hover:border-[#D4AF37]"><span className="block text-xs font-mono-retro uppercase text-gray-400">Date</span><span className="block font-bold">{event.date.split(',')[0]}</span></div>
            </div>
            <div className="flex items-center gap-2 font-mono-retro text-sm text-gray-400 mb-8 w-max"><MapPin size={14} /> <span className="underline decoration-dotted underline-offset-4">{event.location}</span></div>
            <div className="flex justify-between items-center border-t border-gray-700 pt-6">
              <span className="font-mono-retro text-xs text-green-500 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> OPEN</span>
              <button onClick={() => { playClick(); playSuccess(); alert("Manifesto Signed!"); }} className="px-6 py-2 bg-[#D4AF37] text-[#1A1A1A] font-bold font-mono-retro text-xs uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">Sign The Ledger</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const RetroScanner = ({ playSuccess }) => {
  const [scanning, setScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState(null);

  const simulateScan = () => {
    setScanning(false);
    const student = MOCK_STUDENTS[Math.floor(Math.random() * MOCK_STUDENTS.length)];
    setLastScanned(student); playSuccess();
    setTimeout(() => { setLastScanned(null); setScanning(true); }, 3000);
  };

  return (
    <div className="min-h-screen bg-black pt-20 flex flex-col items-center justify-center relative overflow-hidden">
      <h2 className="text-[#D4AF37] font-serif-retro text-2xl absolute top-24 z-10 uppercase tracking-widest">8mm Viewfinder</h2>
      <div className="relative w-[90vw] max-w-md aspect-[3/4] bg-gray-900 border-8 border-[#111] rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 pointer-events-none z-20 opacity-40" style={{ backgroundImage: `radial-gradient(circle, transparent 30%, black 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)` }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"><div className={`transition-all duration-500 ${scanning ? 'w-48 h-48 opacity-30' : 'w-40 h-40 opacity-80 border-green-500'} border-2 border-[#D4AF37] rounded-sm`}></div></div>
        <div className="absolute top-4 right-4 flex items-center gap-2 z-30"><div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div><span className="font-mono-retro text-red-600 text-xs">REC</span></div>
        <div className="w-full h-full bg-[#222] flex flex-col items-center justify-center text-gray-500 relative">
           {scanning && <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.5)] animate-scan"></div>}
           {!lastScanned ? ( <> <QrCode size={64} className="opacity-20 mb-4 animate-pulse" /> <p className="font-mono-retro text-xs text-center px-8">ALIGN SUBJECT'S TICKET CODE</p> </>
           ) : (
             <div className="bg-[#D4AF37] text-black p-6 text-center animate-in zoom-in duration-300 border-4 border-white shadow-[0_0_30px_rgba(212,175,55,0.6)]">
               <CheckCircle size={48} className="mx-auto mb-2" />
               <h3 className="font-serif-retro font-bold text-xl">ACCESS GRANTED</h3>
               <p className="font-mono-retro text-sm uppercase">{lastScanned.name}</p>
             </div>
           )}
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4 z-10">
        <button onClick={simulateScan} disabled={!scanning} className="bg-[#D4AF37] text-black font-bold font-mono-retro px-8 py-4 rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-transform disabled:opacity-50 hover:bg-white">{scanning ? "SIMULATE SCAN" : "PROCESSING..."}</button>
      </div>
    </div>
  );
};

export const Ledger = () => (
    <div className="min-h-screen bg-[#E6DCC3] pt-24 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end border-b-2 border-[#1A1A1A] pb-4 mb-8">
          <div><h2 className="font-serif-retro text-4xl text-[#1A1A1A]">The Ledger</h2><p className="font-mono-retro text-sm text-gray-600 mt-1">Confidential Administrative Log</p></div>
        </div>
        <div className="bg-[#F0EAD6] border border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <h3 className="font-serif-retro text-xl mb-4 flex items-center gap-2"><Users size={20} /> Recent Entries</h3>
            <p className="py-4 text-center font-mono-retro text-gray-400 italic">No entries recorded in this session.</p>
        </div>
      </div>
    </div>
);

export const Gallery = ({ playClick, playHover }) => {
    const PHOTOS = ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80", "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80"];
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#F0EAD6] pt-24 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-4"><h2 className="font-serif-retro text-4xl tracking-widest">The Archives</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PHOTOS.map((src, idx) => (
              <div key={idx} onMouseEnter={playHover} className="group relative aspect-[4/3] bg-[#111] p-4 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 hover:z-10 hover:scale-105 cursor-pointer">
                <div className="w-full h-full overflow-hidden relative bg-black">
                   <img src={src} className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 blur-[1px] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:blur-0 transition-all duration-[1500ms] ease-out" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};