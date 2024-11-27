import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth;
        }
        return 1200;
    });

    const [windowHeight, setWindowHeight] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            return window.innerHeight;
        }
        return 1200;
    });


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    const isMobile = windowWidth < 468;
    const isMediumTablet = windowWidth < 788;
    const isLargeTablet = windowWidth < 900;
    const isTablet = windowWidth < 1067;
    const isLaptop = windowWidth < 1268 ;
    const isDesktop = windowWidth >= 1568;

    return { windowWidth, windowHeight, isMobile, isMediumTablet, isLargeTablet, isTablet, isLaptop, isDesktop };
};
export default useWindowSize;
