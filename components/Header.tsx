
import React from 'react';
import { BookOpenIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 shadow-md border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-30 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="h-8 w-8 text-primary-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Easy Lesson
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            Your AI Study Partner
            </p>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};