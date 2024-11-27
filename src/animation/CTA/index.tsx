import React from 'react'
import styles from './style.module.scss';
import { GoArrowRight } from "react-icons/go";
import { TransitionLink } from '../../components/transitionLink';

const CTA = ({ label, href, backgroundColor, buttonTextColor }: { label: string; href: string; backgroundColor?: string, buttonTextColor?: string }) => {

  return (
    <div className={styles.ctaButton} style={{ overflow: "hidden", backgroundColor: backgroundColor ?? "var(--second-accent-color)", color: buttonTextColor ?? "var(--title-color)" }}>
      <TransitionLink href={`${href}`} label={label} color={buttonTextColor} />
      <GoArrowRight style={{ color: buttonTextColor }} />
    </div>
  )
}


export default CTA