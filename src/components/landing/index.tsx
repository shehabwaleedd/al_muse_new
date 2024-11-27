'use client'
import React, { useEffect, useRef } from 'react'
import styles from './style.module.scss'
import { motion } from 'framer-motion';
import Image from "next/image"
import useWindowSize from '@/hooks/useWindowWidth'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useWindowWidth from '@/hooks/useWindowWidth'

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    const { isTablet } = useWindowSize();
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const paraRef = useRef(null);

    useEffect(() => {
        // Animate the content (unchanged)
        const headersAnimation = gsap.to(`.${styles.headers}`, {
            yPercent: !isTablet ? -160 : -100,
            stagger: 0.5,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: `.${styles.landing__lower}`,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Shared ScrollTrigger for container, image, and para
        const sharedTrigger = {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom -50%",
            scrub: 1,
        };
        // Image animation
        const imageAnimation = gsap.fromTo(imageRef.current,
            { padding: 0, borderRadius: 0 },
            {
                padding: '0.5rem',
                borderRadius: '1.5rem',
                scrollTrigger: sharedTrigger,
                ease: 'power3.out',
            }
        );

        // Para animation
        const paraAnimation = gsap.fromTo(paraRef.current,
            { left: '0.5rem', bottom: "0.5rem" },
            {
                left: '1rem',
                bottom: '1rem',
                duration: 1,
                scrollTrigger: sharedTrigger,
                ease: 'power3.out',
            }
        );

        return () => {
            if (headersAnimation.scrollTrigger) headersAnimation.scrollTrigger.kill();
            if (imageAnimation.scrollTrigger) imageAnimation.scrollTrigger.kill();
            if (paraAnimation.scrollTrigger) paraAnimation.scrollTrigger.kill();
        };
    }, [isTablet]);

    const { isDesktop } = useWindowWidth();



    return (
        <motion.section className={styles.landing__lower} style={{ width: "100%" }} ref={containerRef}>
            <Image src="/mainImage_background.webp" alt="F365 Movement" width={isDesktop ? 1800 : 500} height={isDesktop ? 800 : 500} priority={true} className={styles.img1} ref={imageRef} />
            <div className={styles.abs}>
                <section className={styles.landing}>
                    <Image src="/mainImage_isolated.png" alt="F365 Movement" width={1800} height={800} priority={true} className={styles.img2} />
                    <div className={styles.landing__upper}>
                        <div className={styles.headers}>
                            <h2> Building Connections </h2>
                            <h2> With Creative Tech </h2>
                        </div>
                    </div>
                </section>
            </div>
        </motion.section>
    )
}

export default Landing