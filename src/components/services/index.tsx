'use client';
import React, { useRef } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../servicesData';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Service {
    img: string;
    title: string;
    year?: string;
    serviceDescription: string[];
    homePageDesc: string;
    services: string[];
    serviceTitle: string;
}

const ServicesLayers: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);


    useGSAP(() => {
        if (wrapperRef.current && rightRef.current) {
            const imageContainers = Array.from(rightRef.current.querySelectorAll(`.${styles.imageContainer}`));

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                },
            });

            // Set initial state
            gsap.set(imageContainers[0], { clipPath: 'inset(0% 0% 0% 0%)' });
            gsap.set(imageContainers.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
            imageContainers.forEach((container, index) => {
                if (index > 0) {
                    tl.fromTo(container,
                        { clipPath: 'inset(100% 0% 0% 0%)' },
                        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: "power2.inOut" },
                        index
                    );
                }

                if (index < imageContainers.length - 1) {
                    tl.to(container,
                        { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: "power2.inOut" },
                        index + 1
                    );
                }
            });

        }
    }, { scope: wrapperRef });

    return (
        <div className={styles.serviceLayers} ref={wrapperRef}>
            <div className={styles.serviceLayers_content}>
                <div className={styles.center} ref={rightRef}>
                    {services.map((service: Service, i: number) => (
                        <div key={`image_container_${i}`} className={styles.imageContainer}>
                            <Image
                                src={service.img ?? '/noimage.png'}
                                alt={service.title ?? ''}
                                width={1920}
                                height={1260}
                                loading='lazy'
                                className={styles.servicesImg}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ServicesLayers;