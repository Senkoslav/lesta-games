import React from 'react';

export const Ground: React.FC = () => {
  return (
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[500, 1, 500]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};