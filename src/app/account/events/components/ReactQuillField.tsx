import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import  { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../unified.module.scss';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface ReactQuillFieldProps extends Omit<ReactQuillProps, 'onChange'> {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
}

const ReactQuillModules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'color': [] }, { 'background': [] }], // Color and background color options
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const ReactQuillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background'
];


const ReactQuillField: FC<ReactQuillFieldProps> = ({ label, name, value, onChange, placeholder }) => {
    const handleChange = (content: string) => {
        onChange(name, content);
    };

    return (
        <div className={styles.quill}>
            <label htmlFor={name}>{label}</label>
            <ReactQuill
                className={styles.reactQuill}
                theme="snow"
                value={value}
                onChange={handleChange}
                placeholder={placeholder || ''}
                modules={ReactQuillModules}
                formats={ReactQuillFormats}
                style={{ border: "none", marginBottom: "5rem" }}
            />
        </div>
    );
};

export default ReactQuillField;
