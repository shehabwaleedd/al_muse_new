import { useMemo } from 'react';
import { EventType } from '@/types/common';

export const useUniqueValues = (events: EventType[]) => {
    return useMemo(() => ({
        cities: Array.from(new Set(events.map(event => event.city).filter(Boolean))),
        categories: Array.from(new Set(events.map(event => event.category).filter(Boolean))),
        types: Array.from(new Set(events.map(event => event.location).filter(Boolean))),
        dates: Array.from(new Set(events.map(event => event.dateOfEvent).filter(Boolean))),
        countries: Array.from(new Set(events.map(event => event.country).filter(Boolean))),
        times: Array.from(new Set(events.map(event => event.timeOfEvent?.from).filter(Boolean)))
    }), [events]);
};