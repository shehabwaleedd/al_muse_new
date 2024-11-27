import Landing from "../components/landing";
import styles from "./page.module.scss";
import RevealAnimation from "@/animation/revealAnimation";
import EventsClient from "@/components/EventsHomePage/component";
import DynamicTextAnimation from '@/animation/textOpacity';
import { getEvents } from '@/lib/events/server/getDisplayedEvents';
import Testimonials from "@/components/testimonials";
import Gallery from "@/components/perpective/Perpective";

export default async function Home() {
  const events = await getEvents();

  return (
    <main className={styles.main}>
      <Landing />
      <RevealAnimation 
        phrase="Your Event is a reflection of your brand. We help you create an experience that resonates with your audience." 
        color='#555' 
        backgroundColor='#FFBBE4' 
        backgroundImage='/9.png'
      >
        <EventsClient events={events.slice(0, 5)} />
      </RevealAnimation>
      <DynamicTextAnimation 
        phrase="Empower women with knowledge, skills, and connections to make a difference." 
        backgroundColor='var(--light-accent-color-two)' 
        color='#777' 
        backgroundImage='/7.png' 
      />
      <Gallery />
      <Testimonials 
        background="var(--darker-background-three)" 
        svgColor='var(--second-accent-color)' 
      />
    </main>
  );
}