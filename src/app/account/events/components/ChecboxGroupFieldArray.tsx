import React from 'react';
import styles from '../unified.module.scss';
import { CheckboxGroupFieldArrayProps } from '@/types/common';

const CheckboxGroupFieldArray: React.FC<CheckboxGroupFieldArrayProps> = ({ name, options, setFieldValue, values }) => {

    const handleChange = (optionValue: string) => {
        const newValues = values.includes(optionValue)
            ? values.filter((value) => value !== optionValue)
            : [...values, optionValue];
        setFieldValue(name, newValues);
    };

    return (
        <div className={styles.checkboxField}>
            <h3>{name}</h3>
            <div className={styles.checkbox}>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`${styles.checkbox} ${values.includes(option.value) ? styles.selected : ''}`}
                        onClick={() => handleChange(option.value)}>
                        <label>
                            {option.label}
                        </label>
                        <input
                            type="checkbox"
                            name={name}
                            value={option.value}
                            checked={values.includes(option.value)}
                            onChange={() => handleChange(option.value)}
                            style={{ display: "none" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckboxGroupFieldArray;