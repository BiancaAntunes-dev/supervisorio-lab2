import { Camera, Wifi, MonitorPlay } from 'lucide-react';

export default function Monitoramento() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Monitoramento ao Vivo</h2>
        <p className="text-gray-600">Feed de vídeo da câmara do equipamento integrado.</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="bg-slate-900 rounded-lg aspect-video w-full relative flex flex-col items-center justify-center border-4 border-slate-800 overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            REC / AO VIVO
          </div>
          <div className="absolute top-4 left-4 text-white text-sm font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            CAM-01 / ESTEIRA PRINCIPAL
          </div>
          
          <Camera className="w-16 h-16 text-slate-700 mb-4 opacity-50" />
          <p className="text-slate-400 font-medium">Ligado ao feed RTSP...</p>
          
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full border border-white/20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/40 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30"></div>
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/30"></div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-3 rounded border flex items-center gap-3">
            <Wifi className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Estado da Rede</p>
              <p className="font-semibold text-gray-800">Ligado (Latência: 12ms)</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded border flex items-center gap-3">
            <MonitorPlay className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Resolução</p>
              <p className="font-semibold text-gray-800">1080p @ 60 FPS</p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded border flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Gravação</p>
              <p className="font-semibold text-gray-800">Ativada</p>
            </div>
            <button className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors">Capturar</button>
          </div>
        </div>
      </div>
    </div>
  );
}