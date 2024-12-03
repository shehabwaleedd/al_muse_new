'use client'
import React from 'react'
import Image from 'next/image'
import styles from './style.module.scss'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
gsap.registerPlugin(ScrollTrigger);


const CommunityUpper = () => {

  return (
    <section className={styles.communityUpper}>
      <Image src="/assets/New/IMG_0136.webp" alt="community" fill />
      <div className={styles.communityUpper__content}>
        <Link href="/register">
          <Image src="/assets/svg/joinCommunity.svg" alt="join community" width={300} height={300} />
        </Link>
      </div>

    </section>
  )
}

export default CommunityUpper
