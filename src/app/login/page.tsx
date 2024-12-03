'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from "./../register/page.module.scss";
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { toast } from 'sonner';
import global from "@/app/page.module.scss"


interface ErrorResponse {
    err?: string;
    message?: string;
    errors?: Array<{ message: string }>;
}

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { handleLoginSuccess } = useAuth();
    const router = useRouter();

    const validationSchema = yup.object({
        email: yup.string().email().required("Email is required"),
        password: yup.string().required("Password is required"),
    });

    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/login`, values);

                if (response.status === 200 && response.data.message === "success") {
                    toast.success('Login successful');
                    toast.success("Redirecting to dashboard...");
                    handleLoginSuccess(response.data.token, response.data.data);
                    router.push('/account');
                }
            } catch (err) {
                let errorMessage = 'An unexpected error occurred during login.';

                if (axios.isAxiosError(err)) {
                    const error = err as AxiosError<ErrorResponse>;
                    if (error.response?.data) {
                        const errorData = error.response.data;
                        if (errorData.err) {
                            errorMessage = errorData.err;
                        } else if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.errors) {
                            errorMessage = errorData.errors.map(e => e.message).join('\n');
                        }
                    }
                }

                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <main className={styles.container}>
            <section className={styles.center}>
                <section className={styles.container__form}>
                    <form onSubmit={loginFormik.handleSubmit} className={styles.form}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete='email'
                            onBlur={loginFormik.handleBlur}
                            required
                            onChange={loginFormik.handleChange}
                            value={loginFormik.values.email}
                            className={styles.input}
                        />
                        {loginFormik.touched.email && loginFormik.errors.email && (
                            <div className={styles.error}>{loginFormik.errors.email}</div>
                        )}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete='current-password'
                            onBlur={loginFormik.handleBlur}
                            required
                            onChange={loginFormik.handleChange}
                            value={loginFormik.values.password}
                            className={styles.input}
                        />
                        {loginFormik.touched.password && loginFormik.errors.password && (
                            <div className={styles.error}>{loginFormik.errors.password}</div>
                        )}
                        <button type="submit" className={global.submitButton} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className={styles.link}>
                            <Link href="/forgotPassword" aria-label="Forgot password? Don't worry, click here">
                                <span className={styles.link}>Forgot password? Don&apos;t worry, click here</span>
                            </Link>
                            <Link href="/register" aria-label="Don't have an account? Sign up">
                                <span>Don&apos;t have an account? Sign up</span>
                            </Link>
                        </div>
                    </form>
                </section>
            </section>
            <Image src="/assets/backgrounds/1.webp" height={1000} width={1920} alt='register background' className={styles.mainImg} />
        </main>
    );
}

export default Page;
