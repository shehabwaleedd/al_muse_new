'use client'
import React, { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import styles from './page.module.scss'
import { useAuth } from '../../context/AuthContext'
import PersonalInfo from '../../components/accountComponents/personalInfo'
import ChangePasswordForm from '@/components/accountComponents/changePassword'
import { AnimatePresence } from 'framer-motion'
import UserEvents from '@/components/accountComponents/userEvents'
import SuperAdminView from '../../components/accountViews/superAdmin'
import AdminView from '../../components/accountViews/admin'
import UserView from '../../components/accountViews/user'
import Participants from '../../components/accountComponents/participants'
import AllUsers from '../../components/accountComponents/allUsers'
import PendingEvents from '../../components/accountComponents/pendingEvents'
import AllEvents from '../../components/accountComponents/allEvents'
import CreateEvent from './events/createEvent/page'
import AnalyticsDashboard from '@/components/accountComponents/analytics'
import { User } from '@/types/common'
const Account = () => {
    const { user, setUser } = useAuth();
    const [activeSection, setActiveSection] = useState<string>('personalInfo');

    const handleOpen = (sectionName: string) => () => {
        setActiveSection(sectionName);
    };



    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const token = localStorage.getItem('token');
        const avatar = user?.avatar;
        const formData = new FormData();
        if (avatar && avatar.url) formData.append('avatar', avatar.url);
        if (event?.currentTarget?.files) {
            formData.append('avatar', event.currentTarget.files[0]);
        }


        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token
                }
            });
            console.log(response.data);
            setUser(response.data.data.user);
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <main className={styles.account}>
            <div className={styles.account__lower}>
                <div className={styles.account__lower_left}>
                    <div className={styles.account__lower_left_upper}>
                        <div className={styles.account_lower_left_upper_image}>
                            <Image src={user?.avatar?.url ?? '/user.png'} alt="user" width={300} height={300} quality={100} priority={true} />
                        </div>
                        <div className={styles.account_lower_left_upper_middle}>
                            <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleAvatarChange} />
                            <label htmlFor="avatar">Change Profile Picture</label>
                        </div>
                        <div className={styles.account_lower_left_upper_bottom}>
                            <h2>{user?.name}</h2>
                        </div>
                    </div>
                    <div className={styles.account__lower_left_lower}>
                        {user?.role === 'superAdmin' ? <SuperAdminView handleOpen={handleOpen} /> : user?.role === 'admin' ? <AdminView handleOpen={handleOpen} /> : <UserView handleOpen={handleOpen} />}
                    </div>
                </div>

                <div className={styles.account__lower_right}>

                    <AnimatePresence mode='wait'>
                        {activeSection === 'personalInfo' && <PersonalInfo user={user as User} onUpdate={() => { }} />}
                        {activeSection === 'changePassword' && <ChangePasswordForm />}
                        {activeSection === 'userEvents' && <UserEvents />}
                        {activeSection === 'createEvent' && <CreateEvent />}
                        {activeSection === 'participants' && <Participants />}
                        {activeSection === 'events' && <AllEvents />}
                        {activeSection === 'users' && <AllUsers />}
                        {activeSection === 'pendingEvents' && <PendingEvents />}
                        {activeSection === 'analytics' && <AnalyticsDashboard />}
                        {activeSection === '' && <div className={styles.account__lower_right_default} style={{ padding: "1rem" }}><h2>Select a section to view</h2></div>}
                    </AnimatePresence>
                </div>

            </div>
        </main>
    )
}

export default Account