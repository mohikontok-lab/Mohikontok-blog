"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Radio } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'studio', label: 'Studio Space' },
    { id: 'services', label: 'Services & Rates' },
    { id: 'music', label: 'Portfolio' },
    { id: 'blog', label: 'Blog', external: 'https://blog.mohikontok.com' },
    { id: 'scheduler', label: 'Book Now' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-logo">
          <Radio size={22} className="pulse-glow" style={{ color: 'var(--color-orange)' }} />
          <span>Mohikontok</span>
        </a>

        {/* Desktop Links */}
        <ul className="nav-links desktop-menu">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.external || `#${link.id}`}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Auth and CTA Actions */}
        <div className="nav-actions desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {status === 'authenticated' && session?.user ? (
            <div className="user-profile-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="user-avatar"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--color-orange)', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="user-avatar-placeholder"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-orange)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                </div>
              )}
              <button
                onClick={() => signOut()}
                className="nav-link"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="nav-link"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '4px 8px',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
            >
              Sign In
            </button>
          )}

          <a href="#scheduler" className="nav-cta">
            Book Lab
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile menu drawer */}
        <ul className={`mobile-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.id} onClick={() => setIsMenuOpen(false)}>
              <a
                href={link.external || `#${link.id}`}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
          
          {/* Mobile Auth and Action */}
          {status === 'authenticated' && session?.user ? (
            <li style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--color-orange)', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--color-orange)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{session.user.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{session.user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className="nav-link"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li style={{ padding: '0 24px', marginTop: '8px' }}>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signIn('google');
                }}
                className="nav-link"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-orange)',
                  color: 'var(--color-orange)',
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
            </li>
          )}

          <li onClick={() => setIsMenuOpen(false)}>
            <a href="#scheduler" className="nav-cta" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
              Book Lab
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
