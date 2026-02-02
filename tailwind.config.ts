import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',
          darker: '#050508',
          primary: '#00ff88',
          secondary: '#00d4ff',
          accent: '#ff00ff',
          warning: '#ffaa00',
          danger: '#ff3366',
          muted: '#1a1a2e',
          card: '#0f0f1a',
          border: '#1f1f3a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        cyber: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'glitch': 'glitch 0.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'winner-glow': 'winner-glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88' },
          '50%': { boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'winner-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88',
            borderColor: '#00ff88'
          },
          '50%': { 
            boxShadow: '0 0 30px #00d4ff, 0 0 60px #00d4ff, 0 0 90px #00d4ff',
            borderColor: '#00d4ff'
          },
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
