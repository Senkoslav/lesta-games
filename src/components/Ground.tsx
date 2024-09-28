// Ground.tsx
import React from 'react';
import * as THREE from 'three';

const Ground: React.FC = () => {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

export default Ground;
