import { EventType } from '@/types/common';
import type { User } from '@/types/common';

export interface TimeOfEvent {
    from: string;
    to: string;
}

export interface Avatar {
    url: string;
    public_id: string;
}

export interface EventParticipant {
    _id: string;
    name: string;
    avatar?: Avatar;
    email: string;
}


export interface EventComponentProps {
    slug: string;
    base64: string;
}

export interface EventLowerProps {
    event: EventType;
    formattedDate: string;
    user: User | undefined;
    hasParticipated: boolean;
    setHasParticipated: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
}