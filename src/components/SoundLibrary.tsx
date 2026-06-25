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
      title: "Rehearsal space Saibam",
      cover: "/pics/mOHiKOnTOK SESSION.jpg",
      link: "https://open.spotify.com/artist/3r7P1vpv1GVFxQ9GnSHDS2",
      artist: "Mohikontok Spoken Word",
      desc: "Client Project: Full vocal tracking, stereo acoustic guitar processing, and spatial audio mixing completed at Mohikontok."
    },
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

        {/* Releases Grid */}
        <div className="grid-2 releases-grid">
          {tracks.map((track, index) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="release-card"
            >
              <img
                src={track.cover}
                alt={`${track.title} Cover`}
              />
              <div className="release-card-overlay">
                <h4 className="release-title">{track.title}</h4>
                <p className="release-desc">{track.desc}</p>
                <div className="release-buttons">
                  <a
                    href={track.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                  >
                    <ExternalLink size={14} /> Stream Full
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Audio Player Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="audio-player-container"
        >
          <div className="player-cover">
            <img src={currentTrack.cover} alt="Now Playing Album Art" />
          </div>
          
          <div className="player-info">
            <p className="player-track">{currentTrack.title}</p>
            <p className="player-artist">{currentTrack.artist}</p>
          </div>

          <div className="player-controls">
            {/* Visualizer bars */}
            <div className={`visualizer-waveform ${isPlaying ? 'playing' : ''}`}>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
              <div className="visualizer-bar"></div>
            </div>

            <button className="play-pause-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />}
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SoundLibrary;
