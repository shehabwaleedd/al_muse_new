import { useMemo } from 'react';
import { EventType, FilterState } from '@/types/common';

export const useEventFilters = (events: EventType[], filters: FilterState) => {
    return useMemo(() => {
        const lowerSearch = filters.search.toLowerCase();

        return events.filter(event => {
            // Basic text search across multiple fields
            const searchableFields = [
                event.title,
                event.description,
                event.city,
                event.country,
                event.category,
                event.address,
                event.locationDetails
            ].filter(Boolean) as string[];

            const matchesSearch = !filters.search ||
                searchableFields.some(field =>
                    field.toLowerCase().includes(lowerSearch)
                );

            // Location filters
            const matchesCountry = !filters.country || event.country === filters.country;
            const matchesCity = !filters.city || event.city === filters.city;

            // Event type filters
            const matchesCategory = !filters.category || event.category === filters.category;
            const matchesType = !filters.type || event.location === filters.type;

            // Time filters
            const matchesDate = !filters.date || event.dateOfEvent === filters.date;
            const matchesTime = !filters.time || event.timeOfEvent?.from === filters.time;

            return matchesSearch &&
                matchesCountry &&
                matchesCity &&
                matchesCategory &&
                matchesType &&
                matchesDate &&
                matchesTime;
        });
    }, [events, filters]);
};