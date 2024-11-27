'use client'
import { useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export const useEventParticipation = (
    eventId: string,
    setHasParticipated: (value: boolean) => void
) => {
    const [loading, setLoading] = useState(false);

    const joinEvent = useCallback(async () => {
        setLoading(true);

        const token = Cookies.get('token');
        if (!token) {
            toast.error("No token found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const isConfirmed = window.confirm("Are you sure you want to join this event?");
            if (!isConfirmed) {
                setLoading(false);
                return;
            }

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/event/joinWithEvent/${eventId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 200) {
                toast.success("Successfully joined the event!");
                setHasParticipated(true);
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to join the event";

            console.error('Error joining event:', error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [eventId, setHasParticipated]);

    return { joinEvent, loading };
};