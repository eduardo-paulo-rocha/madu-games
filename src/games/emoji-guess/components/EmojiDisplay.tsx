import { motion, AnimatePresence } from 'framer-motion';

interface EmojiDisplayProps {
    emoji: string;
    index: number;
}

export function EmojiDisplay({ emoji, index }: EmojiDisplayProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={index}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                    fontSize: '80px',
                    textAlign: 'center',
                    lineHeight: 1,
                    userSelect: 'none',
                }}
            >
                {emoji}
            </motion.div>
        </AnimatePresence>
    );
}
