'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import global from "@/app/page.module.scss";
import SubComponentSide from '@/common/SubComponentSide';
import { toast } from 'sonner';
import { useSubComponents } from '@/context/SubComponentsContext';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [emailForReset, setEmailForReset] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorFromDataBase, setErrorFromDataBase] = useState<string>('');
    const { setIsLoginOpen, setIsForgetPasswordOpen } = useSubComponents();

    const getValidationSchema = () => {
        switch (step) {
            case 1:
                return yup.object().shape({
                    email: yup.string().email("Invalid email format").required("Email is required"),
                });
            case 2:
                return yup.object().shape({
                    code: yup.string().required("Code is required").length(4, "Code must be 4 characters"),
                });
            case 3:
                return yup.object().shape({
                    newPassword: yup.string()
                        .required("Password is required")
                        .min(8, "Password must be at least 8 characters")
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                        ),
                    confirmNewPassword: yup.string()
                        .oneOf([yup.ref('newPassword')], "Passwords must match")
                        .required("Confirm password is required"),
                });
            default:
                return yup.object().shape({});
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            code: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: getValidationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorFromDataBase('');

            try {
                switch (step) {
                    case 1:
                        await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/user/sendCode`, {
                            email: values.email
                        });
                        setEmailForReset(values.email);
                        setStep(2);
                        toast.success('Verification code sent successfully.');
                        break;

                    case 2:
                        const codeResponse = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/user/checkCode`, {
                            email: emailForReset,
                            code: values.code,
                        });

                        if (codeResponse.data.message === 'success' && codeResponse.data.data === 'correct code') {
                            setVerificationCode(values.code);
                            setStep(3);
                            toast.success('Verification code is correct.');
                        } else {
                            throw new Error('Invalid verification code');
                        }
                        break;

                    case 3:
                        await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/forgetPassword`, {
                            email: emailForReset,
                            newPassword: values.newPassword,
                            code: verificationCode,
                        });
                        toast.success('Password reset successful!');
                        setIsForgetPasswordOpen(false);
                        setIsLoginOpen(true);
                        break;
                }
            } catch (error: any) {
                setErrorFromDataBase(error.response?.data?.err || "An unexpected error occurred");
                toast.error(error.response?.data?.err || "An unexpected error occurred");
            } finally {
                setIsLoading(false);
            }
        },
    });

    const renderFormContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className={global.group}>
                        <div className={global.column}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                required
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <>
                        <div className={global.group}>
                            <div className={global.column}>
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="Enter 4-digit verification code"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.code}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            className={global.submitButton}

                            onClick={() => setStep(1)}
                            aria-label="Change Email"
                        >
                            Change Email
                        </button>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className={global.group}>
                            <div className={global.column}>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.newPassword}
                                    required
                                />
                            </div>
                        </div>
                        <div className={global.group}>
                            <div className={global.column}>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    placeholder="Confirm New Password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmNewPassword}
                                    required
                                />
                            </div>
                        </div>
                    </>
                );
        }
    };

    const getButtonText = () => {
        if (isLoading) {
            switch (step) {
                case 1: return 'Sending Code...';
                case 2: return 'Verifying...';
                case 3: return 'Resetting...';
            }
        }
        switch (step) {
            case 1: return 'Send Verification Code';
            case 2: return 'Verify Code';
            case 3: return 'Reset Password';
            default: return '';
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Reset Your Password</h2>
            {renderFormContent()}
            {formik.errors[Object.keys(formik.errors)[0] as keyof typeof formik.errors] &&
                formik.touched[Object.keys(formik.touched)[0] as keyof typeof formik.touched] && (
                    <div className={global.error}>
                        {String(formik.errors[Object.keys(formik.errors)[0] as keyof typeof formik.errors])}
                    </div>
                )}
            <button
                type="submit"
                disabled={isLoading}
                className={global.submitButton}
                aria-label={getButtonText()}
            >
                {getButtonText()}
            </button>
            {errorFromDataBase && <div className={global.error}>{errorFromDataBase}</div>}
            <div className={global.link}>
                <button
                    type="button"
                    onClick={() => {
                        setIsForgetPasswordOpen(false);
                        setIsLoginOpen(true);
                    }}
                    aria-label="Back to Login"
                >
                    Back to Login
                </button>
            </div>
        </form>
    );
};

ForgotPassword.displayName = "ForgotPassword";

export default SubComponentSide(ForgotPassword);