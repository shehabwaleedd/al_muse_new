import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { EventType } from '@/types/common';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://events-nsih.onrender.com';

export const usePendingEvents = () => {
    const [pendingEvents, setPendingEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getPendingEvents = useCallback(async () => {
        const token = Cookies.get('token');
        if (!token) {
            console.error('No token found');
            toast.error('Authentication token not found, logging you out...');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/event`, {
                headers: { token },
            });
            const filteredEvents = response.data.data.result.filter((event: EventType) => event.status === "pending");
            setPendingEvents(filteredEvents);
        } catch (err) {
            console.error('Error fetching pending events:', err);
            toast.error('Failed to fetch pending events');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getPendingEvents();
    }, [getPendingEvents]);

    const refreshEvents = useCallback(async () => {
        setLoading(true);
        await getPendingEvents();
        toast.success("Events refreshed successfully.");
    }, [getPendingEvents]);

    return { pendingEvents, loading, refreshEvents };
};