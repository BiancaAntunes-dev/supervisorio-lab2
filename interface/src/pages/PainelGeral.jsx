import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  Play,
  Power,
  CircleCheck,
  Video,
} from 'lucide-react';

const cardCls = 'rounded-xl border border-[#2a3038] bg-[#1e2329] shadow-sm';

function detectColorFromLog(text) {
  const t = text.toLowerCase();
  if (t.includes('vermelha')) return { key: 'vermelha', rampa: 1, label: 'Vermelha', short: 'Vermelho' };
  if (t.includes('preta')) return { key: 'preta', rampa: 2, label: 'Preta', short: 'Preto' };
  if (t.includes('cinza') || t.includes('cinzenta')) return { key: 'cinza', rampa: 3, label: 'Cinza', short: 'Cinza' };
  
  if (/\brampa\s*3\b/i.test(text) || /\brampa3\b/i.test(t)) return { key: 'cinza', rampa: 3, label: 'Cinza', short: 'Cinza' };
  if (/\brampa\s*2\b/i.test(text) || /\brampa2\b/i.test(t)) return { key: 'preta', rampa: 2, label: 'Preta', short: 'Preto' };
  if (/\brampa\s*1\b/i.test(text) || /\brampa1\b/i.test(t)) return { key: 'vermelha', rampa: 1, label: 'Vermelha', short: 'Vermelho' };
  return null;
}

function resolvePgmRampaFromPayload(data, depth = 0) {
  const done = (value) => {
    return value;
  };

  if (!data || typeof data !== 'object' || depth > 2) return done(undefined);
  if (data.painel_luminoso === false || data.pgm_desligado === true || data.sem_destino === true) return done(null);

  const direct =
    data.pgm_rampa ??
    data.rampa_pgm ??
    data.rampa_ativa ??
    data.rampa ??
    data.rampa_em_execucao ??
    data.destino ??
    data.esteira ??
    data.pgm;

  if (direct === null || direct === '') return done(null);
  const numDirect = Number(direct);
  if (!Number.isNaN(numDirect)) {
    if (numDirect === 0) return done(null);
    if (numDirect >= 1 && numDirect <= 3) return done(numDirect);
  }

  if (data.pgm_rampa1 === true || data.PGM_Rampa1 === true) return done(1);
  if (data.pgm_rampa2 === true || data.PGM_Rampa2 === true) return done(2);
  if (data.pgm_rampa3 === true || data.PGM_Rampa3 === true) return done(3);

  const no = data.no_ativo ?? data.node_id ?? data.no;
  if (no === 1 || no === 2 || no === 3) return done(no);

  const ultimo = typeof data.ultimo_log === 'string' ? data.ultimo_log : '';
  if (ultimo) {
    const low = ultimo.toLowerCase();
    if (/\brampa\s*3\b/i.test(ultimo) || /\brampa3\b/i.test(low) || low.includes('pgm3')) return done(3);
    if (/\brampa\s*2\b/i.test(ultimo) || /\brampa2\b/i.test(low) || low.includes('pgm2')) return done(2);
    if (/\brampa\s*1\b/i.test(ultimo) || /\brampa1\b/i.test(low) || low.includes('pgm1')) return done(1);
  }

  const p = data.payload;
  if (typeof p === 'number') {
    if (p >= 1 && p <= 3) return done(p);
    if (p === 0) return done(null);
  }
  if (typeof p === 'string') {
    const n = parseInt(p, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= 3) return done(n);
    const low = p.toLowerCase();
    if (low.includes('vermelh') || low === 'rampa1' || low === 'rampa_1' || low === 'pgm1') return done(1);
    if (low.includes('preta') || low === 'rampa2' || low === 'rampa_2' || low === 'pgm2') return done(2);
    if (low.includes('cinza') || low.includes('cinzent') || low === 'rampa3' || low === 'rampa_3' || low === 'pgm3')
      return done(3);
  }
  if (p != null && typeof p === 'object' && !Array.isArray(p)) {
    const nested = resolvePgmRampaFromPayload(p, depth + 1);
    if (nested !== undefined) return done(nested);
  }

  const topic = String(data.topic ?? data.msg ?? '').toLowerCase();
  if (topic && (topic.includes('pgm1') || topic.includes('rampa1') || topic.includes('rampa_1'))) return done(1);
  if (topic && (topic.includes('pgm2') || topic.includes('rampa2') || topic.includes('rampa_2'))) return done(2);
  if (topic && (topic.includes('pgm3') || topic.includes('rampa3') || topic.includes('rampa_3'))) return done(3);

  return done(undefined);
}

export default function PainelGeral() {
  const [now, setNow] = useState(() => new Date());
  const [isConnected, setIsConnected] = useState(false);
  const programEnabled = true;

  const [currentPieceColor, setCurrentPieceColor] = useState(null);
  const [activeRampa, setActiveRampa] = useState(null);
  const [activePgmRampa, setActivePgmRampa] = useState(null);

  const [productionFeed, setProductionFeed] = useState([]);

  const [nodeRedData, setNodeRedData] = useState({
    total_pecas: 0,
    total_ciclos: 0,
    taxa_acerto: '%',
    status_robo: 'AGUARDANDO',
    tempo_ciclo: '4.2',
    oee: '85%',
    disponibilidade_mecanica: '99.2%',
  });

  const [rampas, setRampas] = useState([
    { id: 1, name: 'PGM Rampa 1', active: false },
    { id: 2, name: 'PGM Rampa 2', active: false },
    { id: 3, name: 'PGM Rampa 3', active: false },
  ]);

useEffect(() => {
    // 1. Função para testar no Console (mantida para testes manuais)
    window.setRampaStatus = (id, isActive) => {
      setRampas((prev) => 
        prev.map((r) => (r.id === id ? { ...r, active: isActive } : r))
      );
    };

    
    const eventSource = new EventSource('http://localhost:3001/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Verifica se o payload chegou com o array raw_bits
      if (data && data.raw_bits) {
        const bits = data.raw_bits;

       
        if (bits[0]) setActiveButtonIndex(2);
        else if (bits[1]) setActiveButtonIndex(1);
        else if (bits[2]) setActiveButtonIndex(0);
   
        setRampas([
          { id: 1, name: 'PGM Rampa 1', active: !!bits[3] },
          { id: 2, name: 'PGM Rampa 2', active: !!bits[4] },
          { id: 3, name: 'PGM Rampa 3', active: !!bits[5] },
        ]);
      }
    };

  
    return () => {
      eventSource.close();
      delete window.setRampaStatus;
    };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);

  }, []);
  
  const getCorRampaAtiva = (id) => {
    switch (id) {
      case 1: // Rampa 1: Vermelho suave
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
      case 2: // Rampa 2: Preto com leve sombra para destacar
        return 'bg-black shadow-[0_0_8px_rgba(0,0,0,0.4)]';
      case 3: // Rampa 3: Cinza
        return 'bg-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.6)]';
      default:
        return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    }
  };

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');
        {/* Monitoramento de Destino */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-center mb-1 text-lg">Monitoramento de destino:</h3>
          <p className="text-xs text-gray-500 text-center mb-4 px-4 leading-tight">
            Painel luminoso indica qual esteira está ativa no momento.
          </p>
          
          <div className="space-y-3">
           {rampas.map((rampa) => (
              <div key={rampa.id} className="bg-gray-200 rounded-md p-3 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  {/*mudança de cor da rampa */}
                  <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                    rampa.active ? getCorRampaAtiva(rampa.id) : 'bg-gray-400'
                  }`}></div>               
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
                <span className={`absolute -inset-2 bg-emerald-500 rounded-full blur-md -z-10 transition-opacity duration-500$ {activeButtonIndex === 2 ? 'opacity-30' : 'opacity-0'}`}></span>
                    
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
=======
    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
      
        console.log('[DEBUG] Dado cru recebido do Node-RED:', data);
        

        setNodeRedData((prev) => ({
          ...prev,
          total_pecas: data.total_pecas !== undefined ? data.total_pecas : prev.total_pecas,
          total_ciclos: data.total_ciclos !== undefined ? data.total_ciclos : prev.total_ciclos,
          taxa_acerto: data.taxa_acerto !== undefined ? data.taxa_acerto : prev.taxa_acerto,
          status_robo: data.status_robo !== undefined ? data.status_robo : prev.status_robo,
          tempo_ciclo: data.tempo_ciclo !== undefined ? data.tempo_ciclo : prev.tempo_ciclo,
          oee: data.oee !== undefined ? data.oee : prev.oee,
          disponibilidade_mecanica:
            data.disponibilidade_mecanica !== undefined
              ? data.disponibilidade_mecanica
              : data.disponibilidade !== undefined
                ? data.disponibilidade
                : prev.disponibilidade_mecanica,
        }));

        const rawRampa = data.rampa_ativa ?? data.rampa ?? data.rampa_em_execucao;
        if (rawRampa === 1 || rawRampa === 2 || rawRampa === 3) setActiveRampa(rawRampa);
        else if (rawRampa === 0 || rawRampa === null) setActiveRampa(null);

        const pgmResolved = resolvePgmRampaFromPayload(data);
        if (pgmResolved !== undefined) setActivePgmRampa(pgmResolved);

        
        let logTexto = null;
        if (data.ultimo_log) logTexto = data.ultimo_log;
        else if (typeof data.payload === 'string') logTexto = data.payload;
        else if (data.payload && data.payload.ultimo_log) logTexto = data.payload.ultimo_log;
        else if (data.msg) logTexto = data.msg;
>>>>>>> 434341da77e18cdf79232214f0a37e9933bbd060

        if (logTexto) {
          const timeStr = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          setProductionFeed((prev) => {
            if (prev.length > 0 && prev[0].line === logTexto && prev[0].time === timeStr) {
               return prev; 
            }
            return [
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                time: timeStr,
                line: logTexto,
              },
              ...prev,
            ].slice(0, 30); 
          });

          const colorInfo = detectColorFromLog(logTexto);
          if (colorInfo) {
            setCurrentPieceColor(colorInfo.key);
            setActiveRampa(colorInfo.rampa);
          } else {
            const t = logTexto.toLowerCase();
            if (t.includes('vermelha')) setCurrentPieceColor('vermelha');
            if (t.includes('preta')) setCurrentPieceColor('preta');
            if (t.includes('cinza') || t.includes('cinzenta')) setCurrentPieceColor('cinza');
          }
        }
      } catch (error) {
        console.error('Erro ao processar dados do SSE:', error);
      }
    };

    eventSource.onerror = () => setIsConnected(false);
    return () => eventSource.close();
  }, []);

  // --- Auto-desliga o brilho da peça após 2.5 segundos ---
  useEffect(() => {
    if (currentPieceColor || activeRampa) {
      const timer = setTimeout(() => {
        setCurrentPieceColor(null);
        setActiveRampa(null); 
      }, 2500); 

      return () => clearTimeout(timer); 
    }
  }, [currentPieceColor, activeRampa]);

  const cameraOverlayTime = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const estadoRobo = useMemo(() => {
    const s = (nodeRedData.status_robo || '').toUpperCase();
    if (s.includes('AGUARD') || s.includes('IDLE')) return { label: 'IDLE', dot: 'bg-[#ff9800]' };
    if (s.includes('OPER')) return { label: 'OPERANDO', dot: 'bg-[#4caf50]' };
    return { label: nodeRedData.status_robo || '—', dot: 'bg-[#2196f3]' };
  }, [nodeRedData.status_robo]);

  return (
    <div className="font-industrial text-[#e4e6eb] w-full max-w-[1920px] mx-auto pb-8 space-y-5">
      <header className={`${cardCls} p-4 md:p-5`}>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Célula Robótica — Separação de Cores
            </h1>
            <p className="text-sm text-[#9aa0a8] mt-1">Separação Automática de Peças por Cor</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div
              role="status"
              aria-label="Enable program, programa do robô habilitado"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wide bg-[#2e7d32] text-white shadow-[0_0_20px_rgba(76,175,80,0.35)] select-none"
            >
              <Play className="h-5 w-5 fill-current" aria-hidden />
              enable program
            </div>
            <button
              type="button"
              aria-label="Parada de emergência do equipamento"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c62828] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(244,67,54,0.35)] hover:bg-[#b71c1c]"
            >
              <Power className="h-5 w-5" aria-hidden />
              Parada emergência
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Coluna esquerda */}
        <aside className="lg:col-span-3 space-y-4">
          <div className={`${cardCls} p-4`}>
            <div className="flex items-center gap-2 text-[#90a4ae] text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="h-4 w-4 text-[#2196f3]" />
              Status do robô
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center gap-2">
                <dt className="text-[#9aa0a8]">Estado</dt>
                <dd className="flex items-center gap-2 font-semibold text-white">
                  <span className={`h-2.5 w-2.5 rounded-full ${estadoRobo.dot}`} />
                  {estadoRobo.label}
                </dd>
              </div>
              <div className="flex justify-between items-center gap-2">
                <dt className="text-[#9aa0a8]">Programa</dt>
                <dd className={programEnabled ? 'text-[#4caf50] font-bold' : 'text-[#78909c] font-bold'}>
                  {programEnabled ? 'Habilitado' : 'Desabilitado'}
                </dd>
              </div>
              <div className="flex justify-between items-center gap-2">
                <dt className="text-[#9aa0a8]">Comunicação</dt>
                <dd className="flex items-center gap-1.5 font-semibold">
                  {isConnected ? (
                    <>
                      <Wifi className="h-4 w-4 text-[#4caf50]" />
                      <span className="text-[#4caf50]">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-[#ef5350]" />
                      <span className="text-[#ef5350]">Offline</span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className={`${cardCls} p-4`}>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-[#9aa0a8] uppercase tracking-wide mb-1">Peças processadas</p>
                <p className="text-2xl md:text-3xl font-black font-industrial-mono text-[#42a5f5] tabular-nums">
                  {nodeRedData.total_pecas} <span className="text-base font-bold text-[#78909c]">peças</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#9aa0a8] uppercase tracking-wide mb-1">Tempo de ciclo (s)</p>
                <p className="text-2xl md:text-3xl font-black font-industrial-mono text-[#66bb6a] tabular-nums">
                  {nodeRedData.tempo_ciclo} <span className="text-base font-bold text-[#78909c]">seg</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#9aa0a8] uppercase tracking-wide mb-1">Taxa de acerto (%)</p>
                <p className="text-2xl md:text-3xl font-black font-industrial-mono text-[#ffa726] tabular-nums">
                  {nodeRedData.taxa_acerto}
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardCls} p-4`}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#90a4ae] mb-4">Monitoramento de peças</p>
            <div
              className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8"
              role="group"
              aria-label="Estado por cor de peça"
            >
              {[
                {
                  id: 1,
                  key: 'vermelha',
                  label: 'Vermelho',
                  inactive: 'bg-[#7a1f1f] border-[#5c1515]',
                  activeClass: 'peca-ativo-vermelho',
                },
                {
                  id: 2,
                  key: 'preta',
                  label: 'Preto',
                  inactive: 'bg-[#1f1f1f] border-[#2a2a2a]',
                  activeClass: 'peca-ativo-preto',
                },
                {
                  id: 3,
                  key: 'cinza',
                  label: 'Cinza',
                  inactive: 'bg-[#616161] border-[#4a4a4a]',
                  activeClass: 'peca-ativo-cinza',
                },
              ].map((d) => {
                const on = currentPieceColor === d.key || activeRampa === d.id;
                return (
                  <div key={d.id} className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-pressed={on}
                      aria-label={`Indicador de peça ${d.label}: ${on ? 'ativo, em destaque' : 'inativo'}`}
                      className={`pointer-events-none h-16 w-16 shrink-0 rounded-full border-2 border-solid ${
                        on ? d.activeClass : `${d.inactive} shadow-none`
                      }`}
                    />
                    <span className="text-xs font-medium text-center text-[#cfd8dc] tracking-wide">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${cardCls} p-4 flex items-center gap-3`}>
            <CircleCheck className="h-8 w-8 shrink-0 text-[#4caf50]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Alertas</p>
              <p className="text-sm font-semibold text-[#c8e6c9]">Sistema dentro dos parâmetros</p>
            </div>
          </div>
        </aside>

        {/* Centro */}
        <section className="lg:col-span-6 space-y-4">
          <div className={`${cardCls} overflow-hidden p-0`}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a3038]">
              <Video className="h-4 w-4 text-[#2196f3]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#90a4ae]">Esquemático da célula</h2>
            </div>
            <div className="relative aspect-video bg-black max-h-[420px]">
              <img
                src="/celula-robot-camera.png"
                alt="Vista superior da célula robótica — separação por cores"
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 font-industrial-mono text-xs text-white/90 bg-black/50 px-2 py-1 rounded">
                CAM-01 | {cameraOverlayTime}
              </div>
              <div className="absolute top-3 right-3 bg-[#c62828] text-white text-[10px] font-bold px-2 py-0.5 rounded">REC</div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#2e7d32]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Processando
              </div>
            </div>
          </div>

          <div className={`${cardCls} p-4`}>
            <p className="text-sm md:text-base font-bold uppercase tracking-wider text-[#90a4ae] mb-2">
              Monitoramento de destino
            </p>
            <p className="text-sm md:text-[15px] text-[#78909c] mb-4 leading-relaxed">
              Painel luminoso indica qual esteira está ativa no momento.
            </p>
            <div className="flex flex-col gap-3 w-full" role="list" aria-label="Rampas PGM e esteiras">
              {[
                {
                  id: 1,
                  label: 'PGM Rampa 1',
                  rowBg: 'bg-[#2a181c]',
                  borderLeft: 'border-l-[5px] border-l-[#c62828]',
                  iconBg: 'bg-[#e53935]',
                  activeClass: 'peca-ativo-vermelho border-l-[5px] border-l-[#b71c1c]',
                  labelActive: 'text-white',
                },
                {
                  id: 2,
                  label: 'PGM Rampa 2',
                  rowBg: 'bg-[#181c22]',
                  borderLeft: 'border-l-[5px] border-l-[#424242]',
                  iconBg: 'bg-[#212121] ring-1 ring-white/10',
                  activeClass: 'peca-ativo-preto border-l-[5px] border-l-[#303030]',
                  labelActive: 'text-[#eceff1]',
                },
                {
                  id: 3,
                  label: 'PGM Rampa 3',
                  rowBg: 'bg-[#1e2329]',
                  borderLeft: 'border-l-[5px] border-l-[#bdbdbd]',
                  iconBg: 'bg-[#cfd8dc]',
                  activeClass: 'peca-ativo-cinza border-l-[5px] border-l-[#90a4ae]',
                  labelActive: 'text-[#263238]',
                },
              ].map((row) => {
                const ativo = activePgmRampa === row.id || activeRampa === row.id;
                return (
                  <div
                    key={row.id}
                    role="listitem"
                    className={`flex w-full min-w-0 items-center gap-3 rounded-lg border-solid py-3 pl-4 pr-4 border-2 ${
                      ativo
                        ? row.activeClass
                        : `${row.rowBg} ${row.borderLeft} border-[#2a3038]/80`
                    }`}
                  >
                    <span
                      className={`h-3 w-3 shrink-0 rounded-sm ${row.iconBg} ${ativo ? 'ring-1 ring-white/30' : ''}`}
                      aria-hidden
                    />
                    <span
                      className={`min-w-0 flex-1 text-sm font-semibold ${ativo ? row.labelActive : 'text-white'}`}
                    >
                      {row.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Direita — logs + KPIs */}
        <aside className="lg:col-span-3 space-y-4">
          <div className={`${cardCls} p-0 flex flex-col max-h-[min(85vh,920px)]`}>
            <div className="px-4 py-3 border-b border-[#2a3038]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#90a4ae]">Logs do Robô</h2>
            </div>
            <div className="overflow-y-auto p-4 space-y-3 flex-1 font-industrial">
              {productionFeed.length === 0 ? (
                <p className="text-xs text-[#78909c] text-center mt-2">Aguardando eventos do servidor…</p>
              ) : (
                productionFeed.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-[13px] leading-snug">
                    <span className="font-bold text-[#42a5f5] shrink-0">{item.time}</span>
                    <span className="font-medium text-[#e4e6eb]">{item.line}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${cardCls} p-4`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#90a4ae] mb-4">KPIS DE PRODUÇÃO</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-[#9aa0a8] uppercase tracking-wide mb-1">OEE da célula</p>
                <p className="text-2xl font-black font-industrial-mono text-[#42a5f5] tabular-nums">
                  {nodeRedData.oee}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#9aa0a8] uppercase tracking-wide mb-1">Disponibilidade mecânica</p>
                <p className="text-2xl font-black font-industrial-mono text-[#66bb6a] tabular-nums">
                  {typeof nodeRedData.disponibilidade_mecanica === 'number'
                    ? `${nodeRedData.disponibilidade_mecanica}%`
                    : nodeRedData.disponibilidade_mecanica}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}