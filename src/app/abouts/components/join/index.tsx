'use client'

import React from 'react'
import styles from "./style.module.scss"
import DiamondButton from '@/components/diamondButton';
import { useRouter } from 'next/navigation';

const Join = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/contact');
    }

    return (
        <section className={styles.join}>
            <h3>
                We&apos;d love to have you with us.
            </h3>
            <DiamondButton
                onClick={handleClick}
                ariaLabel="Join Us"
                fillColor="#202020"
                iconColor="#ffffff"
                size="xlarge"
            >
                <p>
                    Join Us
                </p>
            </DiamondButton>
        </section>
    )
}

export default Join