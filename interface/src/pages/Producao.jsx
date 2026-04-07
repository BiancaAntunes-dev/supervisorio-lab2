import React, { useState, useEffect } from 'react';
import { Package, Timer, Target, Terminal, RotateCcw, Wifi, WifiOff } from 'lucide-react';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  const [counts, setCounts] = useState({
    vermelha: 0,
    preta: 0,
    cinza: 0
  });

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

  const logsRoboFixo = [
    { id: 1, evento: 'Ciclo de Seleção: ATIVO', hora: '10:05' },
    { id: 2, evento: 'Início do Programa: AUTO_CYCLE_V1', hora: '10:00' },
  ];

  // --- LIGAÇÃO AO BACKEND (SSE - Server-Sent Events) ---
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
        console.log("=== Dados replicados para a Dashboard ===", data);
        
    
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
          if (logTexto.includes('vermelha')) setCounts(prev => ({ ...prev, vermelha: prev.vermelha + 1 }));
          if (logTexto.includes('preta')) setCounts(prev => ({ ...prev, preta: prev.preta + 1 }));
          if (logTexto.includes('cinza') || logTexto.includes('cinzenta')) setCounts(prev => ({ ...prev, cinza: prev.cinza + 1 }));
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
    const timestamp = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setConsoleLogs([`[${timestamp}] > Contadores redefinidos para ZERO.`, ...consoleLogs.slice(0, 9)]);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-6 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cards Empilhados */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Peças Processadas (TOTAL)</h3>
                <Package className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-1">
                <span className="text-4xl font-black text-slate-800">{nodeRedData.total_pecas}</span>
                <span className="text-sm font-bold text-gray-500 ml-1">un</span>
              </div>
              <div className="mt-4 flex justify-between items-center text-xs font-bold text-gray-500">
                <span>ESTADO:</span>
                <span className="text-blue-600 font-black">
                  {nodeRedData.status_robo}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tempo de Ciclo (S)</h3>
                <Timer className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-1">
                <span className="text-4xl font-black text-slate-800">{nodeRedData.tempo_ciclo}</span>
                <span className="text-sm font-bold text-gray-500 ml-1">s</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Taxa de Acerto (%)</h3>
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-1">
                <span className="text-4xl font-black text-slate-800">{nodeRedData.taxa_acerto}</span>
              </div>
              <div className="mt-4 flex justify-between items-center text-xs font-bold text-gray-500">
                <span>CICLOS TOTAIS: {nodeRedData.total_ciclos}</span>
              </div>
            </div>
          </div>

          {/* KPIs e Logs Fixos */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8">
            
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
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

            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                Logs do Robô (Fixos)
              </h3>
              <ul className="space-y-3">
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
          
          {/* Contadores */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[280px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-slate-700 text-sm uppercase">
                Contagem de Peças
              </h3>
            </div>
      
            <div className="flex-1 flex justify-around items-center p-6">
              {/* Preto */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-4 border-zinc-900 flex items-center justify-center text-4xl font-black text-white bg-zinc-900 shadow-lg transition-all duration-300">
                  {counts.preta}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preto</span>
              </div>

              {/* Vermelho */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center text-4xl font-black text-white bg-red-600 shadow-lg transition-all duration-300">
                  {counts.vermelha}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Vermelho</span>
              </div>

              {/* Cinza */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-4 border-slate-500 flex items-center justify-center text-4xl font-black text-white bg-slate-500 shadow-lg transition-all duration-300">
                  {counts.cinza}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cinza</span>
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