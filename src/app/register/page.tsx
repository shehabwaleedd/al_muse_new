'use client';

import React, { useState, ChangeEvent } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { toast } from 'sonner';
import global from "@/app/page.module.scss"
import DOMPurify from 'dompurify';

interface FormValues {
    name: string;
    email: string;
    age: string;
    password: string;
    rePassword: string;
    phone: string;
    country: string;
    region: string;
    company: string;
    position: string;
    gender: string;
}

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    age: yup
        .number()
        .positive('Age must be a positive number')
        .integer('Age must be an integer')
        .required('Age is required'),
    password: yup
        .string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Password must be at least 8 characters and include a number')
        .required('Password is required'),
    rePassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Repeat Password is required'),
    phone: yup
        .string()
        .matches(/^\d+$/, 'Phone must be a number')
        .required('Phone is required'),
    country: yup.string().required('Country is required'),
    region: yup.string().required('Region is required'),
    company: yup.string().required('Company is required'),
    position: yup.string().required('Position is required'),
    gender: yup.string().required('Gender is required'),
});

const Register: React.FC = () => {
    const [avatar, setAvatar] = useState<File | null>(null);
    const router = useRouter();

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files) {
            setAvatar(event.currentTarget.files[0]);
        }
    };

    const registerFormik = useFormik<FormValues>({
        initialValues: {
            name: '',
            email: '',
            age: '',
            password: '',
            rePassword: '',
            phone: '',
            country: '',
            region: '',
            company: '',
            position: '',
            gender: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            const formData = new FormData();
            
            Object.keys(values).forEach(key => {
                const value = values[key as keyof FormValues];
                const sanitizedValue = typeof value === 'string' 
                    ? DOMPurify.sanitize(value).trim() 
                    : value;
                formData.append(key, sanitizedValue);
            });

            if (avatar) formData.append('avatar', avatar);

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/register`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (response.status === 200 && response.data.token) {
                    toast.success('Registration successful');
                    localStorage.setItem('token', response.data.token);
                    router.push('/register/verify'); // Navigate to verify page
                }
            } catch (error: any) {
                toast.error(error.response?.data.message || 'An error occurred');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <main className={styles.container}>
            <section className={styles.center}>
                <div className={styles.container__form}>
                    <form className={styles.form} onSubmit={registerFormik.handleSubmit}>
                        <h1>Let the journey begin</h1>
                        <div className={styles.container__form__group}>
                            <input
                                type="text"
                                placeholder="Name"
                                className={styles.container__input}
                                name="name"
                                onChange={registerFormik.handleChange}
                                value={registerFormik.values.name}
                            />
                            {registerFormik.touched.name && registerFormik.errors.name && (
                                <div className={styles.register__error}>{registerFormik.errors.name}</div>
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                className={styles.container__input}
                                name="email"
                                onChange={registerFormik.handleChange}
                                value={registerFormik.values.email}
                            />
                            {registerFormik.touched.email && registerFormik.errors.email && (
                                <div className={styles.register__error}>{registerFormik.errors.email}</div>
                            )}
                        </div>
                        <div className={styles.group}>
                            <div >
                                <select
                                    name="gender"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.gender}
                                    onBlur={registerFormik.handleBlur}
                                    className={styles.container__input}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {registerFormik.touched.gender && registerFormik.errors.gender && (
                                    <div className={styles.error}>{registerFormik.errors.gender}</div>
                                )}
                            </div>
                            <div>
                                <select
                                    name="age"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.age}
                                    className={styles.container__input}
                                >
                                    <option value="">Select Age</option>
                                    {Array.from({ length: 50 }, (_, i) => i + 17).map(age => (
                                        <option key={age} value={age}>
                                            {age}
                                        </option>
                                    ))}
                                </select>
                                {registerFormik.touched.age && registerFormik.errors.age && (
                                    <div className={styles.container__error}>{registerFormik.errors.age}</div>
                                )}
                            </div>
                        </div>
                        <div className={styles.group}>
                            <div className={styles.column}>
                                <CountryDropdown
                                    value={registerFormik.values.country}
                                    onChange={val => registerFormik.setFieldValue('country', DOMPurify.sanitize(val))}
                                    priorityOptions={[
                                        'AE', 'GB', 'CA', 'AU', 'DE', 'EG', 'FR', 'ES', 'NL', 'BR', 'PT', 'MX', 'IN', 'CN', 'JP', 'RU', 'IT', 'SE', 'NO', 'DK', 'FI', 'BE', 'CH', 'AT', 'IE', 'SG', 'ZA', 'NZ', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY',
                                    ]}
                                />
                                {registerFormik.touched.country && registerFormik.errors.country && (
                                    <div className={styles.container__error}>{registerFormik.errors.country}</div>
                                )}
                            </div>
                            <div className={styles.container__form__group_column}>
                                <RegionDropdown
                                    country={registerFormik.values.country}
                                    value={registerFormik.values.region}
                                    onChange={val => registerFormik.setFieldValue('region', val)}
                                />
                                {registerFormik.touched.region && registerFormik.errors.region && (
                                    <div className={styles.container__error}>{registerFormik.errors.region}</div>
                                )}
                            </div>
                        </div>
                        <div className={styles.container__form__group__passwords}>
                            <div className={styles.container__form__group_column}>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={styles.register__input}
                                    name="password"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.password}
                                />
                                {registerFormik.touched.password && registerFormik.errors.password && (
                                    <div className={styles.register__error}>{registerFormik.errors.password}</div>
                                )}
                            </div>
                            <div className={styles.container__form__group_column}>
                                <input
                                    type="password"
                                    placeholder="Repeat Password"
                                    className={styles.container__input}
                                    name="rePassword"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.rePassword}
                                />
                                {registerFormik.touched.rePassword && registerFormik.errors.rePassword && (
                                    <div className={styles.container__error}>{registerFormik.errors.rePassword}</div>
                                )}
                            </div>

                        </div>
                        <div className={styles.container__form__group}>
                            <div className={styles.register__form__group_column}>
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    className={styles.container__input}
                                    name="phone"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.phone}
                                />
                                {registerFormik.touched.phone && registerFormik.errors.phone && (
                                    <div className={styles.container__error}>{registerFormik.errors.phone}</div>
                                )}
                            </div>
                            <div className={styles.container__form__group_column}>
                                <input
                                    type="text"
                                    placeholder="Company"
                                    className={styles.container__input}
                                    name="company"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.company}
                                />
                                {registerFormik.touched.company && registerFormik.errors.company && (
                                    <div className={styles.container__error}>{registerFormik.errors.company}</div>
                                )}
                            </div>
                            <div className={styles.container__form__group_column}>
                                <input
                                    type="text"
                                    placeholder="Position"
                                    className={styles.container__input}
                                    name="position"
                                    onChange={registerFormik.handleChange}
                                    value={registerFormik.values.position}
                                />
                                {registerFormik.touched.position && registerFormik.errors.position && (
                                    <div className={styles.container__error}>{registerFormik.errors.position}</div>
                                )}
                            </div>
                        </div>
                        <div className={styles.container__form__group}>
                            <div className={styles.container__form__group_column}>
                                <div className={styles.grouped}>
                                    <label htmlFor="avatar">Profile Picture</label>
                                    {avatar && <Image src={URL.createObjectURL(avatar)} alt="Profile Preview" height={50} width={50} />}
                                </div>
                                <input type="file" id="avatar" name="avatar" onChange={handleAvatarChange} />

                            </div>
                        </div>
                        <button type="submit" disabled={registerFormik.isSubmitting} className={global.submitButton}>
                            {registerFormik.isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                        <Link href="/login">
                            <span className={styles.container__login}>Already have an account? Login</span>
                        </Link>
                    </form>
                </div>
            </section>
            <Image src="/assets/backgrounds/3.webp" height={1000} width={1920} alt='register background' className={styles.mainImg} />
        </main>
    );
};

export default Register;
