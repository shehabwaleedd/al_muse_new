import React from 'react';
import styles from './style.module.scss';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";

interface DiamondButtonProps {
    onClick: () => void;
    ariaLabel: string;
    direction?: 'prev' | 'next';
    fillColor?: string;
    iconColor?: string;
    children?: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    disabled?: boolean;
}

const DiamondButton = ({
    onClick,
    ariaLabel,
    direction,
    fillColor = '#202020',
    iconColor = '#ffffff',
    children,
    size = 'medium',
    disabled = false
}: DiamondButtonProps) => {
    const sizeMap = {
        small: { button: '2rem', icon: '1rem' },
        medium: { button: '3rem', icon: '1.25rem' },
        large: { button: '4rem', icon: '1.5rem' },
        xlarge: { button: '6rem', icon: '2.5rem' }
    };

    return (
        <button
            onClick={onClick}
            className={`${styles.diamondButton} ${styles[size]}`}
            aria-label={ariaLabel}
            style={{ width: sizeMap[size].button, height: sizeMap[size].button }}
            disabled={disabled}
        >
            {direction && (
                <div className={styles.iconWrapper} style={{ fontSize: sizeMap[size].icon }}>
                    {direction === 'prev' ? (
                        <GoArrowLeft style={{ fill: iconColor }} />
                    ) : (
                        <GoArrowRight style={{ fill: iconColor }} />
                    )}
                </div>
            )}

            <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.diamondSvg}
                viewBox="0 0 1280 1280"
                preserveAspectRatio="xMidYMid meet"
            >
                <g transform="translate(0,1280) scale(0.1,-0.1)" fill={fillColor}>
                    <path d="M6361 12697 c-268 -738 -619 -1517 -939 -2082 -250 -443 -538 -874 -815 -1220 -364 -453 -828 -912 -1278 -1262 -701 -545 -1509 -998 -2549 -1430 -166 -69 -526 -209 -677 -264 -51 -19 -93 -36 -93 -39 0 -3 42 -20 93 -39 50 -18 189 -71 307 -117 2057 -797 3369 -1719 4385 -3084 119 -161 376 -544 477 -715 398 -667 777 -1484 1089 -2342 19 -51 36 -93 39 -93 3 0 20 42 39 93 268 738 619 1517 939 2082 250 443 538 874 815 1220 364 453 828 912 1278 1262 701 545 1509 998 2549 1430 166 69 526 209 677 264 51 19 93 36 93 39 0 3 -42 20 -93 39 -50 18 -189 71 -307 117 -2057 797 -3369 1719 -4385 3084 -119 161 -376 544 -477 715 -398 667 -777 1484 -1089 2342 -19 51 -36 93 -39 93 -3 0 -20 -42 -39 -93z" />
                </g>
            </svg>

            {children && (
                <div className={styles.content}>
                    {children}
                </div>
            )}
        </button>
    );
};

export default DiamondButton;