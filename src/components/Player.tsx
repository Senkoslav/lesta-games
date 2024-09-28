import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from './useKeyboardControls';

export const Player: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const [velocity] = useState(new THREE.Vector3());
  const controls = useKeyboardControls();

  useFrame(() => {
    if (ref.current) {
      // Передаем как скорость, так и позицию игрока в функцию update
      controls.update(velocity, ref.current.position);
      ref.current.position.add(velocity);

      // Простая проверка, чтобы не проваливаться ниже поверхности
      if (ref.current.position.y < 1) {
        ref.current.position.y = 1;
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
