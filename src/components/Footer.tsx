'use client';

import { motion } from 'framer-motion';
import { Github, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 py-8 mt-16 border-t border-cyber-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-2 text-gray-500">
            <Shield className="w-5 h-5 text-cyber-primary" />
            <span className="font-mono text-sm">Skillmetter</span>
          </div>
          
          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-500 text-xs font-mono max-w-md">
              ⚠️ Educational project only. Not affiliated with TryHackMe.
              <br />
              Uses simulated data for demonstration purposes.
            </p>
          </motion.div>
          
          {/* Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-500 hover:text-cyber-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <span className="flex items-center gap-1 text-gray-500 text-sm font-mono">
              Made with <Heart className="w-4 h-4 text-cyber-accent" /> for hackers
            </span>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs font-mono">
            © {new Date().getFullYear()} Skillmetter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
