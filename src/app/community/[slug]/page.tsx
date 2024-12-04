import React from 'react';
import EventComponent from './components';
import { getEventBySlug } from '@/lib/events/server/getEventBySlug';
import getBase64 from '../../../lib/getLocalBase64';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event/${params.slug}`);
    if (!res.ok) throw new Error('Failed to fetch event');

    const jsonResponse = await res.json();
    const cleanDescription = jsonResponse.data.description.replace(/<[^>]*>/g, '').slice(0, 150);

    return {
        title: jsonResponse.data.title,
        description: cleanDescription,
        url: `https://almuse.com/community/${params.slug}`,
        image: jsonResponse.data.mainImg,
        openGraph: {
            type: 'website',
            title: jsonResponse.data.title,
            description: cleanDescription,
            images: jsonResponse.data.mainImg,
            url: `https://almuse.com/community/${params.slug}`,
            site_name: 'Almuse',
        },
        twitter: {
            title: jsonResponse.data.title,
            description: cleanDescription,
            images: jsonResponse.data.mainImg,
            cardType: 'summary_large_image',
        },
    };
}

export default async function EventPage({
    params,
}: Awaited<{ params: { slug: string } }>) {
    try {
        const event = await getEventBySlug(params.slug); // Resolving the event data
        const base64 = await getBase64(event.data.mainImg.url); // Resolving the base64 image

        return (
            <>
                <EventComponent 
                    params={params} 
                    base64={base64 ?? ''} 
                />
            </>
        );
    } catch (error) {
        console.error('Failed to load event page:', error);
        return (
            <div>
                <h1>Error</h1>
                <p>Failed to load the event. Please try again later.</p>
            </div>
        );
    }
}
