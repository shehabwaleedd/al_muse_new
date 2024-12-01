import { BaseJourneyItem } from '@/types/common';

export interface JourneyProps {
    items: BaseJourneyItem[];
    type: 'education' | 'experience';
    primaryColor?: string;
    secondaryColor?: string;
    title: string;
    eyebrow: string;
}