'use client'
import React from 'react'
import styles from "./style.module.scss"
import getChars from '../../../../animation/animatedHeaders/getChars'
import CTAButton from '@/components/ctaButton'

const AboutUpper = () => {
    return (
        <section className={styles.aboutUpperTitles}>
            <div className={styles.aboutUpperTitles_titles}>
                <p className={styles.eyebrow}>Almuse</p>
                {getChars('A Creative')}
            </div>
            <div className={styles.aboutUpperTitles_titles_accent}>
                {getChars('Agency Uniting')}
            </div>
            <div className={styles.aboutUpperTitles_titles}>
                {getChars('Wellness With Tech')}
            </div>
            <CTAButton text="Get in Touch" href="/contact" backgroundColor="var(--accent-color)" textColor="var(--title-color)" />
            <div className={styles.aboutUpperLower}>
                <p>
                    Bridging the gap between health empowerment and digital creativity, F365 pioneers wellness through cutting-edge technology. We&apos;re not just developing solutions; we&apos;re designing a healthier, more connected world.
                </p>
            </div>
        </section>
    )
}

export default AboutUpper