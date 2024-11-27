import styles from './style.module.scss';
import { useDisplayedEvents } from '@/lib/events/server/getDisplayedEvents';
import EventsClient from './component';

export default async function EventsHomePage() {
    const { fetchEvents } = useDisplayedEvents();
    const events = await fetchEvents();

    return (
        <section className={`${styles.work}`}>
            <EventsClient events={events.slice(0, 5)} />
        </section>
    );
}
