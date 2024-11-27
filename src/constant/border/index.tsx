'use client';
import React from 'react';
import styles from './style.module.scss';
import { GoPlus } from 'react-icons/go';

interface BorderProps {
    background?: string;
    width?: string;
    color?: string;
    svgColor?: string;
}

const Border: React.FC<BorderProps> = ({ background, width, color, svgColor }) => {
    return (
        <div className={styles.borderBox} style={{ background: background ?? '#c1c1c1', width: width ?? '90%' }}>
            <div className={styles.plusSign} style={{ color: color ?? '#202020' }}>
                <svg viewBox="0 0 24 24" className={styles.diamond} style={{ fill: svgColor ?? '#202020' }}>
                    <path d="M12 2 L20 12 L12 22 L4 12 L12 2" />
                </svg>
            </div>
        </div>
    );
};

export default Border;
