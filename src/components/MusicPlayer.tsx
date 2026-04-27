import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Drive",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Cyberpunk City",
    artist: "NetRunner",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Synthwave Nights",
    artist: "Aura 808",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay was prevented
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (!isNaN(duration)) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-4">Neural Beats FM</h3>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      {/* Track List */}
      <div className="space-y-3 flex-grow overflow-y-auto mb-4">
        {TRACKS.map((track, idx) => {
          const isCurrentTrack = idx === currentTrackIndex;
          return (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`p-3 border-l-2 transition-colors flex justify-between items-center cursor-pointer ${
                isCurrentTrack 
                  ? 'bg-pink-500/10 border-pink-500' 
                  : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="overflow-hidden">
                <p className={`text-sm font-bold truncate ${isCurrentTrack ? 'text-white' : 'text-white/70'}`}>
                  {track.title}
                </p>
                <p className="text-[10px] text-white/40">{track.artist}</p>
              </div>
              {isCurrentTrack && isPlaying ? (
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
              ) : (
                <span className="text-[10px] text-white/20">3:XX</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls Container */}
      <div className="mt-auto bg-[#0f0f0f] border border-white/10 rounded-xl p-4 shadow-inner flex flex-col gap-4">
        
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <Disc3 size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-bold truncate text-white">{currentTrack.title}</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">{currentTrack.artist}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1.5 font-mono">
            <span className="text-pink-500">
              {audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}
            </span>
            <span className="text-white/30">
              {audioRef.current && !isNaN(audioRef.current.duration) ? formatTime(audioRef.current.duration) : '00:00'}
            </span>
          </div>
          <div 
            className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={toggleMute}
            className="text-white/40 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="text-white/40 hover:text-white transition-colors"
            >
              <SkipBack size={18} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-white/40 hover:text-white transition-colors"
            >
              <SkipForward size={18} />
            </button>
          </div>
          
          <div className="w-4"></div>
        </div>
      </div>
    </div>
  );
}
