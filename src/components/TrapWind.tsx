import React, { useState, useEffect } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface WindTrapProps {
  position: [number, number, number];
  size: [number, number, number];
}

export const WindTrap: React.FC<WindTrapProps> = ({ position, size }) => {
  const [windDirection, setWindDirection] = useState<THREE.Vector3>(
    new THREE.Vector3(1, 0, 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      setWindDirection(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Box position={position} args={size}>
      <meshStandardMaterial color="blue" />
    </Box>
  );
};