'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Tempus from '@studio-freight/tempus';
import Lenis from '@studio-freight/lenis';
import { usePathname } from 'next/navigation';


const SmoothScroller = () => {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();


    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    useLayoutEffect(() => {
        const lenisInstance = new Lenis({
            duration: 2.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1.2,
            touchMultiplier: 2,
        });
        lenisRef.current = lenisInstance;

        const resizeInterval = setInterval(() => {
            lenisInstance.resize();
        }, 150);

        const onFrame = (time: number) => {
            lenisInstance.raf(time);
        };

        const unsubscribe = Tempus.add(onFrame);

        return () => {
            clearInterval(resizeInterval);
            unsubscribe();
            lenisInstance.destroy();
            lenisRef.current = null;
        };
    }, []);

    return null;
};

export default SmoothScroller;
