'use client';

import React from 'react'
import styles from './style.module.scss'
import { BsTwitterX, BsLinkedin, BsWhatsapp } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { EventType } from '@/types/common';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ShareDropDownType {
    event: EventType | null,
    setShowShareOptions: any

}

const ShareDropdown: React.FC<ShareDropDownType> = ({ event, setShowShareOptions }) => {
    const onShare = (platform: string) => {
        const text = `Check out this event: ${event?.title}`;
        const url = `https://almuse.com/community/${event?.slug}`;
        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`;
                break;
            default:
                break;
        }

        window.open(shareUrl, '_blank');
        setShowShareOptions(false);

    }

    const handleCopyLink = async () => {
        const url = `https://almuse.com/community/${event?.slug}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch (err: any) {
            toast.error('Failed to copy link:', err);
        }
    };

    const socialList = [
        { name: 'twitter', icon: <BsTwitterX /> },
        { name: 'facebook', icon: <FaFacebookF /> },
        { name: 'whatsapp', icon: <BsWhatsapp /> },
        { name: 'linkedin', icon: <BsLinkedin /> },
    ]

    return (
        <motion.section className={styles.shareEvent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className={styles.shareEvent__container}>
                <div className={styles.shareEvent__container_upper}>
                    <h2>Share Event</h2>
                    <button onClick={() => setShowShareOptions(false)} aria-label="Close share options">close</button>
                </div>
                <ul className={styles.shareEvent__container_socialIcons}>
                    {socialList.map((social, i) => (
                        <li key={i} onClick={() => onShare(social.name)} aria-label={`Share on ${social.name}`} >
                            {social.icon}
                        </li>
                    ))}
                </ul>

                <h3>Event public page link</h3>
                <div className={styles.group}>
                    <input type="text" value={`https://almuse.com/community/${event?.slug}`} readOnly />
                    <button onClick={handleCopyLink} aria-label="Copy link to clipboard"> <IoCopyOutline /></button>
                </div>
            </div>
        </motion.section>
    );
};

export default ShareDropdown