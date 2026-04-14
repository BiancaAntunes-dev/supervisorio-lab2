import { Network } from 'lucide-react';

const cardCls = 'rounded-xl border border-[#2a3038] bg-[#1e2329] shadow-sm overflow-hidden';

const inputCls =
  'w-full rounded-lg border border-[#2a3038] bg-[#141820] px-3 py-2.5 font-industrial-mono text-sm text-[#e4e6eb] placeholder:text-[#5c6370] focus:border-[#2196f3]/70 focus:ring-2 focus:ring-[#2196f3]/25 focus:outline-none transition-colors';

const labelCls = 'block text-sm font-bold text-[#9aa0a8] mb-1.5';

export default function Configuracoes() {
  return (
    <div className="font-industrial text-[#e4e6eb] w-full max-w-[1920px] mx-auto pb-8 space-y-6">
      <div className="rounded-xl border border-[#2a3038] bg-[#23262f] px-4 py-4 md:px-5 md:py-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Configurações</h2>
        <p className="text-sm text-[#9aa0a8] mt-1">Ajustes do sistema de monitoramento integrado.</p>
      </div>

      <div className={cardCls}>
        <div className="border-b border-[#2a3038] bg-[#181c22] px-4 py-3">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <Network className="w-5 h-5 text-[#2196f3]" />
            Ligações e rede
          </h3>
        </div>
        <div className="p-5 md:p-6 space-y-8">
          <section>
            <h4 className="text-base font-bold text-white border-b border-[#2a3038] pb-2 mb-4">Configurações de rede</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Endereço IP da câmara (RTSP)</label>
                <input
                  type="text"
                  defaultValue="rtsp://192.168.1.100:554/stream"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Porta do controlador lógico (CLP)</label>
                <input
                  type="text"
                  defaultValue="502 (Modbus TCP)"
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-2 border-t border-[#2a3038]">
            <button
              type="button"
              aria-label="Guardar alterações de ligações e rede"
              className="rounded-lg bg-[#1976d2] text-white font-bold py-2.5 px-6 hover:bg-[#1565c0] transition-colors border border-[#2196f3]/30 shadow-[0_0_20px_rgba(33,150,243,0.2)]"
            >
              Guardar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
