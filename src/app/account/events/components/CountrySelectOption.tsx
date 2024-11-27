import React from 'react';
import { useField, useFormikContext } from 'formik';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import styles from '../../page.module.scss';

const CountrySelectInput = ({ name }: { name: string }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    return (
        <div className={styles.unifiedInputComponent__container_form}>
            <label htmlFor={name}>Event&apos;s Country</label>
            <CountryDropdown
                {...field}
                onChange={(val) => setFieldValue(name, val)}
                id={name}
                name={name}
                priorityOptions={[
                    'AE', 'GB', 'CA', 'AU', 'DE',
                    'EG', 'FR', 'ES', 'NL', 'BR',
                    'PT', 'MX', 'IN', 'CN', 'JP',
                    'RU', 'IT', 'SE', 'NO', 'DK',
                    'FI', 'BE', 'CH', 'AT', 'IE',
                    'SG', 'ZA', 'NZ', 'AR', 'CL',
                    'CO', 'PE', 'VE', 'EC', 'UY',
                ]}
            />
            {meta.touched && meta.error ? (
                <div className={styles.error}>{meta.error}</div>
            ) : null}
        </div>
    );
};

// RegionSelectInput component for selecting a region based on the selected country
const RegionSelectInput = ({ countryFieldName, name }: { countryFieldName: string, name: string }) => {
    const { values, setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    return (
        <div className={styles.unifiedInputComponent__container_form}>
            <label htmlFor={name}>Event&apos;s City</label>
            <RegionDropdown
                {...field}
                country={(values as Record<string, string>)[countryFieldName]}
                onChange={(val) => setFieldValue(name, val)}
                id={name}
                name={name}
            />
            {meta.touched && meta.error ? (
                <div className={styles.error}>{meta.error}</div>
            ) : null}

        </div>
    );
};

export { CountrySelectInput, RegionSelectInput };