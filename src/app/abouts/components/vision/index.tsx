'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import styles from "./style.module.scss"
import { GoArrowUpRight } from "react-icons/go";
import { useScroll, useTransform, motion } from 'framer-motion';
import { useSubComponents } from '@/context/SubComponentsContext';

const Vision = () => {
    const container = useRef<HTMLDivElement>(null);
    const { handleTeamOpened } = useSubComponents()

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "100vh"])



    return (
        <section className={styles.vision} ref={container}>
            <motion.div style={{ y, position: "sticky" }}>
                <Image src="/mainImage.webp" alt="Vision" width={1920} height={1080} />
            </motion.div>
            <div className={styles.teamSmall}>
                <p> Our team not just develops <br /> solutions  we design a <br /> healthier, more  <br /> connected world for women.</p>
                <div className={styles.teamSmall_down} onClick={handleTeamOpened}>
                    <GoArrowUpRight />
                    <span>Team</span>
                </div>
            </div>
        </section>
    )
}

export default Vision