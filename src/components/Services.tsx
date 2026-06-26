"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Mic, Settings, Globe, Calendar, Music } from 'lucide-react';

interface ServiceItem {
  title: string;
  price: string;
  icon: React.ReactNode;
  desc: string;
  features: string[];
}

const servicesList: ServiceItem[] = [
  {
  title: "Studio",
  price: "$65 / HOUR",
  icon: <Mic size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Capture high-fidelity vocal and instrumental tracks in our professionally soundproofed creative space in the Bronx.",
    features: [
      "High-end condenser & dynamic microphones",
      "Focusrite & Yamaha preamps",
      "Isolated acoustic vocal booths",
      "Experienced tracking engineer included",
      "Half-Day (4 hrs): $250–$500",
      "Full-Day (8 hrs): $500–$1,000"
    ]
  },
  {
    title: "Mixing",
    price: "FROM $250 / SONG",
    icon: <Settings size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Professional mixing services to transform your rough tracks into polished, release-ready recordings.",
    features: [
      "Basic Mix: $100–$200",
      "Professional Mix: $250–$500",
      "Premium Mix: $500–$1,500+",
      "Dynamic processing & compression",
      "Frequency spectrum equalization (EQ)",
      "Vocal pitch correction & tuning"
    ]
  },
  {
    title: "Mastering",
    price: "FROM $75 / SONG",
    icon: <Headphones size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Professional mastering to ensure your tracks sound polished, cohesive, and competitive across all streaming platforms.",
    features: [
      "Basic Mastering: $30–$75",
      "Professional Mastering: $75–$200",
      "Premium Mastering: $200–$500+",
      "Optimized for streaming loudness targets",
      "Final stereo enhancement & limiting",
      "Multiple format delivery (WAV/MP3)"
    ]
  },
  {
    title: "New Haven package",
    price: "FROM $399 / SONG",
    icon: <Music size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Save with our combined recording, mixing, and mastering bundles — perfect for independent artists.",
    features: [
      "Recording + Mix + Master: $399/song",
      "5-Song EP Package: $1,799",
      "Demo Package: $150–$250/song",
      "Commercial Release Package: $600–$1,500+/song",
      "First-time artist discount: 15% off",
      "2–3 revision rounds included"
    ]
  },
  {
    title: "Sound Lab Package",
    price: "$199 – $699",
    icon: <Calendar size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "All-in-one recording, mixing, and mastering packages designed for independent artists.",
    features: [
      "Bronze – $199: 2 hrs recording + basic mix + MP3/WAV delivery",
      "Silver – $399: 4 hrs recording + professional mix + mastering + 2 revisions",
      "Gold – $699: Full-day recording + premium mix + mastering + instrumental version + 3 revisions",
      "First-time artist discount: 15% off"
    ]
  },
  {
    title: "Global Music Distribution",
    price: "CUSTOM PRICING",
    icon: <Globe size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Get your tracks on all major platforms worldwide, ensuring official licensing and rights.",
    features: [
      "Official ISRC & UPC code generation",
      "Distribution to 150+ stores (Spotify, Apple, etc.)",
      "Royalties setup & metadata optimization",
      "Copyright ownership verification"
    ]
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="section-padding bg-secondary">
      <div className="container-width">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-tag" style={{ color: 'var(--color-orange)' }}>Our Services</span>
          <h2 className="section-title">
            Professional Studio & <span className="highlight">Audio Solutions</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '10px auto 0 auto', color: 'var(--text-secondary)' }}>
            We provide state-of-the-art facilities and engineering expertise to elevate your audio production.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {servicesList.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="artist-card" // Reusing the styled glassmorphic card styles
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div style={{ 
                      background: 'rgba(255, 122, 48, 0.1)', 
                      padding: '12px', 
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="artist-name" style={{ fontSize: '1.25rem', marginBottom: '2px', color: 'white' }}>{service.title}</h4>
                      <span className="artist-role" style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>{service.price}</span>
                    </div>
                  </div>
                  
                  <p className="artist-bio" style={{ marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    {service.desc}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.features.map((feat) => (
                      <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-light-gray)' }}>
                        <span style={{ 
                          width: '4px', 
                          height: '4px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--color-orange)', 
                          boxShadow: '0 0 4px var(--color-orange)',
                          flexShrink: 0
                        }}></span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <a href="#scheduler" className="btn btn-outline" style={{ 
                  textAlign: 'center', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  padding: '10px 16px',
                  width: '100%'
                }}>
                  <Calendar size={14} /> Book or Inquire
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
