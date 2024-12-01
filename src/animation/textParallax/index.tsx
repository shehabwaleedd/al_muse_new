'use client'

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import styles from './style.module.scss';
import { TextPhraseProps, TextSlideProps, TextSlidingParallaxProps } from '@/types/common';

const TextPhrase: React.FC<TextPhraseProps> = ({ text }) => {
    return (
        <article className={styles.phrase}>
            <h3 className={styles.text}>{text}</h3>
        </article>
    );
};

const TextSlide: React.FC<TextSlideProps> = ({ texts, direction, left, progress }) => {
    const directionMultiplier = direction === 'left' ? -1 : 1;
    const translateX = useTransform(
        progress,
        [0, 1],
        [150 * directionMultiplier, -150 * directionMultiplier]
    );

    if (!texts?.length) return null;

    return (
        <motion.div style={{ x: translateX, left }} className={styles.slide}>
            {[...Array(3)].map((_, repeatIndex) => (
                <div key={repeatIndex} className={styles.textGroup}>
                    {texts.map((text, textIndex) => (
                        <TextPhrase key={`${repeatIndex}-${textIndex}`} text={text} />
                    ))}
                </div>
            ))}
        </motion.div>
    );
};

const TextSlidingParallax: React.FC<TextSlidingParallaxProps> = ({ slides }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    return (
        <section
            ref={containerRef}
            className={styles.slidingParallax}
            aria-label="Sliding Parallax Text"
        >
            <div className={styles.container}>
                {slides.map((slide, index) => (
                    <TextSlide key={index} texts={slide.texts} direction={slide.direction} left={slide.offset} progress={scrollYProgress} />
                ))}
            </div>
        </section>
    );
};

export default TextSlidingParallax