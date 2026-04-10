import React, { useState, useEffect } from 'react';
import { Package, Timer, Target, Terminal, RotateCcw, Wifi, WifiOff, Camera, AlertTriangle } from 'lucide-react';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  const [counts, setCounts] = useState({
    vermelha: 0,
    preta: 0,
    cinza: 0
  });

  const [currentPieceColor, setCurrentPieceColor] = useState(null);

  const [consoleLogs, setConsoleLogs] = useState([
    "Aguardando ligação ao servidor SSE (localhost:3001)...",
  ]);


  const [nodeRedData, setNodeRedData] = useState({
    total_pecas: 0,
    total_ciclos: 0,
    taxa_acerto: "0%",
    status_robo: "AGUARDANDO",
    tempo_ciclo: "4.2", 
    oee: "85%" 
  });

 function obterHoraAtual() {
  const agora = new Date();

  return agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
  const logsRoboFixo = [
    { id: 1, evento: 'Ciclo de Seleção: ATIVO', hora: obterHoraAtual() },
    { id: 2, evento: 'Início do Programa: AUTO_CYCLE_V1', hora: obterHoraAtual() },
  ];

  // --- LIGAÇÃO AO BACKEND (server events)---
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');

    eventSource.onopen = () => {
      setIsConnected(true);
      const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setConsoleLogs(prev => [`[${timestamp}] > CONECTADO ao Servidor de Eventos.`, ...prev.slice(0, 9)]);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        
    
        setNodeRedData(prev => ({
          ...prev,
          total_pecas: data.total_pecas !== undefined ? data.total_pecas : prev.total_pecas,
          total_ciclos: data.total_ciclos !== undefined ? data.total_ciclos : prev.total_ciclos,
          taxa_acerto: data.taxa_acerto !== undefined ? data.taxa_acerto : prev.taxa_acerto,
          status_robo: data.status_robo !== undefined ? data.status_robo : prev.status_robo,
        }));

       
        if (data.ultimo_log) {
          const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const novoLog = `[${data.status_robo || 'INFO'}] > ${data.ultimo_log}`;
          setConsoleLogs(prev => [novoLog, ...prev.slice(0, 9)]);
          
          
          const logTexto = data.ultimo_log.toLowerCase();
          if (logTexto.includes('vermelha')) {
            setCounts(prev => ({ ...prev, vermelha: prev.vermelha + 1 }));
            setCurrentPieceColor('vermelha');
          }
          if (logTexto.includes('preta')) {
            setCounts(prev => ({ ...prev, preta: prev.preta + 1 }));
            setCurrentPieceColor('preta');
          }
          if (logTexto.includes('cinza') || logTexto.includes('cinzenta')) {
            setCounts(prev => ({ ...prev, cinza: prev.cinza + 1 }));
            setCurrentPieceColor('cinza');
          }
        }

      } catch (error) {
        console.error("Erro ao processar dados do SSE:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const resetSimulation = () => {
    setCounts({ vermelha: 0, preta: 0, cinza: 0 });
    setCurrentPieceColor(null);
    const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setConsoleLogs([`[${timestamp}] > Contadores redefinidos para ZERO.`, ...consoleLogs.slice(0, 9)]);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-6 md:p-8 font-sans text-slate-800 flex flex-col">
      <div className="max-w-6xl mx-auto space-y-6 flex-1 flex flex-col w-full">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Controle de Produção</h2>
              {isConnected ? (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-200">
                  <Wifi className="w-3 h-3" /> ONLINE
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded border border-red-200 animate-pulse">
                  <WifiOff className="w-3 h-3" /> OFFLINE
                </span>
              )}
            </div>
            <p className="text-gray-600">Monitorização de KPIs e contagem de peças da Célula Robótica.</p>
          </div>
          <button 
            onClick={resetSimulation}
            className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Resetar Contagem
          </button>
        </div>

        {/* parte superior */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cards Empilhados (Coluna Esquerda) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex-1 flex flex-col justify-between">
              
              {/* Peças Processadas */}
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Peças Processadas (TOTAL)</h3>
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <div className="mt-1">
                  <span className="text-4xl font-black text-slate-800">{nodeRedData.total_pecas}</span>
                  <span className="text-sm font-bold text-gray-500 ml-1">un</span>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>ESTADO:</span>
                  <span className="text-blue-600 font-black">
                    {nodeRedData.status_robo}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Tempo de Ciclo */}
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tempo de Ciclo (S)</h3>
                  <Timer className="w-4 h-4 text-gray-400" />
                </div>
                <div className="mt-1">
                  <span className="text-4xl font-black text-slate-800">{nodeRedData.tempo_ciclo}</span>
                  <span className="text-sm font-bold text-gray-500 ml-1">s</span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Taxa de Acerto */}
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Taxa de Acerto (%)</h3>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div className="mt-1">
                  <span className="text-4xl font-black text-slate-800">{nodeRedData.taxa_acerto}</span>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>CICLOS TOTAIS: {nodeRedData.total_ciclos}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Visão da Célula (Coluna do Meio) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Visão da Célula</h3>
                <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div> LIVE
                </span>
              </div>
              <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 min-h-[200px] shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                <Camera className="w-12 h-12 text-gray-600 relative z-10" />
              </div>
            </div>
            
            <button className="w-full bg-[#E60000] hover:bg-red-700 text-white font-bold py-3 px-10 rounded-lg shadow-[0_4px_15px_rgba(230,0,0,0.3)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="tracking-wide text-sm">PARADA DE EMERGÊNCIA</span>
            </button>
          </div>

          {/* KPIs e Logs Fixos (Coluna Direita) */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            
            <div className="flex-1 mb-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                KPIs de Produção
              </h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">OEE da Célula</span>
                  <span className="text-lg font-bold text-slate-800">{nodeRedData.oee}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Disponibilidade Mecânica</span>
                  <span className="text-lg font-bold text-slate-800">92%</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                Logs do Robô
              </h3>
              <ul className="space-y-3 flex-1 overflow-y-auto">
                {logsRoboFixo.map((log) => (
                  <li key={log.id} className="flex items-start gap-3">
                    <span className="text-sm text-red-600 font-bold w-12 flex-shrink-0">{log.hora}</span>
                    <span className="text-sm font-medium text-slate-700 leading-tight">{log.evento}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* parte inferior*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 border-t border-gray-300 pt-8">
          
          {/* Indicador de Peça */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[280px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-slate-700 text-sm uppercase">
                Peça em Processamento
              </h3>
            </div>
      
            <div className="flex-1 flex justify-around items-center p-6">
              {/* Preto */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-24 h-24 rounded-full border-4 border-zinc-900 bg-zinc-900 transition-all duration-500 ${currentPieceColor === 'preta' ? 'scale-110 shadow-[0_0_20px_rgba(24,24,27,0.8)] opacity-100' : 'opacity-30 scale-100 shadow-none'}`}>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${currentPieceColor === 'preta' ? 'text-zinc-900' : 'text-gray-400'}`}>Preto</span>
              </div>

              {/* Vermelho */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-24 h-24 rounded-full border-4 border-red-600 bg-red-600 transition-all duration-500 ${currentPieceColor === 'vermelha' ? 'scale-110 shadow-[0_0_20px_rgba(220,38,38,0.8)] opacity-100' : 'opacity-30 scale-100 shadow-none'}`}>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${currentPieceColor === 'vermelha' ? 'text-red-700' : 'text-gray-400'}`}>Vermelho</span>
              </div>

              {/* Cinza */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-24 h-24 rounded-full border-4 border-slate-500 bg-slate-500 transition-all duration-500 ${currentPieceColor === 'cinza' ? 'scale-110 shadow-[0_0_20px_rgba(100,116,139,0.8)] opacity-100' : 'opacity-30 scale-100 shadow-none'}`}>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${currentPieceColor === 'cinza' ? 'text-slate-700' : 'text-gray-400'}`}>Cinza</span>
              </div>
            </div>
          </div>

          {/*Terminal Simulado*/}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[280px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase">
                <Terminal className="w-4 h-4 text-slate-600" /> Logs de Produção
              </h3>
            </div>
            
            <div className="flex-1 p-4 bg-white text-slate-700 font-mono text-sm overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
              {consoleLogs.map((log, index) => (
                <p key={index} className={`${index === 0 ? "text-blue-600 font-bold" : "opacity-80"}`}>
                  {log}
                </p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}