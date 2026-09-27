import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import MeteorCanvas from './components/MeteorCanvas';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import SpaceshipScrollbar from './components/SpaceshipScrollbar';
import SkillsOrbit from './components/SkillsOrbit';
import TerminalSection from './components/TerminalSection';
import './components.css'; // Import the component styles

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optional: Add global entrance animations or loaders here
  }, []);

  return (
    <div 
      ref={containerRef}
      className="scroll-container"
      style={{
        backgroundImage: 'url(/stars-bg.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '400px',
      }}
    >
      <MeteorCanvas />
      <SpaceshipScrollbar />
      
      {/* Scrollable sections */}
      <div className="content-layer">
        
        <HeroSection />
        <ProjectsSection />
        <SkillsOrbit />
        <TerminalSection />
        
      </div>
    </div>
  );
}

export default App;
