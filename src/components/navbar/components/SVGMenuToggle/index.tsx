import React from 'react'
import styles from "./style.module.scss"

const SVGMenuToggle = ({ isOpen }: { isOpen: boolean }) => {
    return (
        <svg className={`${styles.menu} ${isOpen ? styles.open : ''}`}  viewBox="0 0 100 100" width="20">
            <line className={styles.line} x1="20" y1="30" x2="80" y2="30" />
            <line className={styles.line} x1="20" y1="50" x2="80" y2="50" />
            <line className={styles.line} x1="20" y1="70" x2="80" y2="70" />
        </svg>
    );
};

export default SVGMenuToggle