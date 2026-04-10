import React, { useState, useEffect } from 'react';
import { Activity, Moon, Home, AlertTriangle, Power } from 'lucide-react'; 

export default function PainelGeral() {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveButtonIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full mx-auto sm:mx-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
        {/* Status do Robô */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Activity className="text-blue-500 w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-800">Status do Robô</h2>
          </div>
          <div className="flex items-center justify-center gap-3 bg-gray-50 py-3 rounded-md border border-gray-100">
            <span className="font-bold text-gray-800 text-lg">Estado atual:</span>
            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded flex items-center gap-2 border border-green-200">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              Operando
            </span>
          </div>
        </div>

        {/* Monitoramento de Destino */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-center mb-1 text-lg">Monitoramento de destino:</h3>
          <p className="text-xs text-gray-500 text-center mb-4 px-4 leading-tight">
            Painel luminoso indica qual esteira está ativa no momento.
          </p>
          
          <div className="space-y-3">
            {[
              { id: 1, name: 'PGM Rampa 1', active: true },
              { id: 2, name: 'PGM Rampa 2', active: true },
              { id: 3, name: 'PGM Rampa 3', active: true },
            ].map((rampa) => (
              <div key={rampa.id} className="bg-gray-200 rounded-md p-3 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${rampa.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}></div>
                  <span className="font-extrabold text-gray-800 text-lg">{rampa.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="p-4 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-center mb-4 text-lg">Painel de Sinalização</h3>
          <div className="grid grid-cols-2 gap-6 max-w-[280px] mx-auto">
            {/* Botão Running */}
            <div className="flex justify-center items-center">
              <button className={`transition-all duration-500 rounded-full aspect-square w-28 flex flex-col items-center justify-center shadow-md border-2 border-gray-300
                ${activeButtonIndex === 0 
                  ? 'bg-emerald-100 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-100' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                <span className="font-extrabold">Running</span>
                <span className={`text-xs ${activeButtonIndex === 0 ? 'text-emerald-600' : 'text-gray-600'}`}>(PGM)</span>
              </button>
            </div>
            
            {/* Botão Sleep */}
            <div className="flex justify-center items-center">
              <button className={`transition-all duration-500 rounded-full aspect-square w-28 flex flex-col items-center justify-center shadow-md border-2 border-gray-300
                ${activeButtonIndex === 1 
                  ? 'bg-emerald-100 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-100' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                <span className="font-extrabold">Sleep</span>
                <Moon className={`w-5 h-5 mt-1 ${activeButtonIndex === 1 ? 'text-emerald-800' : 'text-gray-800'}`} />
              </button>
            </div>
            
            {/* Botão Home*/}
            <div className="flex justify-center items-center">
              <button className={`transition-all duration-500 rounded-full aspect-square w-28 flex flex-col items-center justify-center shadow-md border-2 border-gray-300
                ${activeButtonIndex === 2 
                  ? 'bg-emerald-100 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-100' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                <span className="font-extrabold mb-1">Home</span>
                <Home className={`w-6 h-6 ${activeButtonIndex === 2 ? 'text-emerald-800' : 'text-gray-800'}`} />
              </button>
            </div>
            
            {/* Botão Emergência */}
            <div className="flex justify-center items-center">
              <button className={`transition-all duration-500 rounded-full aspect-square w-28 flex flex-col items-center justify-center shadow-md border-2 border-gray-300
                ${activeButtonIndex === 3 
                  ? 'bg-red-200 text-red-900 shadow-[0_0_15px_rgba(248,113,113,0.5)] border-red-400' 
                  : 'bg-gray-200 hover:bg-red-200 hover:border-red-400 text-gray-800'}`}>
                <span className="font-extrabold">Emergência</span>
                <AlertTriangle className={`w-6 h-6 mt-1 ${activeButtonIndex === 3 ? 'text-red-900' : 'text-gray-800'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 h-full">
        {/* Card de Emergência */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 justify-center">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">Controle de Emergência</h2>
            </div>
            <div className="flex items-center justify-center gap-3 bg-red-50 py-3 rounded-md border border-red-100">
              <span className="font-bold text-red-800 text-lg">Atenção:</span>
              <span className="text-red-700 text-sm font-semibold">Parada Imediata do Sistema</span>
            </div>
          </div>

          <div className="p-6 flex flex-col items-center justify-center flex-1 bg-gray-50">
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3 px-10 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-700 transition-transform active:scale-95 cursor-pointer flex items-center gap-2 self-center">
              <AlertTriangle className="w-5 h-5" />
              PARADA DE EMERGÊNCIA
            </button>
            
            <p className="mt-6 text-sm text-gray-500 text-center max-w-xs font-medium">
              Pressione este botão apenas em caso de risco iminente ou falha crítica do equipamento.
            </p>
          </div>
        </div>

        {/* Card Enable Program */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 justify-center">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 justify-center">
              <Power className="text-blue-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">Controle de Programa</h2>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center flex-1 bg-gray-50">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg shadow-md border border-blue-700 transition-transform active:scale-95 cursor-pointer flex items-center gap-2 text-lg">
              <Power className="w-6 h-6" />
              ENABLE PROGRAM
            </button>
            <p className="mt-4 text-sm text-gray-500 text-center max-w-xs font-medium">
              Habilita a execução do programa no controlador lógico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
