'use client';

import React from 'react';
import styles from './style.module.scss';
import Link from 'next/link';

const CTAButton = ({ href, text, backgroundColor, textColor }: { href: string; text: string; backgroundColor: string; textColor: string }) => {
    return <Link href={href} className={styles.ctaButton} style={{ backgroundColor, color: textColor }}>{text}</Link>;
};

export default CTAButton;