import { useState, useCallback } from 'react';
import axios from 'axios';
import { EventType } from '@/types/common';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://events-nsih.onrender.com';

export const useUserEvents = (userId?: string) => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUserEvents = useCallback(async () => {
        if (!userId) {
            console.error('User ID is not available');
            return;
        }
        setLoading(true);
        const token = Cookies.get('token');
        try {
            const response = await axios.get(`${BASE_URL}/event/getAllEventByOneUser/${userId}`, {
                headers: { token },
            });
            console.log('API Response:', response); // Add this line for debugging
            if (response.status === 200 && Array.isArray(response.data.data)) {
                setEvents(response.data.data);
            } else {
                throw new Error('Failed to fetch events or invalid response format');
            }
        } catch (error) {
            console.error('Error fetching user events:', error);
            toast.error('Failed to fetch events. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const refreshEvents = useCallback(() => {
        fetchUserEvents();
    }, [fetchUserEvents]);

    return { events, loading, refreshEvents, fetchUserEvents };
};