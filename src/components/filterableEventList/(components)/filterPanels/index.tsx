import React, { memo } from 'react';
import styles from './style.module.scss';
import { FilterState } from '@/types/common';
import { useUniqueValues } from '@/hooks/useUniqueValues';
import { SearchInput } from '../searchInput';
import { FilterSelect } from '../filterSelect';

interface FiltersPanelProps {
    filters: FilterState;
    uniqueValues: ReturnType<typeof useUniqueValues>;
    onFilterChange: (key: keyof FilterState, value: string) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = memo(({ filters, uniqueValues, onFilterChange }) => (
    <section className={styles.filters}>
        <div className={styles.search}>
            <SearchInput
                value={filters.search}
                onChange={(value) => onFilterChange('search', value)}
            />
        </div>
        <div className={styles.filter}>
            <FilterSelect
                label="Country"
                value={filters.country}
                options={uniqueValues.countries.filter(Boolean) as string[]}
                onChange={(value) => onFilterChange('country', value)}
            />
            <FilterSelect
                label="Cities"
                value={filters.city}
                options={uniqueValues.cities.filter(Boolean) as string[]}
                onChange={(value) => onFilterChange('city', value)}
            />
            <FilterSelect
                label="Categories"
                value={filters.category}
                options={uniqueValues.categories.filter(Boolean) as string[]}
                onChange={(value) => onFilterChange('category', value)}
            />
            <FilterSelect
                label="Types"
                value={filters.type}
                options={uniqueValues.types.filter(Boolean) as string[]}
                onChange={(value) => onFilterChange('type', value)}
            />



            <FilterSelect
                label="Date"
                value={filters.date}
                options={uniqueValues.dates.filter(Boolean) as string[]}
                onChange={(value) => onFilterChange('date', value)}
            />
            <FilterSelect
                label="Time"
                value={filters.time}
                options={uniqueValues.times.filter(Boolean) as string[]}
                onChange={(value) => onFilterChange('time', value)}
            />
        </div>
    </section>
));

FiltersPanel.displayName = 'FiltersPanel';
