import React, { useState, useEffect } from 'react';
import { Box } from '@react-three/drei';

export const TrapWind: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box position={position} args={[3, 0.1, 3]}>
      <meshStandardMaterial color={active ? 'blue' : 'lightblue'} />
    </Box>
  );
};