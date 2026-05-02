'use client';

import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClass = styles[type];

  return (
    <div className={`${styles.toast} ${typeClass} ${isVisible ? styles.enter : styles.exit} glass`}>
      <span>{message}</span>
      <button onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }} className={styles.closeBtn}>
        &times;
      </button>
    </div>
  );
}
