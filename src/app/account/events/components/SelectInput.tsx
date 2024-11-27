import React from 'react';
import { useField } from 'formik';
import styles from '../../page.module.scss';
interface SelectInputProps {
    label: string,
    options: string[],
    placeholder: string,
    name: string,
    id: string
}


const SelectInput = ({ label, options, placeholder, ...props }: SelectInputProps) => {
    const [field, meta] = useField(props);
    return (
        <div className={styles.createEvent__container_content}>
            <label htmlFor={props.id || props.name}>{label}</label>
            <select {...field} {...props}>
                <option value="">{placeholder}</option> 
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {meta.touched && meta.error ? (
                <div className={styles.error}>{meta.error}</div>
            ) : null}
        </div>
    );
};

export default SelectInput;