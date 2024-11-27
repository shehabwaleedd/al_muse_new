import React from 'react'
import { motion } from "framer-motion";
import styles from "./style.module.scss"
import { useAuth } from '@/context/AuthContext';
import { TransitionLink } from '@/components/transitionLink';
import Image from 'next/image';
import { getVariants } from '@/animation/animate';
import { useSubComponents } from '@/context/SubComponentsContext';
import useWindowWidth from '@/hooks/useWindowWidth';
import SubComponentSide from '@/common/SubComponentSide';


const Header = () => {
    const { user } = useAuth();
    const { handleLogOutForm } = useSubComponents();
    const { isMobile } = useWindowWidth();

    return (
        <motion.section initial="initial" animate="animate" exit="exit" variants={getVariants(isMobile)} className={styles.accountHeader__profile}>
            <div className={styles.upper}>
                <Image src={user?.avatar?.url ?? '/user.png'} alt={user?.name ?? "User Avatar"} title={user?.name ?? "User Avatar"} width={500} height={500} quality={100} placeholder='blur' blurDataURL={user?.avatar?.url ?? '/user.png'} />
            </div>
            <div className={styles.user_info}>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
            </div>
            <div className={styles.accountHeader__profile_lower}>
                <div>
                    <TransitionLink href="/account" label="Account" />
                    <TransitionLink href={`/account/user/${user?._id}/user-events`} label="My Events" />
                    <TransitionLink href="/account/createEvent" label="Create Event" />
                </div>
                <button onClick={handleLogOutForm} className={styles.logout}>
                    Logout
                </button>
            </div>
        </motion.section>
    )
}


Header.displayName = 'Header';

export default SubComponentSide(Header);