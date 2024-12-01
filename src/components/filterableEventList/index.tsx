'use client'
import React, { useState, useCallback } from 'react';
import styles from './style.module.scss';
import { FilterState } from '@/types/common';
import { useUniqueValues } from '@/hooks/useUniqueValues';
import { useEventFilters } from '@/hooks/useEventFilters';
import Skeleton from '@/animation/skeletoned/Card';
import { FiltersPanel } from './(components)/filterPanels';
import { EventType } from '@/types/common';
import EventsList from '../eventList';

interface FilterableEventsListProps {
    events: EventType[];
    asideContent: React.ReactNode;
    loading: boolean;
}

const FilterableEventsList: React.FC<FilterableEventsListProps> = ({
    events,
    asideContent,
    loading
}) => {
    const [filters, setFilters] = useState<FilterState>({
        city: '',
        category: '',
        type: '',
        country: '',
        search: '',
        date: '',
        time: ''
    });

    const uniqueValues = useUniqueValues(events);
    const filteredEvents = useEventFilters(events, filters);

    const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);


    return (
        <section className={styles.communityEvents}>
            <div>{asideContent}</div>
            <FiltersPanel filters={filters} uniqueValues={uniqueValues} onFilterChange={handleFilterChange}/>
            {loading ? (
                <Skeleton />
            ) : (
                <EventsList data={filteredEvents} />
            )}
        </section>
    );
};

export default React.memo(FilterableEventsList);