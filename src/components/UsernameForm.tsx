'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Swords, AlertCircle, Sparkles } from 'lucide-react';
import { isValidUsername } from '@/lib/utils';

interface UsernameFormProps {
  onSubmit: (user1: string, user2: string) => void;
  error: string | null;
}

export default function UsernameForm({ onSubmit, error }: UsernameFormProps) {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    user1?: string;
    user2?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { user1?: string; user2?: string } = {};
    
    if (!user1.trim()) {
      errors.user1 = 'Enter your TryHackMe username';
    } else if (!isValidUsername(user1.trim())) {
      errors.user1 = 'Invalid username format';
    }
    
    if (!user2.trim()) {
      errors.user2 = 'Enter opponent username';
    } else if (!isValidUsername(user2.trim())) {
      errors.user2 = 'Invalid username format';
    }
    
    if (user1.trim().toLowerCase() === user2.trim().toLowerCase()) {
      errors.user2 = 'Cannot compare with yourself';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      onSubmit(user1.trim(), user2.trim());
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Intro Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-cyber-warning" />
          <h2 className="font-cyber text-2xl text-white">ENTER THE ARENA</h2>
          <Sparkles className="w-6 h-6 text-cyber-warning" />
        </div>
        <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
          Enter two TryHackMe usernames to initiate a skill battle.
          Discover who dominates the cyber arena!
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        {/* Input Cards Container */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* User 1 Input */}
          <motion.div
            className="cyber-card p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyber-secondary/20 border border-cyber-secondary/30">
                <User className="w-5 h-5 text-cyber-secondary" />
              </div>
              <div>
                <h3 className="font-cyber text-cyber-secondary text-sm">CHALLENGER</h3>
                <p className="text-gray-500 text-xs font-mono">Your username</p>
              </div>
            </div>
            
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type="text"
                value={user1}
                onChange={(e) => {
                  setUser1(e.target.value);
                  if (validationErrors.user1) {
                    setValidationErrors(prev => ({ ...prev, user1: undefined }));
                  }
                }}
                placeholder="Enter TryHackMe username"
                className="cyber-input text-lg"
                maxLength={20}
              />
            </motion.div>
            
            {validationErrors.user1 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-cyber-danger text-xs font-mono flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {validationErrors.user1}
              </motion.p>
            )}
          </motion.div>

          {/* VS Divider (Mobile) */}
          <div className="md:hidden flex items-center justify-center">
            <div className="p-3 rounded-full bg-cyber-accent/20 border border-cyber-accent/30">
              <Swords className="w-6 h-6 text-cyber-accent" />
            </div>
          </div>

          {/* User 2 Input */}
          <motion.div
            className="cyber-card p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyber-accent/20 border border-cyber-accent/30">
                <User className="w-5 h-5 text-cyber-accent" />
              </div>
              <div>
                <h3 className="font-cyber text-cyber-accent text-sm">OPPONENT</h3>
                <p className="text-gray-500 text-xs font-mono">Their username</p>
              </div>
            </div>
            
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type="text"
                value={user2}
                onChange={(e) => {
                  setUser2(e.target.value);
                  if (validationErrors.user2) {
                    setValidationErrors(prev => ({ ...prev, user2: undefined }));
                  }
                }}
                placeholder="Enter opponent username"
                className="cyber-input text-lg"
                maxLength={20}
              />
            </motion.div>
            
            {validationErrors.user2 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-cyber-danger text-xs font-mono flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {validationErrors.user2}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-cyber-danger/10 border border-cyber-danger/30 text-center"
          >
            <p className="text-cyber-danger font-mono text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            type="submit"
            className="cyber-btn text-lg px-12 py-4 flex items-center gap-3"
          >
            <Swords className="w-5 h-5" />
            INITIATE BATTLE
            <Swords className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.form>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-600 text-xs font-mono">
          💡 Tip: Try comparing with friends or top players to see how you stack up!
        </p>
      </motion.div>
    </div>
  );
}
