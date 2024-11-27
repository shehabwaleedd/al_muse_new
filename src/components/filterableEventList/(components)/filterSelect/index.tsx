import React, { memo } from 'react';
import styles from './style.module.scss';

interface FilterSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = memo(({ label, value, options, onChange }) => (
    <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} >
        <option value="">{`All ${label}`}</option>
        {options.map(option => (
            <option key={option} value={option}>{option}</option>
        ))}
    </select>
));

FilterSelect.displayName = 'FilterSelect';

export default FilterSelect;