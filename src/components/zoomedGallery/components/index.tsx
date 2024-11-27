import React from 'react'
import styles from "./style.module.scss";
import Image from 'next/image';
import { GoArrowUpRight } from "react-icons/go";
import Link from 'next/link';

const ZoomInfo = ({ imageRef }: { imageRef: React.RefObject<HTMLImageElement> }) => {
    return (
        <div className={styles.info}>
            <div className={styles.info_left}>
                <Image ref={imageRef} src="/assets/backgrounds/3.webp" alt="Image 1" width={500} height={500} />
            </div>
            <div className={styles.info_right}>
                <span> Participate with ease </span>
                <p>
                    Our seamless platform allows you to participate in events with ease. Just RSVP, add to calendar, and show up!
                </p>
                <Link className={styles.info_button} href="/community">
                    <GoArrowUpRight />
                    <span>Explore Community</span>
                </Link>
            </div>
        </div>
    )
}

export default ZoomInfo