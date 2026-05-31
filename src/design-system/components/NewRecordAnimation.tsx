import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    delay: number;
    color: string;
    size: number;
}

const COLORS = ['#FFD93D', '#FF6B9D', '#6C63FF', '#4CAF50', '#FF9800', '#E91E63'];

export function NewRecordAnimation() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: COLORS[i % COLORS.length]!,
            size: Math.random() * 10 + 6,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 101,
            }}
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: `${p.x}vw`,
                        y: '110vh',
                        opacity: 1,
                        scale: 0,
                    }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1, 1, 0.5],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 2.5,
                        delay: p.delay,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: '50%',
                    }}
                />
            ))}
        </div>
    );
}
