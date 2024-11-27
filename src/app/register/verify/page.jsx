'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import styles from "@/app/register/page.module.scss";
import Image from 'next/image';
import global from "@/app/page.module.scss"

const Verify = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const reVerify = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('No token found. Please log in again.');
                setLoading(false);
                return;
            }
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/resend-confirmation-email`, {}, {
                headers: { token },
            });
            toast.success('Verification email resent. Please check your email.');
        } catch (error) {
            toast.error("Error re-sending confirmation email:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkConfirmationStatus = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('No token found. Please log in again.');
                    return;
                }
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
                    headers: { token },
                });
                if (response.data.data.isConfirmed) {
                    router.push('/account');
                }
            } catch (error) {
                toast.error("Error checking confirmation status:", error);
            }
        };

        const timer = setTimeout(() => {
            checkConfirmationStatus();
        }, 30000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className={styles.container}>
            <section className={styles.center}>
                <div className={styles.container__form}>
                    <h2>Verify your email</h2>
                    <p>
                        We have sent a verification link to your email. Please check your email and click on the link to verify your account.
                    </p>
                    <p style={{ fontSize: "var(--small-font-size)" }}>
                        If you haven&apos;t received the email, please check your spam folder.
                    </p>
                    <button onClick={reVerify} disabled={loading} className={global.submitButton}>
                        {loading ? 'Resending...' : 'Resend Verification Email'}
                    </button>
                </div>
            </section>
            <Image src="/mainImage.webp" alt="F365 Movement" width={1900} height={1080} className={styles.mainImg} />
        </main>
    );
};

export default Verify;
