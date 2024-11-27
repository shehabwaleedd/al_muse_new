import React, { memo } from 'react';
import styles from './style.module.scss';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = memo(({ value, onChange }) => (
    <input
        type="text"
        className={styles.searchInput}
        placeholder="Search events..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search events"
    />
));

SearchInput.displayName = 'SearchInput';