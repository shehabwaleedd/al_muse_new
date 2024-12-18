const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] }

export const opacity = {
    initial: {
        opacity: 0
    },
    open: {
        opacity: 1,
        transition: { duration: 0.35 }
    },
    closed: {
        opacity: 0,
        transition: { duration: 0.35 }
    }
}

export const height = {
    initial: {
        height: 0
    },
    enter: {
        height: "110vh",
        transition
    },
    exit: {
        height: 0,
        transition
    }
}

export const width = {
    initial: {
        x: "100%",
    },
    enter: {
        x: 0,
        transition
    },
    exit: {
        x: "100%",
        transition
    }
}

export const contactPageHeight = {
    initial: {
        height: 0
    },
    enter: {
        height: "75vh",
        transition
    },
    exit: {
        height: 0,
        transition
    }
}

export const background = {
    initial: {
        height: 0
    },
    open: {
        height: "110vh",
        transition
    },
    closed: {
        height: 0,
        transition
    }
}

export const blur = {
    initial: {
        filter: "blur(0px)",
        opacity: 1
    },
    open: {
        filter: "blur(4px)",
        opacity: 0.6,
        transition: { duration: 0.3 }
    },
    closed: {
        filter: "blur(0px)",
        opacity: 1,
        transition: { duration: 0.3 }

    }
}

export const translate = {
    initial: {
        y: "100%",
    },
    enter: (i) => ({
        y: 0,
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: i[0] }
    }),
    exit: (i) => ({
        y: "100%",
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i[1] }
    })
}

export const slideUp = {
    initial: {
        y: "100%"
    },
    open: (i) => ({
        y: "0%",
        transition: {duration: 0.5, delay: 0.01 * i}
    }),
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
}