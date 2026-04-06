import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PainelGeral from './pages/PainelGeral';
import Alertas from './pages/Alertas';
import Configuracoes from './pages/Configuracoes';
import Monitoramento from './pages/Monitoramento';
import Producao from './pages/Producao';
import PerfilCadastro from './pages/PerfilCadastro';


export default function App() {
  const [activeTab, setActiveTab] = useState('painel');

  const renderContent = () => {
    switch (activeTab) {
      case 'painel': return <PainelGeral />;
      case 'monitoramento': return <Monitoramento />;
      case 'producao': return <Producao />;
      case 'alertas' : return <Alertas />;
      case 'configuracoes' : return <Configuracoes />;
      case 'perfil' : return <PerfilCadastro />;
      default: return <PainelGeral />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden text-slate-800">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f3f4f6]">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

    </div>
  );
}