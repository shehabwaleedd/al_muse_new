
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin } from 'react-icons/fi';
import styles from './style.module.scss';
import { BoxData, SocialMediaLink } from '@/types/common';

const BoxesData: BoxData[] = [
    {
        id: 1,
        content: 'Featured Image',
        image: '/assets/backgrounds/1.webp',
        backgroundColor: 'transparent',
        color: '#777',
    },
    {
        id: 2,
        content: 'We combine creativity and strategy to deliver exceptional results that elevate your brand presence.',
        backgroundColor: 'var(--original-light-grey)',
        color: '#000',
    },
    {
        id: 3,
        content: 'Our team of experts works tirelessly to ensure your digital success through innovative solutions and dedicated support.',
        backgroundColor: 'var(--original-min-green)',
        color: 'var(--original-grey)',
    },
    {
        id: 4,
        content: "Let's Connect",
        backgroundColor: 'var(--original-green)',
        color: '#fff',
        socialLinks: [
            { platform: 'Instagram', url: 'https://instagram.com', icon: FiInstagram },
            { platform: 'Twitter', url: 'https://twitter.com', icon: FiTwitter },
            { platform: 'Facebook', url: 'https://facebook.com', icon: FiFacebook },
            { platform: 'LinkedIn', url: 'https://linkedin.com', icon: FiLinkedin },
        ],
    },
];

const ImageBox: React.FC<{ image: string }> = ({ image }) => (
    <figure className={styles.imageBox}>
        <Image
            src={image}
            alt="Featured"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
            priority
        />
    </figure>
);

const ContentBox: React.FC<{ content: string }> = ({ content }) => (
    <article className={styles.contentBox}>
        <p className={styles.content}>{content}</p>
    </article>
);

const SocialBox: React.FC<{ content: string, links: SocialMediaLink[] }> = ({ content, links }) => (
    <aside className={styles.socialBox}>
        <h2 className={styles.socialTitle}>{content}</h2>
        <nav className={styles.socialLinks} aria-label="Social Media Links">
            {links.map((link) => {
                const Icon = link.icon;
                return (
                    <Link
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label={`Visit our ${link.platform} page`}
                    >
                        <Icon />
                    </Link>
                );
            })}
        </nav>
    </aside>
);

const BoxContent: React.FC<{ box: BoxData }> = ({ box }) => {
    if (box.id === 1 && box.image) {
        return <ImageBox image={box.image} />;
    }

    if (box.socialLinks) {
        return <SocialBox content={box.content} links={box.socialLinks} />;
    }

    return <ContentBox content={box.content} />;
};

const Boxes: React.FC = () => {
    return (
        <section className={styles.boxes} aria-label="Feature Highlights">
            <div className={styles.grid}>
                {BoxesData.map((box) => (
                    <div key={box.id}
                        className={`${styles.box} ${box.id === 1 ? styles.noPadding : ''}`}
                        style={{ backgroundColor: box.backgroundColor, color: box.color }}
                    >
                        <BoxContent box={box} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Boxes;