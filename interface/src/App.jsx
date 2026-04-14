import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PainelGeral from './pages/PainelGeral';
import Configuracoes from './pages/Configuracoes';
import PerfilCadastro from './pages/PerfilCadastro';

export default function App() {
  const [activeTab, setActiveTab] = useState('painel');

  const renderContent = () => {
    switch (activeTab) {
      case 'painel': return <PainelGeral />;
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

        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 ${activeTab === 'painel' || activeTab === 'perfil' || activeTab === 'configuracoes' ? 'bg-[#1a1d24]' : 'bg-[#f3f4f6]'}`}
        >
          <div className={activeTab === 'painel' || activeTab === 'perfil' || activeTab === 'configuracoes' ? 'max-w-[1920px] mx-auto w-full' : 'max-w-6xl mx-auto'}>
            {renderContent()}
          </div>
        </main>
      </div>

    </div>
  );
}