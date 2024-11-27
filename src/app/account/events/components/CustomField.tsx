import React from "react";
import { Field, useFormikContext } from "formik";
import styles from '../unified.module.scss';
import { format } from 'date-fns';
import { toast } from "sonner";

interface CustomFieldProps {
    name: string;
    label: string;
    fieldType?: "input" | "select" | "date" | "file" | "textarea";
    options?: Array<{ value: string; label: string }>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue?: (field: string, value: any) => void;
}

const CustomField: React.FC<CustomFieldProps> = ({
    name,
    label,
    fieldType = "input",
    options,
    onChange
}) => {
    const { errors, touched } = useFormikContext();


    const renderField = () => {
        switch (fieldType) {
            case "file":
                return (
                    <div className={styles.column}>
                        <label htmlFor={name}>{label}</label>
                        <input
                            id={name}
                            name={name}
                            type="file"
                            onChange={onChange}
                            accept="image/*"
                            multiple={name === "images"}
                            className={styles.fileInput}
                        />
                    </div>
                );

            case "select":
                return (
                    <div className={styles.column}>
                        <label htmlFor={name}>{label}</label>
                        <Field
                            as="select"
                            id={name}
                            name={name}
                            className={`${styles.select} ${touched[name as keyof typeof touched] && errors[name as keyof typeof errors] ? styles.error : ''}`}
                        >
                            <option value="">Select {label}</option>
                            {options?.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Field>
                    </div>
                );

            case "date":
                const today = format(new Date(), 'yyyy-MM-dd');
                return (
                    <div className={styles.column}>
                        <label htmlFor={name}>{label}</label>
                        <Field
                            as="input"
                            type="date"
                            id={name}
                            name={name}
                            min={today}
                            className={`${styles.input} ${touched[name as keyof typeof touched] && errors[name as keyof typeof errors] ? styles.error : ''}`}
                        />
                    </div>
                );

            case "textarea":
                return (
                    <div className={styles.column}>
                        <label htmlFor={name}>{label}</label>
                        <Field
                            as="textarea"
                            id={name}
                            name={name}
                            className={`${styles.textarea} ${touched[name as keyof typeof touched] && errors[name as keyof typeof errors] ? styles.error : ''}`}
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    </div>
                );

            default:
                return (
                    <div className={styles.column}>
                        <label htmlFor={name}>{label}</label>
                        <Field
                            type="text"
                            id={name}
                            name={name}
                            className={`${styles.input} ${touched[name as keyof typeof touched] && errors[name as keyof typeof errors] ? styles.error : ''}`}
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />

                    </div>
                );
        }
    };

    return renderField();
};

export default CustomField;