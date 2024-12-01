'use client'

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import JourneyItem from '../journeyItem';
import styles from './style.module.scss';
import type { JourneyProps } from './types';

const Journey: React.FC<JourneyProps> = ({
    items,
    primaryColor = '#0D9488',
    secondaryColor = '#0F766E',
    title,
    eyebrow
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Improved scroll progress tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <motion.h2 className={styles.sectionTitle}>
                    <p className={styles.eyebrow}>{eyebrow}</p>
                    {title}
                </motion.h2>
            </div>

            <div ref={containerRef} className={styles.timeline}>
                <motion.div style={{ scaleY: scrollYProgress, backgroundColor: primaryColor }} className={styles.progressLine} />
                <ul className={styles.itemsList}>
                    {items.map((item, index) => (
                        <JourneyItem
                            key={item.id}
                            {...item}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            isRight={index % 2 === 1}
                        />
                    ))}
                </ul>
            </div>
        </section>
    );
};
export default Journey;
