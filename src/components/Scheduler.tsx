"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ChevronLeft, ChevronRight, Plus, Download, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';



interface Service {
  id: string;
  name: string;
  price: string;
  desc: string;
}

const services: Service[] = [
  { id: 'rehearsal', name: 'Rehearsal Space', price: '$35/hr', desc: 'Fully treated acoustics with Yamaha keyboards, Marshall amps, and acoustic drums.' },
  { id: 'recording', name: 'Recording Session', price: '$50/hr', desc: 'Vocal tracking and live instrumentation using high-end mics and sound interfaces.' },
  { id: 'mastering', name: 'Mixing & Mastering', price: '$60/track', desc: 'Professional audio post-production, digital filtering, and high-fidelity output tuning.' },
  { id: 'rental', name: 'Sound Rental Inquiry', price: 'Varies', desc: 'Rent premium sound cabinets, monitors, and microphones for private parties/events.' }
];

const timeSlots = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
  "08:00 PM - 10:00 PM"
];

const Scheduler: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  
  // Date Picker States
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // June 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 5, 15)); // Default June 15, 2026
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[2]); // Default 2:00 - 4:00 PM
  
  // Contact States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // NextAuth Session
  const { data: session, status } = useSession();

  // Pre-populate name and email from session
  useEffect(() => {
    if (session?.user) {
      if (!name && session.user.name) setName(session.user.name);
      if (!email && session.user.email) setEmail(session.user.email);
    }
  }, [session, name, email]);

  // Stripe Payment States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const searchParams = useSearchParams();

  // Handle Stripe Success Redirect
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const sessionId = searchParams.get('session_id');

    if (statusParam === 'success' && sessionId) {
      const serviceId = searchParams.get('service_id');
      const serviceName = searchParams.get('service_name');
      const dateStr = searchParams.get('date');
      const timeSlot = searchParams.get('time_slot');
      const clientName = searchParams.get('client_name');
      const clientEmail = searchParams.get('client_email');
      const clientPhone = searchParams.get('client_phone');
      const notesVal = searchParams.get('notes');

      if (serviceName && dateStr && timeSlot) {
        const matchedService = services.find(s => s.id === serviceId) || {
          id: serviceId || 'custom',
          name: serviceName,
          price: '',
          desc: ''
        };
        setSelectedService(matchedService);
        setSelectedDate(new Date(dateStr));
        setSelectedTimeSlot(timeSlot);
        if (clientName) setName(clientName);
        if (clientEmail) setEmail(clientEmail);
        if (clientPhone) setPhone(clientPhone);
        if (notesVal) setNotes(notesVal);
        setTransactionId(sessionId);
        setStep(5);

        // Smooth scroll to scheduler
        setTimeout(() => {
          const el = document.getElementById('scheduler');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  }, [searchParams]);

  // Calculate pricing summary details
  const calculateTotalDetails = (service: Service) => {
    let subtotal = 0;
    let breakdown = '';
    
    if (service.id === 'rehearsal') {
      subtotal = 70.00;
      breakdown = 'Rehearsal Space ($35/hr × 2 hrs)';
    } else if (service.id === 'recording') {
      subtotal = 100.00;
      breakdown = 'Recording Session ($50/hr × 2 hrs)';
    } else if (service.id === 'mastering') {
      subtotal = 60.00;
      breakdown = 'Mixing & Mastering (1 track)';
    } else {
      subtotal = 150.00;
      breakdown = 'Sound Rental Booking Deposit';
    }

    const stripeFee = parseFloat((subtotal * 0.029 + 0.30).toFixed(2));
    const total = parseFloat((subtotal + stripeFee).toFixed(2));

    return {
      subtotal: subtotal.toFixed(2),
      breakdown,
      stripeFee: stripeFee.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const pricing = calculateTotalDetails(selectedService);

  // Calendar render logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Padding for previous month's empty days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysGrid = getDaysInMonth(currentMonth);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to format date for Google Calendar TEMPLATE (YYYYMMDDTHHMMSSZ)
  const getGCalDates = (date: Date, slot: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Parse time slots e.g. "02:00 PM - 04:00 PM"
    const times = slot.split(" - ");
    const parseTime = (timeStr: string) => {
      const parts = timeStr.split(":");
      let hours = parseInt(parts[0]);
      const minutes = parts[1].substring(0, 2);
      const amp = parts[1].substring(3, 5);
      
      if (amp === "PM" && hours !== 12) hours += 12;
      if (amp === "AM" && hours === 12) hours = 0;
      
      return `${String(hours).padStart(2, '0')}${minutes}00`;
    };

    const startTime = parseTime(times[0]);
    const endTime = parseTime(times[1]);

    // Format local to UTC approximation (assuming local NY time to simplify)
    return `${year}${month}${day}T${startTime}/${year}${month}${day}T${endTime}`;
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    if (!selectedDate) return '#';
    const dates = getGCalDates(selectedDate, selectedTimeSlot);
    const title = encodeURIComponent(`Mohikontok Sound Lab: ${selectedService.name}`);
    const details = encodeURIComponent(
      `Service: ${selectedService.name}\n` +
      `Artist Name: ${name || 'N/A'}\n` +
      `Email: ${email || 'N/A'}\n` +
      `Phone: ${phone || 'N/A'}\n` +
      `Project Notes: ${notes || 'None'}\n` +
      `Rate: ${selectedService.price}\n\n` +
      `Please save this event to finalize booking with the Sound Lab staff.`
    );
    const location = encodeURIComponent("1389 Kearney Ave, Bronx, NY 10465");
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  // Download local ICS Calendar File
  const downloadIcsFile = () => {
    if (!selectedDate) return;
    
    const dates = getGCalDates(selectedDate, selectedTimeSlot);
    const startStr = dates.split('/')[0];
    const endStr = dates.split('/')[1];

    const icsContent = 
      `BEGIN:VCALENDAR\n` +
      `VERSION:2.0\n` +
      `PRODID:-//Mohikontok//Sound Lab Session//EN\n` +
      `BEGIN:VEVENT\n` +
      `UID:mohikontok-${Date.now()}@mohikontok.com\n` +
      `DTSTAMP:${startStr}\n` +
      `DTSTART:${startStr}\n` +
      `DTEND:${endStr}\n` +
      `SUMMARY:Mohikontok Sound Lab Rehearsal - ${selectedService.name}\n` +
      `DESCRIPTION:Service: ${selectedService.name}\\nArtist Name: ${name}\\nPhone: ${phone}\\nNotes: ${notes}\n` +
      `LOCATION:1389 Kearney Ave, Bronx, NY 10465\n` +
      `END:VEVENT\n` +
      `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mohikontok-session.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFormValid = () => {
    return name.trim().length > 0 && email.trim().match(/.+@.+\..+/);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setPaymentError('');
    setIsProcessingPayment(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          price: selectedService.price,
          date: selectedDate ? selectedDate.toDateString() : '',
          timeSlot: selectedTimeSlot,
          name,
          email,
          phone,
          notes,
          userId: session?.user ? (session.user as any).id : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate secure checkout.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Stripe session URL not found.');
      }
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'An error occurred while redirecting to secure payment.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <section id="scheduler" className="section-padding bg-secondary scheduler-section">
      <div className="container-width">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-tag">Booking Engine</span>
          <h2 className="section-title">
            Reserve the <span className="highlight">Sound Lab</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Schedule rehearsals, mixing reviews, or recording sessions directly into your calendar.
          </p>
        </div>

        <div className="scheduler-container">
          <div className="glass-card" style={{ padding: '40px' }}>
            
            {status !== 'authenticated' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'rgba(238, 114, 52, 0.1)', 
                  color: 'var(--color-orange)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 24px auto'
                }}>
                  <Lock size={30} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff', fontFamily: 'var(--font-sans)' }}>
                  Authentication Required
                </h3>
                <p style={{ maxWidth: '450px', margin: '0 auto 30px auto', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Please sign in with your Google account to access our booking calendar, choose scheduling dates, and complete secure session payments.
                </p>
                <button
                  onClick={() => signIn('google')}
                  className="btn btn-orange pulse-glow"
                  style={{ padding: '12px 32px', fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Sign In with Google
                </button>
              </div>
            ) : (
              <>
                {/* Step Indicators */}
                <div className="scheduler-step-indicator">
              <div className={`step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Service</div>
              </div>
              <div className={`step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Time</div>
              </div>
              <div className={`step-node ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Artist Info</div>
              </div>
              <div className={`step-node ${step === 4 ? 'active' : step > 4 ? 'completed' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-label">Payment</div>
              </div>
              <div className={`step-node ${step === 5 ? 'active' : ''}`}>
                <div className="step-number">5</div>
                <div className="step-label">Add Calendar</div>
              </div>
            </div>

            {/* Step Contents */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.2rem' }}>
                    Select Your Service:
                  </h3>
                  <div className="service-select-grid">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`service-card-btn ${selectedService.id === service.id ? 'selected' : ''}`}
                      >
                        <h4>{service.name}</h4>
                        <p>{service.desc}</p>
                        <div className="service-card-price">{service.price}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.2rem' }}>
                    Choose Date & Time Slot:
                  </h3>
                  
                  <div className="calendar-layout">
                    {/* Calendar grid */}
                    
                    <div className="calendar-picker flex ">
                      <div className="calendar-header-nav">
                        <span className="calendar-month-title">
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={handlePrevMonth} className="calendar-nav-btn">
                            <ChevronLeft size={18} />
                          </button>
                          <button onClick={handleNextMonth} className="calendar-nav-btn">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="calendar-days-header">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>

                      <div className="calendar-days-grid">
                        {daysGrid.map((day, idx) => {
                          if (!day) return <div key={`empty-${idx}`}></div>;
                          const isSelected = selectedDate && selectedDate.getDate() === day.getDate() && selectedDate.getMonth() === day.getMonth();
                          const isToday = new Date().toDateString() === day.toDateString();
                          
                          // Simple validation: disable past dates (simplified since we are in 2026)
                          const isPast = day.getTime() < new Date(2026, 4, 1).getTime();

                          return (
                            <button
                              key={`day-${idx}`}
                              disabled={isPast}
                              onClick={() => setSelectedDate(day)}
                              className={`calendar-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                            >
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    <div className="slots-picker">
                      <h4 className="slots-title">Available Time Slots:</h4>
                      <div className="slots-grid">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`slot-btn ${selectedTimeSlot === slot ? 'selected' : ''}`}
                          >
                            <Clock size={12} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.2rem' }}>
                    Enter Contact Details:
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label>Artist/Band Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sharif Siddiqui"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="artist@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="(929) 371-0371"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Session Notes (Instruments to record, requests, etc.)</label>
                    <textarea
                      className="form-control"
                      placeholder="Planning to record vocals and acoustic guitar overlays for Kobitar Gan podcast..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.2rem' }}>
                    Complete Payment to Secure Booking:
                  </h3>

                  {isProcessingPayment ? (
                    <div className="payment-processing-container animate-pulse">
                      <div className="spinner-wave"></div>
                      <div className="processing-message">Redirecting to Secure Payment...</div>
                      <div className="processing-sub">Connecting to Stripe checkout gateway</div>
                    </div>
                  ) : (
                    <div className="payment-layout">
                      {/* Left Side: Secure Stripe Information */}
                      <div className="stripe-card-form" style={{ padding: '30px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="secure-transaction" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#635bff', fontWeight: 600, fontSize: '0.9rem' }}>
                          <ShieldCheck size={20} /> Secure Stripe Checkout
                        </div>

                        <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          You will be redirected to Stripe's secure payment gateway to finish booking. Stripe supports major credit cards, Apple Pay, and Google Pay.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-light-gray)' }}>
                            <Lock size={12} style={{ color: 'var(--color-gold)' }} />
                            <span>PCI-Compliant Payment Gateway</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-light-gray)' }}>
                            <ShieldCheck size={12} style={{ color: 'var(--color-gold)' }} />
                            <span>128-bit SSL Encryption Security</span>
                          </div>
                        </div>

                        <div className="stripe-logo-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '15px', display: 'flex', alignItems: 'center' }}>
                          <Lock size={10} style={{ marginRight: '4px' }} /> powered by <span style={{ fontWeight: '800', letterSpacing: '0.02em', marginLeft: '2px' }}>stripe</span>
                        </div>

                        {paymentError && (
                          <div style={{ color: 'var(--color-orange)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-orange)' }}></span>
                            {paymentError}
                          </div>
                        )}
                      </div>

                      {/* Right Side: Order Summary */}
                      <div className="payment-summary-box">
                        <h4 className="summary-heading">Booking Summary</h4>
                        <div className="summary-details">
                          <div className="summary-row">
                            <span>Service:</span>
                            <strong style={{ color: 'white' }}>{selectedService.name}</strong>
                          </div>
                          <div className="summary-row">
                            <span>Date:</span>
                            <span>
                              {selectedDate ? monthNames[selectedDate.getMonth()] : ''} {selectedDate?.getDate()},{' '}
                              {selectedDate?.getFullYear()}
                            </span>
                          </div>
                          <div className="summary-row">
                            <span>Time:</span>
                            <span>{selectedTimeSlot}</span>
                          </div>
                          <div style={{ margin: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></div>
                          <div className="summary-row">
                            <span style={{ fontSize: '0.8rem' }}>{pricing.breakdown}:</span>
                            <span>${pricing.subtotal}</span>
                          </div>
                          <div className="summary-row">
                            <span style={{ fontSize: '0.8rem' }}>Stripe processing fee:</span>
                            <span>${pricing.stripeFee}</span>
                          </div>
                          <div className="summary-row total">
                            <span>Total Due Now:</span>
                            <span className="price-highlight">${pricing.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="success-card"
                >
                  <div className="success-icon-wrapper">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="success-title">Booking Confirmed!</h3>
                  <div style={{ marginBottom: '24px' }}>
                    <span className="paid-badge">
                      <ShieldCheck size={14} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} /> Paid via Stripe
                    </span>
                    <div className="transaction-id-label">Receipt Reference: {transactionId}</div>
                  </div>
                  <p className="success-subtitle">
                    Your session for <strong>{selectedService.name}</strong> is booked for{' '}
                    <strong>
                      {selectedDate ? monthNames[selectedDate.getMonth()] : ''} {selectedDate?.getDate()},{' '}
                      {selectedDate?.getFullYear()}
                    </strong>{' '}
                    at <strong>{selectedTimeSlot}</strong>. 
                    <br />
                    Add this appointment directly to your Google Calendar to secure the spot!
                  </p>

                  <div className="calendar-action-buttons">
                    <a
                      href={generateGoogleCalendarUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-orange pulse-glow"
                    >
                      <Plus size={18} /> Add to Google Calendar
                    </a>
                    <button
                      onClick={downloadIcsFile}
                      className="btn btn-outline"
                    >
                      <Download size={18} /> Download Calendar Invite (.ics)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav controls */}
            <div className="scheduler-nav-bar">
              {step > 1 && step < 5 && !isProcessingPayment ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="btn btn-outline"
                  style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="btn btn-gold"
                  style={{ padding: '10px 24px', fontSize: '0.8rem' }}
                >
                  Continue
                </button>
              ) : step === 3 ? (
                <button
                  onClick={() => setStep(4)}
                  disabled={!isFormValid()}
                  className="btn btn-gold"
                  style={{
                    padding: '10px 24px',
                    fontSize: '0.8rem',
                    opacity: isFormValid() ? 1 : 0.5,
                    cursor: isFormValid() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Proceed to Payment
                </button>
              ) : step === 4 ? (
                !isProcessingPayment && (
                  <button
                    onClick={handlePaymentSubmit}
                    className="btn btn-orange pulse-glow"
                    style={{
                      padding: '10px 24px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Proceed to secure payment
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    setStep(1);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setNotes('');
                    setPaymentError('');
                    setTransactionId('');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '10px 24px', fontSize: '0.8rem' }}
                >
                  Book Another Session
                </button>
              )}
            </div>
          </>
        )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Scheduler;
