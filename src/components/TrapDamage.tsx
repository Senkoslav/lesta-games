import React, { useState, useEffect } from 'react';
import { Box } from '@react-three/drei';

interface TrapDamageProps {
  position: [number, number, number];
  size: [number, number, number];
}

export const TrapDamage: React.FC<TrapDamageProps> = ({ position, size }) => {
  const [state, setState] = useState<'idle' | 'activated' | 'cooldown'>('idle');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === 'activated') {
      interval = setTimeout(() => {
        setState('cooldown');
      }, 1000); 
    } else if (state === 'cooldown') {
      interval = setTimeout(() => {
        setState('idle');
      }, 5000); 
    }
    return () => clearTimeout(interval);
  }, [state]);

  const color =
    state === 'activated' ? 'orange' : state === 'cooldown' ? 'gray' : 'red';

  return (
    <Box position={position} args={size}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};