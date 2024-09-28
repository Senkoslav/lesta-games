// useKeyboardControls.ts
import { useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';

export const useKeyboardControls = () => {
  const keys = {
    W: false,
    A: false,
    S: false,
    D: false,
    Space: false,
  };

  const velocity = new THREE.Vector3();
  const [isGrounded, setIsGrounded] = useState(true);

  const update = useCallback((velocity: THREE.Vector3, playerPosition: THREE.Vector3) => {
    const speed = 0.05; // Постоянная скорость движения
    const jumpSpeed = 0.2; // Скорость прыжка
    const gravity = 0.01; // Гравитация

    // Сброс горизонтальной скорости перед каждым обновлением
    velocity.x = 0;
    velocity.z = 0;

    // Горизонтальное движение: WASD
    if (keys.W) velocity.z = -speed;
    if (keys.S) velocity.z = speed;
    if (keys.A) velocity.x = -speed;
    if (keys.D) velocity.x = speed;

    // Прыжок
    if (keys.Space && isGrounded) {
      velocity.y += jumpSpeed;
      setIsGrounded(false);
    }

    // Применение гравитации
    velocity.y -= gravity;

    // Ограничение скорости падения
    if (velocity.y < -0.3) velocity.y = -0.3;

    // Логика приземления
    if (playerPosition.y <= 0 && velocity.y <= 0) {
      setIsGrounded(true); // Если игрок на земле
      velocity.y = 0; // Остановка падения
    }
  }, [isGrounded]);

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
