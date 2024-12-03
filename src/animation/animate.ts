export const getVariants = (isMobile: boolean) => ({
    initial: {
        y: isMobile ? 400 : -20,
        opacity: isMobile ? '' : 0,
        transition: {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    animate: {
        y: 0,
        opacity: isMobile ? '' : 1,
        transition: {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        y: isMobile ? 400 : -20,
        opacity: isMobile ? '' : 0,
        transition: {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
        },
    }
});


export const mobileVariants = {
    initial: {

        x: 800,
        transition: {
            duration: 1,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    animate: {

        x: 0,
        transition: {
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {

        x: 800,
        transition: {
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};
export const teamVariants = {
    initial: {

        x: 800,
        transition: {
            duration: 1,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    animate: {

        x: 0,
        transition: {
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {

        x: 1000,
        transition: {
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};



export const getLoginFormVariants = (isMobile: boolean) => ({
    initial: {
        opacity: 0,
        y: isMobile ? '70vh' : '70vh',
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        opacity: 0,
        y: isMobile ? '70vh' : '70vh',
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
        },
    },
});