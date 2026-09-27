import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
  isHonourable?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  techStack, 
  link, 
  github,
  isHonourable = false
}) => {
  return (
    <div className={`project-card ${isHonourable ? 'project-card-honourable' : ''}`} style={{ width: '320px', minHeight: '350px' }}>
      <div className="project-content">
        <h3 style={{ 
          color: isHonourable ? 'var(--accent-gold)' : 'var(--accent-cyan)',
          marginBottom: '1rem',
          fontSize: '1.25rem'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          color: 'var(--text-muted)', 
          flexGrow: 1,
          lineHeight: '1.5',
          fontSize: '0.95rem'
        }}>
          {description}
        </p>
        
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {techStack.map(tech => (
              <span key={tech} style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          {link && (
            <a href={link} target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, justifyContent: 'center' }}>
              <ExternalLink size={16} /> Demo
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, justifyContent: 'center' }}>
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
