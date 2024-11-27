import React from 'react';
import { useField } from 'formik';
import styles from '../../page.module.scss';
const TextInput = ({ label, ...props } : { label: string; id: string; name: string; type?: string; placeholder: string;}) => {
    const [field, meta] = useField(props);

    return (
        <div className={styles.createEvent__container_content}>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className={styles.error}>{meta.error}</div>
            ) : null}
        </div>
    );
};

export default TextInput;