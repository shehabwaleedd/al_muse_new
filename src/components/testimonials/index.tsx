'use client'
import React, { useRef, useState } from 'react';

import styles from './style.module.scss';
import { GoArrowRight } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";
import Magnetic from '../../animation/Magnetic';
import { usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper';
import useWindowWidth from '../../hooks/useWindowWidth';
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
import Image from 'next/image';
import { CiCirclePlus } from "react-icons/ci";
import common from "@/app/page.module.scss"
import { motion, AnimatePresence } from 'framer-motion';
import Border from '@/constant/border';



interface TestimonialsType {
    id: number;
    img: string;
    name: string;
    position: string;
    company: string;
    title?: string;
    text: string;

}

const testimonialsData: TestimonialsType[] = [
    {
        id: 1,
        img: "/assets/team/1.webp",
        name: "John Doe",
        position: "Managing Partner",
        company: "XYZ Company",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad harum iure mollitia. Amet corrupti placeat sequi deleniti quisquam quae autem ea quis doloribus sint facilis similique animi a, atque incidunt pariatur impedit quaerat illum ex minima velit, inventore saepe? Nesciunt enim quia, nam illo provident ad velit. Deserunt animi, neque vitae eius voluptate aut doloremque explicabo optio nesciunt totam quisquam et, maxime, molestiae sed quaerat.."
    },
    {
        id: 2,
        img: "/assets/team/1.webp",
        name: "John Doe",
        position: "Managing Partner",
        company: "XYZ Company",
        title: "Jane Doe, CTO, Another Company",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad harum iure mollitia. Amet corrupti placeat sequi deleniti quisquam quae autem ea quis doloribus sint facilis similique animi a, atque incidunt pariatur impedit quaerat illum ex minima velit, inventore saepe? Nesciunt enim quia, nam illo provident ad velit. Deserunt animi, neque vitae eius voluptate aut doloremque explicabo optio nesciunt totam quisquam et, maxime, molestiae sed quaerat."
    },
    {
        id: 3,
        img: "/assets/team/1.webp",
        name: "John Doe",
        position: "Managing Partner",
        company: "XYZ Company",
        title: "Jim Beam, Founder, Startup XYZ",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad harum iure mollitia. Amet corrupti placeat sequi deleniti quisquam quae autem ea quis doloribus sint facilis similique animi a, atque incidunt pariatur impedit quaerat illum ex minima velit, inventore saepe? Nesciunt enim quia, nam illo provident ad velit. Deserunt animi, neque vitae eius voluptate aut doloremque explicabo optio nesciunt totam quisquam et, maxime, molestiae sed quaerat."
    },

    {
        id: 1,
        img: "/assets/team/1.webp",
        name: "John Doe",
        position: "Managing Partner",
        company: "XYZ Company",
        title: "John Doe, CEO, Company Name",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad harum iure mollitia. Amet corrupti placeat sequi deleniti quisquam quae autem ea quis doloribus sint facilis similique animi a, atque incidunt pariatur impedit quaerat illum ex minima velit, inventore saepe? Nesciunt enim quia, nam illo provident ad velit. Deserunt animi, neque vitae eius voluptate aut doloremque explicabo optio nesciunt totam quisquam et, maxime, molestiae sed quaerat.."
    },
    {
        id: 2,
        img: "/assets/team/1.webp",
        name: "John Doe",
        position: "Managing Partner",
        company: "XYZ Company",
        title: "Jane Doe, CTO, Another Company",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad harum iure mollitia. Amet corrupti placeat sequi deleniti quisquam quae autem ea quis doloribus sint facilis similique animi a, atque incidunt pariatur impedit quaerat illum ex minima velit, inventore saepe? Nesciunt enim quia, nam illo provident ad velit. Deserunt animi, neque vitae eius voluptate aut doloremque explicabo optio nesciunt totam quisquam et, maxime, molestiae sed quaerat."
    },
    {
        id: 3,
        img: "/assets/team/1.webp",
        name: "John Doe",
        position: "Managing Partner",
        company: "XYZ Company",
        title: "Jim Beam, Founder, Startup XYZ",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad harum iure mollitia. Amet corrupti placeat sequi deleniti quisquam quae autem ea quis doloribus sint facilis similique animi a, atque incidunt pariatur impedit quaerat illum ex minima velit, inventore saepe? Nesciunt enim quia, nam illo provident ad velit. Deserunt animi, neque vitae eius voluptate aut doloremque explicabo optio nesciunt totam quisquam et, maxime, molestiae sed quaerat."
    },

];

const Testimonials = ({ background, svgColor }: { background: string, svgColor: string }) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const container = useRef(null);
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const { isMobile, isTablet, isDesktop } = useWindowWidth(); 
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialsType | null>(null);

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const handleNextSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handlePrevSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleDetailsOpen = (testimonial: TestimonialsType) => {
        setSelectedTestimonial(testimonial); 
        setDetailsOpen(true); 
    };

    const handleDetailsClose = () => {
        setDetailsOpen(false); 
    };



    return (
        <div className={styles.testimonialsSection} style={{ backgroundColor: background }}>
            <section className={styles.testimonial__upperSection}>
                <h3> What others are saying about Almuse </h3>
            </section>
            <Border width='90%' svgColor={svgColor} background='#a7a7a7'/>
            <div className={styles.testimonials_btns}>
                <Magnetic>
                    <button ref={prevRef} onClick={handlePrevSlide} aria-label="Previous testimonial"><GoArrowLeft /></button>
                </Magnetic>
                <Magnetic>
                    <button ref={nextRef} onClick={handleNextSlide} aria-label="Next testimonial"><GoArrowRight /></button>
                </Magnetic>
            </div>
            <motion.section className={styles.testimonials} ref={container}>
                <Swiper
                    onSwiper={(swiper) => { swiperRef.current = swiper }}
                    spaceBetween={isMobile ? 20 : 50}
                    slidesPerView={
                        isMobile ? 1 : isTablet ? 2 : isDesktop ? 4 : 3
                    }
                    navigation={
                        {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev"
                        }
                    }
                    className={styles.testimonials__slide}
                >
                    {testimonialsData.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.testimonials__slide_container}>
                                <div className={styles.testimonials__slide_container_upper}>
                                    <Image src={testimonial.img} alt="testimonial" width={200} height={200} />

                                </div>
                                <div className={styles.testimonials__slide_container_lower}>
                                    <p>&quot;{testimonial.text.slice(0, 150)}...&quot;</p>
                                    <div className={styles.testimonials__slide_container_middle}>
                                        <CiCirclePlus />
                                        <button onClick={() => handleDetailsOpen(testimonial)} className={styles.testimonials__slide_container_middle_readMore} aria-label='Read More Details'>
                                            Read More
                                        </button>
                                    </div>
                                    <div className={styles.testimonials__slide_container_upper_text}>
                                        <h4>{testimonial.name}</h4>
                                        <h4>{testimonial.position}</h4>
                                        <h4>{testimonial.company}</h4>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {isHomePage && <div className={styles.spacer} style={{ height: "10vh" }}></div>}
            </motion.section>
            <AnimatePresence mode='wait'>
                {detailsOpen && selectedTestimonial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${styles.testimonialsDetailsModal} ${isMobile ? common.bottomGlass : common.centeredGlass}`}
                        onClick={handleDetailsClose}>
                        <div className={styles.testimonialsDetailsContent}>
                            <div className={styles.close}> <button onClick={handleDetailsClose}>Close</button> </div>
                            <Image src={selectedTestimonial.img} alt="testimonial" width={200} height={200} />
                            <p>&quot;{selectedTestimonial.text}&quot;</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Testimonials;
