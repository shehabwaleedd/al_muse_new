import React from 'react'
import styles from "./page.module.scss"
import Team from './components/team'
import AboutUpper from "./components/aboutUpper"
import Image from 'next/image'
import { logos } from "../../components/logos"
import Data from './Data'
export function generateMetadata() {
    return {
        title: 'About F365 Movement',
        description: 'We are a creative agency in Dubai with a focus on wellness and community. We are not just developing solutions; we are designing a healthier, more connected world.',
        url: 'https://f365-global.com/about',
        type: 'website',
        siteName: 'F365',
        author: "Cairo Studio",
        
        keywords: [
            "F365",
            "F365 Global",
            "F365 Dubai",
            "F365 Community",
            "F365 Wellness",
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
            title: 'About F365 Movement',
            description: 'We are a creative agency in Dubai with a focus on wellness and community. We are not just developing solutions; we are designing a healthier, more connected world.',
            images: '/assets/backgrounds/1.webp',
            url: 'https://f365-global.com/about',
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
            <section className={styles.about__upper}>
                <div className={styles.about__upper_mainVideo}>
                    <video src="/mainVideo.mp4" loop autoPlay muted playsInline security='restricted' preload="metadata" />
                    <div className={styles.hero_text}>
                        <h1> A Creative Agency In Dubai With <br /> A Focus On Wellness & Community. </h1>
                    </div>
                </div>
            </section>
            <section className={styles.about__desc}>
                <h2>High Performance</h2>
                <div className={styles.about__desc_content}>
                    {Data.map((item, index) => {
                        return (
                            <div className={styles.about__desc_content_item} key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.about__desc_about}>
                    <h2>About Us</h2>
                    <div>
                        <p>Founded in 2023 by Asma Sami and Nihal Sami, F365 is a trailblazing wellness community in Dubai, dedicated to supporting women&apos;s health, personal development, and career progression. Incubated by in5 Dubai, our mission extends to nurturing skills in web development and graphic design, essential tools in today&apos;s digital world for personal branding and entrepreneurship.</p>
                        <p>Our programs are meticulously designed to empower women not only in wellness and careers but also in harnessing the power of digital technology and creative design. We believe in the transformative potential of web development and graphic design as platforms for innovation, expression, and professional growth.</p>
                        <p>At F365, empowerment is woven through every program and initiative, from health to career advancement to digital literacy. By integrating web development and graphic design, we provide a comprehensive toolkit for our community to thrive in all dimensions of life, ensuring they&apos;re well-equipped for the challenges of the digital era.</p>
                    </div>
                </div>
            </section>
            <Team />
            <section className={styles.about__clients}>
                <h2>Our Clients</h2>
                <div className={styles.about__clients_container}>
                    {logos.map((item, index) => {
                        return (
                            <div className={styles.about__clients_container_item} key={index}>
                                <Image src={item.img} alt="" width={300} height={300} />
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}

export default About