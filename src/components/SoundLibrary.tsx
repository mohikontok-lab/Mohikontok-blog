"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink } from 'lucide-react';

interface Track {
  title: string;
  cover: string;
  link: string;
  desc: string;
  artist: string;
}

const SoundLibrary: React.FC = () => {
  const tracks: Track[] = [
    
    {
      title: "Video Editing Technology",
      cover: "/pics/MOHIKONTOK ARTISTS.jpg",
      link: "https://ditto.fm/kabitara-gana-3-hrdayera-rna",
      artist: "Sharif Siddiqui & Sohan Jajabor",
      desc: "Client Project: Multi-track folk fusion recording. Professional compression, frequency EQ balancing, and mastering for streaming platforms."
    },
    {
      title: "Studio Recording session",
      cover: "/pics/MISTER NAS AKA EDAN BROWN.jpg",
      link: "https://ditto.fm/the-east-river",
      artist: "Hamid Zaman & Edan Brown",
      desc: "In-House Project: Integration of analog rock drums, vocal pre-amps alignment, and digital synthesizer mastering."
    }
  ];

  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (track: Track) => {
    if (currentTrack.title === track.title) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <section id="music" className="section-padding bg-primary">
      <div className="container-width">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="section-tag">Production Portfolio</span>
          <h2 className="section-title">
            Hear Our <span className="highlight">Engineering Quality</span>
          </h2>
        </div>





      </div>
    </section>
  );
};

export default SoundLibrary;
