import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { TrapDamage } from './TrapDamage';
import { TrapWind } from './TrapWind';
import { Obstacle } from './Obstacle';

export const Game: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 10, 20], fov: 75 }} style={{ display: 'block' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Добавляем поверхность */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="lightgrey" />
        </mesh>

        <Player />
        <TrapDamage position={[0, 0, -3]} />
        <TrapWind position={[3, 0, -3]} />
        <Obstacle position={[5, 1, -5]} />
        <Obstacle position={[-5, 1, -10]} />
      </Canvas>
    </div>
  );
};