'use client'
import React from 'react'
import styles from './style.module.scss'
import { motion } from 'framer-motion';
import Image from "next/image"
const Landing = () => {



    return (
        <motion.section className={styles.landing}>
            <section className={styles.left}>
                <div className={styles.headers}>

                    <h2>
                        <p className={styles.eyebrow}> Almuse </p>
                        Building Connections </h2>
                    <h2> With Creative Tech </h2>
                    <button className={styles.button}> Get in Touch </button>
                </div>
            </section>
            <section className={styles.right}>
                <Image src="/briefImage.webp" alt="F365 Movement" priority width={1000} height={1000} />
            </section>
        </motion.section>
    )
}

export default Landing