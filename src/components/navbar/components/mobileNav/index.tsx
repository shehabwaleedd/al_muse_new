import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './style.module.scss';
import { TransitionLink } from '@/components/transitionLink';

const MobileNav = ({ navHovered }: { navHovered: boolean }) => {
    return (
        <AnimatePresence>
            {navHovered && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className={styles.menuListMobile}
                >
                    <motion.ul
                        className={styles.menuList}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        <li><TransitionLink href="/community" label="Community" /></li>
                        <li><TransitionLink href="/services" label="Services" /></li>
                        <li><TransitionLink href="/about" label="About" /></li>
                        <li><TransitionLink href="/contact" label="Contact" /></li>
                    </motion.ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileNav;
