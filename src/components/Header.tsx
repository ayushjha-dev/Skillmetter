'use client';

import { motion } from 'framer-motion';
import { Shield, Swords } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-20 py-6 border-b border-cyber-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Logo */}
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10 text-cyber-secondary" />
            <h1 className="font-cyber text-4xl md:text-5xl cyber-title font-bold tracking-wider">
              SKILLMETTER
            </h1>
            <Swords className="w-10 h-10 text-cyber-accent" />
          </div>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 text-lg font-mono"
          >
            TryHackMe Profile Comparison Platform
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 h-px w-full max-w-md bg-gradient-to-r from-transparent via-cyber-primary to-transparent"
          />
        </motion.div>
      </div>
      
      {/* Animated background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-cyber-primary/20 via-transparent to-cyber-primary/20" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-cyber-secondary/20 via-transparent to-cyber-secondary/20" />
      </div>
    </header>
  );
}
