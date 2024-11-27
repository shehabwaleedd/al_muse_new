'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { EventType } from '@/types/common';

export const useEventBySlug = (slug: string) => {
    const [event, setEvent] = useState<EventType>({} as EventType);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/event/${slug}`,
                    {
                        headers: {
                            token: typeof window !== 'undefined' ? localStorage.getItem("token") : null
                        },
                    }
                );

                if (response.status === 200) {
                    setEvent(response.data.data);
                } else {
                    throw new Error("Failed to fetch event");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to fetch event";
                console.error("Error fetching event:", error);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug]); // Added slug as dependency

    return { event, loading, error };
}