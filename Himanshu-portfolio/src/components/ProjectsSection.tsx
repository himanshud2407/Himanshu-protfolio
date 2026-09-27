import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'Cosmic Portfolio',
    description: 'An interactive, space-themed developer portfolio featuring a virtual filesystem terminal and physics-based GSAP animations.',
    techStack: ['React', 'TypeScript', 'GSAP', 'Vite'],
    github: 'https://github.com/himanshu/portfolio',
    isHonourable: true
  },
  {
    title: 'AI Data Analyzer',
    description: 'A machine learning powered dashboard for analyzing datasets and extracting insights using natural language processing.',
    techStack: ['Python', 'FastAPI', 'React', 'Pandas'],
    link: '#',
    github: '#'
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with integrated payment gateway, admin dashboard, and inventory management.',
    techStack: ['Next.js', 'Stripe', 'Tailwind', 'PostgreSQL'],
    link: '#',
    github: '#'
  }
];

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger project cards appearance on scroll
      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        scale: 0.8,
        stagger: 0.2
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="fullscreen-section" style={{ minHeight: '100dvh', padding: '5rem 2rem', justifyContent: 'flex-start' }}>
      <h2 style={{ marginBottom: '4rem' }}>My Works</h2>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center',
        maxWidth: '1200px',
        width: '100%'
      }}>
        {projects.map((proj, idx) => (
          <ProjectCard key={idx} {...proj} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
