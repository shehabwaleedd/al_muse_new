import { MotionValue } from 'framer-motion';


export interface StarIconProps {
    reference: React.RefObject<HTMLLIElement>;
    primaryColor?: string;
    secondaryColor?: string;
    progress: MotionValue<number>;
}
