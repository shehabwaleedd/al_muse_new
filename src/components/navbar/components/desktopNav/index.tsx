import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './style.module.scss';
import Link from 'next/link';

const DesktopNav = ({ navHovered }: { navHovered: boolean }) => {
    return (
        <AnimatePresence>
            {navHovered && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className={styles.menuListContainer}
                >
                    <motion.ul
                        className={styles.menuList}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        <li><Link href="/community" aria-label="Community">Community</Link></li>
                        <li><Link href="/services" aria-label="Services">Services</Link></li>
                        <li><Link href="/about" aria-label="About">About</Link></li>
                        <li><Link href="/contact" aria-label="Contact">Contact</Link></li>
                    </motion.ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DesktopNav;
