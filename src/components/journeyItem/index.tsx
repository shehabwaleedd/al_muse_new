'use client'

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import DiamondIcon from '../diamondIcon';
import styles from './style.module.scss';
import type { JourneyItemProps } from './types';
import Image from 'next/image';

const JourneyItem: React.FC<JourneyItemProps> = ({
    title,
    company,
    time,
    location,
    comment,
    image,
    primaryColor,
    secondaryColor,
    isRight,
}) => {
    const itemRef = useRef<HTMLLIElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start end", "end start"]
    });

    // Enhanced content animations
    const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.8, 1, 1]);

    const delay = 0.1;

    return (
        <li ref={itemRef} className={`${styles.container} ${isRight ? styles.right : styles.left}`}>
            <div className={styles.timelineIndicator}>
                <DiamondIcon
                    reference={itemRef}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    progress={scrollYProgress}
                />
            </div>

            <motion.div
                ref={contentRef}
                style={{ y, opacity, scale }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                    duration: 0.5,
                    delay,
                    ease: "easeOut"
                }}
                className={styles.content}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {title}
                        {company && <span className={styles.company}>@{company}</span>}
                    </h3>
                    <span className={styles.meta}>{time} | {location}</span>
                </div>

                {image && (
                    <motion.div
                        className={styles.imageContainer}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.2, duration: 0.5 }}
                    >
                        <Image 
                            src={image} 
                            alt={title} 
                            className={styles.image} 
                            width={500} 
                            height={500}
                            loading="lazy"
                        />
                    </motion.div>
                )}

                <motion.p
                    className={styles.comment}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.3, duration: 0.5 }}
                >
                    {comment}
                </motion.p>
            </motion.div>
        </li>
    );
};


export default JourneyItem;