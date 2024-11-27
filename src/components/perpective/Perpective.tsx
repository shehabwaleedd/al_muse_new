'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {  useTransform, useScroll } from 'framer-motion';
import styles from './page.module.scss';
import Data from './Data';
import useWindowSize from '@/hooks/useWindowWidth';
import Row from './components/Row';
import Column from './components/Column';

interface Dimension {
    width: number;
    height: number;
}

const Gallery: React.FC = () => {
    const gallery = useRef<HTMLDivElement>(null);
    const { isTablet } = useWindowSize();
    const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });

    const { scrollYProgress } = useScroll({
        target: gallery,
        offset: ['start end', 'end start'],
    });

    const verticalTransforms = {
        transform1: useTransform(scrollYProgress, [0, 1], [0, dimension.height * 1.25]),
        transform2: useTransform(scrollYProgress, [0, 1], [0, dimension.height * 2.7]),
        transform3: useTransform(scrollYProgress, [0, 1], [0, dimension.height * 1.25]),
        transform4: useTransform(scrollYProgress, [0, 1], [0, dimension.height * 2.0]),
    };

    const horizontalTransforms = {
        transform1: useTransform(scrollYProgress, [0, 1], [0, dimension.width * -1.75]),
        transform2: useTransform(scrollYProgress, [0, 1], [0, dimension.width * -0.73]),
        transform3: useTransform(scrollYProgress, [0, 1], [0, dimension.width * -2.1]),
        transform4: useTransform(scrollYProgress, [0, 1], [0, dimension.width * -1.5]),
    };

    const resize = useCallback(() => {
        setDimension({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resize);
        resize(); // Call it once to initialize
        return () => window.removeEventListener('resize', resize);
    }, [resize]);

    return (
        <section className='perpective'>
            <div ref={gallery} className={styles.gallery}>
                {isTablet ? (
                    <>
                        <Row data={[Data[4], Data[5], Data[8], Data[6]]} transform={horizontalTransforms.transform1} top="0" />
                        <Row data={[Data[0], Data[7], Data[9], Data[3]]} transform={horizontalTransforms.transform2} top="25vh" />
                        <Row data={[Data[10], Data[9], Data[10], Data[2]]} transform={horizontalTransforms.transform3} top="50vh" />
                        <Row data={[Data[1], Data[8], Data[5], Data[4]]} transform={horizontalTransforms.transform4} top="75vh" />
                    </>
                ) : (
                    <>
                        <Column data={[Data[4], Data[5], Data[8], Data[6]]} transform={verticalTransforms.transform1} />
                        <Column data={[Data[0], Data[7], Data[9], Data[3]]} transform={verticalTransforms.transform2} />
                        <Column data={[Data[10], Data[9], Data[10], Data[2]]} transform={verticalTransforms.transform3} />
                        <Column data={[Data[1], Data[8], Data[5], Data[4]]} transform={verticalTransforms.transform4} />
                    </>
                )}
            </div>
        </section>
    );
};

export default Gallery;
