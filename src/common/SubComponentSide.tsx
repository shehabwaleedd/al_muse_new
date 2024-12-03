'use client';
import React from 'react';
import { motion, VariantLabels, AnimationControls, TargetAndTransition } from 'framer-motion';
import { mobileVariants } from '@/animation/animate';
import global from "@/app/page.module.scss";

interface SubComponentSideProps {
    handleClose: () => void;
    children?: React.ReactNode;
    animate?: boolean | VariantLabels | AnimationControls | TargetAndTransition;
}

const SubComponentSide = <P extends object>(Component: React.ComponentType<P>) => {
    const WrappedComponent: React.FC<P & SubComponentSideProps> = ({ handleClose, children, ...props }) => {
        return (
            <motion.section
                className={global.subComponent_container}
                initial={{ backdropFilter: 'blur(0px)' }}
                animate={{ backdropFilter: 'blur(5px)' }}
                exit={{ backdropFilter: 'blur(0px)' }}
                transition={{ duration: 1 }}
            >
                <motion.div className={global.upper} initial="initial" animate="animate" exit="exit" variants={mobileVariants}>
                    <button onClick={handleClose} className={global.closeButton}>x</button>
                </motion.div>
                <motion.div initial="initial" animate="animate" exit="exit" variants={mobileVariants} className={global.form}>
                    <Component {...(props as P)}>{children}</Component>
                </motion.div>
            </motion.section>
        );
    };

    WrappedComponent.displayName = `WithCommonStyles(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
};

export default SubComponentSide;
