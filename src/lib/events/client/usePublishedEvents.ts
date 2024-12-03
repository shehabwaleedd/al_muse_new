'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { EventType } from '@/types/common';

export const usePublishedEvents = (page: number) => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/event?page=${page}`);
            setEvents(response.data.data.result);
            setHasMore(page < response.data.data.totalPages);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [page]);

    return { events, loading, hasMore, totalPages };
}