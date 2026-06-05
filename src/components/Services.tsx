"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Mic, Settings, Globe, Volume2, Calendar } from 'lucide-react';

interface ServiceItem {
  title: string;
  price: string;
  icon: React.ReactNode;
  desc: string;
  features: string[];
}

const servicesList: ServiceItem[] = [
  {
    title: "Recording Sessions",
    price: "$50 / hour",
    icon: <Mic size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Capture high-fidelity vocal and instrument tracks in our professionally sound-treated environment.",
    features: [
      "High-end condenser & dynamic microphones",
      "Focusrite & Yamaha preamps",
      "Isolated acoustic vocal booths",
      "Experienced tracking engineer included"
    ]
  },
  {
    title: "Rehearsal Space",
    price: "$35 / hour",
    icon: <Headphones size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "A fully equipped acoustic-treated rehearsal studio tailored for bands, solos, and podcasts.",
    features: [
      "Full acoustic drum kit & percussion",
      "Marshall guitar & Yamaha bass cabinets/amps",
      "Yamaha keyboards & synthesizer setup",
      "High-power active stage monitors"
    ]
  },
  {
    title: "Mixing & Mastering",
    price: "$60 / track",
    icon: <Settings size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Professional audio post-production. Polish your rough tracks into release-ready masterpieces.",
    features: [
      "Dynamic processing & compression",
      "Frequency spectrum equalization (EQ)",
      "High-fidelity vocal pitch correction",
      "Optimized for streaming loudness targets"
    ]
  },
  {
    title: "Global Music Distribution",
    price: "Custom Pricing",
    icon: <Globe size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Get your tracks on all major platforms worldwide, ensuring official licensing and rights.",
    features: [
      "Official ISRC & UPC code generation",
      "Distribution to 150+ stores (Spotify, Apple, etc.)",
      "Royalties setup & metadata optimization",
      "Copyright ownership verification"
    ]
  },
  {
    title: "Sound Equipment Rental",
    price: "Inquire for Rates",
    icon: <Volume2 size={24} style={{ color: 'var(--color-orange)' }} />,
    desc: "Rent premium sound gear, monitors, and wireless microphones for private events and parties.",
    features: [
      "Active subwoofers & PA speakers",
      "Multi-channel analog/digital mixers",
      "UHF wireless handheld/lapel mics",
      "Delivery, setup, and teardown services"
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
