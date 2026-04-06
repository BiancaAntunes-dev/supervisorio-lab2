import { User, Save } from 'lucide-react';

export default function PerfilCadastro() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Perfil e Cadastro</h2>
        <p className="text-gray-600">Faça a gestão das suas informações e registe novos operadores.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meu Perfil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 p-4 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Meu Perfil
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-2xl font-bold">
                OP
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Lucas Silva</h4>
                <p className="text-blue-600 font-medium">Supervisor de Turno</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Matrícula SENAI</label>
                <p className="text-gray-800 font-medium">SN-99824</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">E-mail</label>
                <p className="text-gray-800 font-medium">lucas.silva@senai.br</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Último Acesso</label>
                <p className="text-gray-800 font-medium">Hoje, 07:45 AM</p>
              </div>
            </div>
            <button className="mt-6 w-full bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-50 transition-colors">
              Editar Informações
            </button>
          </div>
        </div>

        {/* Novo Registo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 p-4 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" /> Registar Novo Utilizador
            </h3>
          </div>
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Isabela Lima" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">E-mail Corporativo</label>
                <input type="email" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: isabela@senai.br" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nível de Acesso</label>
                <select className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                  <option>Operador Nível 1</option>
                  <option>Operador Nível 2</option>
                  <option>Supervisor</option>
                  <option>Administrador do Sistema</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Senha Provisória</label>
                <input type="password" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
              </div>
              <button type="button" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 mt-4">
                <Save className="w-4 h-4" /> Registar Utilizador
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}