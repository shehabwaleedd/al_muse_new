'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
interface AnimationContextType {
    hasAnimationShown: boolean;
    setHasAnimationShown: React.Dispatch<React.SetStateAction<boolean>>;
    renderingOpening: boolean;
    setRenderingOpening: React.Dispatch<React.SetStateAction<boolean>>;
    timeline: any;
    setTimeline: React.Dispatch<React.SetStateAction<any>>;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = (): AnimationContextType => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within a AnimationProvider');
    }
    return context;
};

interface AnimationProviderProps {
    children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
    const [hasAnimationShown, setHasAnimationShown] = useState<boolean>(false);
    const [renderingOpening, setRenderingOpening] = useState<boolean>(false);
    const [timeline, setTimeline] = useState<any>(null);

    useEffect(() => {
        if (!hasAnimationShown && !sessionStorage.getItem("hasAnimationShown")) {
            setRenderingOpening(true);
        }
    }, [hasAnimationShown])

    useLayoutEffect(() => {
        const context = gsap.context(() => {
            const tl = gsap.timeline();

            setTimeline(tl);
        });
    }, []);


    return (
        <AnimationContext.Provider value={{ hasAnimationShown, setHasAnimationShown, renderingOpening, setRenderingOpening, timeline, setTimeline }}>
            {children}
        </AnimationContext.Provider>
    );
};

export default AnimationProvider;
