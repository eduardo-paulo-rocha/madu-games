import { motion } from 'framer-motion';
import { colors } from '../tokens';

interface StarRatingProps {
    stars: number;
    size?: number;
}

export function StarRating({ stars, size = 32 }: StarRatingProps) {
    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3].map((i) => (
                <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                    style={{
                        fontSize: `${size}px`,
                        color: i <= stars ? colors.starFilled : colors.starEmpty,
                        display: 'inline-block',
                    }}
                >
                    ★
                </motion.span>
            ))}
        </div>
    );
}
