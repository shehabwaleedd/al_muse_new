import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { EventResponseResults, EventType } from "@/types/common";

interface EventResponse {
    data: EventResponseResults;
}


export const useAllEvents = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(false);

    const getAllEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get<EventResponse>(`${process.env.NEXT_PUBLIC_BASE_URL}/event`);
            setEvents(response.data.data.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        getAllEvents();
    }, [getAllEvents]);



    return { events, setEvents, getAllEvents, loading, setLoading };
}

export default useAllEvents;
