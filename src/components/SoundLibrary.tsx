"use client";

import React from 'react';
import AudioPlayer from './AudioPlayer';

const SoundLibrary: React.FC = () => {
  return (
    <section id="music" className="section-padding bg-primary">
      <div className="container-width">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="section-tag">Production Portfolio</span>
          <h2 className="section-title">
            Hear Our <span className="highlight">Engineering Quality</span>
          </h2>
        </div>
        <AudioPlayer />
      </div>
    </section>
  );
};

export default SoundLibrary;

export default SoundLibrary;
