import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './style.module.scss';
import { TransitionLink } from '@/components/transitionLink';

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
                        <li><TransitionLink href="/community" label="Community" color='var(--title-color)' /></li>
                        <li><TransitionLink href="/services" label="Services" color='var(--title-color)' /></li>
                        <li><TransitionLink href="/about" label="About" color='var(--title-color)' /></li>
                        <li><TransitionLink href="/contact" label="Contact" color='var(--title-color)' /></li>
                    </motion.ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DesktopNav;
