'use client'

import { motion, useTransform } from 'framer-motion';
import styles from './style.module.scss';
import type { StarIconProps } from './types';

const DiamondIcon: React.FC<StarIconProps> = ({
    primaryColor = '#0D9488',
    secondaryColor = '#0F766E',
    progress
}) => {

    const rotate = useTransform(progress, [0, 1], [-90, 90]);
    const pathLength = useTransform(progress, [0, 1], [0, 1]);

    return (
        <figure className={styles.iconContainer}>
            <motion.svg
                className={styles.star}
                width="40"
                height="40"
                viewBox="0 0 12800 12800"
                style={{ rotate }}>
                <g transform="scale(1, -1) translate(0, -12800)">
                    <motion.path
                        className={styles.outline}
                        d="M6361 12697 c-268 -738 -619 -1517 -939 -2082 -250 -443 -538 -874
                        -815 -1220 -364 -453 -828 -912 -1278 -1262 -701 -545 -1509 -998 -2549 -1430
                        -166 -69 -526 -209 -677 -264 -51 -19 -93 -36 -93 -39 0 -3 42 -20 93 -39 50
                        -18 189 -71 307 -117 2057 -797 3369 -1719 4385 -3084 119 -161 376 -544 477
                        -715 398 -667 777 -1484 1089 -2342 19 -51 36 -93 39 -93 3 0 20 42 39 93 268
                        738 619 1517 939 2082 250 443 538 874 815 1220 364 453 828 912 1278 1262
                        701 545 1509 998 2549 1430 166 69 526 209 677 264 51 19 93 36 93 39 0 3 -42
                        20 -93 39 -50 18 -189 71 -307 117 -2057 797 -3369 1719 -4385 3084 -119 161
                        -376 544 -477 715 -398 667 -777 1484 -1089 2342 -19 51 -36 93 -39 93 -3 0
                        -20 -42 -39 -93z"
                        style={{
                            pathLength,
                            stroke: primaryColor
                        }}
                    />
                    <motion.path
                        className={styles.fill}
                        d="M6361 12697 c-268 -738 -619 -1517 -939 -2082 -250 -443 -538 -874
                        -815 -1220 -364 -453 -828 -912 -1278 -1262 -701 -545 -1509 -998 -2549 -1430
                        -166 -69 -526 -209 -677 -264 -51 -19 -93 -36 -93 -39 0 -3 42 -20 93 -39 50
                        -18 189 -71 307 -117 2057 -797 3369 -1719 4385 -3084 119 -161 376 -544 477
                        -715 398 -667 777 -1484 1089 -2342 19 -51 36 -93 39 -93 3 0 20 42 39 93 268
                        738 619 1517 939 2082 250 443 538 874 815 1220 364 453 828 912 1278 1262
                        701 545 1509 998 2549 1430 166 69 526 209 677 264 51 19 93 36 93 39 0 3 -42
                        20 -93 39 -50 18 -189 71 -307 117 -2057 797 -3369 1719 -4385 3084 -119 161
                        -376 544 -477 715 -398 667 -777 1484 -1089 2342 -19 51 -36 93 -39 93 -3 0
                        -20 -42 -39 -93z"
                        style={{ fill: secondaryColor,}}
                    />
                </g>
            </motion.svg>
        </figure>
    );
};

export default DiamondIcon;