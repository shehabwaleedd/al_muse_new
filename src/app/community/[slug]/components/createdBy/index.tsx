import styles from '../../page.module.scss';
import Link from 'next/link';
import { memo } from 'react';
import type { EventType } from '@/types/common';

interface CreatorInfoProps {
    createdBy: EventType['createdBy'];
}


const CreatorInfo = memo(({ createdBy }: CreatorInfoProps) => {
    if (!createdBy) return null;

    const profileUrl = `/users/${createdBy._id}?fetchParam1=${createdBy.name}&fetchParam2=${createdBy.avatar?.url}`;

    return (
        <div className={styles.creatorInfo} itemScope itemType="http://schema.org/Person">
            <h3 className={styles.creatorName}> By {' '} <Link href={profileUrl} itemProp="url"> {createdBy.name} </Link></h3>
        </div>
    );
});

CreatorInfo.displayName = 'CreatorInfo';

export default CreatorInfo;