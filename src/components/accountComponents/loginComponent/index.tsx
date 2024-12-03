'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios, { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useSubComponents } from '@/context/SubComponentsContext';
import global from "@/app/page.module.scss";
import SubComponentSide from '@/common/SubComponentSide';

const LoginComponent: React.FC = () => {
    const [errorFromDataBase, setErrorFromDataBase] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setUser } = useAuth();
    const { handleLoginSuccessForm, handleRegisterIsOpen, setIsLoginOpen, handleForgetPassword } = useSubComponents();

    const validationSchema = yup.object().shape({
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            const url = `/api/user/login`;
            const dataToSend = { email: values.email, password: values.password };

            try {
                const response = await axios.post(url, dataToSend);
                if (response.data.message === 'success') {
                    setUser(response.data.data);
                    handleLoginSuccessForm(response.data.token, response.data.data);
                    setIsLoginOpen(false);
                } else {
                    setErrorFromDataBase(response.data.err || 'An unexpected error occurred.');
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setErrorFromDataBase(error.response?.data?.err || "An unexpected error occurred.");
                } else {
                    setErrorFromDataBase("An unexpected error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Login To Continue</h2>
            <div className={global.group}>
                <div className={global.column}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        onBlur={formik.handleBlur}
                        required
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                </div>
            </div>
            <div className={global.group}>
                <div className={global.column}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onBlur={formik.handleBlur}
                        required
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                </div>
            </div>
            {formik.touched.password && formik.errors.password && (
                <div className={global.error}>{formik.errors.password}</div>
            )}
            <button type="submit" disabled={isLoading} className={global.submitButton} aria-label={isLoading ? 'Loading' : 'Login'}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {errorFromDataBase && <div className={global.error}>{errorFromDataBase}</div>}
            <div className={global.link}>
                <button type="button" onClick={handleRegisterIsOpen} aria-label="Don't have an account? Sign up">Don&apos;t have an account? Sign up</button>
            </div>
            <div className={global.link}>
                <button type="button" onClick={handleForgetPassword} aria-label="Forgot your password? Don't worry, click here">
                    Forgot your password? Don&apos;t worry, click here
                </button>
            </div>
        </form>
    );
};

LoginComponent.displayName = "LoginComponent";

export default SubComponentSide(LoginComponent);
