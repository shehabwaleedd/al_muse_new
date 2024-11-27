'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { teamVariants } from '@/animation/animate';
import styles from "./style.module.scss";
import { FaLinkedin } from "react-icons/fa";
import Image from 'next/image';
import global from "@/app/page.module.scss"
import { useSubComponents } from '@/context/SubComponentsContext';
const TeamOverlay = () => {

    const [selectedMember, setSelectedMember] = useState<number>(0);
    const { handleTeamOpened } = useSubComponents();
    const handleMemberClick = (index: number): void => {
        if (index !== selectedMember) {
            setSelectedMember(index);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);


    return (
        <div className={styles.overlayWrapper}>
            <motion.section className={styles.main}>
                <motion.div initial="initial" animate="animate" exit="exit" variants={teamVariants} className={styles.teamFirst}>
                    {TeamData.map((team, index) => (
                        <div key={index} className={`${styles.teamFirst__card} ${selectedMember === index ? styles.selected : ''}`} onClick={() => handleMemberClick(index)}>
                            <div className={styles.teamFirst__card__content}>
                                <Image src={team.image} alt={team.name} className={styles.teamFirst__card__image} width={200} height={200} style={{ opacity: selectedMember === index ? 1 : 0.8, filter: selectedMember === index ? 'none' : 'grayscale(100%)', transition: 'opacity 0.3s, filter 0.3s' }} />
                                <div className={styles.column}>
                                    <h2>{team.name}</h2>
                                    <p>{team.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
                <motion.div className={styles.teamSecond} initial="initial" animate="animate" exit="exit" variants={teamVariants}>
                    <div className={styles.secondRight}>
                        <Image
                            src={TeamData[selectedMember].image}
                            alt={TeamData[selectedMember].name}
                            className={styles.teamSecond__image}
                            width={400}
                            height={400}
                        />
                        <div className={styles.lower}>
                            <h2>{TeamData[selectedMember].name}</h2>
                            <p>{TeamData[selectedMember].role}</p>
                            <a href={TeamData[selectedMember].linkedIn} target="_blank" rel="noreferrer">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                    <div className={global.upper}style={{ right: "42vw", left: "auto", position: "fixed" }}>
                        <button onClick={handleTeamOpened} className={global.closeButton}>x</button>
                    </div>
                </motion.div>
            </motion.section>
        </div>
    );
};

export default TeamOverlay;


interface TeamMember {
    name: string;
    role: string;
    image: string;
    linkedIn: string;
}



const TeamData: TeamMember[] = [
    {
        name: "Asmaa Sami",
        role: "Founder & CEO",
        image: "/assets/team/1.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "Nihal Sami",
        role: "CTO",
        image: "/assets/team/2.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "Joseph Alphonse",
        role: "Head of operations",
        image: "/assets/team/3.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "Arryk Beerman",
        role: "Head of brand & marketing",
        image: "/assets/team/4.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "Erryk Hoffmann",
        role: "Head of design",
        image: "/assets/team/5.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "William Smith",
        role: "Advisor",
        image: "/assets/team/6.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "Jack Bauer",
        role: "Strategist",
        image: "/assets/team/7.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
    {
        name: "Will Johnson",
        role: "Head of finance",
        image: "/assets/team/8.webp",
        linkedIn: "https://www.linkedin.com/in/asmaa-sami-1b1b1b1b1/"
    },
];