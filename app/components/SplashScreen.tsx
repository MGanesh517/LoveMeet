'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out animation
        }, 3000); // Show for 3 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                                style={{
                                    width: Math.random() * 200 + 100,
                                    height: Math.random() * 200 + 100,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    x: [0, 20, 0],
                                    scale: [1, 1.1, 1],
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <motion.div
                        className="relative z-10 text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        {/* Animated Heart Logo */}
                        <motion.div
                            className="mx-auto mb-8 flex items-center justify-center"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <div className="relative">
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-md"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 0, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-2xl">
                                    <Heart className="h-16 w-16 fill-white text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Brand Name with Letter Animation */}
                        <motion.h1
                            className="mb-4 text-6xl font-extrabold text-white md:text-8xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {['L', 'o', 'v', 'e', 'M', 'e', 'e', 't'].map((letter, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{
                                        delay: 0.4 + i * 0.1,
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 12,
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.h1>

                        {/* Tagline */}
                        <motion.p
                            className="text-xl text-white/90 md:text-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                        >
                            Find Your Perfect Match
                        </motion.p>

                        {/* Loading Dots */}
                        <motion.div
                            className="mt-12 flex justify-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-3 w-3 rounded-full bg-white"
                                    animate={{
                                        y: [0, -10, 0],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

