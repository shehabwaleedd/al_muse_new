import React from 'react';
import styles from './style.module.scss';
import { PaginationProps } from '@/types/common';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <nav className={styles.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pagination__button}
            >
                Previous
            </button>

            <div className={styles.pagination__numbers}>
                {getPageNumbers().map((pageNum, index) => (
                    <button
                        key={index}
                        onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                        className={`${styles.pagination__number} ${pageNum === currentPage ? styles.pagination__number_active : ''
                            }`}
                        disabled={typeof pageNum !== 'number'}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pagination__button}
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;