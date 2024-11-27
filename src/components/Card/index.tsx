'use client'
import React from 'react';
import Image from 'next/image';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { IoLocationOutline } from "react-icons/io5";
import { TransitionCard } from '../transitionLink';
import { isPast } from 'date-fns';
import { CardProps } from '@/types/common';
import Link from 'next/link';

const Card = ({ i, title, description, mainImg, city, category, slug, dateOfEvent, createdBy }: CardProps) => {

  const startDate = new Date(dateOfEvent);
  const defaultImageUrl = "/noimage.png";
  const imageUrl = mainImg && mainImg.url ? mainImg.url : defaultImageUrl;
  let formattedDate = '';
  try {
    formattedDate = dateOfEvent ? format(parseISO(dateOfEvent), 'd MMMM') : '';
  } catch (error) {
    console.error('Error parsing date:', error);

    formattedDate = 'Invalid date';
  }

  return (
    <TransitionCard href={`/community/${slug}`} key={i} className={styles.cardContainer}>
      <>
        <motion.div className={styles.card} >
          <motion.div className={styles.team__container__right__content__column__item} >
            <motion.div className={styles.team__container__right__content__column__item_upper}>
              <Image src={imageUrl} alt={title ? title : "F365 Event"} width={800} height={800}
                priority={i < 3 ? true : false}
              />

              <div className={styles.team__container__right__content__column__item__overlay}>
                {isPast(startDate) ? (
                  <div className={styles.team__container__right__content__column__item__overlay__past}>
                    <span>Finished</span>
                  </div>
                ) : (
                  <div className={styles.team__container__right__content__column__item__overlay__upcoming}>
                    <span>Upcoming</span>
                  </div>
                )}
              </div>
            </motion.div>
            <div className={styles.team__container__right__content__column__item__details}>
              <div className={styles.team__container__right__content__column__item__details_content}>
                <div className={styles.locationTime}>
                  <span> <IoLocationOutline />{city},</span>
                  <span> {formattedDate}</span>
                </div>
                <h4>{title.slice(0, 35)}...</h4>
                <h5>
                  {description.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </h5>
              </div>
              <div className={styles.team__container__right__content__column__item__details_bottom}>
                <div className={styles.createdBy}>
                  <Image src={createdBy?.avatar?.url} alt="created by" width={30} height={30} />
                  <span>{createdBy?.name}</span>
                </div>
                <span>{category}</span>
              </div>
              <div className={styles.card__bottom}>
                <Link href={`/community/${slug}`}>RSVP Now</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </>
    </TransitionCard>
  )
}

export default Card