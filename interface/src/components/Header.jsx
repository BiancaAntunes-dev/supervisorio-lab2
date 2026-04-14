import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function Header({ setActiveTab }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [hasNotification, setHasNotification] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const notificationTimer = setInterval(() => {
            setHasNotification(true);
        }, 15000);

        return () => {
            clearInterval(timer);
            clearInterval(notificationTimer);
        };
    }, []);

    const handleNotificationClick = () => {
        setHasNotification(false);
        if (setActiveTab) {
            setActiveTab('painel');
        }
    };

    const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
      <header className="h-16 bg-[#111827] flex items-center px-6 shadow-md z-10 border-l border-slate-700/50 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white">Sistema de Monitoramento Integrado</h2>
<<<<<<< HEAD
        <img 
          src="/assets/logo-senai.png" alt="Logotipo SENAI"
          width={"250"}
          height={"60"}
          className='h-11 w-auto object-contain m-8'
       />
=======
        <img src="/assets/logo-senai.png" alt="Logótipo SENAI" className='h-11 w-auto object-contain m-8' />
>>>>>>> 434341da77e18cdf79232214f0a37e9933bbd060
        
        <div className="ml-auto flex items-center gap-6">
          {/* Relógio em Tempo Real */}
          <div className="text-slate-300 font-mono text-sm font-semibold tracking-wider bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
            {formattedTime}
          </div>

          {/* Sino de Notificações */}
<<<<<<< HEAD
          <button 
            aria-label="Ver notificações"
=======
          <button
            type="button"
>>>>>>> 434341da77e18cdf79232214f0a37e9933bbd060
            onClick={handleNotificationClick}
            aria-label="Notificações. Abre o painel geral."
            className="text-slate-300 hover:text-white relative transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" aria-hidden />
            {hasNotification && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-[#111827] animate-pulse" />
            )}
          </button>
          
          {/* Avatar */}
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-bold border border-slate-600 cursor-pointer hover:bg-slate-600 transition-colors">
            BG
          </div>
        </div>
      </header>
    );
  }