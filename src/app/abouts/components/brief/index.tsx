import React from 'react';
import styles from './style.module.scss';

const Brief = () => {
    return (
        <section className={styles.desc}>
            <div className={styles.desc_about}>
                <h2>Our Story</h2>
                <div>
                    <p>Founded in 2023 by Asma Sami and Nihal Sami, Almuse is a wellness community in Dubai dedicated to women’s health, personal development, and career growth. Supported by in5 Dubai, we aim to enhance skills in web development and graphic design, essential for personal branding and entrepreneurship.</p>
                    <p>Our programs empower women through wellness and career advancement, leveraging digital technology and creative design. We believe in the transformative power of web development and graphic design for innovation and professional growth.</p>
                    <p>At Almuse, we integrate health, career advancement, and digital literacy, providing a toolkit for our community to thrive in all aspects of life in the digital age.</p>
                </div>
            </div>
        </section>
    );
};

export default Brief;
