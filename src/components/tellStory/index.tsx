// components/TellUsYourStory.tsx
'use client';
import React from 'react';
import { FormikHelpers, Formik, Form } from 'formik';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser';
import { useSubComponents } from '@/context/SubComponentsContext';
import global from "@/app/page.module.scss";
import SubComponentSide from '@/common/SubComponentSide';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    age: Yup.number().positive().integer().required('Age is required'),
    message: Yup.string().required('Message is required').min(25, 'Message is too short').max(1000, 'Message is too long'),
});

type FormValuesType = {
    name: string;
    email: string;
    message: string;
    gender: string;
    age: number;
}

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const TellUsYourStory: React.FC = () => {
    const { handleTellUsYourStory } = useSubComponents();

    const initialValues: FormValuesType = {
        name: '',
        email: '',
        message: '',
        gender: '',
        age: 0,
    };

    const handleSubmit = async (values: FormValuesType, { setSubmitting, resetForm }: FormikHelpers<FormValuesType>) => {
        try {
            await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', values, 'YOUR_USER_ID');
            resetForm();
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                    <h2>Share Your Story With Us</h2>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    <select
                        id="gender"
                        name="gender"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.gender}
                    >
                        <option value="" disabled>Select Gender</option>
                        {genderOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Message"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                    />
                    <button className={global.submitButton} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

TellUsYourStory.displayName = "TellUsYourStory";

export default SubComponentSide(TellUsYourStory);
