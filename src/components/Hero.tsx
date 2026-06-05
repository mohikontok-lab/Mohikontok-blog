"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      {/* Background Studio Image */}
      <div className="hero-bg">
        <img
          src="/pics/Gemini_Generated_Image_h195y8h195y8h195.png"
          alt="Mohikontok Recording Studio Space"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Layered Content */}
      <div className="hero-content">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-tag"
          style={{ color: 'var(--color-orange)' }}
        >
          Bronx, NY Recording Studio & Label
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="hero-title"
        >
          mOHiKOnTOk <br />
          <span className="highlight">Sound Lab</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-desc"
        >
          Bronx's premier recording studio, rehearsal space, and audio engineering facility.
          State-of-the-art production rooms equipped for tracking, mixing, mastering,
          global distribution, and premium sound rentals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="hero-buttons"
        >
          <a href="#services" className="btn btn-gold">
            View Services & Rates
          </a>
          <a href="#scheduler" className="btn btn-orange">
            <Calendar size={16} />
            Book Studio Session
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-bar-indicator"></div>
      </div>
    </section>
  );
};

export default Hero;
