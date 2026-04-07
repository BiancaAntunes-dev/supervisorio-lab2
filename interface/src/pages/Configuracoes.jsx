export default function Configuracoes() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
          <p className="text-gray-600">Ajustes do sistema de monitoramento integrado.</p>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-8">
            
            {/* Rede */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Configurações de Rede</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Endereço IP da Câmara (RTSP)</label>
                  <input 
                    type="text" 
                    defaultValue="rtsp://192.168.1.100:554/stream" 
                    className="w-full border border-gray-300 rounded p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Porta do Controlador Lógico (CLP)</label>
                  <input 
                    type="text" 
                    defaultValue="502 (Modbus TCP)" 
                    className="w-full border border-gray-300 rounded p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
              </div>
            </section>
  
            {/* Exibição */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Preferências de Exibição</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <p className="font-bold text-gray-800">Tema Escuro</p>
                    <p className="text-xs text-gray-500">Mudar a interface principal para cores escuras.</p>
                  </div>
                  {/* Switch inativo */}
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer transition-colors">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <p className="font-bold text-gray-800">Atualização em Tempo Real</p>
                    <p className="text-xs text-gray-500">Busca novos dados de produção a cada 1 segundo.</p>
                  </div>
                  {/* Switch ativo */}
                  <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer transition-colors">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow transition-transform"></div>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Botão de Salvar */}
            <div className="flex justify-end pt-4">
              <button className="bg-slate-800 text-white font-bold py-2 px-6 rounded hover:bg-slate-700 transition-colors">
                Guardar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }