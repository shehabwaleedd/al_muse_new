import React from 'react'
import styles from "./style.module.scss"

type DynamicGridUpperProps = {
    phrase: string;
    phrase2?: string;
    backgroundColor?: string;
    color?: string;

};


const GridUpperDynamicAnimation = ({ phrase, backgroundColor, color, phrase2 }: DynamicGridUpperProps) => {

    return (
        <section className={styles.visionUpper} style={{ backgroundColor: backgroundColor ?? "var(--cream-color)", color: color ?? "var(--title-color)" }}>
            <h3> {phrase2 ?? "Our Vision"} </h3>
            <p style={{ color: color ?? "var(--title-color)" }}>{phrase}</p>
        </section >
    )
}

export default GridUpperDynamicAnimation