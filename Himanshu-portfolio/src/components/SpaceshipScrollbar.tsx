import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface Checkpoint {
  id: string;
  label: string;
}

const checkpoints: Checkpoint[] = [
  { id: 'hero', label: 'Start' },
  { id: 'projects', label: 'Works' },
  { id: 'skills', label: 'Tech' },
  { id: 'terminal', label: 'Terminal' }
];

const SpaceshipScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // We use GSAP ScrollTrigger to track overall page scroll
    // Since our scroll container is .scroll-container, we need to track it
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setScrollProgress(progress);

      // Determine active checkpoint based on progress
      const index = Math.round(progress * (checkpoints.length - 1));
      setActiveIndex(index);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial call
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    const container = document.querySelector('.scroll-container');
    if (section && container) {
      gsap.to(container, {
        scrollTo: { y: section, autoKill: true },
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div className="spaceship-scrollbar">
      {/* Background track line */}
      <div className="scroll-track">
        {/* Progress line */}
        <div 
          className="scroll-progress-line" 
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Checkpoints */}
      <div className="checkpoints-container">
        {checkpoints.map((cp, index) => {
          const topPosition = (index / (checkpoints.length - 1)) * 100;
          const isActive = index <= activeIndex;
          
          return (
            <div 
              key={cp.id}
              className={`checkpoint ${isActive ? 'active' : ''}`}
              style={{ top: `${topPosition}%` }}
              onClick={() => scrollToSection(cp.id)}
              title={cp.label}
            >
              <div className="checkpoint-core" />
              <div className="checkpoint-ring ring-1" />
              <div className="checkpoint-ring ring-2" />
            </div>
          );
        })}
      </div>

      {/* Spaceship */}
      <div 
        className="spaceship-indicator"
        style={{ 
          top: `${scrollProgress * 100}%`,
          transform: `translate(-50%, -50%)`
        }}
      >
        <img src="/spaceship.png" alt="Spaceship" className="spaceship-img" />
        <div className="spaceship-fire" />
      </div>
    </div>
  );
};

export default SpaceshipScrollbar;
