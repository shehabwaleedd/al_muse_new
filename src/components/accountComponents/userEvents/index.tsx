'use client'
import React, { useEffect } from 'react'
import { useUserEvents } from '@/lib/events/client/useUserEvents'
import DashboardEvents from '../../dashboardEvents'
import { useAuth } from '../../../context/AuthContext'

const UserEvents = () => {
    const { user, handleLogout } = useAuth();
    const { events, loading, refreshEvents, fetchUserEvents } = useUserEvents(user?._id);

    useEffect(() => {
        console.log(user, "user")
        if (user?._id) {
            fetchUserEvents();
        } else {
            handleLogout();
        }
    }, [user, fetchUserEvents, handleLogout]);

    return (
        <DashboardEvents events={events} loading={loading} refreshEvents={refreshEvents} title="My Events" />
    );
}

export default UserEvents;