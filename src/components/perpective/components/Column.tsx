import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import styles from '../page.module.scss';
import Data from '../Data';
import { MotionValue } from 'framer-motion';

interface ColumnProps {
    data: typeof Data;
    transform: MotionValue<number>;
}

const Column: React.FC<ColumnProps> = ({ data, transform }) => {
    return (
        <LazyMotion features={domAnimation}>
            <m.div className={styles.column} style={{ y: transform }}>
                {data.map((item, i) => (
                    <div key={i} className={styles.imageContainer}>
                        <Image
                            src={item.image}
                            alt="Snapshots of our work with our latest clients"
                            title="Snapshots of our work with our latest clients"
                            loading="lazy"
                            sizes="(max-width: 500px) 100vw, 500px, (max-width: 768px) 100vw, 500px, (max-width: 1024px) 100vw, 500px, (max-width: 1280px) 100vw, 500px, (max-width: 1536px) 100vw, 500px, 500px"
                            width={600}
                            height={1000}
                            placeholder='blur'
                            blurDataURL={item.image}
                        />
                    </div>
                ))}
            </m.div>
        </LazyMotion>
    );
};

export default Column;
