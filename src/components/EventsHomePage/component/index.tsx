'use client'
import React, { useRef } from 'react'
import Border from '@/constant/border';
import { TransitionLink } from '@/components/transitionLink';
import Image from 'next/image';
import DynamicCard from '@/components/twoGrids';
import { EventType } from '@/types/common';
import styles from "@/components/twoGrids/style.module.scss";
import { motion, useScroll, useTransform, } from 'framer-motion';


const EventsClient = ({ events }: { events: EventType[] }) => {

    const stripHtmlTagsAndSlice = (html: string, maxLength: number = 400): string => {
        const strippedText = html.replace(/<[^>]+>/g, '');
        return strippedText.length > maxLength ? strippedText.slice(0, maxLength) + '...' : strippedText;
    };

    const truncateTitle = (title: string) => {
        return title.length > 50 ? `${title.slice(0, 49)}...` : title;
    };

    const container = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "0vh"])

    const renderEventContent = (event: EventType) => (
        <>
            <div className={styles.upper}>
                <p>
                    {event.dateOfEvent}
                </p>
            </div>
            <h2>{truncateTitle(event.title ?? '')}</h2>
            <Border width='90%' svgColor='var(--accent-color)' color='#513' />
            <p>{stripHtmlTagsAndSlice(event.description ?? '')}</p>
            <div className={styles.btnMobile}>
                <Image src={event.mainImg?.url ?? ''} alt={event.title ?? ''} width={500} height={500} loading='lazy' />
                <TransitionLink href={`/community/${event.slug}`} label="Read More" />
            </div>
        </>
    );

    const getEventImageUrl = (event: EventType) => event.mainImg?.url ?? '';
    const getEventTitle = (event: EventType) => event.title ?? '';
    const getEventLink = (event: EventType) => `/community/${event?.slug}`;


    return (
        <motion.section style={{ y, position: "relative" }}>
            <DynamicCard
                items={events.map((event: EventType, index: number) => ({ id: index.toString(), ...event }))}
                renderItemContent={renderEventContent}
                getImageUrl={getEventImageUrl}
                getTitle={(event: EventType) => truncateTitle(getEventTitle(event))}
                getLink={getEventLink}
            />
        </motion.section>
    )
}

export default EventsClient;
