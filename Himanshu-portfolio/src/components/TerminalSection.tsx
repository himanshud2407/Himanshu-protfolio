import React, { useState, useEffect, useRef } from 'react';

// Simplified Virtual File System
const fileSystem: any = {
  'README.txt': 'Welcome to HimanshuOS v1.0.0.\nType "help" to see available commands.',
  'about.txt': 'Hi! I am Himanshu, a Full-Stack & AI Developer.\nI specialize in React, Node, Python, and Machine Learning.',
  'skills': {
    'frontend.txt': '- React\n- Next.js\n- TypeScript\n- TailwindCSS\n- GSAP',
    'backend.txt': '- Node.js\n- Python\n- FastAPI\n- Django\n- PostgreSQL',
    'ai.txt': '- TensorFlow\n- PyTorch\n- Scikit-learn\n- Pandas'
  }
};

interface OutputBlock {
  type: 'input' | 'output' | 'error';
  content: string;
}

const TerminalSection: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<OutputBlock[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-focus the input
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    document.addEventListener('click', focusInput);
    return () => document.removeEventListener('click', focusInput);
  }, []);

  // Auto-scroll to bottom on output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Initial command
  useEffect(() => {
    handleCommand('cat README.txt', true);
  }, []);

  const getDirectory = (path: string[]): any => {
    let current = fileSystem;
    for (const dir of path) {
      if (current[dir] && typeof current[dir] === 'object') {
        current = current[dir];
      } else {
        return null;
      }
    }
    return current;
  };

  const handleCommand = (cmdStr: string, silentInput = false) => {
    const cmd = cmdStr.trim();
    if (!cmd) return;

    if (!silentInput) {
      setHistory(prev => [...prev, { type: 'input', content: `guest@himanshu:~/$\{(currentPath.length > 0 ? currentPath.join('/') : '')} $ $\{cmd}` }]);
    }

    const args = cmd.split(' ').filter(Boolean);
    const command = args[0].toLowerCase();
    
    let output = '';
    let isError = false;
    const currentDir = getDirectory(currentPath);

    switch (command) {
      case 'help':
        output = 'Available commands:\n  help    - Show this message\n  ls      - List directory contents\n  cd      - Change directory\n  cat     - View file contents\n  clear   - Clear terminal output';
        break;
      
      case 'ls':
        if (currentDir) {
          output = Object.keys(currentDir).map(k => typeof currentDir[k] === 'object' ? `$\{k}/` : k).join('  ');
        }
        break;

      case 'cd':
        const target = args[1];
        if (!target || target === '~' || target === '/') {
          setCurrentPath([]);
        } else if (target === '..') {
          if (currentPath.length > 0) {
            setCurrentPath(prev => prev.slice(0, -1));
          }
        } else {
          if (currentDir[target] && typeof currentDir[target] === 'object') {
            setCurrentPath(prev => [...prev, target]);
          } else {
            output = `cd: $\{target}: No such directory`;
            isError = true;
          }
        }
        break;

      case 'cat':
        const file = args[1];
        if (!file) {
          output = 'cat: missing file operand';
          isError = true;
        } else if (currentDir[file] && typeof currentDir[file] === 'string') {
          output = currentDir[file];
        } else if (currentDir[file] && typeof currentDir[file] === 'object') {
          output = `cat: $\{file}: Is a directory`;
          isError = true;
        } else {
          output = `cat: $\{file}: No such file`;
          isError = true;
        }
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        output = `command not found: $\{command}`;
        isError = true;
    }

    if (output) {
      setHistory(prev => [...prev, { type: isError ? 'error' : 'output', content: output }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  const promptPath = currentPath.length > 0 ? `~/$\{currentPath.join('/')}` : '~';

  return (
    <section id="terminal" className="fullscreen-section" style={{ minHeight: '100dvh', padding: '5rem 2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Terminal</h2>
      
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="tb close"></span>
            <span className="tb minimize"></span>
            <span className="tb expand"></span>
          </div>
          <div className="terminal-title">guest@himanshu:~</div>
        </div>
        
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          {history.map((block, i) => (
            <div key={i} className={`term-block $\{block.type}`}>
              {block.content}
            </div>
          ))}
          
          <div className="term-input-line">
            <span className="term-prompt">guest@himanshu:<span style={{color: 'var(--accent-cyan)'}}>{promptPath}</span> $</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="term-input"
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </section>
  );
};

export default TerminalSection;
