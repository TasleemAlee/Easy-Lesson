
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SolutionDisplay } from './components/SolutionDisplay';
import { solveLessonFromImages } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { HeroVisual } from './components/HeroVisual';
import { ChevronDownIcon, UploadIcon, SparklesIcon, CheckCircleIcon, CoffeeIcon, WhatsAppIcon, ClipboardIcon, CloseIcon } from './components/icons';

const App: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [solution, setSolution] = useState<string>(() => localStorage.getItem('lessonSolution') || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyAccountButtonText, setCopyAccountButtonText] = useState('Copy');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!solution) return;
    const intervalId = setInterval(() => {
      localStorage.setItem('lessonSolution', solution);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [solution]);

  const handleImagesChange = (files: File[]) => {
    setImages(files);
    setSolution('');
    setError(null);
    localStorage.removeItem('lessonSolution');
  };

  const handleSubmit = useCallback(async () => {
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolution('');
    localStorage.removeItem('lessonSolution');

    try {
      const imageParts = await Promise.all(
        images.map(async (file) => {
          const base64Data = await fileToBase64(file);
          return {
            inlineData: { data: base64Data, mimeType: file.type },
          };
        })
      );

      const result = await solveLessonFromImages(imageParts);
      setSolution(result);
      localStorage.setItem('lessonSolution', result);
    } catch (err) {
      console.error(err);
      setError('Failed to solve the lesson. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [images]);

  const scrollToSolver = () => {
    document.getElementById('solver')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyAccountNumber = () => {
    const accountNumber = '03018981055';
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopyAccountButtonText('Copied!');
      setTimeout(() => setCopyAccountButtonText('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy account number: ', err);
      setCopyAccountButtonText('Failed!');
      setTimeout(() => setCopyAccountButtonText('Copy'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header theme={theme} setTheme={setTheme} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Your AI Study Partner
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 mb-8">
                From lesson page to complete solution in seconds. Snap a picture of any lesson in English, Urdu, or Sindhi to get instant answers.
              </p>
              <button
                onClick={scrollToSolver}
                className="group inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-700 transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-primary-400/40"
              >
                Start Solving
                <ChevronDownIcon className="w-5 h-5 transition-transform group-hover:translate-y-1" />
              </button>
            </div>
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Solver Section */}
      <main id="solver" className="container mx-auto px-4 py-16 lg:py-24 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <ImageUploader onImagesChange={handleImagesChange} onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 sticky top-24">
            <SolutionDisplay solution={solution} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>

      {/* How to Use Section */}
      <section className="bg-white dark:bg-slate-800/50 py-16 lg:py-24 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">Get your solutions in three simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mb-4">
                <UploadIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">1. Upload Images</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Click or drag-and-drop pictures of your lesson pages.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mb-4">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">2. Solve Exercises</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Let our AI work its magic analyzing your lesson.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mb-4">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">3. Get Solutions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your solved exercises will appear instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Easy Lesson. Created by Tasleem Sanjrani.</p>
        </div>
      </footer>
      
      {/* Support FABs */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col items-center gap-3">
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 p-4 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
          aria-label="Support my work"
        >
          <CoffeeIcon className="w-6 h-6" />
        </button>
         <a
          href="https://whatsapp.com/channel/0029Vb7Tf1gK0IBn3A2i6L2y"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join our WhatsApp Channel"
          className="bg-white dark:bg-slate-700 text-green-500 p-4 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
      </div>

      {/* Support Modal */}
      {isSupportModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-60 z-40 flex items-center justify-center p-4"
          onClick={() => setIsSupportModalOpen(false)}
          aria-modal="true" role="dialog"
        >
          <div
            className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1"
              aria-label="Close support modal"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div className="text-center">
              <CoffeeIcon className="h-12 w-12 mx-auto text-primary-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Support My Work</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                If Easy Lesson helps you, please consider buying me a cup of coffee. Your support keeps this project running!
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">EasyPaisa Details</h3>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold text-slate-600 dark:text-slate-300">Bank:</span> EasyPaisa</p>
                <p><span className="font-semibold text-slate-600 dark:text-slate-300">Account Title:</span> Tasleem</p>
                <div className="flex items-center justify-between">
                  <p><span className="font-semibold text-slate-600 dark:text-slate-300">Account Number:</span> 03018981055</p>
                  <button onClick={handleCopyAccountNumber} className="flex items-center gap-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium py-1.5 px-2.5 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors w-20 justify-center">
                    <ClipboardIcon className="w-3 h-3" />
                    {copyAccountButtonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;