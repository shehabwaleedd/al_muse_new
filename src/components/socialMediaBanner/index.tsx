'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './style.module.scss';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { GoArrowUpRight } from 'react-icons/go';

const socialMediaLinks = [
    { icon: <FaFacebook />, href: "https://www.facebook.com", bgColor: "#FFCCEB" },
    { icon: <FaInstagram />, href: "https://www.instagram.com", bgColor: "#FFC4E7" },
    { icon: <FaTwitter />, href: "https://www.twitter.com", bgColor: "#FFBBE4" },
    { icon: <FaLinkedin />, href: "https://www.linkedin.com", bgColor: "#FFB3E0" },
];

const SocialMediaBanner = () => {
    const [email, setEmail] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail('');
    };

    return (
        <div className={styles.socialMediaBanner}>
            <div className={styles.left}>
                {socialMediaLinks.map((social, index) => (
                    <Link
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.icon}
                    >
                        {React.cloneElement(social.icon, {
                            style: {
                                backgroundColor: social.bgColor,
                                borderRadius: '50%',
                                padding: '8px',
                                color: '#fff', // Ensures visibility
                                width: '40px',
                                height: '40px',
                            },
                        })}
                    </Link>
                ))}
            </div>
            <div className={styles.right}>
                <h4>Subscribe for the latest Almuse updates.</h4>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <button type="submit">
                            <h5>Join Now</h5>
                            <GoArrowUpRight />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SocialMediaBanner;
