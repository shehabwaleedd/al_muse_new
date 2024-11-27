import React from 'react';
import { useField } from 'formik';
import styles from '../../page.module.scss';
const Textarea = ({ label, ...props } : { label: string, name: string, id: string }) => {
    const [field, meta] = useField(props);
    return (
        <div className={styles.createEvent__container_content}>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea {...field} {...props}></textarea>
            {meta.touched && meta.error ? (
                <div className={styles.error}>{meta.error}</div>
            ) : null}
        </div>
    );
};

export default Textarea;