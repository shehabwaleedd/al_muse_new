'use client'

import React, { useRef } from 'react';
import styles from "./style.module.scss";
import { GoArrowUpRight } from "react-icons/go";
import { TransitionLogo } from '../transitionLink';
import Border from '@/constant/border';
import { useScroll, motion, useTransform } from 'framer-motion';

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

    return (
        <motion.footer className={styles.footer} style={{ y }} ref={container}>
            <section className={styles.upper}>
                <h3>
                    Where Innovation Meets <br /> Women&apos;s Empowerment
                </h3>
                <nav className={styles.nav}>
                    <ul>
                        {footerSiteLinks.map((link, index) => (
                            <li key={index}>
                                <TransitionLogo
                                    href={link.href} label={link.label}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.subscripe}>
                        <h4>Subscribe for the latest Almuse updates.</h4>
                        <button>
                            <GoArrowUpRight />
                            <h5>Join Now</h5>
                        </button>
                </div>
            </section>
            <Border
                width="95%"
                background="#999999"
                svgColor='var(--original-grey)'
            />
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
                            <a href={link.href} target='_blank' rel="noreferrer">
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
