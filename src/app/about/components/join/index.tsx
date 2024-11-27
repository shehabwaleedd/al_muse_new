import React from 'react'
import styles from "./style.module.scss"
import CTA from '@/animation/CTA'
import { TransitionEventLink } from '@/components/transitionLink'

const Join = () => {
    return (
        <section className={styles.join}>
            <h3>
                We&apos;d love to have you with us.
            </h3>
            <TransitionEventLink href="/contact" label="Join Us" />
        </section>
    )
}

export default Join