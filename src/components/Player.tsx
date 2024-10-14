import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from './useKeyboardControls';

interface Trap {
  position: [number, number, number];
  size: [number, number, number];
}

interface PlayerProps {
  health: number;
  setHealth: (health: number) => void;
  onGameOver: (result: 'win' | 'lose') => void;
  setStartTime: (time: number) => void;
  damageTraps: Trap[];
  windTraps: Trap[];
  finishPlatform?: Trap;
}

export const Player: React.FC<PlayerProps> = ({
  health,
  setHealth,
  onGameOver,
  setStartTime,
  damageTraps,
  windTraps,
  finishPlatform,
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [velocity] = useState(new THREE.Vector3());
  const controls = useKeyboardControls();
  const { camera } = useThree();
  const [started, setStarted] = useState(false);
  const [damageTrapTimers, setDamageTrapTimers] = useState<Record<number, number>>({});
  const [windDirections, setWindDirections] = useState<Record<number, THREE.Vector3>>({});
  const [isGrounded, setIsGrounded] = useState(true); // Добавлено состояние для отслеживания земли

  useFrame((state, delta) => {
    if (ref.current) {
      controls.update(velocity, ref.current.position);
      ref.current.position.add(velocity);

      
      camera.position.lerp(
        new THREE.Vector3(ref.current.position.x, ref.current.position.y + 5, ref.current.position.z - 10),
        0.1
      );
      camera.lookAt(ref.current.position);

      
      if (ref.current.position.y < -10) {
        onGameOver('lose');
      }

      
      if (!started && ref.current.position.z > 5) {
        setStarted(true);
        setStartTime(Date.now());
      }

      if (finishPlatform && isPlayerOnTrap(ref.current.position, finishPlatform.position, finishPlatform.size)) {
        onGameOver('win');
        console.log('Финишная линия пересечена!');
      }

      
      if (health <= 0) {
        onGameOver('lose');
      }

      
      damageTraps.forEach((trap, index) => {
        if (isPlayerOnTrap(ref.current.position, trap.position, trap.size)) {
          if (!damageTrapTimers[index]) {
            damageTrapTimers[index] = Date.now();
            setDamageTrapTimers({ ...damageTrapTimers });
          } else if (Date.now() - damageTrapTimers[index] >= 1000) {
            setHealth(health - 20); 
            damageTrapTimers[index] = Date.now() + 5000; 
            setDamageTrapTimers({ ...damageTrapTimers });
          }
        } else {
          if (damageTrapTimers[index] && Date.now() - damageTrapTimers[index] >= 5000) {
            delete damageTrapTimers[index];
            setDamageTrapTimers({ ...damageTrapTimers });
          }
        }
      });

      
      windTraps.forEach((trap, index) => {
        if (!windDirections[index] || state.clock.elapsedTime % 2 < delta) {
          
          const angle = Math.random() * Math.PI * 2;
          windDirections[index] = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
          setWindDirections({ ...windDirections });
        }
        if (isPlayerOnTrap(ref.current.position, trap.position, trap.size)) {
          
          ref.current.position.add(windDirections[index].clone().multiplyScalar(0.1));
        }
      });

      // Обработка прыжка
      if (isGrounded && velocity.y <= 0) {
        // Игрок на земле
        velocity.y = 0;
      } else {
        
        velocity.y -= 0.1; 
        setIsGrounded(false); 
      }
    }
  });

  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

function isPlayerOnTrap(
  position: THREE.Vector3,
  trapPosition: [number, number, number],
  trapSize: [number, number, number]
): boolean {
  const halfSize = trapSize.map((s) => s / 2);
  return (
    position.x > trapPosition[0] - halfSize[0] &&
    position.x < trapPosition[0] + halfSize[0] &&
    position.y > trapPosition[1] - halfSize[1] &&
    position.y < trapPosition[1] + halfSize[1] &&
    position.z > trapPosition[2] - halfSize[2] &&
    position.z < trapPosition[2] + halfSize[2]
  );
}