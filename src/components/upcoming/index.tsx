'use client'

import React, { useState, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import useAllEvents from '@/lib/events/client/useAllEvents';
import CTA from '@/animation/CTA';
import styles from './style.module.scss';
import 'keen-slider/keen-slider.min.css';
import Magnetic from '@/animation/Magnetic';
import { GoArrowRight } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";

const SLIDES_PER_VIEW = {
    sm: 1,
    md: 2,
    lg: 3,
};

export const Upcoming: React.FC = () => {
    const { events, loading } = useAllEvents();
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        slides: {
            perView: 1,
            spacing: 0,
        },
        breakpoints: {
            '(min-width: 680px)': {
                slides: { perView: SLIDES_PER_VIEW.md, spacing: 0 },
            },
            '(min-width: 1024px)': {
                slides: { perView: SLIDES_PER_VIEW.lg, spacing: 0 },
            },
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    const handlePrevSlide = useCallback(() => {
        instanceRef.current?.prev();
    }, [instanceRef]);

    const handleNextSlide = useCallback(() => {
        instanceRef.current?.next();
    }, [instanceRef]);

    if (loading) {
        return (
            <section className={styles.upcoming} aria-busy="true">
                <div className={styles.skeleton}>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className={styles.skeletonSlide} />
                    ))}
                </div>
            </section>
        );
    }

    const canSlidePrev = currentSlide > 0;
    const canSlideNext = currentSlide < (events.length - SLIDES_PER_VIEW.lg);

    return (
        <section className={styles.upcoming} aria-label="Upcoming Events">
            <header className={styles.header}>
                <h2>
                    <p className={styles.eyebrow}>Explore Our</p>
                    Upcoming Events
                </h2>
                <nav className={styles.swiperButtons} aria-label="Slider Navigation">
                    <Magnetic>
                        <button onClick={handlePrevSlide} className={`${styles.navButton} ${!canSlidePrev ? styles.disabled : ''}`} disabled={!canSlidePrev} aria-label="Previous slide">
                            <GoArrowLeft />
                        </button>
                    </Magnetic>
                    <Magnetic>
                        <button onClick={handleNextSlide} className={`${styles.navButton} ${!canSlideNext ? styles.disabled : ''}`} disabled={!canSlideNext} aria-label="Next slide">
                            <GoArrowRight />
                        </button>
                    </Magnetic>
                </nav>
            </header>

            <div ref={sliderRef} className="keen-slider">
                {events.map((event) => (
                    <article key={event._id} className={`keen-slider__slide ${styles.slide}`}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={event.mainImg?.url || '/noimage.png'}
                                alt={event.title || 'Event Image'}
                                fill
                                sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className={styles.image}
                                priority={currentSlide === 0}
                                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                        <div className={styles.content}>
                            <h2>{event.title}</h2>
                            <p>
                                {event.description
                                    ?.replace(/<[^>]*>/g, '')
                                    .slice(0, 100)}
                                ...
                            </p>
                            <CTA
                                href={`/events/${event._id}`}
                                label="View Event"
                                backgroundColor="var(--accent-color)"
                                buttonTextColor="var(--title-color)"
                            />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Upcoming;