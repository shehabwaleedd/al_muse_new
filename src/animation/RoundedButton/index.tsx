'use client';

import React, { useEffect, useRef, ReactNode, HTMLAttributes } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import Magnetic from '../Magnetic';

interface RoundedButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  backgroundColor?: string;
}

const RoundedButton: React.FC<RoundedButtonProps> = ({ children, backgroundColor, ...attributes }) => {
  const circle = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (circle.current) {
      timeline.current = gsap.timeline({ paused: true });
      timeline.current
        .to(circle.current, { top: '-25%', width: '150%', duration: 0.4, ease: 'power3.in' }, 'enter')
        .to(circle.current, { top: '-150%', width: '125%', duration: 0.25 }, 'exit');
    }
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeline.current?.tweenFromTo('enter', 'exit');
  };

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  return (
    <Magnetic>
      <div
        className={styles.roundedButton}
        style={{ backgroundColor: 'transparent', overflow: 'hidden' }}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...attributes}
      >
        {children}
        <div
          ref={circle}
          className={styles.circle}
          style={{ backgroundColor: backgroundColor ?? 'var(--accent-color)' }}
        ></div>
      </div>
    </Magnetic>
  );
};

export default RoundedButton;
