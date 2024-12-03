'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, X } from 'lucide-react';
import styles from './style.module.scss';

interface InstagramPost {
    id: string;
    mediaUrl: string;
    permalink: string;
    caption: string;
    timestamp: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    thumbnailUrl: string;
}

interface KeepUpWithUsProps {
    instagramUsername: string;
    accessToken: string;
}

const KeepUpWithUs: React.FC<KeepUpWithUsProps> = ({
    instagramUsername,
    accessToken
}) => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=9&access_token=${accessToken}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch Instagram posts');
                }

                const data = await response.json();
                const formattedPosts: InstagramPost[] = data.data.map((post: InstagramPost) => ({
                    id: post.id,
                    mediaUrl: post.mediaUrl,
                    permalink: post.permalink,
                    caption: post.caption || '',
                    timestamp: new Date(post.timestamp).toLocaleDateString(),
                    mediaType: post.mediaType,
                    thumbnailUrl: post.thumbnailUrl || post.mediaUrl
                }));

                setPosts(formattedPosts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [accessToken]);

    return (
        <section className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={styles.header}
            >
                <h2 className={styles.title}>Keep Up with Us</h2>
                <a
                    href={`https://instagram.com/${instagramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.username}
                >
                    <Instagram size={24} />
                    @{instagramUsername}
                </a>
            </motion.div>

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    Loading posts...
                </div>
            )}

            {error && (
                <div className={styles.error}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            )}

            <motion.div
                className={styles.grid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        className={styles.gridItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        onClick={() => setSelectedPost(post)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={styles.imageWrapper}>
                            <img
                                src={post.thumbnailUrl}
                                alt={post.caption.slice(0, 100)}
                                loading="lazy"
                            />
                            <div className={styles.overlay}>
                                <Instagram size={24} />
                                <span>View Post</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedPost(null)}
                            >
                                <X size={24} />
                            </button>
                            <iframe
                                src={`${selectedPost.permalink}embed`}
                                className={styles.iframe}
                                frameBorder="0"
                                scrolling="no"
                                allowTransparency={true}
                            />
                        </div>
                        <div
                            className={styles.modalOverlay}
                            onClick={() => setSelectedPost(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default KeepUpWithUs;