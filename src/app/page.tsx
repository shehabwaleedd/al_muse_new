import Landing from "../components/landing";
import styles from "./page.module.scss";
import DynamicTextAnimation from '@/animation/textOpacity';

import Testimonials from "@/components/testimonials";
import Boxes from "@/components/boxes";
import Upcoming from "@/components/upcoming";
import Journey from "@/components/journey";
import TextSlidingParallax from "@/animation/textParallax";
import SlidingParallax from "@/animation/slidingParallax";
import SocialMediaBanner from "@/components/socialMediaBanner";


const slides = [
  {
    image: '/images/0.webp',
    direction: 'left' as const,
    offset: '-40%',
    text: 'Community Wellness'
  },
  {
    image: '/images/1.webp',
    direction: 'right' as const,
    offset: '-5%',
    text: 'Empowering Women'
  },
  {
    image: '/images/2.webp',
    direction: 'left' as const,
    offset: '-75%',
    text: 'Leadership Development'
  }
]

const companiesData = [
  {
    texts: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook'],
    direction: 'left' as const,
    offset: '-40%'
  },
  {
    texts: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook'],
    direction: 'right' as const,
    offset: '-40%'
  },
  {
    texts: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook'],
    direction: 'left' as const,
    offset: '-40%'
  }
]


const educationData = [
  {
    id: '1',
    title: 'Computer Science',
    time: '2018-2022',
    location: 'MIT',
    comment: 'Graduated with honors',
    image: '/images/3.webp'
  },
  {
    id: '2',
    title: 'Business Administration',
    time: '2018-2022',
    location: 'Harvard',
    comment: 'Graduated with honors',
    image: '/images/4.webp'
  },
  {
    id: '3',
    title: 'Marketing',
    time: '2018-2022',
    location: 'Stanford',
    comment: 'Graduated with honors',
    image: '/images/5.webp'
  },
  {
    id: '4',
    title: 'Leadership',
    time: '2018-2022',
    location: 'Oxford',
    comment: 'Graduated with honors',
    image: '/images/6.webp'
  },
  {
    id: '5',
    title: 'Leadership',
    time: '2018-2022',
    location: 'Oxford',
    comment: 'Graduated with honors',
    image: '/images/6.webp'
  }


];

export default async function Home() {
  // const events = await getEvents();

  return (
    <main className={styles.main}>
      <SocialMediaBanner />
      <Landing />
      <Boxes />
      <Upcoming />
      <DynamicTextAnimation phrase="Your Event is a reflection of your brand. We help you create an experience that resonates with your audience." backgroundColor='#FFBBE4' color='#555' backgroundImage='/9.svg' />
      <SlidingParallax slides={slides} />
      <Journey items={educationData} title="Journey" primaryColor="#ffaadd" secondaryColor="#7d0986" type="experience" eyebrow="About Our" />
      {/* <RevealAnimation 
        phrase="Your Event is a reflection of your brand. We help you create an experience that resonates with your audience." 
        color='#555' 
        backgroundColor='#FFBBE4' 
        backgroundImage='/9.png'
      >
        <EventsClient events={events.slice(0, 5)} />
      </RevealAnimation> */}

      <TextSlidingParallax slides={companiesData} />
      <DynamicTextAnimation
        phrase="Empower women with knowledge, skills, and connections to make a difference."
        backgroundColor='var(--light-accent-color-two)'
        color='#777'
        backgroundImage='/7.png'
      />
      <Testimonials
        background="var(--background-color)"
        svgColor='var(--second-accent-color)'
      />
    </main>
  );
}