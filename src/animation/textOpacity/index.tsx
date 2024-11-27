'use client';

import styles from './style.module.scss';
import { useRef, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import gsap from 'gsap';
type DynamicTextAnimationProps = {
    phrase: string;
    backgroundColor?: string;
    color?: string;
    backgroundImage?: string;

};

const TextOpacity: React.FC<DynamicTextAnimationProps> = ({ phrase, backgroundColor, color, backgroundImage }) => {
    const refs = useRef<HTMLSpanElement[]>([]);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        createAnimation();
    }, []);

    const createAnimation = () => {
        gsap.to(refs.current, {
            scrollTrigger: {
                trigger: container.current,
                scrub: true,
                start: `-=${window.innerHeight * 0.67}`,
                end: `+=${window.innerHeight / 1.5}`,
            },
            opacity: 1,
            filter: "blur(0px)",
            ease: 'none',
            stagger: 0.1,
        });
    };

    const splitWords = (phrase: string) => {
        const body: JSX.Element[] = [];
        phrase.split(' ').forEach((word, i) => {
            const letters = splitLetters(word);
            body.push(<p style={{ color: color ?? "var(--title-color)" }} key={word + '_' + i}>{letters}</p>);
        });
        return body;
    };

    const splitLetters = (word: string) => {
        const letters: JSX.Element[] = [];
        word.split('').forEach((letter, i) => {
            letters.push(
                <span key={letter + '_' + i} ref={(el) => { if (el) refs.current.push(el); }}>
                    {letter}
                </span>
            );
        });
        return letters;
    };

    return (
        <motion.main ref={container} className={styles.main} style={{ backgroundColor: backgroundColor ?? "var(--background-color)", position: "relative", '--background-image': backgroundImage ? `url(${backgroundImage})` : "none" } as React.CSSProperties}>
            <motion.div className={styles.body}>
                {splitWords(phrase)}
            </motion.div>
        </motion.main>
    );
};

export default TextOpacity;
