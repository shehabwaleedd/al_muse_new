'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './style.module.scss';
import { useSubComponents } from '@/context/SubComponentsContext';
import useWindowSize from '@/hooks/useWindowWidth';
import DesktopNav from './components/desktopNav';
import MobileNav from './components/mobileNav';
import SVGMenuToggle from './components/SVGMenuToggle';

const Navbar: React.FC = () => {
    const [navHovered, setNavHovered] = useState(false);
    const { isLoggedIn } = useAuth();
    const { handleLoginIsOpen, handleProfileHeaderOpen } = useSubComponents();
    const pathname = usePathname();
    const { isLaptop } = useWindowSize();

    const handleClick = useCallback(() => {
        setNavHovered((prev) => !prev);
    }, []);

    useEffect(() => {
        setNavHovered(false);
    }, [pathname]);

    const motionVariants = {
        initial: {
            backgroundColor: 'var(--dimmed-color)',
            padding: '0rem',
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },


        animate: {
            backgroundColor: navHovered && isLaptop ? '#e1dad0' : 'var(--dimmed-color)',
            padding: navHovered && isLaptop ? '0.25rem' : '0rem',
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
        exit: {
            backgroundColor: 'var(--dimmed-color)',
            padding: '0rem',
            transition: { duration: 0.9, ease: [0.75, 0.33, 0.85, 0.51] },
        }
    };

    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.logo} aria-label="Home">
                <Image src="/logo2.svg" alt="Almuse Logo" width={200} height={200} />
            </Link>
            <div className={styles.nav_right} role="navigation" aria-label="User menu">
                <div className={styles.nav_right_container}>
                    <motion.div className={styles.content} initial="initial" animate={navHovered ? "animate" : "initial"} exit="exit" variants={motionVariants}>
                        <button
                            className={styles.hamburger}
                            onClick={handleClick}
                            aria-label="Toggle Menu"
                            aria-expanded={navHovered}
                            style={{ backgroundColor: navHovered && isLaptop ? 'var(--second-accent-color)' : 'transparent', clipPath: navHovered && isLaptop ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                        >
                            <SVGMenuToggle isOpen={navHovered} />
                            {!isLaptop && <DesktopNav navHovered={navHovered} />}
                        </button>
                        {isLoggedIn ? (
                            <button
                                onClick={handleProfileHeaderOpen}
                                aria-label="Open Profile"
                                style={{ backgroundColor: navHovered && isLaptop ? 'transparent' : 'var(--second-accent-color)', }}
                                className={styles.navButton}
                            >
                                Account
                            </button>
                        ) : (
                            <button
                                onClick={handleLoginIsOpen}
                                aria-label="Open Login"
                                style={{ backgroundColor: navHovered && isLaptop ? 'transparent' : 'var(--second-accent-color)', }}
                                className={styles.navButton}
                            >
                                Login
                            </button>
                        )}
                    </motion.div>
                    {isLaptop && <MobileNav navHovered={navHovered} />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
