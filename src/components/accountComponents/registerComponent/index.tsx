'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useSubComponents } from '@/context/SubComponentsContext';
import { CountryDropdown } from 'react-country-region-selector';
import global from "@/app/page.module.scss";
import SubComponentSide from '@/common/SubComponentSide';
import styles from './styles.module.scss';


interface ErrorResponse {
    err: string;
    message?: string;
}

const RegisterComponent: React.FC = () => {
    const [errorFromDataBase, setErrorFromDataBase] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setUser } = useAuth();
    const { handleLoginSuccessForm, setIsRegisterOpen, setIsLoginOpen } = useSubComponents();

    const validationSchema = yup.object().shape({
        email: yup.string()
            .email("Invalid email format")
            .required("Email is required")
            .max(255, "Email is too long"),
        password: yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[0-9]/, "Password must contain at least one number"),
        name: yup.string()
            .required("Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name is too long"),
        rePassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required'),
        nationality: yup.string().required("Nationality is required"),
        gender: yup.string().required("Gender is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
            rePassword: '',
            nationality: '',
            gender: '',
        },
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            const url = `https://events-nsih.onrender.com/user/register`;
            const dataToSend = values;

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false
            };

            try {
                const response = await axios.post(url, dataToSend, config);
                if (response.data.message === 'success') {
                    setUser(response.data.data);
                    handleLoginSuccessForm(response.data.token, response.data.data);
                    setIsRegisterOpen(false);
                } else {
                    setErrorFromDataBase(response.data.err || 'An unexpected error occurred.');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        const errorData = error.response.data as ErrorResponse;
                        setErrorFromDataBase(errorData.err || "Server error occurred.");
                    } else if (error.request) {
                        setErrorFromDataBase("No response from server. Please try again later.");
                    } else {
                        setErrorFromDataBase("An error occurred while sending the request.");
                    }
                    console.error('Registration error:', error.message);
                } else {
                    // Handle non-Axios errors
                    setErrorFromDataBase("An unexpected error occurred.");
                    console.error('Non-Axios error:', error);
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    const DisplayError = ({ fieldName }: { fieldName: string }) => {
        return formik.touched[fieldName as keyof typeof formik.touched] &&
            formik.errors[fieldName as keyof typeof formik.errors] ? (
            <div className={global.error}>
                {formik.errors[fieldName as keyof typeof formik.errors]}
            </div>
        ) : null;
    };

    return (
        <form onSubmit={formik.handleSubmit} noValidate className={styles.form}>
            <h2>Let The Journey Begin</h2>
            <div className={global.group}>
                <div className={global.column}>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        placeholder="Name"
                    />
                    <DisplayError fieldName="name" />
                </div>
                <div className={global.column}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    <DisplayError fieldName="email" />
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
                <div className={global.column}>
                    <input
                        id="rePassword"
                        name="rePassword"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.rePassword}
                        placeholder="Confirm Password"
                    />
                </div>
            </div>
            <div className={global.group}>
                <div className={global.column}>
                    <CountryDropdown
                        value={formik.values.nationality}
                        onChange={val => formik.setFieldValue('nationality', val)}
                        onBlur={() => formik.setFieldTouched('nationality', true)}
                    />
                    <DisplayError fieldName="nationality" />
                </div>
                <div className={global.column}>
                    <select
                        id="gender"
                        name="gender"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <DisplayError fieldName="gender" />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading || !formik.isValid || !formik.dirty}
                className={global.submitButton}
                aria-label={isLoading ? 'Loading' : 'Register'}
            >
                {isLoading ? 'Registering...' : 'Register'}
            </button>
            {errorFromDataBase && <div className={global.error}>{errorFromDataBase}</div>}
            <div className={global.link}>
                <button type="button" onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true) }} aria-label="Already have an account? Login">Already have an account? Login</button>
            </div>
        </form>
    );
};

RegisterComponent.displayName = "RegisterComponent";

export default SubComponentSide(RegisterComponent);
