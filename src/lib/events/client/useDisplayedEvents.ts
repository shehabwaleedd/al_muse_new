import axios from 'axios';
import { useEffect, useState } from 'react';
import { EventType } from '@/types/common';



export const useDisplayedEvents = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchEvents = async () => {
        setLoading(true); 
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/event`); 
            setEvents(response.data.data.result);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []); 



    return { events, loading, fetchEvents, setLoading };
}

