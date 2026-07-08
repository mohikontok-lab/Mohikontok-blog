"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Play, Music as MusicIcon, Camera, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [collabEmail, setCollabEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collabEmail.trim()) {
      setSubmitted(true);
      // Mock submit
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="container-width">
        <div className="footer-top">
          
          {/* Brand Info */}
          <div className="footer-brand">
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.8rem', fontWeight: 900 }}>
              MOHIKONTOK
            </h3>
            <p>
              Bronx's premier recording studio, rehearsal space, and audio engineering facility. Providing professional recording, mixing, mastering, global music distribution, and premium sound equipment rentals.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com/mohikontok" target="_blank" rel="noreferrer" className="social-btn">
                <Globe size={18} />
              </a>
              <a href="https://www.youtube.com/channel/UC4sA5S5_opmm1foOTx-QsNA" target="_blank" rel="noreferrer" className="social-btn">
                <Play size={18} />
              </a>
              <a href="https://open.spotify.com/artist/3r7P1vpv1GVFxQ9GnSHDS2" target="_blank" rel="noreferrer" className="social-btn">
                <MusicIcon size={18} />
              </a>
              <a href="#" className="social-btn">
                <Camera size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Links</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#studio">Studio Space</a></li>
              <li><a href="#services">Services & Rates</a></li>
              <li><a href="#music">Portfolio</a></li>
              <li><a href="/blog" target="_blank" rel="noreferrer">Blog</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-heading">Reach Us</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <Mail size={16} />
                <a href="mailto:MOHIKONTOK@GMAIL.COM">MOHIKONTOK@GMAIL.COM</a>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} />
                <a href="tel:363-777-0809">(363) 777-0809</a>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginLeft: '8px' }}>Sales</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} />
                <a href="tel:347-497-3589">(347) 497-3589</a>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '8px' }}>Support</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={16} />
                <span>1389 Kearney Ave, Bronx, NY 10465</span>
              </div>
            </div>
          </div>

          {/* Collaborate newsletter form */}
          <div>
            <h4 className="footer-heading">Booking Inquiry</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Have a project in mind or need custom sound system rental rates? Let us know your requirements.
            </p>
            {submitted ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                Thanks for reaching out! We will be in touch soon.
              </p>
            ) : (
              <form onSubmit={handleCollabSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email"
                  style={{ padding: '10px 14px', fontSize: '0.85rem', borderRadius: '8px' }}
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  <Send size={12} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Mohikontok. All Rights Reserved.
          </p>
          <div className="footer-legal">
            <a href="https://docs.google.com/document/d/1N58TdwMr9J0yxSOfkdQBDKSD29mxdZWJEiXZ8RDtOYM/edit?usp=sharing" target="_blank" aria-label="Privacy policy (readable and audible)">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
