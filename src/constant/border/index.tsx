'use client';
import React from 'react';
import styles from './style.module.scss';


interface BorderProps {
    background?: string;
    width?: string;
    color?: string;
    svgColor?: string;
}

const Border: React.FC<BorderProps> = ({ background, width, color, svgColor }) => {
    return (
        <section className={styles.borderBox} style={{ background: background ?? '#c1c1c1', width: width ?? '90%' }}>
            <div className={styles.plusSign} style={{ color: color ?? '#202020' }}>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className={styles.diamond} viewBox="0 0 1280.000000 1280.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" style={{ fill: svgColor ?? "#202020"}} stroke="none">
                        <path d="M6361 12697 c-268 -738 -619 -1517 -939 -2082 -250 -443 -538 -874 -815 -1220 -364 -453 -828 -912 -1278 -1262 -701 -545 -1509 -998 -2549 -1430 -166 -69 -526 -209 -677 -264 -51 -19 -93 -36 -93 -39 0 -3 42 -20 93 -39 50 -18 189 -71 307 -117 2057 -797 3369 -1719 4385 -3084 119 -161 376 -544 477 -715 398 -667 777 -1484 1089 -2342 19 -51 36 -93 39 -93 3 0 20 42 39 93 268 738 619 1517 939 2082 250 443 538 874 815 1220 364 453 828 912 1278 1262 701 545 1509 998 2549 1430 166 69 526 209 677 264 51 19 93 36 93 39 0 3 -42 20 -93 39 -50 18 -189 71 -307 117 -2057 797 -3369 1719 -4385 3084 -119 161 -376 544 -477 715 -398 667 -777 1484 -1089 2342 -19 51 -36 93 -39 93 -3 0 -20 -42 -39 -93z"/>
                    </g>
                </svg>
            </div>
        </section>
    );
};

export default Border;
