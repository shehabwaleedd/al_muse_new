'use client';
import React, { useRef } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ZoomInfo from './components';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ImageItem {
    src: string;
    alt: string;
    isVideo: boolean;
}

const ImageData: ImageItem[] = [
    { src: '/assets/backgrounds/1.webp', alt: 'Image 1', isVideo: false },
    { src: '/assets/backgrounds/2.webp', alt: 'Image 2', isVideo: false },
    { src: '/assets/backgrounds/3.webp', alt: 'Image 3', isVideo: false },
    { src: '/mainVideo.mp4', alt: 'Video', isVideo: true },
    { src: '/assets/backgrounds/4.webp', alt: 'Image 4', isVideo: false },
];

const ZoomGallery: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const zoomInfoRef = useRef<HTMLDivElement>(null);
    const zoomInfoImageRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        if (containerRef.current && videoRef.current && videoContainerRef.current && zoomInfoRef.current) {
            const lastImage = imageRefs.current[imageRefs.current.length - 1];

            ScrollTrigger.matchMedia({
                "(min-width: 778px)": function () {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: videoContainerRef.current,
                            start: 'center 60%',
                            end: 'bottom top',
                            scrub: true,
                        },
                    });

                    tl.fromTo(
                        videoRef.current,
                        { clipPath: 'inset(25% 25% 25% 25% round 1rem)' },
                        { clipPath: 'inset(0% 0% 0% 0% round 1rem)', ease: "power2.inOut" },
                    );

                    tl.to(lastImage, {
                        opacity: 0,
                        y: 50,
                        ease: 'power2.inOut',
                    }, '<').to(containerRef.current, {
                        duration: 0.5,
                        ease: 'power2.inOut',
                    });
                    tl.fromTo(zoomInfoRef.current,
                        { y: '120%'},
                        { y: '0%', ease: 'power2.out' },
                        '>-0.75'
                    );

                    tl.fromTo(zoomInfoImageRef.current,
                        { clipPath: 'inset(0 100% 0 0)' },
                        { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut' },
                        '<' 
                    );


                },
                "(max-width: 777px)": function () {
                    // Add any mobile-specific animations here if needed
                    gsap.set(videoRef.current, { borderRadius: '1rem' });
                }
            });
        }
    }, { scope: containerRef }); // scope the animations to the container


    return (
        <section className={styles.container} ref={containerRef}>
            {ImageData.map((item, index) => (
                item.isVideo ? (
                    <div key={index} className={styles.videoContainer} ref={videoContainerRef}>
                        <video ref={videoRef} autoPlay loop muted playsInline className={styles.video}>
                            <source src={item.src} type="video/mp4" />
                        </video>
                        <div ref={zoomInfoRef} className={styles.zoomInfoWrapper}>
                            <ZoomInfo imageRef={zoomInfoImageRef} />
                        </div>
                    </div>
                ) : (
                    <div key={index} className={styles.imageContainer} ref={(el: HTMLDivElement | null) => { imageRefs.current[index] = el;}}>
                        <Image src={item.src} alt={item.alt} width={500} height={500} />
                    </div>
                )
            ))}
        </section>
    );
};

export default ZoomGallery;
