import React from 'react';
import { useField, useFormikContext } from 'formik';
import styles from '../../page.module.scss';
const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        const hour = i % 12 || 12; // Convert 0, 12, 24 to 12
        const amPm = i < 12 ? 'AM' : 'PM';
        options.push(`${hour.toString().padStart(2, '0')}:00 ${amPm}`);
    }
    return options;
};

const TimeSelectInput = ({ label, name } : { label: string; name: string }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const timeOptions = generateTimeOptions();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFieldValue(name, e.target.value);
    };

    return (
        <div className={styles.createEvent__container_content}>
            {label && <label htmlFor={name}>{label}</label>}
            <select
                {...field}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}
                id={name}
            >
                <option value="">Select Time</option>
                {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                        {time}
                    </option>
                ))}
            </select>
            {meta.touched && meta.error ? (
                <div className={styles.error}>{meta.error}</div>
            ) : null}
        </div>
    );
};

export default TimeSelectInput;
