import { User, Save } from 'lucide-react';

const cardCls = 'rounded-xl border border-[#2a3038] bg-[#1e2329] shadow-sm overflow-hidden';

const inputCls =
  'w-full rounded-lg border border-[#2a3038] bg-[#141820] px-3 py-2.5 text-[#e4e6eb] placeholder:text-[#5c6370] focus:border-[#2196f3]/70 focus:ring-2 focus:ring-[#2196f3]/25 focus:outline-none transition-colors';

const labelCls = 'block text-sm font-bold text-[#9aa0a8] mb-1.5';

export default function PerfilCadastro() {
  return (
    <div className="font-industrial text-[#e4e6eb] w-full max-w-[1920px] mx-auto pb-8 space-y-6">
      <div className="rounded-xl border border-[#2a3038] bg-[#23262f] px-4 py-4 md:px-5 md:py-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Perfil e cadastro</h2>
        <p className="text-sm text-[#9aa0a8] mt-1">
          Gestão das suas informações e registo de novos operadores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        {/* Meu Perfil */}
        <div className={cardCls}>
          <div className="border-b border-[#2a3038] bg-[#181c22] px-4 py-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <User className="w-5 h-5 text-[#2196f3]" /> Meu perfil
            </h3>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-[#2a3038] border-2 border-[#3d4654] flex items-center justify-center text-[#90a4ae] text-2xl font-bold">
                OP
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Lucas Silva</h4>
                <p className="text-[#2196f3] font-medium text-sm">Supervisor de turno</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#78909c] uppercase tracking-wide">Matrícula SENAI</label>
                <p className="text-[#e4e6eb] font-medium mt-0.5">SN-99824</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#78909c] uppercase tracking-wide">E-mail</label>
                <p className="text-[#e4e6eb] font-medium mt-0.5">lucas.silva@senai.br</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#78909c] uppercase tracking-wide">Último acesso</label>
                <p className="text-[#e4e6eb] font-medium mt-0.5">Hoje, 07:45</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Editar informações do meu perfil"
              className="mt-6 w-full rounded-lg border border-[#2a3038] bg-[#141820] text-[#e4e6eb] font-bold py-2.5 hover:bg-[#1e2329] hover:border-[#2196f3]/40 transition-colors"
            >
              Editar informações
            </button>
          </div>
        </div>

        {/* Novo Registo */}
        <div className={cardCls}>
          <div className="border-b border-[#2a3038] bg-[#181c22] px-4 py-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <User className="w-5 h-5 text-[#4caf50]" /> Registar novo utilizador
            </h3>
          </div>
          <div className="p-5 md:p-6">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className={labelCls}>Nome completo</label>
                <input type="text" className={inputCls} placeholder="Ex: Isabela Lima" />
              </div>
              <div>
                <label className={labelCls}>E-mail corporativo</label>
                <input type="email" className={inputCls} placeholder="Ex: isabela@senai.br" />
              </div>
              <div>
                <label className={labelCls}>Nível de acesso</label>
                <select className={`${inputCls} cursor-pointer`}>
                  <option className="bg-[#1e2329]">Operador nível 1</option>
                  <option className="bg-[#1e2329]">Operador nível 2</option>
                  <option className="bg-[#1e2329]">Supervisor</option>
                  <option className="bg-[#1e2329]">Administrador do sistema</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Senha provisória</label>
                <input type="password" className={inputCls} placeholder="••••••••" />
              </div>
              <button
                type="submit"
                aria-label="Registar novo utilizador no sistema"
                className="w-full rounded-lg bg-[#1976d2] text-white font-bold py-2.5 hover:bg-[#1565c0] transition-colors flex justify-center items-center gap-2 mt-2 border border-[#2196f3]/30 shadow-[0_0_20px_rgba(33,150,243,0.2)]"
              >
                <Save className="w-4 h-4" aria-hidden /> Registar utilizador
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
