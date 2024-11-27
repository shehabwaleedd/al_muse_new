'use client'
import React from 'react';

import { useUserEvents } from '@/lib/events/client/useUserEvents';
import DashboardEvents from '@/components/dashboardEvents';
import { useAuth } from '@/context/AuthContext';
import NoEvents from '@/components/accountComponents/noEvents';

const UserEventsPage = () => {
    const { userId, user } = useAuth();
    const { events, loading, refreshEvents } = useUserEvents(userId ?? "");

    if (events.length === 0) return <NoEvents />

    return (
        <main className='flex flex-col items-start justify-start min-h-screen pt-10'>
            <DashboardEvents events={events} loading={loading} refreshEvents={refreshEvents} title={`${user?.name}'s Events`} />
        </main>
    )
}

export default UserEventsPage