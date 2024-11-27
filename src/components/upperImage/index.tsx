'use client'
import React, { useEffect, useRef, ReactNode } from 'react'
import styles from "./style.module.scss"
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useWindowSize from '@/hooks/useWindowWidth'

interface ServicesUpperProps {
  backgroundImage: string;
  children: ReactNode;
  imageAlt?: string;
}

gsap.registerPlugin(ScrollTrigger);

const ServicesUpper = ({ backgroundImage, children, imageAlt = 'background image' }: ServicesUpperProps) => {
    const { isTablet } = useWindowSize();
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Animate the content (unchanged)
        gsap.to(`.${styles.content} span`, {
            yPercent: !isTablet ? -190 : "-7vh",
            stagger: 0.5,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: `.${styles.upper}`,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Animate only the last word
        gsap.to(`.${styles.content} span:last-child`, {
            scale: 1.05,
            scrollTrigger: {
                trigger: `.${styles.upper}`,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Improved image animation
        const img = imageRef.current;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: `.${styles.upper}`,
                start: "top top",
                end: "bottom -50%",
                scrub: 1,
            },
        });

        tl.to(img, {
            padding: 0,
            borderRadius: 0,
            ease: 'power1.inOut',
        }).to(img, {
            padding: "0.5rem",
            borderRadius: '1.85rem',
            ease: 'power3.out',
        });

        return () => {
            tl.kill();
        };
    }, [isTablet]);

    return (
        <section className={styles.wrapper}>
            <div className={styles.upper}>
                <div className={styles.imageContainer}>
                    <Image
                        src={backgroundImage}
                        layout="fill"
                        objectFit="cover"
                        alt={imageAlt}
                        className={styles.mainImg}
                        ref={imageRef}
                    />
                </div>
                <div className={styles.abs}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServicesUpper
