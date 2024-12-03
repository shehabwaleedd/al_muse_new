'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface AnimationContextType {
    hasAnimationShown: boolean;
    setHasAnimationShown: React.Dispatch<React.SetStateAction<boolean>>;
    renderingOpening: boolean;
    setRenderingOpening: React.Dispatch<React.SetStateAction<boolean>>;
    timeline: GSAPTimeline | null;
    setTimeline: React.Dispatch<React.SetStateAction<GSAPTimeline | null>>;
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
    const [timeline, setTimeline] = useState<GSAPTimeline | null>(null);

    useEffect(() => {
        if (!hasAnimationShown && !sessionStorage.getItem("hasAnimationShown")) {
            setRenderingOpening(true);
        }
    }, [hasAnimationShown])



    return (
        <AnimationContext.Provider value={{ hasAnimationShown, setHasAnimationShown, renderingOpening, setRenderingOpening, timeline, setTimeline }}>
            {children}
        </AnimationContext.Provider>
    );
};

export default AnimationProvider;
