import React from 'react';
import styles from "../../../components/filterableEventList/style.module.scss";
import FilterableEventsList from '../../../components/filterableEventList';
import { getUserEvents } from '@/lib/events/server/getUserEvents';
import Image from "next/image"
import { EventType } from '@/types/common';

export async function generateMetadata({ params, searchParams }: { params: { id: string }; searchParams: { fetchParam1?: string; fetchParam2?: string; }; }) {
    const userName = searchParams.fetchParam1 || 'User';
    const userImage = searchParams.fetchParam2 || '/default-avatar.jpg';
    
    const metadata = {
        title: `${userName} on F365: Explore Events, Interests & Connect`,
        description: `Dive into ${userName}'s world on F365. Discover events, share interests, and connect with a vibrant community. Click to explore more!`,
        image: userImage,
        url: `https://almuse.com/users/${params.id}`,
    };

    return {
        ...metadata,
        openGraph: {
            ...metadata,
            images: metadata.image,
        },
        twitter: {
            ...metadata,
            images: metadata.image,
        },
        structuredData: {
            "@context": "http://schema.org",
            "@type": "Person",
            "name": userName,
            "url": metadata.url,
            "image": metadata.image,
        }
    };
}

export default async function UserPortal({ params, searchParams }: { params: { id: string }; searchParams: { fetchParam1?: string; fetchParam2?: string; }; }) {
    try {
        const eventsData = await getUserEvents(params.id);
        
        if (!eventsData?.data) {
            throw new Error('Failed to fetch user events');
        }

        const publishedEvents = eventsData.data.filter(
            (event: EventType) => event.status === "published"
        );

        const AsideContent = () => (
            <aside className={styles.userProfile}>
                <div className={styles.imageWrapper}>
                    <Image 
                        src={searchParams.fetchParam2 || '/default-avatar.jpg'} 
                        alt={`${searchParams.fetchParam1 || 'User'}'s profile picture`}
                        width={500} 
                        height={500}
                        priority // Load profile image immediately
                        className={styles.profileImage}
                    />
                </div>
                <div className={styles.profileInfo}>
                    <h3>{searchParams.fetchParam1 || 'User'}&apos;s Profile</h3>
                </div>
            </aside>
        );

        return (
            <main 
                className={styles.events} 
                style={{ 
                    paddingBottom: publishedEvents.length > 0 ? "40vh" : "3rem" 
                }}
            >
                <FilterableEventsList
                    events={publishedEvents}
                    asideContent={<AsideContent />}
                    loading={false}
                />
            </main>
        );
    } catch (error) {
        console.error('Error in UserPortal:', error);
        return (
            <main className={styles.error}>
                <h2>Something went wrong loading this profile</h2>
                <p>Please try again later</p>
            </main>
        );
    }
}


