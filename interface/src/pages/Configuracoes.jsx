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