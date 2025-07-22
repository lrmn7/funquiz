'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { AudioContext } from '@/contexts/AudioContext';

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(error => {
                console.warn("Autoplay was blocked by the browser. User interaction is required to play music.");
                setIsPlaying(false);
            });
        }
    }, []);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play().catch(error => console.error("Audio play failed:", error));
            setIsPlaying(true);
        }
    }, [isPlaying]);

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
            <audio ref={audioRef} src="/somnia-vibes-music.mp3" loop />
            {children}
        </AudioContext.Provider>
    );
};