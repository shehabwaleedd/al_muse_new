'use client'

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import styles from './style.module.scss';

interface PhraseProps {
    src: string;
    text: string;
}

interface SlideProps {
    src: string;
    direction: 'left' | 'right';
    left: string;
    progress: MotionValue<number>;
    text: string;
}

interface SlidingParallaxProps {
    slides: Array<{
        image: string;
        direction: 'left' | 'right';
        offset: string;
        text: string;
    }>;
}

const Phrase: React.FC<PhraseProps> = ({ src, text }) => {
    return (
        <article className={styles.phrase}>
            <h3 className={styles.text}>{text}</h3>
            <figure className={styles.imageWrapper}>
                <Image
                    src={src}
                    alt={text}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className={styles.image}
                />
            </figure>
        </article>
    );
};

const Slide: React.FC<SlideProps> = ({ src, direction, left, progress, text }) => {
    const directionMultiplier = direction === 'left' ? -1 : 1;
    const translateX = useTransform(
        progress,
        [0, 1],
        [150 * directionMultiplier, -150 * directionMultiplier]
    );

    return (
        <motion.div
            style={{ x: translateX, left }}
            className={styles.slide}
        >
            {[...Array(3)].map((_, index) => (
                <Phrase key={index} src={src} text={text} />
            ))}
        </motion.div>
    );
};

const SlidingParallax: React.FC<SlidingParallaxProps> = ({ slides }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    return (
        <section
            ref={containerRef}
            className={styles.slidingParallax}
            aria-label="Sliding Parallax Gallery"
        >
            <div className={styles.container}>
                {slides.map((slide, index) => (
                    <Slide
                        key={index}
                        src={slide.image}
                        direction={slide.direction}
                        left={slide.offset}
                        progress={scrollYProgress}
                        text={slide.text}
                    />
                ))}
            </div>
        </section>
    );
};

export default SlidingParallax;