import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-4 sm:p-6 font-sans overflow-hidden flex flex-col gap-4">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-500/30 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.8)] flex items-center justify-center">
            <Gamepad2 className="text-black" size={20} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-cyan-400 uppercase">
            NeonSnake OS
          </h1>
        </div>
        <div className="flex gap-4 text-xs font-mono text-cyan-500/70">
          <span className="hidden sm:inline">CPU: 14%</span>
          <span className="hidden sm:inline">RAM: 2.4GB</span>
          <span className="text-pink-500 animate-pulse font-bold">● LIVE FEED</span>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 flex-grow w-full max-w-7xl mx-auto xl:max-w-none">
        
        {/* System Logs (Stats Card equivalent) */}
        <div className="lg:col-span-3 lg:row-span-6 flex flex-col gap-4">
          <div className="h-full bg-[#0a0a0a] border border-cyan-500/20 p-5 rounded-xl flex flex-col">
            <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse" />
              System Logs
            </p>
            <div className="space-y-2 font-mono text-[11px] text-white/40">
              <p>&gt; Initializing neural net...</p>
              <p>&gt; Loading audio modules...</p>
              <p>&gt; Synthwave tracks ready.</p>
              <p>&gt; Awaiting user input.</p>
              <div className="h-[1px] bg-white/10 w-full my-4"></div>
              <p className="text-cyan-400/60">&gt; Environment: Grid-01</p>
              <p className="text-pink-500/60">&gt; Protocol: Serpent</p>
            </div>
            
            <div className="mt-auto">
              <div className="h-[1px] bg-white/10 w-full mb-4"></div>
              <p className="hidden lg:block text-[10px] text-white/20 uppercase tracking-widest leading-loose">
                Project S-N-A-K-E <br/>
                UI Integration <br/>
                Bento Grid Active
              </p>
            </div>
          </div>
        </div>

        {/* Snake Game Window */}
        <div className="lg:col-span-6 lg:row-span-6 bg-black border-2 border-pink-500/50 rounded-2xl relative shadow-[0_0_40px_rgba(236,72,153,0.1)] flex items-center justify-center overflow-hidden min-h-[450px]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col p-4">
            <SnakeGame />
          </div>
        </div>

        {/* Playlist / Music Player */}
        <div className="lg:col-span-3 lg:row-span-6 bg-[#0a0a0a] border border-white/5 p-5 rounded-xl flex flex-col">
           <MusicPlayer />
        </div>

      </main>

      {/* Footer Info */}
      <footer className="hidden sm:flex justify-between text-[9px] text-white/20 uppercase tracking-widest pt-2">
        <span>Project S-N-A-K-E // Audio Integration Module v0.4.2</span>
        <span>© 2026 NEON-GRID INDUSTRIES</span>
      </footer>

    </div>
  );
}
