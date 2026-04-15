import React from 'react';
import { Play, Home, Moon } from 'lucide-react';

export default function IndicadoresEstadoSistema({ running, home, sleep }) {
  // Configuração visual baseada em quem está "true"
  const indicators = [
    {
      id: 'running',
      label: 'Running',
      isActive: running,
      icon: <Play className="h-5 w-5" />,
      activeColors: 'border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    },
    {
      id: 'home',
      label: 'Home',
      isActive: home,
      icon: <Home className="h-5 w-5" />,
      activeColors: 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    },
    {
      id: 'sleep',
      label: 'Sleep',
      isActive: sleep,
      icon: <Moon className="h-5 w-5" />,
      activeColors: 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    },
  ];

  const baseStyle = "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300";
  const inactiveColors = "border-[#2a3038] bg-[#1e2329]/50 text-[#78909c] opacity-60";

  return (
    <div className="flex flex-col gap-3">
      {indicators.map((ind) => (
        <div
          key={ind.id}
          className={`${baseStyle} ${ind.isActive ? ind.activeColors : inactiveColors}`}
        >
          {ind.icon}
          <span className="font-bold uppercase tracking-wider text-sm">
            {ind.label}
          </span>
        </div>
      ))}
    </div>
  );
}
