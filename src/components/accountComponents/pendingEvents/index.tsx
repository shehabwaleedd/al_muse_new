'use client'

import React from 'react';
import { usePendingEvents } from "../../../lib/events/client/usePendingEvents";
import Loading from '@/animation/loading/Loading';
import DashboardEvents from '../../dashboardEvents';

const PendingEvents = () => {
    const { pendingEvents, loading, refreshEvents } = usePendingEvents();

    if (loading) return <Loading height={100} />;

    return (
        <DashboardEvents events={pendingEvents} refreshEvents={refreshEvents} title="Pending Events" loading={loading} />
    );
};

export default PendingEvents;