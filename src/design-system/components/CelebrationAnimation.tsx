import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
}

const PARTICLE_COLORS = ['#FFD93D', '#FF6B9D', '#6C63FF', '#4CAF50', '#FF9800'];

export function CelebrationAnimation() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10,
            color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]!,
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
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
                zIndex: 100,
            }}
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: `${p.x}vw`, y: '-10vh', rotate: 0, opacity: 1 }}
                    animate={{
                        y: '110vh',
                        rotate: p.rotation + 720,
                        opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 2 + Math.random(), ease: 'easeIn' }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                />
            ))}
        </div>
    );
}
