import React from 'react';
import styles from './style.module.scss';
import { useSubComponents } from '@/context/SubComponentsContext';
import { LiaUserSolid } from 'react-icons/lia';
const AccountHeaderNavbar = () => {
    const { handleProfileHeaderOpen } = useSubComponents();


    return (
        <div className={styles.accountHeader}>
            <div className={styles.accountHeader__avatar} onClick={handleProfileHeaderOpen}>
                <LiaUserSolid style={{ color: "#fff", fontSize: "var(--body-font-size)" }} />
            </div>
        </div>
    );
};

export default AccountHeaderNavbar;
