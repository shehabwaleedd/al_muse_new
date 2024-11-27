'use client'

import React from 'react'
import FilterableEventsList from '../../components/filterableEventList'
import { usePublishedEvents } from '../../lib/events/client/usePublishedEvents'
import EventsPageTitles from "./components/eventsPageTitles"

const Events: React.FC = () => {
    const { events, loading } = usePublishedEvents(1);
    const asideContent = <EventsPageTitles />;

    return (
        <FilterableEventsList
            events={events}
            asideContent={asideContent}
            loading={loading}
        />
    );
}

export default Events
