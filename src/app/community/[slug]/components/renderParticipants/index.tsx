'use client';

import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import styles from '../../page.module.scss';
import type { EventType } from '@/types/common';
import { toast } from 'sonner';

interface RenderParticipantsProps {
    event: EventType | null;
}

const ParticipantImage = memo(({ url, name }: { url: string; name: string }) => (
    <Image
        src={url || '/noimage.png'}
        alt={name || 'Event participant'}
        title={name || 'Event participant'}
        width={100}
        height={100}
        className={styles.participantImage}
        loading="lazy"
        onError={() => toast.error(`Failed to load image for ${name}`)}
    />
));

ParticipantImage.displayName = 'ParticipantImage';

const RenderParticipants = memo(({ event }: RenderParticipantsProps) => {
    const participants = useMemo(() => {
        return event?.EventParticipants?.filter(participant =>
            participant && (participant.avatar?.url || participant.name)
        ) || [];
    }, [event?.EventParticipants]);

    if (participants.length === 0) {
        return (
            <div className={styles.noParticipants}>
                <h3>No participants yet</h3>
            </div>
        );
    }

    return (
        <div className={styles.participantsGrid}>
            {participants.map((participant) => (
                <ParticipantImage
                    key={participant._id}
                    url={participant.avatar?.url || '/noimage.png'}
                    name={participant.name || 'Anonymous Participant'}
                />
            ))}
        </div>
    );
});

RenderParticipants.displayName = 'RenderParticipants';

export default RenderParticipants;