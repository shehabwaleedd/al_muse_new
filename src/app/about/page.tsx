import React from 'react'
import styles from "./page.module.scss"
import AboutUpper from "./components/aboutUpper"
import Vision from './components/vision'
import Border from '@/constant/border'
import Brief from './components/brief'
import Join from './components/join'
import DynamicTextAnimation from "@/animation/textOpacity";
import RevealAnimation from '@/animation/revealAnimation'
import GridUpperDynamicAnimation from './components/dynamicUpperGridAnimation'
import SecondReveal from './components/secondReveal'
import UpperBrief from './components/upperBrief'

export function generateMetadata() {
    return {
        title: 'About Almuse Movement',
        description: 'We are a creative agency in Dubai with a focus on wellness and community. We are not just developing solutions; we are designing a healthier, more connected world.',
        url: 'https://almuse-global.com/about',
        type: 'website',
        siteName: 'Almuse',
        author: "Cairo Studio",

        keywords: [
            "Almuse",
            "Almuse Global",
            "Almuse Dubai",
            "Almuse Community",
            "Almuse Wellness",
            "Web Development",
            "Web Design",
            "SEO",
            "Digital Marketing",
            "Graphic Design",
            "Social Media Marketing",
            "Content Creation",
            "Content Marketing",
            "Wellness",
        ],
        openGraph: {
            title: 'About Almuse Movement',
            description: 'We are a creative agency in Dubai with a focus on wellness and community. We are not just developing solutions; we are designing a healthier, more connected world.',
            images: '/assets/backgrounds/1.webp',
            url: 'https://Almuse-global.com/about',
            type: 'website',
        },
        robots: "index, follow",
        language: "en",
        favicon: {
            ico: "/favicon.ico",
            webp: "/favicon.webp",
            png: "/favicon.png",
        },
    }
}

const About = () => {
    return (
        <main className={styles.about}>
            <AboutUpper />
            {/* <DynamicTextAnimation phrase="Almuse bridges wellness empowerment and digital innovation for brands." backgroundColor="var(--light-accent-color-one)" color='var(--darker-background-two)' /> */}
            <DynamicTextAnimation phrase="Almuse bridges wellness empowerment and digital innovation for brands." backgroundColor="var(--light-accent-color-one)" color='#555' />
            <SecondReveal phrase="To be the leading wellness community in Dubai, soon in the world" backgroundColor='var(--darker-background-two)' color='#555'>
                <Vision />
            </SecondReveal>
            {/* <SecondReveal phrase="To be the leading wellness community in Dubai, soon in the world" backgroundColor='var(--darker-background-two)' color='#efccd6'>
                <Vision />
            </SecondReveal> */}
            <UpperBrief />
            <Border background='var(--darker-background-three)' width='70%' />
            <Brief />
            <Border background='var(--light-accent-color-one)' width='70%' />
        </main>
    )
}

export default About