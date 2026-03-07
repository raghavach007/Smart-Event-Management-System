import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { TypewriterText } from "../components/Shared";
import { DEPARTMENTS } from "../data";

const VintageGeometry = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[3, 0, -5]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.15} />
      </mesh>

      <mesh position={[-4, -2, -8]}>
        <octahedronGeometry args={[3, 0]} />
        <meshBasicMaterial color="#1A1A1A" wireframe transparent opacity={0.2} />
      </mesh>
    </Float>
  );
};

const TiltCard = ({ dept, playHover, playClick }) => {
  const navigate = useNavigate();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [joined, setJoined] = useState(false);

  const handleMouseMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();

    setRotate({
      x: ((e.clientY - box.top) - box.height / 2) / 20,
      y: (box.width / 2 - (e.clientX - box.left)) / 20
    });
  };

  const handleCardClick = () => {
    if (dept.name.toLowerCase().includes("arena")) {
      navigate("/arena");
    }
  };

  return (
    <div
      className="min-w-[300px] h-[400px] perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      onMouseEnter={playHover}
      onClick={handleCardClick}
    >
      <div
        className="w-full h-full bg-[#F0EAD6] border-2 border-[#1A1A1A] p-6 relative group cursor-pointer transition-transform duration-100 ease-out flex flex-col shadow-[8px_8px_0px_0px_#1A1A1A]"
        style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-5 pointer-events-none">
          {dept.icon}
        </div>

        <div className="z-10 relative h-full flex flex-col justify-between pointer-events-none">
          <div>
            <div className="text-6xl mb-4">{dept.icon}</div>

            <h3 className="font-serif-retro text-2xl font-bold mb-2">
              {dept.name}
            </h3>

            <p className="font-mono-retro text-xs uppercase tracking-widest text-[#D4AF37] mb-4">
              {dept.type}
            </p>

            <p className="font-mono-retro text-sm text-gray-600">
              {dept.desc}
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-4 flex justify-between items-center font-mono-retro text-xs pointer-events-auto">
            <span>MEMBERS: {dept.members}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                setJoined(true);
              }}
              className={`font-bold ${
                joined
                  ? "text-green-600"
                  : "text-[#D4AF37] hover:text-[#1A1A1A]"
              }`}
            >
              {joined ? "REQUEST SENT" : "JOIN →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Home = ({ playClick, playHover }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 pb-12 bg-[#F0EAD6] border-b-2 border-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 10] }}>
            <Stars radius={50} depth={50} count={1500} factor={2} fade />
            <VintageGeometry />
          </Canvas>
        </div>

        <div className="max-w-4xl relative z-10">
          <h1 className="text-6xl font-serif-retro font-bold text-[#1A1A1A] mb-6">
            Cultura
          </h1>

          <button
            onClick={() => navigate("/events")}
            onMouseEnter={playHover}
            className="px-8 py-3 bg-[#1A1A1A] text-[#F0EAD6] font-mono-retro uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all"
          >
            View Events
          </button>
        </div>
      </div>

      <div className="py-20 bg-[#E6DCC3] border-b-2 border-[#1A1A1A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif-retro text-4xl text-[#1A1A1A] mb-12">
            The Guilds
          </h2>

          <div className="flex gap-8 overflow-x-auto pb-12 pt-4 px-4">
            {DEPARTMENTS.map((dept) => (
              <TiltCard
                key={dept.id}
                dept={dept}
                playHover={playHover}
                playClick={playClick}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};