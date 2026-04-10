import React, { useState, useEffect } from 'react';

export default function Alertas() {
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      tipo: 'CRITICO',
      titulo: 'Robô Principal',
      descricao: 'Parada de emergência acionada na linha principal.',
      data: new Date(Date.now() - 10000), 
      lido: false
    },
    {
      id: 2,
      tipo: 'AVISO',
      titulo: 'Rampa 3',
      descricao: 'Capacidade de armazenamento próxima ao limite (90%).',
      data: new Date(Date.now() - 5 * 60000), 
      lido: false
    },
    {
      id: 3,
      tipo: 'INFO',
      titulo: 'Sistema',
      descricao: 'Atualização de rotina concluída com sucesso.',
      data: new Date(Date.now() - 60 * 60000), 
      lido: false
    },
    {
      id: 4,
      tipo: 'AVISO',
      titulo: 'Câmera',
      descricao: 'Queda na taxa de quadros (FPS) detectada.',
      data: new Date(Date.now() - 120 * 60000), 
      lido: false
    }
  ]);

  // Dados fictícios
  useEffect(() => {
    // alertas falsos para o sistema ir sorteando
    const possiveisAlertas = [
      { tipo: 'INFO', titulo: 'Conexão', descricao: 'Estabilidade da rede restaurada com sucesso.' },
      { tipo: 'AVISO', titulo: 'Sensor de Cor', descricao: 'Leitura com baixa confiança (Rampa 1). Necessário limpeza.' },
      { tipo: 'CRITICO', titulo: 'CLP', descricao: 'Falha de comunicação com o controlador lógico na Rampa 2.' },
      { tipo: 'INFO', titulo: 'Backup', descricao: 'Sincronização dos dados de produção salva na nuvem.' },
      { tipo: 'AVISO', titulo: 'Motor Esteira', descricao: 'Temperatura do motor acima da média (65ºC).' }
    ];

    const simulador = setInterval(() => {
      const alertaSorteado = possiveisAlertas[Math.floor(Math.random() * possiveisAlertas.length)];
      
      const novoAlerta = {
        id: Date.now(), 
        tipo: alertaSorteado.tipo,
        titulo: alertaSorteado.titulo,
        descricao: alertaSorteado.descricao,
        data: new Date(), 
        lido: false
      };

      setAlertas(estadoAtual => [novoAlerta, ...estadoAtual].slice(0, 10));

    }, 15000); 
               
               

    return () => clearInterval(simulador);
  }, []);

 
  const [, setTick] = useState(0);
  useEffect(() => {
    const relogio = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(relogio);
  }, []);

  const calcularTempoAtras = (dataDoAlerta) => {
    const segundosAtras = Math.floor((new Date() - dataDoAlerta) / 1000);
    
    if (segundosAtras < 60) return 'Agora mesmo';
    
    const minutosAtras = Math.floor(segundosAtras / 60);
    if (minutosAtras < 60) return `Há ${minutosAtras} min`;
    
    const horasAtras = Math.floor(minutosAtras / 60);
    if (horasAtras < 24) return `Há ${horasAtras} hora${horasAtras > 1 ? 's' : ''}`;
    
    const diasAtras = Math.floor(horasAtras / 24);
    return `Há ${diasAtras} dia${diasAtras > 1 ? 's' : ''}`;
  };
//Botão superior
  const marcarTodosComoLidos = () => {
    setAlertas(alertasAtual => alertasAtual.map(a => ({ ...a, lido: true })));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Alertas e Notificações</h2>
        <p className="text-slate-500">Central de alarmes e alertas.</p>
      </div>

      {/* Card Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        
        {/* Topo do Card */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">Histórico Recente</h3>
          <button 
            onClick={marcarTodosComoLidos}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Marcar todos como lidos
          </button>
        </div>

        {/* Lista de Alertas */}
        <div className="divide-y divide-slate-100">
          {alertas.map((alerta) => (
            <div 
              key={alerta.id} 
              className={`p-4 flex gap-4 transition-all duration-500 ${alerta.lido ? 'opacity-50 bg-slate-50' : 'bg-white'}`}
            >
              {/* Ícones */}
              <div className="mt-1 flex-shrink-0">
                {alerta.tipo === 'CRITICO' && (
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="m15 9-6 6m0-6 6 6"/></svg>
                )}
                {alerta.tipo === 'AVISO' && (
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01"/></svg>
                )}
                {alerta.tipo === 'INFO' && (
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4"/></svg>
                )}
              </div>

              {/* Conteúdo do Alerta */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  
                  {/* Badge e Título */}
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wider ${
                      alerta.tipo === 'CRITICO' ? 'bg-red-100 text-red-700' : 
                      alerta.tipo === 'AVISO' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alerta.tipo}
                    </span>
                    <h4 className="font-bold text-slate-800">{alerta.titulo}</h4>
                  </div>
                  
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {calcularTempoAtras(alerta.data)}
                  </span>
                </div>
                
                {/* Descrição */}
                <p className="text-sm text-slate-500 mt-1">
                  {alerta.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}