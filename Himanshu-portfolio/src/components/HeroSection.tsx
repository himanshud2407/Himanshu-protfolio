import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail } from 'lucide-react';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo('.hero-text > *', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5 }
      );

      // Scroll-triggered exit animation
      gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "50% top",
          scrub: true,
        },
        scale: 0.8,
        opacity: 0,
        y: -100
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="fullscreen-section" style={{ padding: '0 5%' }}>
      <div ref={textRef} className="hero-text" style={{ textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ marginBottom: '1rem' }}>Hi, I'm <span style={{ color: 'var(--accent-cyan)' }}>Himanshu</span></h1>
        <h2>Full-Stack & AI Developer</h2>
        
        <p style={{ 
          marginTop: '2rem', 
          fontSize: '1.2rem', 
          maxWidth: '600px', 
          lineHeight: '1.6',
          color: 'var(--text-muted)' 
        }}>
          I build high-performance web applications, intelligent AI integrations, and cosmic digital experiences.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem' }}>
          <a href="https://github.com/himanshu" target="_blank" rel="noreferrer" className="btn">
            GitHub
          </a>
          <a href="https://linkedin.com/in/himanshu" target="_blank" rel="noreferrer" className="btn">
            LinkedIn
          </a>
          <a href="mailto:himanshu@example.com" className="btn">
            <Mail size={20} /> Contact
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
