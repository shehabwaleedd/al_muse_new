'use client';

import React, { memo, useCallback, useMemo } from 'react';
import styles from '../../page.module.scss';
import { isPast, formatDistanceToNow } from 'date-fns';
import dynamic from 'next/dynamic';
import { useSubComponents } from '@/context/SubComponentsContext';
import { useEventParticipation } from '@/hooks/useEventParticipation';
import type { EventType, User } from '@/types/common';

const Magnetic = dynamic(() => import('@/animation/Magnetic'), {
    ssr: false
});
const CTA = dynamic(() => import('@/animation/CTA'), {
    ssr: false
});


interface EventStatusProps {
    isLoggedIn: boolean;
    event: EventType;
    user: User | null;
    hasParticipated: boolean;
    setHasParticipated: React.Dispatch<React.SetStateAction<boolean>>;
}


const EventStatus = memo(({ isLoggedIn, event, user, hasParticipated, setHasParticipated }: EventStatusProps) => {
    const { isLoginOpen, setIsLoginOpen } = useSubComponents();
    const { joinEvent, loading } = useEventParticipation(event._id ?? '', setHasParticipated);
    const handleLoginClick = useCallback(() => {
        setIsLoginOpen(prev => !prev);
    }, [setIsLoginOpen]);

    if (!event?.dateOfEvent || isNaN(Date.parse(event.dateOfEvent))) {
        return (
            <div className={styles.error} role="alert">
                <p>Invalid event date format</p>
            </div>
        );
    }

    const startDate = useMemo(() => new Date(event.dateOfEvent ?? ''), [event.dateOfEvent]);

    if (isPast(startDate)) {
        return (
            <section className={styles.pastEvent} aria-label="Event status">
                <h3>Event has ended</h3>
                <p>View more updates and events in {event.createdBy?.name}&apos;s portal</p>
                <CTA
                    label={`${event.createdBy?.name}'s Portal`}
                    href={`/users/${event.createdBy?._id}?fetchParam1=${event.createdBy?.name}&fetchParam2=${event.createdBy?.avatar?.url}`}
                    backgroundColor="var(--title-color)"
                    buttonTextColor="var(--cream-color)"
                />
            </section>
        );
    }

    const timeToEvent = formatDistanceToNow(startDate, { addSuffix: true });

    return (
        <section className={styles.upcomingEvent} aria-label="Event status">

            <div className={styles.statusInfo}>
                <h3>Event starts {timeToEvent}</h3>
                <p>
                    {isLoggedIn
                        ? "Don't miss out, participate in the event and get the most out of it."
                        : "Login to register and participate"}
                </p>
            </div>

            <div className={styles.actionArea}>
                {isLoggedIn ? (
                    <Magnetic>
                        <button className={styles.participateButton} onClick={() => joinEvent()} disabled={hasParticipated || loading} aria-busy={loading} data-state={hasParticipated ? 'participated' : loading ? 'loading' : 'idle'}>
                            <span className={styles.buttonText}>
                                {hasParticipated ? "Participated" : loading ? "Joining..." : "Participate"}
                            </span>
                        </button>
                    </Magnetic>
                ) : (
                    <Magnetic>
                        <button onClick={handleLoginClick} className={styles.loginButton} aria-label="Login to participate">
                            <span>Login</span>
                        </button>
                    </Magnetic>
                )}
            </div>
        </section>
    );
});

EventStatus.displayName = 'EventStatus';

export default EventStatus;