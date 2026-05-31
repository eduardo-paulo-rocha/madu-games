import type { Variants } from 'framer-motion';

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 300 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

export const celebrate: Variants = {
    initial: { scale: 0 },
    animate: {
        scale: [0, 1.2, 1],
        transition: { duration: 0.5, times: [0, 0.7, 1] },
    },
};

export const pageTransition: Variants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export const staggerChildren = {
    animate: {
        transition: { staggerChildren: 0.08 },
    },
};
