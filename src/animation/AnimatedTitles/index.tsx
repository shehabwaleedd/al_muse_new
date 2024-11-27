'use client'
import React, { useRef } from 'react';
import { useInView, motion, useScroll, useTransform, } from 'framer-motion';
import styles from "./style.module.scss"
import { slideUp } from '../../components/navbar/anim';

const AnimatedTitles = ({ phrase }: { phrase: string }) => {
    const description = useRef<HTMLDivElement | null>(null);
    const container = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(description);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "100vh"])


    return (
        <div ref={container} className={styles.description} >
            <div ref={description}>
                <motion.div style={{ y, position: "relative" }}>
                    <p>
                        {
                            phrase.split(" ").map((word, index) => (
                                <span key={index} className={styles.mask}>
                                    <motion.span
                                        variants={slideUp}
                                        initial="closed"
                                        animate={isInView ? "open" : "closed"}
                                        custom={index}
                                        key={index}>
                                        {word}
                                    </motion.span>
                                </span>
                            ))
                        }
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AnimatedTitles;
