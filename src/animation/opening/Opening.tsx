'use client'
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from "./style.module.scss"
import { words } from "./data";
import { useAnimation } from '@/context/AnimationContext';


type WordGroupRef = HTMLDivElement;
type ProgressRef = HTMLDivElement;
type LoaderRef = HTMLDivElement;

const introAnimation = (wordGroupsRef: React.RefObject<WordGroupRef>) => {
    const tl = gsap.timeline();
    tl.to(wordGroupsRef.current, {
        yPercent: -80,
        duration: 8,
        ease: "power3.inOut",
    });

    return tl;
};

const collapseWords = (
    wordGroupsRef: React.RefObject<LoaderRef>,
    openingRef: React.RefObject<HTMLDivElement>,
    setHasAnimationShown: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const tl = gsap.timeline();
    tl.to(wordGroupsRef.current, {
        "clip-path": "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
        duration: 3,
        ease: "expo.inOut",
        onComplete: () => {
            tl.to(openingRef.current, {
                opacity: 0,
                display: "none",
                onComplete: () => {
                    sessionStorage.setItem("hasAnimationShown", "true");
                    setHasAnimationShown(true);
                }
            });
        },
    });

    return tl;
};

const progressAnimation = (
    progressRef: React.RefObject<ProgressRef>,
    progressNumberRef: React.RefObject<HTMLDivElement>
) => {
    const tl = gsap.timeline();

    tl.to(progressRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 8,
        ease: "power3.inOut",
        onComplete: () => {
            gsap.to(progressRef.current, {
                opacity: 0,
                display: "none",
            });
        },
    });

    tl.to(progressNumberRef.current, {
        x: "100vw",
        duration: 8,
        ease: "power3.inOut",
        onComplete: () => {
            gsap.to(progressNumberRef.current, {
                opacity: 0,
                display: "none",
            });
        },
    }, "<");

    tl.fromTo(progressNumberRef.current, {
        textContent: "0",
    }, {
        textContent: "100",
        duration: 8,
        ease: "none",
        snap: { textContent: 1 },
        onUpdate: function () {
            if (progressNumberRef.current) {
                progressNumberRef.current.textContent = `${this.targets()[0].textContent}%`;
            }
        },
    }, "<");

    return tl;
};

const Opening: React.FC = () => {
    const loaderRef = useRef<LoaderRef>(null);
    const progressRef = useRef<ProgressRef>(null);
    const progressNumberRef = useRef<HTMLDivElement>(null);
    const wordGroupsRef = useRef<WordGroupRef>(null);
    const openingRef = useRef<HTMLDivElement>(null);
    const { renderingOpening, setHasAnimationShown, timeline } = useAnimation();

    useEffect(() => {
        if (timeline) {
            timeline
                .add(introAnimation(wordGroupsRef))
                .add(progressAnimation(progressRef, progressNumberRef), 0)
                .add(collapseWords(loaderRef, openingRef, setHasAnimationShown), "-=1");
        }
    }, [setHasAnimationShown, timeline]);

    if (!renderingOpening) {
        return null;
    }

    return (
        <div className={styles.loader__wrapper} ref={openingRef}>
            <div className={styles.loader__progressWrapper}>
                <div className={styles.loader__progress} ref={progressRef}></div>
            </div>
            <div className={styles.loader} ref={loaderRef}>
                <div className={styles.loader__words}>
                    <div className={styles.loader__overlay}></div>
                    <div ref={wordGroupsRef} className={styles.loader__wordsGroup}>
                        {words.map((word, index) => (
                            <span key={index} className={styles.loader__word}>
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Opening;