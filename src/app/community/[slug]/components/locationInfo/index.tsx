import { memo } from 'react';
import styles from '../../page.module.scss';
import type { EventLowerProps } from '../eventLower';
import type { EventType } from '@/types/common';
import { IoLocationOutline } from 'react-icons/io5';
import { BsCameraVideo } from 'react-icons/bs';

const LocationInfo = memo(({ isLoggedIn, hasParticipated, event }: Pick<EventLowerProps, 'isLoggedIn' | 'hasParticipated'> & { event: EventType }) => {
    const isOffline = event?.location === 'offline';
    const Icon = isOffline ? IoLocationOutline : BsCameraVideo;

    const getLocationText = () => {
        if (!isLoggedIn) return `Please log in ${isOffline ? 'and register to get the address' : 'and participate to get the link'}`;
        if (hasParticipated) return isOffline ? `Address: ${event?.address}` : `Event Link: ${event?.link}`;
        return isOffline ? 'Participate to get the address' : 'Participate to get the link';
    };

    return (
        <div className={styles.detailsRow}>
            <Icon className={styles.icon} aria-hidden="true" />
            <div className={styles.detailsColumn}>
                <h3>{isOffline ? 'In-Person' : 'Online'}</h3>
                <p>{getLocationText()}</p>
            </div>
        </div>
    );
});

LocationInfo.displayName = 'LocationInfo';

export default LocationInfo;