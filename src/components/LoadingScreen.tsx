'use client';

import { motion } from 'framer-motion';
import { Shield, Skull, Zap } from 'lucide-react';

export default function LoadingScreen() {
  const loadingMessages = [
    'Initiating cyber battle...',
    'Scanning TryHackMe profiles...',
    'Analyzing skill matrices...',
    'Computing battle scores...',
    'Determining champion...',
  ];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
      {/* Main Loading Animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-cyber-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyber-primary shadow-lg shadow-cyber-primary/50" />
        </motion.div>
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-cyber-secondary/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-cyber-secondary shadow-lg shadow-cyber-secondary/50" />
        </motion.div>
        
        {/* Center Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Zap className="w-10 h-10 text-cyber-primary" />
        </motion.div>
      </motion.div>

      {/* VS Animation */}
      <motion.div
        className="mt-8 flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Shield className="w-8 h-8 text-cyber-secondary" />
        </motion.div>
        
        <motion.span
          className="font-cyber text-2xl text-cyber-accent glow-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          VS
        </motion.span>
        
        <motion.div
          animate={{ x: [5, -5, 5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Skull className="w-8 h-8 text-cyber-accent" />
        </motion.div>
      </motion.div>

      {/* Loading Messages */}
      <motion.div
        className="mt-8 h-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {loadingMessages.map((message, index) => (
          <motion.p
            key={message}
            className="font-mono text-sm text-gray-400 text-center absolute left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, -10]
            }}
            transition={{
              duration: 2.5,
              delay: index * 2.5,
              repeat: Infinity,
              repeatDelay: (loadingMessages.length - 1) * 2.5,
            }}
          >
            {message}
          </motion.p>
        ))}
      </motion.div>

      {/* Progress Dots */}
      <div className="mt-8 flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-cyber-primary"
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Matrix Rain Effect (CSS) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-primary/5 to-transparent animate-scan-line" />
      </div>
    </div>
  );
}
