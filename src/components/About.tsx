"use client";

import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="section-padding bg-secondary">
      {/* Background Subtle Gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      ></div>

      <div className="container-width" style={{ position: 'relative', zIndex: 10 }}>
        <div className="grid-2 about-grid">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag">Our Studio</span>
            <h2 className="section-title">
              State-of-the-Art Recording & <span className="highlight">Audio Services</span>
            </h2>
            <p className="about-text">
              Mohikontok Sound Lab is a professional recording studio, rehearsal space, and audio production facility located in Bronx, NY. 
              We offer full-service sound solutions—ranging from vocal and instrument tracking, mixing, and mastering, to sound equipment rental for private events.
            </p>
            <p className="about-text" style={{ color: 'var(--text-muted)' }}>
              Led by industry professionals with over 30 years of composition, songwriting, and sound engineering experience, we help independent musicians, bands, podcasters, and content creators bring their acoustic ideas to life with high-fidelity clarity. We also specialize in global music distribution, registering ISRC/UPC codes to publish your tracks worldwide.
            </p>

            <div className="about-features">
              <div className="about-feature-box">
                <h4>Music Distribution</h4>
                <p>Register official ISRC/UPC codes and distribute your tracks to 150+ streaming platforms.</p>
              </div>
              <div className="about-feature-box">
                <h4>Professional Acoustics</h4>
                <p>Soundproofed tracking rooms and rehearsal spaces configured for bands and audio engineers.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="about-img-container"
          >
            <div className="about-img-frame">
              <img
                src="/pics/MOHAMMAD NASIRULLAH.jpg"
                alt="Mohammad Nasirullah - Founder & Composer"
              />
            </div>

            {/* Float glass card */}
            <div className="about-quote-card">
              <p>
                "Our mission is to give artists the technical precision and acoustic space to realize their sound."
              </p>
              <h5>Mohammad Nasirullah</h5>
              <span>Founder & Chief Engineer</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
