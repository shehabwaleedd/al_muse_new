import React from 'react'
import styles from './style.module.scss';

const HeaderSkeleton = () => {
    return (
        <article className={styles['skeleton-card-tour-header']}>
        <div className={styles['skeleton-card-img-headerr']}>
            <div className={`${styles['skeleton-title']} ${styles.skeleton}`}></div>
            <div className={styles.spacer}></div>
            <div className={styles['skeleton-group']}>
                <div className={styles.column}>
                    {[...new Array(3)].map((p, index) => {
                        return (
                            <div key={index} className={styles['skeleton-icon_title']}>
                                <div className={`${styles['skeleton-icon']} ${styles.skeleton}`}></div>
                                <div className={styles.column}>
                                    <div className={`${styles['skeleton-title_icon']} ${styles.skeleton}`}></div>
                                    <div className={`${styles['skeleton-title_icon']} ${styles.skeleton}`}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.right}>
                    <div className={`${styles['skeleton-title-right']} ${styles.skeleton}`}></div>
                    <div className={`${styles['skeleton-title_icon']} ${styles.skeleton}`}></div>
                    <div className={`${styles['skeleton-title_icon']} ${styles.skeleton}`}></div>
                    <div className={`${styles.button} ${styles.skeleton}`}></div>
                </div>
            </div>
        </div>
    </article>
    )
}

export default HeaderSkeleton;
