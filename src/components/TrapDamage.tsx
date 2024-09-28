import React, { useState, useEffect } from 'react';
import { Box } from '@react-three/drei';

export const TrapDamage: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box position={position} args={[9, 0.1, 9]}>
      <meshStandardMaterial color={active ? 'red' : 'orange'} />
    </Box>
  );
};