'use client'

import React, { useRef } from 'react';
import styles from "./style.module.scss";
import Border from '@/constant/border';
import { useScroll, motion, useTransform } from 'framer-motion';
import TextSlidingParallax from "@/animation/textParallax";
import Link from 'next/link';
import DiamondButton from '../diamondButton';

const footerSiteLinks = [
    { href: '/about', label: 'About Almuse' },
    { href: '/community', label: 'Community' },
    { href: '/services', label: 'Services' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

const socialLinks = [
    { href: "https://www.instagram.com/f365movement/", label: 'Instagram' },
    { href: "https://www.facebook.com/f365movement", label: 'Facebook' },
    { href: "https://www.linkedin.com/f365movement", label: 'LinkedIn' },
    { href: "https://www.twitter.com/f365movement", label: 'Twitter' },
];

const Index = () => {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [-500, 0])

    const textScrolLData = [
        {
            texts: ['Powerment', 'Innovation', 'Empowerment'],
            direction: 'left' as const,
            offset: '-40%'
        }
    ]

    return (
        <motion.footer className={styles.footer} style={{ y }} ref={container}>

            <TextSlidingParallax slides={textScrolLData} />
            <section className={styles.upper}>
                <h3>
                    Where <span>Innovation</span> Meets <br /> Women&apos;s <span>Empowerment</span>
                </h3>
                <nav className={styles.nav}>
                    <ul>
                        {footerSiteLinks.map((link, index) => (
                            <li key={index}>
                                <Link href={link.href} aria-label={link.label} className={styles.pageLink}> {link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.subscripe}>
                    <h4>Subscribe for the latest Almuse updates.</h4>
                    <div className={styles.buttonContainer}>
                        <DiamondButton
                            onClick={() => { }}
                            ariaLabel='Join Now'
                            size='medium'
                            direction='next'
                            fillColor='#B377B7'
                            iconColor='#ffffff'

                        />
                        <h5>Join Now</h5>
                    </div>
                </div>
            </section>
            <Border width="95%" background="#999999" svgColor='var(--original-grey)' />
            <div className={styles.lower}>
                <div className={styles.lower_left}>
                    <h4>
                        <strong>Almuse <span className={styles.span}>by F365</span></strong>
                    </h4>
                    <h4 className={`${styles.link_mobileOnly} ${styles.link}`}> Website by <a href="https://cairo-studio.com" target='_blank' rel="follow"> Cairo Studio.</a></h4>
                </div>
                <div className={styles.lower_right}>
                    <h4 className={styles.link}> Website by <a href="https://cairo-studio.com" target='_blank' rel="follow"> Cairo Studio.</a></h4>
                </div>
                <ul>
                    {socialLinks.map((link, index) => (
                        <li key={index}>
                            <a href={link.href} target='_blank' rel="noreferrer" aria-label={link.label} >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.footer>
    );
}

export default Index;
