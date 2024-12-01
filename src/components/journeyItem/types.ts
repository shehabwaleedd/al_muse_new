import { BaseJourneyItem } from '@/types/common';

export interface JourneyItemProps extends BaseJourneyItem {
    primaryColor?: string;
    secondaryColor?: string;
    progress?: number;
    isRight?: boolean;
}
