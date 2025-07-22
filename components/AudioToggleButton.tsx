"use client";

import { useAudio } from "@/contexts/AudioContext";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";

const AudioToggleButton = () => {
  const { isPlaying, togglePlayPause } = useAudio();

  return (
    <button
      onClick={togglePlayPause}
      className="p-2 rounded-full text-secondary hover:text-primary hover:bg-surface transition-colors mb-4"
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? (
        <HiOutlineSpeakerWave className="w-6 h-6" />
      ) : (
        <HiOutlineSpeakerXMark className="w-6 h-6" />
      )}
    </button>
  );
};

export default AudioToggleButton;
