'use client';

import React, { memo } from 'react';
import styles from '../../page.module.scss';
import { BsCalendar4Week } from 'react-icons/bs';
import { IoTicketOutline } from 'react-icons/io5';
import dynamic from 'next/dynamic';
import type { EventType, User } from '@/types/common';

const RenderEventStatus = dynamic(() => import('../renderEventStatus'), {
    loading: () => <div className={styles.statusSkeleton}>Loading status...</div>
});

const LocationInfo = dynamic(() => import('../locationInfo'), {
    loading: () => <div className={styles.locationSkeleton}>Loading location...</div>
});

const CreatorInfo = dynamic(() => import('../createdBy'), {
    loading: () => <div className={styles.creatorSkeleton}>Loading creator...</div>
});


export interface EventLowerProps {
    event: EventType;
    formattedDate: string;
    user: User | null;
    hasParticipated: boolean;
    setHasParticipated: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
}

const EventLower = memo(({ event, formattedDate, user, hasParticipated, setHasParticipated, isLoggedIn }: EventLowerProps) => {

    if (!event) return null;

    return (
        <section className={styles.eventDetails}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>{event.title}</h1>
                <CreatorInfo createdBy={event.createdBy} />
            </div>
            <div className={styles.container}>
                <div className={styles.details}>
                    <div className={styles.detailsRow}>
                        <BsCalendar4Week className={styles.icon} aria-hidden="true" />
                        <div className={styles.detailsColumn}>
                            <h3>{formattedDate}</h3>
                            <p>
                                <time>{event?.timeOfEvent?.from}</time> - <time>{event?.timeOfEvent?.to}</time>
                            </p>
                        </div>
                    </div>
                    <LocationInfo isLoggedIn={isLoggedIn} hasParticipated={hasParticipated} event={event} />
                    <div className={styles.detailsRow}>
                        <IoTicketOutline className={styles.icon} aria-hidden="true" />
                        <div className={styles.detailsColumn}>
                            <h3>Free</h3>
                            <p>Members Only</p>
                        </div>
                    </div>
                </div>

                <div className={styles.right}>
                    <RenderEventStatus event={event} user={user} hasParticipated={hasParticipated} setHasParticipated={setHasParticipated} isLoggedIn={isLoggedIn} />
                </div>
            </div>
        </section>
    );
});

EventLower.displayName = 'EventLower';

export default EventLower;