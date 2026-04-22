import React from 'react';
import { Rocket, Calculator, Info, Gamepad2, Home, Target, FunctionSquare } from 'lucide-react';

const Navbar = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'objectives', label: 'Objetivos', icon: Target },
    { id: 'theory', label: 'Teoría Física', icon: Info },
    { id: 'analysis', label: 'Análisis Matemático', icon: FunctionSquare },
    { id: 'sim-rocket-math', label: 'Simulador Integral', icon: Gamepad2 },
  ];


  return (
    <nav className="fixed top-0 left-0 w-full h-16 glass-panel z-50 flex items-center justify-between px-6 border-b border-white/10">
      <div className="flex items-center gap-3 text-rl-blue font-bold text-xl text-shadow-neon">
        <Rocket className="text-rl-orange" />
        <span>Rocket Math Sim</span>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 transition-all duration-300 ${
                isActive 
                  ? 'text-rl-blue text-shadow-neon' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
