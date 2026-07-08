"use client";
import React, { useEffect, useState } from 'react';

interface Track {
  title: string;
  url: string;
}

const AudioPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Load track list from public JSON
  useEffect(() => {
    fetch('/tracks.json')
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
        setCurrent(0);
      })
      .catch((e) => console.error('Failed to load tracks', e));
  }, []);

  // Auto‑advance when a track ends
  const handleEnded = () => {
    setCurrent((prev) => (prev + 1) % tracks.length);
  };

  // Update audio source when current changes
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[current].url;
      audioRef.current.play().catch(() => {});
    }
  }, [current, tracks]);

  if (tracks.length === 0) {
    return null; // no player until tracks are loaded
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <audio
        ref={audioRef}
        controls
        onEnded={handleEnded}
        style={{ maxWidth: '200px' }}
      />
      <span style={{ color: 'var(--color-white)' }}>{tracks[current].title}</span>
    </div>
  );
};

export default AudioPlayer;
