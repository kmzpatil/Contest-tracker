'use client';

import React from 'react';
import styles from './ToggleGroup.module.css';

interface Option {
  label: string;
  value: string;
  color?: string;
}

interface ToggleGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  return (
    <div className={styles.group}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const colorStyle = isSelected && option.color ? { color: option.color, borderColor: option.color, backgroundColor: `${option.color}15` } : {};
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`${styles.toggle} ${isSelected ? styles.selected : ''}`}
            style={colorStyle}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
