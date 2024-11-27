import React from 'react';
import styles from "../../components/filterableEventList/style.module.scss";
import EventsClient from "./EventsClient"
import CommunityUpper from './components/communityUpper';

export async function generateMetadata() {
    return {
        title: "Upcoming Events - Almuse",
        description: "Explore the latest events across the globe with Almuse. From art exhibitions to tech conferences, find events that match your interests and connect with like-minded individuals.",
        url: `https://almuse.com/community`,
        openGraph: {
            type: "website",
            title: "Upcoming Events - Almuse",
            description: "Join us to discover and participate in events that spark your interest. Whether it's for learning, networking, or just fun, find your next event with Almuse.",
            url: `https://almuse.com/community`,
            site_name: "Almuse",
            images: '/assets/backgrounds/1.webp',
        },
        twitter: {
            handle: '@Almuse',
            title: "Discover & Join Events Worldwide | Almuse",
            description: "Looking for events that inspire and entertain? Browse Almuse's curated list of upcoming events and find your next adventure or learning opportunity.",
            cardType: 'summary_large_image',
            image: 'https://almuse.com/static/images/events-twitter-card.jpg',
        },
    }
}

const Community = () => {

    return (
        <main className={styles.community}>
            <CommunityUpper />
            <EventsClient />
        </main>
    )
}

export default Community