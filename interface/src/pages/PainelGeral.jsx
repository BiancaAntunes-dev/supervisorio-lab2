import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
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
  const done = (value) => value;

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


function getRampaEmExecucao(data) {
  if (!data || typeof data !== 'object') return null;
  const pgm = resolvePgmRampaFromPayload(data);
  if (pgm === 1 || pgm === 2 || pgm === 3) return pgm;
  const raw = data.rampa_ativa ?? data.rampa ?? data.rampa_em_execucao;
  if (raw === 1 || raw === 2 || raw === 3) return raw;
  if (data.raw_bits) {
    const b = data.raw_bits;
    if (b[3]) return 1;
    if (b[4]) return 2;
    if (b[5]) return 3;
  }
  return null;
}

/** Tela do painel geral: status, métricas, KPIs, esquemático, indicadores por cor, destinos PGM, logs e stream SSE. */
export default function PainelGeral() {
  const [now, setNow] = useState(() => new Date());
  const [isConnected, setIsConnected] = useState(false);
  const programEnabled = true;

  const [currentPieceColor, setCurrentPieceColor] = useState(null);
  const [activeRampa, setActiveRampa] = useState(null);
  const [activePgmRampa, setActivePgmRampa] = useState(null);

  const [productionFeed, setProductionFeed] = useState([]);

  const [nodeRedData, setNodeRedData] = useState({
    total_pecas: 1.257,
    total_ciclos: 0,
    taxa_acerto: '98.5%',
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

  const lastRampaExecLoggedRef = useRef(null);
  const lastCicloStatusRef = useRef(null);
  const lastProgramaStatusRef = useRef(null);

  // Atualiza a cada segundo a hora exibida na sobreposição da câmera.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Abre EventSource para o backend, sincroniza KPIs, rampas, logs e estado; expõe setRampaStatus no window para testes.
  useEffect(() => {
    
    window.setRampaStatus = (id, isActive) => {
      setRampas((prev) => prev.map((r) => (r.id === id ? { ...r, active: isActive } : r)));
    };

    const eventSource = new EventSource('http://localhost:3001/events');

    eventSource.onopen = () => setIsConnected(true);

    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("msg.payload :", data);

        if (data && data.raw_bits) {
          const bits = data.raw_bits;
          setRampas([
            { id: 1, name: 'PGM Rampa 1', active: !!bits[3] },
            { id: 2, name: 'PGM Rampa 2', active: !!bits[4] },
            { id: 3, name: 'PGM Rampa 3', active: !!bits[5] },
          ]);
        }

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

        const rampaExec = getRampaEmExecucao(data);
        
   
        const statusAtual = (data.status_robo || '').toLowerCase();

        if (statusAtual.includes('rampa 1') || rampaExec === 1) {
          setActivePgmRampa(1);
          setActiveRampa(1);
          setCurrentPieceColor('vermelha');
        } else if (statusAtual.includes('rampa 2') || rampaExec === 2) {
          setActivePgmRampa(2);
          setActiveRampa(2);
          setCurrentPieceColor('preta');
        } else if (statusAtual.includes('rampa 3') || rampaExec === 3) {
          setActivePgmRampa(3);
          setActiveRampa(3);
          setCurrentPieceColor('cinza');
        } else if (statusAtual.includes('aguard') || statusAtual.includes('idle')) {
         
          setActivePgmRampa(null);
        }
       

        if (rampaExec !== lastRampaExecLoggedRef.current) {
          lastRampaExecLoggedRef.current = rampaExec;
          if (rampaExec === 1 || rampaExec === 2 || rampaExec === 3) {
            const timeStr = new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            const line = `Rampa ${rampaExec} em execução`;
            setProductionFeed((prev) => {
              if (prev.length > 0 && prev[0].line === line && prev[0].time === timeStr) {
                return prev;
              }
              return [
                {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  time: timeStr,
                  line,
                },
                ...prev,
              ].slice(0, 30);
            });
          }
        }

        let logTexto = null;
        if (data.ultimo_log) logTexto = data.ultimo_log;
        else if (typeof data.payload === 'string') logTexto = data.payload;
        else if (data.payload && data.payload.ultimo_log) logTexto = data.payload.ultimo_log;
        else if (data.msg) logTexto = data.msg;

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

    return () => {
      eventSource.close();
      delete window.setRampaStatus;
    };
  }, []);

 
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

  // Mapeia a string status_robo do Node-RED para rótulo amigável e cor do indicador (IDLE / OPERANDO / outro).
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

          <div className={`${cardCls} p-5 md:p-6`}>
            <p className="text-sm md:text-base font-bold uppercase tracking-wider text-[#90a4ae] mb-6">
              Monitoramento de peças
            </p>
            <div
              className="flex flex-row flex-wrap items-center justify-center gap-10 sm:gap-14 md:gap-16 lg:gap-20 min-h-[140px]"
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
                const rampaEmExecucao =
                  activePgmRampa === d.id || activeRampa === d.id;
                const on = currentPieceColor === d.key || rampaEmExecucao;
                return (
                  <div key={d.id} className="flex flex-col items-center gap-3 shrink-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-pressed={on}
                      aria-label={`Indicador de peça ${d.label}: ${on ? 'ativo, em destaque' : 'inativo'}`}
                      className={`pointer-events-none h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-full border-2 border-solid transition-shadow ${
                        on
                          ? `${d.activeClass}${rampaEmExecucao ? ' peca-indicador-rampa-exec' : ''}`
                          : `${d.inactive} shadow-none`
                      }`}
                    />
                    <span className="text-sm font-medium text-center text-[#cfd8dc] tracking-wide">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Direita — logs */}
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
        </aside>
      </div>
    </div>
  );
}