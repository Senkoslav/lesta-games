import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Player } from './Player';
import { TrapDamage } from './TrapDamage';
import { WindTrap } from './TrapWind';
import './styles.css';

interface Platform {
  type: 'platform' | 'damageTrap' | 'windTrap' | 'finish';
  position: [number, number, number];
  size: [number, number, number];
}

export const Game: React.FC = () => {
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  useEffect(() => {
    if (isGameStarted) {
      generatePlatforms();
      setStartTime(Date.now());
    }
  }, [isGameStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime !== null && gameOver === null) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, gameOver]);

  const handleGameOver = (result: 'win' | 'lose') => {
    console.log(`Game Over: ${result}`);
    setGameOver(result);
  };

  const handleRestart = () => {
    setHealth(100);
    setGameOver(null);
    setStartTime(null);
    setElapsedTime(0);
    setIsGameStarted(false);
  };

  const generatePlatforms = () => {
    const newPlatforms: Platform[] = [
      { type: 'platform', position: [0, 0, 0], size: [10, 1, 10] },
      { type: 'platform', position: [0, 0, 10], size: [3, 1, 3] },
      { type: 'damageTrap', position: [0, 0, 13], size: [3, 1, 3] },
      { type: 'platform', position: [0, 0, 16], size: [3, 1, 3] },
      { type: 'windTrap', position: [0, 0, 19], size: [3, 1, 3] },
      { type: 'platform', position: [0, 0, 22], size: [3, 1, 3] },
      { type: 'finish', position: [0, 0, 25], size: [10, 1, 5] },
    ];
    setPlatforms(newPlatforms);
  };

  return (
    <>
      {!isGameStarted ? (
        <div className="overlay">
          <h1>Запуск игры</h1>
          <button onClick={() => setIsGameStarted(true)}>Начать игру</button>
        </div>
      ) : (
        <>
          {gameOver && (
            <div className="overlay">
              <h1>{gameOver === 'win' ? 'Победа!' : 'Поражение!'}</h1>
              {gameOver === 'win' && (
                <p>Время прохождения: {(elapsedTime / 1000).toFixed(2)} секунд</p>
              )}
              <button onClick={handleRestart}>Перезапустить игру</button>
            </div>
          )}
          <div className="hud">
            <p>Здоровье: {health}</p>
            {startTime && <p>Время: {(elapsedTime / 1000).toFixed(2)} с</p>}
          </div>
          <div className="fullscreen-canvas">
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <OrbitControls />
              {platforms.map((platform, index) => {
                switch (platform.type) {
                  case 'platform':
                    return (
                      <mesh key={index} position={platform.position}>
                        <boxGeometry args={platform.size} />
                        <meshStandardMaterial color="gray" />
                      </mesh>
                    );
                  case 'damageTrap':
                    return (
                      <TrapDamage key={index} position={platform.position} size={platform.size} />
                    );
                  case 'windTrap':
                    return (
                      <WindTrap key={index} position={platform.position} size={platform.size} />
                    );
                  case 'finish':
                    return (
                      <mesh key={index} position={platform.position}>
                        <boxGeometry args={platform.size} />
                        <meshStandardMaterial color="gold" />
                      </mesh>
                    );
                  default:
                    return null;
                }
              })}
              <Player
                health={health}
                setHealth={setHealth}
                onGameOver={handleGameOver}
                setStartTime={setStartTime}
                damageTraps={platforms.filter(p => p.type === 'damageTrap')}
                windTraps={platforms.filter(p => p.type === 'windTrap')}
                finishPlatform={platforms.find(p => p.type === 'finish')}
              />
            </Canvas>
          </div>
        </>
      )}
    </>
  );
};