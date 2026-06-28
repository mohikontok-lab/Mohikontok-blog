"use client";

import { useEffect, useState, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import StudioSpace from '../components/StudioSpace';
import Services from '../components/Services';
import SoundLibrary from '../components/SoundLibrary';
import Scheduler from '../components/Scheduler';
import Contact from '../components/Contact';

export default function Home() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'studio', 'services', 'music', 'scheduler'];
      const scrollPosition = window.scrollY + 200; // offset for nav trigger

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Background Floating Ambient Light Elements */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Navigation Header */}
      <Navbar activeSection={activeSection} />

      <main>
        {/* Hero Banner */}
        <Hero />

        {/* Narrative / About */}
        <About />

        {/* Physical Studio Setup */}
        <StudioSpace />

        {/* Studio Services & Rates */}
        <Services />

        {/* Releases & Visualizer Player */}
        <SoundLibrary />

        {/* Google Calendar Interactive Booking Form */}
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Loading Price Matching Services...</div>}>
          <Scheduler />
        </Suspense>
      </main>

      {/* Footer and Contacts */}
      <Contact />
    </>
  );
}
