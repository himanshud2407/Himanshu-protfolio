import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Skill {
  name: string;
  radius: number; // Base radius in pixels (will scale based on screen size)
  speed: number;  // Angular velocity
  angle: number;  // Initial angle
}

const skillsData: Skill[] = [
  { name: 'React', radius: 100, speed: 0.01, angle: 0 },
  { name: 'Node.js', radius: 140, speed: -0.008, angle: Math.PI / 4 },
  { name: 'Python', radius: 180, speed: 0.006, angle: Math.PI / 2 },
  { name: 'Docker', radius: 220, speed: -0.005, angle: Math.PI },
  { name: 'AWS', radius: 260, speed: 0.004, angle: (3 * Math.PI) / 2 },
  { name: 'TensorFlow', radius: 300, speed: -0.003, angle: Math.PI / 3 },
  { name: 'Next.js', radius: 340, speed: 0.002, angle: (5 * Math.PI) / 4 }
];

const SkillsOrbit: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Handle responsive scaling of the orbit
    const handleResize = () => {
      // Base width is assumed to be 800px. Scale down if window is smaller.
      const currentWidth = window.innerWidth;
      if (currentWidth < 800) {
        setScale(currentWidth / 800);
      } else {
        setScale(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    const state = skillsData.map(s => ({ ...s })); // clone

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      state.forEach((skill, i) => {
        // update angle
        skill.angle += skill.speed * (delta / 16);
        
        // Calculate position
        const x = Math.cos(skill.angle) * skill.radius * scale;
        const y = Math.sin(skill.angle) * skill.radius * scale;

        // Apply transform to the DOM node directly for performance
        if (nodesRef.current[i]) {
          nodesRef.current[i]!.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [scale]);

  useEffect(() => {
    // Scroll trigger entrance animation
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
        scale: 0.1,
        opacity: 0,
        rotation: 90
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="fullscreen-section" style={{ minHeight: '100dvh', overflow: 'hidden' }}>
      <h2 style={{ marginBottom: '2rem', zIndex: 10 }}>Tech Stack</h2>
      
      <div 
        ref={containerRef} 
        className="orbit-container" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}
      >
        {/* Orbit Rings Background */}
        {skillsData.map((skill, i) => (
          <div 
            key={`ring-${i}`}
            style={{
              position: 'absolute',
              width: `${skill.radius * 2 * scale}px`,
              height: `${skill.radius * 2 * scale}px`,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Center Astronaut */}
        <div className="orbit-center">
          <img 
            src="/astronaut.png" 
            alt="Core" 
            style={{ width: '120px', height: '120px', objectFit: 'contain' }} 
          />
        </div>

        {/* Orbit Nodes */}
        {skillsData.map((skill, i) => (
          <div
            key={`node-${i}`}
            ref={el => { nodesRef.current[i] = el; }}
            className="orbit-node"
          >
            {skill.name}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsOrbit;
