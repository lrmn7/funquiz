'use client';

import { createContext, useContext } from 'react';

interface AudioContextType {
    isPlaying: boolean;
    togglePlayPause: () => void;
}
export const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};