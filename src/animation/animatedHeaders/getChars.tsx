'use client'
import React from 'react';
import { translate } from "../../components/navbar/anim";
import { motion } from "framer-motion"
import styles from "./style.module.scss"

const getChars = (word: string) => {
    return word.split("").map((char, i) => (
        <div className={`${styles.getChars} letter`} key={char + i}>
            <motion.span
                custom={[i * 0.02, (word.length - i) * 0.01]}
                variants={translate}
                initial="initial"
                animate="enter"
                exit="exit">
                {char === " " ? "\u00A0" : char}
            </motion.span>
        </div>
    ));
};

export default getChars;