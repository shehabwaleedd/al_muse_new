import { EventParticipants, EventType } from '@/types/common';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Placeholder function to fetch user details by ID
const fetchUserDetailsById = async (userId: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userId}`, {
        headers: { token: localStorage.getItem("token") },
    });
    return response.data;
};

export const useEventByIdWithParticipants = (eventId: string) => {
    const [event, setEvent] = useState<EventType | null>(null);
    const [participants, setParticipants] = useState<EventParticipants[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEventAndParticipants = async () => {
            setLoading(true);
            try {
                const eventResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}`, {
                    headers: { token: localStorage.getItem("token") },
                });
                if (eventResponse.status === 200) {
                    setEvent(eventResponse.data);

                    // If EventParticipants array exists, fetch details for each participant
                    if (eventResponse.data.EventParticipants) {
                        const participantDetailsPromises = eventResponse.data.EventParticipants.map(fetchUserDetailsById);
                        const participantDetails = await Promise.all(participantDetailsPromises);
                        setParticipants(participantDetails);
                    }
                }
            } catch (error) {
                console.error("Error fetching event or participants:", error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventAndParticipants();
        }
    }, [eventId]);

    return { event, participants, loading };
};
