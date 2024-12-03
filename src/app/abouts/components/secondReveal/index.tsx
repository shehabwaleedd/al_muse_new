'use client';

import React, { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from "./style.module.scss";
import VisionUpper from '../dynamicUpperGridAnimation';

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface RevealAnimationProps {
    phrase: string;
    phrase2?: string;
    children: React.ReactNode;
    backgroundColor?: string;
    color?: string;
    
}

const SecondReveal: React.FC<RevealAnimationProps> = ({ phrase, children, backgroundColor, color, phrase2 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const underneathRef = useRef<HTMLDivElement>(null);

    // Define the GSAP animations inside the useGsap hook
    useGSAP(() => {
        if (!containerRef.current || !topRef.current || !underneathRef.current) return;
        
        // Get viewport height and determine if it's a mobile device
        const isMobile = window.innerWidth <= 768;
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                // Adjust start position based on device type
                start: isMobile ? `-=${window.innerHeight/ 1.5}` : `-=${window.innerHeight / 5}`,
                end: `+=${window.innerHeight}`,
                scrub: true,
            }
        });

        // Curtain effect: Pull up the top component with custom easing
        tl.to(topRef.current, { yPercent: -150, ease: "power1.inOut" });

        // Reveal the underneath component
        tl.to(underneathRef.current, { yPercent: 0, ease: "power2.in" }, 0); // Sync with the previous animation

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={topRef} className={styles.top}>
                <VisionUpper phrase={phrase} phrase2={phrase2} backgroundColor={backgroundColor} color={color}/>
            </div>
            <div ref={underneathRef} className={styles.underneath}>
                {children}
            </div>
        </div>
    );
};

export default SecondReveal;
