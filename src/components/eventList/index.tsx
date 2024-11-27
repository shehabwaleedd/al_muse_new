import React from 'react'
import styles from './style.module.scss'
import Card from '../Card'
import Link from 'next/link'

const EventsList = ({ data }: { data: any[] }) => {

    if (data.length === 0) {
        return <div className={styles.noEvents} >
            <h2>No Published Events Found For This User Yet</h2>
            <Link href="/community">View All Community Events</Link>
        </div>
    }

    return (
        <div className={styles.eventsGrid}>
            {data.map((event, index) => (
                <Card key={index} {...event} />
            ))}
        </div>
    );
}
export default EventsList
