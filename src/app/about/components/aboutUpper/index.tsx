'use client'
import React, { useRef } from 'react';
import styles from './style.module.scss';
import getChars from '@/animation/animatedHeaders/getChars';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUpper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,
                markers: false,
            },
        });

        tl.fromTo(videoRef.current, {
            width: '42.5%',
            height: '42.5%',
            y: '40vh',
        }, {
            width: '100%',
            height: '100%',
            y: '0',
            duration: 1.5,
            ease: 'power2.inOut',
        })
        .to(logoRef.current, {
            y: '-20.5vh',
            duration: 1.5,
            ease: 'power2.inOut',
        }, 0);

        tl.set(videoRef.current, { width: '100%', height: '100%', y: '0' });
    }, { scope: containerRef });

    return (
        <section className={styles.aboutUpperWrapper} ref={containerRef}>
            <div className={styles.aboutUpper}>
                <div className={styles.logoFlex} ref={logoRef}>
                    {getChars('Future Women')}
                </div>
                <div className={styles.videoWrapper}>
                    <video ref={videoRef} autoPlay loop muted playsInline>
                        <source
                            src="https://res.cloudinary.com/dfxz1hh8s/video/upload/v1720686844/yt5s.io-Women_Who_Empower_-_Teaser-_720p_yky0jc.mp4"
                            type="video/mp4"
                        />
                    </video>
                </div>
            </div>
        </section>
    );
};

export default AboutUpper;
