'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from '../page.module.scss';
import Image from 'next/image';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { format, parseISO } from 'date-fns';
import { useEventBySlug } from '@/lib/events/client/useEventBySlug';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { EventComponentProps } from '@/types/event';
import Magnetic from '@/animation/Magnetic';
import { AnimatePresence } from 'framer-motion';
const TourSkeleton = dynamic(() => import('@/animation/skeletoned/TourSkeleton'));
const EventLower = dynamic(() => import('./eventLower'));
const ShareDropdown = dynamic(() => import('./shareEvent'));
const RenderParticipants = dynamic(() => import('./renderParticipants'));


const EventComponent: React.FC<EventComponentProps> = ({ params, base64 }) => {
    const { event, loading, error } = useEventBySlug(params.slug);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [hasParticipated, setHasParticipated] = useState(false);
    const { user, isLoggedIn } = useAuth();

    useEffect(() => {
        if (user && event?.EventParticipants?.some(participant => participant._id === user._id)) {
            setHasParticipated(true);
        } else {
            setHasParticipated(false);
        }
    }, [event?.EventParticipants, user]);

    const formattedDate = useMemo(() => {
        try {
            return event?.dateOfEvent ? format(parseISO(event.dateOfEvent), 'd MMMM') : '';
        } catch (error) {
            console.error('Error parsing date:', error);
            toast.error('Invalid event date format');
            return 'Date unavailable';
        }
    }, [event?.dateOfEvent]);

    if (loading) {
        return (
            <div className={styles.loading} role="status" aria-label="Loading event">
                <Image
                    src={base64}
                    alt="Loading event preview"
                    width={1920}
                    height={1080}
                    quality={100}
                    priority
                    placeholder="blur"
                    blurDataURL={base64}
                    className={styles.loadingImage}
                />
                <TourSkeleton />
            </div>
        );
    }

    if (error) {
        const errorMessage = typeof error === 'string' ? error : 'Unknown error occurred';
        toast.error(errorMessage);
        return (
            <section className={styles.error} role="alert">
                <h1>Unable to load event</h1>
                <p>{errorMessage}</p>
            </section>
        );
    }

    if (!event) {
        return (
            <section className={styles.error} role="alert">
                <h1>Event not found</h1>
                <p>The requested event could not be found.</p>

                <Link href="/community">Go back to community</Link>
            </section>
        );
    }

    return (
        <article className={styles.event} itemScope itemType="http://schema.org/Event">
            <meta itemProp="name" content={event.title} />
            <meta itemProp="startDate" content={event.dateOfEvent} />
            <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />

            <header className={styles.event__upper}>
                <Image
                    src={event.mainImg?.url || '/noimage.png'}
                    alt={`${event.title} event banner`}
                    width={1920}
                    height={1080}
                    quality={100}
                    priority
                    placeholder="blur"
                    blurDataURL={base64}
                    className={styles.eventImage}
                    itemProp="image"
                />
            </header>

            <Suspense fallback={<div className={styles.loading}>Loading event details...</div>}>
                <EventLower
                    event={event}
                    formattedDate={formattedDate}
                    user={user || null}
                    hasParticipated={hasParticipated}
                    setHasParticipated={setHasParticipated}
                    isLoggedIn={isLoggedIn}
                />
                <section className={styles.eventContent}>
                    <h2 className={styles.sectionHeader}>Event Details</h2>
                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: event.description ?? '' }} itemProp="description" />
                    <hr className={styles.divider} />

                </section>
                <section className={styles.participants} aria-label="Event participants">
                    {event.EventParticipants && event.EventParticipants.length > 0 && (
                        <header className={styles.participantsHeader}>
                            <h2 className={styles.sectionHeader}>{event.EventParticipants.length} Participants</h2>
                        </header>
                    )}

                    <div className={styles.participantsContainer}>
                        <RenderParticipants event={event} />
                        <Magnetic>
                            <button onClick={() => setShowShareOptions(!showShareOptions)} aria-label="Share event">
                                Spread the word
                            </button>
                        </Magnetic>
                    </div>
                </section>
                {event.googleMapLink && hasParticipated && (
                    <section className={styles.locationSection} aria-label="Event location">
                        <h2 className={styles.sectionHeader}>Location</h2>
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=${event.googleMapLink.split('pb=')[1]}`}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Event location map"
                        />
                    </section>
                )}
            </Suspense>
            <AnimatePresence mode='wait'>
                {showShareOptions && (
                    <ShareDropdown
                        event={event}
                        setShowShareOptions={setShowShareOptions}
                    />
                )}
            </AnimatePresence>
        </article>
    );
};

export default EventComponent;