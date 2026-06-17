"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Globe, Music, Headphones, Volume2 } from 'lucide-react';

const StudioSpace: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Calculate tilt angles (limit max angle to around 15 degrees)
    const angleX = (yc - y) / 15;
    const angleY = (x - xc) / 15;
    setTilt({ x: angleX, y: angleY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="studio" className="section-padding bg-primary">
      <div className="container-width">
        <div className="grid-2 studio-grid">
          
          {/* Left Details Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag" style={{ color: 'var(--color-orange)' }}>The Sound Lab Space</span>
            <h2 className="section-title">
              Where Lyrical Ideas Find <span className="orange-highlight">Their Acoustic Voice</span>
            </h2>
            <p className="about-text">
              Our New York facility is a fully optimized creative environment tailored for rehearsals, vocals
              tracking, instrumental sessions, and mixing. Spanned with advanced acoustic treatment and
              high-end instrument monitors, we offer rental services, DJ setups, and audio archiving
              capabilities.
            </p>

            <ul className="equipment-list">
              <li className="equipment-item">
                <span className="equipment-bullet"></span>
                <span>Pro Mixing Console (Yamaha MG12XUK)</span>
              </li>
              <li className="equipment-item">
                <span className="equipment-bullet"></span>
                <span>Vevor Cabinets/Amps</span>
              </li>
              <li className="equipment-item">
                <span className="equipment-bullet"></span>
                <span>Fully Acoustic-treated space</span>
              </li>
              <li className="equipment-item">
                <span className="equipment-bullet"></span>
                <span>High-End Mics, Guitars & Drums Kit Setup</span>
              </li>
            </ul>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <a href="#scheduler" className="btn btn-orange">
                Book Rehearsal Space
              </a>
              <a href="tel:363-777-0809" className="btn btn-outline">
                <Phone size={16} /> Call Customer Service
              </a>
            </div>
          </motion.div>

          {/* Right 3D Interactive business card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="studio-card-wrapper"
          >
            <div className="studio-card-container">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s ease, box-shadow 0.6s ease' : 'transform 0.08s ease'
                }}
                className="studio-biz-card"
              >
                {/* Glowing gradients inside the card */}
                <div className="card-ambient-glow"></div>
                <div className="card-ambient-glow-2"></div>
                
                {/* Visual curved lines */}
                <svg className="card-wave-overlay" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <path
                    d="M0,90 C150,140 350,50 500,100 L500,150 L0,150 Z"
                    fill="rgba(255, 122, 48, 0.06)"
                  />
                  <path
                    d="M0,105 C180,155 320,65 500,120 L500,150 L0,150 Z"
                    fill="rgba(212, 175, 55, 0.04)"
                  />
                </svg>

                {/* Card Top Branding */}
                <div className="card-top">
                  <h3 className="card-brand">MOHIKONTOK</h3>
                  <p className="card-subtitle">Recording Studio & Rehearsal Place</p>
                  <div className="card-line"></div>

                  {/* Grid Services */}
                  <div className="card-services">
                    <div className="card-service-item">
                      <span className="card-bullet"></span>
                      <Music size={12} style={{ color: 'var(--color-orange)' }} />
                      <span>Rehearsal Space</span>
                    </div>
                    <div className="card-service-item">
                      <span className="card-bullet"></span>
                      <Headphones size={12} style={{ color: 'var(--color-orange)' }} />
                      <span>Recording Studio</span>
                    </div>
                    <div className="card-service-item">
                      <span className="card-bullet"></span>
                      <Volume2 size={12} style={{ color: 'var(--color-orange)' }} />
                      <span>instrumental Rental</span>
                    </div>
                    <div className="card-service-item">
                      <span className="card-bullet"></span>
                      <Headphones size={12} style={{ color: 'var(--color-orange)' }} />
                      <span>Hire Musicians</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Details */}
                <div className="card-bottom">
                  <div className="card-contact-item">
                    <Phone size={14} />
                    <span>(363) 777-0809</span>
                  </div>
                  <div className="card-contact-item">
                    <Globe size={14} />
                    <span>www.mohikontok.com</span>
                  </div>
                  <div className="card-contact-item">
                    <MapPin size={14} />
                    <span>1389 Kearney Ave Bronx NY 10465</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default StudioSpace;
