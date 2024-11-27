import React from 'react'
import { useAllEvents } from "../../../lib/events/client/useAllEvents";
import DashboardEvents from "../../dashboardEvents";
const AllEvents = () => {

    const { events, getAllEvents, loading } = useAllEvents();

    return (
        <DashboardEvents events={events} refreshEvents={getAllEvents} title="All Events" loading={loading} />
    )
}

export default AllEvents