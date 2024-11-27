'use client'

import { memo, useCallback, useTransition } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoLocationOutline } from "react-icons/io5";
import { FiPhone, FiUser, FiMail } from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { toast } from 'sonner';
import { convertUserRole, deleteUser } from '@/lib/actions/user';
import type { User } from '@/types/common';
import styles from './style.module.scss';

interface ViewUserDetailsAdminProps {
    currentUser: User;
    setUserOpened: (value: string | null) => void;
}

const ViewUserDetailsAdmin = ({ currentUser, setUserOpened }: ViewUserDetailsAdminProps) => {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = useCallback(() => {
        if (!window.confirm(`Are you sure you want to convert this ${currentUser.role === 'user' ? 'user to admin' : 'admin to user'}?`)) {
            return;
        }

        startTransition(async () => {
            const newRole = currentUser.role === 'user' ? 'admin' : 'user';
            const result = await convertUserRole(currentUser._id, newRole);

            if (result.success) {
                toast.success(`User has been converted to ${newRole}`);
                setUserOpened(null);
            } else {
                toast.error(result.error);
            }
        });
    }, [currentUser._id, currentUser.role, setUserOpened]);

    const handleDelete = useCallback(() => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        startTransition(async () => {
            const result = await deleteUser(currentUser._id);

            if (result.success) {
                toast.success('User has been deleted');
                setUserOpened(null);
            } else {
                toast.error(result.error);
            }
        });
    }, [currentUser._id, setUserOpened]);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.overlay}
        >
            <div className={styles.modal}>
                <div className={styles.closeButton}>
                    <button onClick={() => setUserOpened(null)}>close</button>
                </div>

                <div className={styles.modal__top}>
                    <Image
                        src={currentUser.avatar?.url || '/user.png'}
                        alt={currentUser.name}
                        width={100}
                        height={100}
                    />
                    <h3>{currentUser.name}</h3>
                </div>

                <div className={styles.modal__bottom}>
                    <p>
                        <FiMail />
                        {currentUser.email}</p>
                    <p><FiPhone /> {currentUser.phone}</p>
                    <p>
                        <IoLocationOutline />
                        {currentUser.country}, {currentUser.region}
                    </p>
                    <p><MdOutlineWorkOutline /> {currentUser.company}</p>
                    <p>
                        <FiUser />
                        {currentUser.gender}, {currentUser.age} yo
                    </p>
                </div>

                <div className={styles.modal__lower}>
                    {currentUser.role === "user" ? (
                        <button
                            onClick={handleRoleChange}
                            className={styles.convertButton}
                            disabled={isPending}
                        >
                            Convert to Admin
                        </button>
                    ) : (
                        <button
                            onClick={handleRoleChange}
                            className={styles.convertButton}
                            disabled={isPending}
                        >
                            Convert to User
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className={styles.deleteButton}
                        disabled={isPending}
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </motion.section>
    );
};

export default memo(ViewUserDetailsAdmin);