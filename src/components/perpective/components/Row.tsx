import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import styles from '../page.module.scss';
import Data from '../Data';

interface RowProps {
    data: typeof Data;
    transform: any; 
    top: string;
}

const Row: React.FC<RowProps> = ({ data, transform, top }) => {
    return (
        <LazyMotion features={domAnimation}>
            <m.div className={styles.row} style={{ top }}>
                {data.map((item, i) => (
                    <m.div key={i} className={styles.imageContainer} style={{ x: transform }}>
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
                    </m.div>
                ))}
            </m.div>
        </LazyMotion>
    );
};

export default Row;
