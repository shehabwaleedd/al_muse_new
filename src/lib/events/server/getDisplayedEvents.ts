import axios from 'axios';
import { EventType } from '@/types/common';
export async function getEvents() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/event`);
        const events = response.data.data.result;
        console.log('events', events);
        return events.filter((event: EventType) => event.isDisplayed !== true);

    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}