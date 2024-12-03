'use client';
import React, { useRef, useState, useLayoutEffect } from 'react';
import styles from "./style.module.scss";
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CTAButton from '@/components/ctaButton';


gsap.registerPlugin(ScrollTrigger);

interface DynamicCardProps<T> {
    items: T[];
    truncateTitleLength?: number;
    truncateMainTitleLength?: number;
    onItemChange?: (currentItemIndex: number) => void;
    renderItemContent: (item: T) => React.ReactNode;
    getImageUrl: (item: T) => string;
    getTitle: (item: T) => string;
    getLink: (item: T) => string;
}

const DynamicCard = <T,>({ items, truncateTitleLength = 15, onItemChange, renderItemContent, getImageUrl, getTitle, getLink }: DynamicCardProps<T>) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const truncateTitle = (title: string, length: number) => {
        return title.length > length ? `${title.slice(0, length)}...` : title;
    };

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 717px)", () => {
            if (wrapperRef.current && leftRef.current && rightRef.current) {
                const absElements = leftRef.current.querySelectorAll(`.${styles.abs}`);
                const listItems = leftRef.current.querySelectorAll(`.${styles.magnetic} li`);
                const imageContainers = rightRef.current.querySelectorAll(`.${styles.imageContainer}`);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: rightRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                        onUpdate: (self) => {
                            const newIndex = Math.floor(self.progress * (items.length - 1));
                            setCurrentItemIndex(newIndex);
                            if (onItemChange) {
                                onItemChange(newIndex);
                            }
                        },
                    },
                });

                absElements.forEach((element, index) => {
                    tl.fromTo(
                        element,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.inOut",
                        },
                        index
                    );

                    if (index < absElements.length - 1) {
                        tl.to(
                            element,
                            {
                                opacity: 0,
                                duration: 0.5,
                                ease: "power2.inOut",
                            },
                            index + 0.85
                        );
                    }

                    tl.to(listItems, {
                        opacity: 0.5,
                        duration: 0.5,
                        ease: "power2.inOut",
                    }, index);

                    tl.to(listItems[index], {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.inOut",
                    }, index);
                });
                imageContainers.forEach((container, index) => {
                    if (index === 0) {
                        gsap.set(container, { clipPath: 'inset(0% 0% 0% 0%)' });
                    } else {
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
        });

        return () => {
            mm.revert();
        };
    }, [items, onItemChange]);

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <div className={styles.left} ref={leftRef}>
                {items.map((item: T, i: number) => (
                    <div className={styles.column} key={`left_${i}`}>
                        <div className={styles.abs}>
                            {renderItemContent(item)}
                        </div>
                    </div>
                ))}
                <div className={styles.magnetic}>
                    <ul>
                        {items.map((item: T, i: number) => (
                            <li key={`item_${i}`}>{truncateTitle(getTitle(item), truncateTitleLength)}</li>
                        ))}
                    </ul>
                    <CTAButton text="Participate Now" href={getLink(items[currentItemIndex])} backgroundColor="var(--accent-color)" textColor="var(--title-color)" />
                </div>
            </div>
            <div className={styles.right} ref={rightRef}>
                <div className={styles.stickyContainer}>
                    {items.map((item: T, i: number) => (
                        <div key={`right_${i}`} className={styles.imageContainer}>
                            <Image
                                src={getImageUrl(item) ?? "/noimage.png"}
                                alt={getTitle(item)}
                                width={1920}
                                height={1260}
                                loading='lazy'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DynamicCard;
