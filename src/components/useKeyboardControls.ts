import { useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';

export const useKeyboardControls = () => {
  const keys = {
    W: false,
    A: false,
    S: false,
    D: false,
    ' ': false,
  };

  const velocity = new THREE.Vector3();
  const [isGrounded, setIsGrounded] = useState(true);

  const update = useCallback(
    (velocity: THREE.Vector3, playerPosition: THREE.Vector3) => {
      const speed = 0.1;
      const jumpSpeed = 0.2;
      const gravity = 0.01;

      velocity.x = 0;
      velocity.z = 0;

      if (keys.W) velocity.z = speed;
      if (keys.S) velocity.z = -speed;
      if (keys.A) velocity.x = speed;
      if (keys.D) velocity.x = -speed;

      if (keys[' '] && isGrounded) {
        velocity.y += jumpSpeed;
        setIsGrounded(false);
      }

      velocity.y -= gravity;

      if (velocity.y < -0.3) velocity.y = -0.3;

      if (playerPosition.y <= 1 && velocity.y <= 0) {
        setIsGrounded(true);
        velocity.y = 0;
      }
    },
    [isGrounded]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key in keys) keys[key as keyof typeof keys] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key in keys) keys[key as keyof typeof keys] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { update, velocity, setIsGrounded };
};