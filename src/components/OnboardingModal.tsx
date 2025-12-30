import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPreferences } from '../types';

interface OnboardingModalProps {
  onComplete: (preferences: UserPreferences) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        pronouns: pronouns.trim(),
        hasOnboarded: true
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Welcome to Simple Todo
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Let's personalize your experience. How may we address you?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="pronouns" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Pronouns (optional)
            </label>
            <input
              type="text"
              id="pronouns"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="input-field"
              placeholder="e.g., they/them, she/her, he/him"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Get Started
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};