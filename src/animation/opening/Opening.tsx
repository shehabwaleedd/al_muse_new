'use client'
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import styles from "./style.module.scss"
import { words } from "./data";
import { useAnimation } from '@/context/AnimationContext';

const introAnimation = (wordGroupsRef: React.RefObject<any>) => {
    const tl = gsap.timeline();
    tl.to(wordGroupsRef.current, {
        yPercent: -80,
        duration: 8,
        ease: "power3.inOut",
    });

    return tl;
};

const collapseWords = (wordGroupsRef: React.RefObject<any>, openingRef: React.RefObject<any>, setHasAnimationShown: React.Dispatch<React.SetStateAction<boolean>>) => {
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
            })
        },
    });

    return tl;
};

const progressAnimation = (progressRef: React.RefObject<any>, progressNumberRef: React.RefObject<any>) => {
    const tl = gsap.timeline();

    // Animation for the progress bar scaling
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

    // Animation for moving the progress number
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

    // Incrementing the progress counter to 100% over time
    tl.fromTo(progressNumberRef.current, {
        textContent: "0",
    }, {
        textContent: "100",
        duration: 8,
        ease: "none",
        snap: { textContent: 1 },
        onUpdate: function () {
            // Update text content to include a percentage sign
            if (progressNumberRef.current) {
                progressNumberRef.current.textContent = `${this.targets()[0].textContent}%`;
            }
        },
    }, "<");

    return tl;
};


const Opening = () => {
    const loaderRef = useRef(null);
    const progressRef = useRef(null);
    const progressNumberRef = useRef(null);
    const wordGroupsRef = useRef(null);
    const openingRef = useRef(null);
    const { renderingOpening, setHasAnimationShown, timeline } = useAnimation();
    useEffect(() => {
        timeline &&
            timeline
                .add(introAnimation(wordGroupsRef))
                .add(progressAnimation(progressRef, progressNumberRef), 0)
                .add(collapseWords(loaderRef, openingRef, setHasAnimationShown), "-=1");
    }, [setHasAnimationShown, timeline]);

    return (
        <>
            {renderingOpening ? (
                <div className={styles.loader__wrapper} ref={openingRef}>
                    <div className={styles.loader__progressWrapper}>
                        <div className={styles.loader__progress} ref={progressRef}></div>
                    </div>
                    <div className={styles.loader} ref={loaderRef}>
                        <div className={styles.loader__words}>
                            <div className={styles.loader__overlay}></div>
                            <div ref={wordGroupsRef} className={styles.loader__wordsGroup}>
                                {words.map((word, index) => {
                                    return (
                                        <span key={index} className={styles.loader__word}>
                                            {word}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default Opening;
