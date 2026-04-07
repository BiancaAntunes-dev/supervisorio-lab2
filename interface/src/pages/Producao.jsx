import React, { useState, useEffect } from "react";

export default function Producao() {
  const [rampas, setRampas] = useState([
    { id: 1, name: "PGM Rampa 1", vermelha: 145, preta: 89, cinza: 12 },
    { id: 2, name: "PGM Rampa 2", vermelha: 210, preta: 115, cinza: 5 },
    { id: 3, name: "PGM Rampa 3", vermelha: 88, preta: 45, cinza: 22 },
  ]);

  // Simulador
  useEffect(() => {
    const simulador = setInterval(() => {
      
      const rampaSorteadaIndex = Math.floor(Math.random() * 3);
      
      
      const cores = ['vermelha', 'preta', 'cinza'];
      const corSorteada = cores[Math.floor(Math.random() * 3)];

     
      setRampas((estadoAnterior) => {
       
        const novoEstado = [...estadoAnterior];
        novoEstado[rampaSorteadaIndex] = {
          ...novoEstado[rampaSorteadaIndex],
          [corSorteada]: novoEstado[rampaSorteadaIndex][corSorteada] + 1
        };
        return novoEstado; 
      });

    }, 1000); 
    return () => clearInterval(simulador);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Controle de Produção</h2>
        <p className="text-gray-600">
          Contabilização de peças separadas por rampa e cor. <span className="text-blue-500 font-semibold">(Simulação Ativa)</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rampas.map((rampa) => (
          <div key={rampa.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            {/* Cabeçalho do Card da Rampa */}
            <div className="bg-slate-800 p-4 text-white">
              <h3 className="font-bold text-lg">{rampa.name}</h3>
              <p className="text-slate-300 text-sm">
                Total: {rampa.vermelha + rampa.preta + rampa.cinza} peças
              </p>
            </div>
            
            {/*Contadores por Cor */}
            <div className="p-4 space-y-4">
              {/* Peças Vermelhas*/}
              <div className="flex items-center justify-between bg-red-50 p-3 rounded border border-red-100">
                <span className="font-semibold text-red-800 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div> 
                  Peças Vermelhas
                </span>
                <span className="text-2xl font-black text-red-600 transition-all">{rampa.vermelha}</span>
              </div>
              
              {/* Peças Pretas*/}
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded border border-gray-300">
                <span className="font-semibold text-black flex items-center gap-2">
                  <div className="w-3 h-3 bg-black rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]"></div> 
                  Peças Pretas
                </span>
                <span className="text-2xl font-black text-black transition-all">{rampa.preta}</span>
              </div>
              
              {/* Peças Cinzas*/}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full shadow-[0_0_5px_rgba(156,163,175,0.5)]"></div> 
                  Peças Cinzas
                </span>
                <span className="text-2xl font-black text-gray-600 transition-all">{rampa.cinza}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}