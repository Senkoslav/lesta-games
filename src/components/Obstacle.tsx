import React from 'react';
import { Box } from '@react-three/drei';

export const Obstacle: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <Box position={position} args={[9, 2, 9]}>
      <meshStandardMaterial color="red" />
    </Box>
  );
};