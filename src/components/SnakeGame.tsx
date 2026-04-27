import { useEffect, useState, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameBoardRef = useRef<HTMLDivElement>(null);
  
  // To handle rapid key presses gracefully
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = () => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      const onSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setGameOver(false);
    setIsPlaying(true);
    setScore(0);
    gameBoardRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      // Prevent scrolling when playing with arrows
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;
        head.x += currentDir.x;
        head.y += currentDir.y;

        // Check collision with walls
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      setDirection(directionRef.current);
    };

    const speed = Math.max(50, 150 - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, score]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative font-sans">
      <div className="flex justify-between w-full mb-4 text-white font-mono uppercase">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] text-cyan-500 tracking-widest">Current Score</span>
          <span className="text-3xl font-black text-white">{score}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-white/40 tracking-widest flex items-center gap-1">
            <Trophy size={10} /> Top Score
          </span>
          <span className="text-xl font-bold text-pink-500">{highScore}</span>
        </div>
      </div>

      <div 
        ref={gameBoardRef}
        className="relative bg-transparent border border-white/10 aspect-square w-full max-h-[500px] max-w-[500px] grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] focus:outline-none mx-auto mt-auto mb-auto"
        tabIndex={0}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`
              ${index === 0 ? 'bg-pink-500 shadow-[0_0_10px_#ec4899] z-10' : 'bg-pink-500'} 
              m-[1px]
            `}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Render Food */}
        <div
          className="bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full m-[2px] animate-pulse z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-bold tracking-wider uppercase rounded-sm hover:scale-105 transition-transform"
            >
              <Play size={20} /> Initialize
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md z-20">
            <div className="text-center flex flex-col items-center">
              <h2 className="text-3xl font-black text-pink-500 mb-2 tracking-widest">SYSTEM FAILURE</h2>
              <p className="text-cyan-400 font-mono mb-6 text-sm">Score logged: {score}</p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-2 bg-transparent border-2 border-cyan-500 text-cyan-500 font-bold tracking-wider uppercase rounded-sm hover:bg-cyan-500 hover:text-black transition-all"
              >
                <RotateCcw size={16} /> Reboot
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-[10px] text-white/30 uppercase tracking-[0.3em] w-full text-center">
        Use Arrow Keys to Navigate
      </div>
    </div>
  );
}
