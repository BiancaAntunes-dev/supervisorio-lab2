import { 
    LayoutDashboard, 
    MonitorPlay, 
    Factory, 
    Bell, 
    User, 
    Settings,
    LogOut
  } from 'lucide-react';
  
  export default function Sidebar({ activeTab, setActiveTab }) {
 
    const menuItems = [
      { id: 'painel', label: 'Painel Geral', icon: LayoutDashboard },
      { id: 'monitoramento', label: 'Monitoramento do Equipamento', icon: MonitorPlay },
      { id: 'producao', label: 'Produção', icon: Factory },
      { id: 'alertas', label: 'Alertas e Notificações', icon: Bell },
      { id: 'perfil', label: 'Perfil e Cadastro', icon: User },
      { id: 'configuracoes', label: 'Configurações', icon: Settings },
    ];
  
    return (
      <aside className="w-64 bg-white text-slate-800 flex flex-col shadow-xl z-20 flex-shrink-0 border-r border-gray-200">
        {/* Título da Sidebar */}
        <div className="h-16 flex items-center px-4 bg-[#111827] border-b border-slate-700">
        <img src="data:image/png;base64,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" 
        lt="Logo" 
        className="w-10 h-10 object-contain mr-3 shrink-0 rounded-md" 
      
    />
          <h1 className="font-bold text-white text-lg leading-tight">
            Supervisório Lab 2
          </h1>
        </div>
        
        {/* Navegação principal */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-200 cursor-pointer
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                      }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="leading-tight">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm transition-colors w-full font-medium">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    );
  }