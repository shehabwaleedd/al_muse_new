'use client';

import React, { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './style.module.scss';
import DynamicTextAnimation from '@/animation/textOpacity';

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface RevealAnimationProps {
    phrase: string;
    children: React.ReactNode;
    backgroundColor?: string;
    color?: string;
    backgroundImage?: string;
}

const RevealAnimation: React.FC<RevealAnimationProps> = ({ phrase, children, backgroundColor, color, backgroundImage }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const underneathRef = useRef<HTMLDivElement>(null);

    // Define the GSAP animations inside the useGsap hook
    useGSAP(() => {
        if (!containerRef.current || !topRef.current || !underneathRef.current) return;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: `-=${window.innerHeight / 5}`,
                end: `+=${window.innerHeight}`,
                scrub: true,
            }
        });
        tl.to(topRef.current, { yPercent: -150, ease: "power1.inOut" });
        tl.to(underneathRef.current, { yPercent: 0, ease: "power2.in" }, 0);

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={topRef} className={styles.top}>
                <DynamicTextAnimation phrase={phrase} backgroundColor={backgroundColor} color={color} backgroundImage={backgroundImage} />
            </div>
            <div ref={underneathRef} className={styles.underneath}>
                {children}
            </div>
        </div>
    );
};

export default RevealAnimation;
