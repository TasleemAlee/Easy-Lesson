
import React from 'react';

// Sub-components for floating icons to keep the main component clean
const ScienceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11.5 2.5a9.5 9.5 0 015.58 16.835" strokeLinecap="round"/>
    <path d="M12.5 21.5a9.5 9.5 0 01-5.58-16.835" strokeLinecap="round"/>
    <path d="M2.5 12.5a9.5 9.5 0 0116.835-5.58" strokeLinecap="round"/>
    <path d="M21.5 11.5a9.5 9.5 0 01-16.835 5.58" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1.5" stroke="none" fill="currentColor"/>
  </svg>
);

const MathIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12L7 2h3l-3 10zm4 0h5m-5 8l3-10h2L8 20zm8-18s-1 0-1 1v2c0 1 1 1 1 1h1s1 0 1-1V4c0-1-1-1-1-1h-1zm-1 5h1v1h-1V9z"/>
    </svg>
);

const LiteratureIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);


export const HeroVisual: React.FC = () => {
  return (
    <div className="relative h-96 flex items-center justify-center">
        {/* Abstract shapes and gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 dark:bg-primary-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-16 left-10 w-64 h-64 bg-yellow-200 dark:bg-yellow-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-10 left-0 w-48 h-48 bg-pink-200 dark:bg-pink-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating Subject Icons */}
        <div className="absolute top-10 left-12 w-16 h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-blue-500 animate-float animation-delay-1000">
            <ScienceIcon />
        </div>
        <div className="absolute bottom-12 left-24 w-16 h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-red-500 animate-float animation-delay-3000">
            <MathIcon />
        </div>
        <div className="absolute top-1/2 -mt-16 right-12 w-16 h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-green-500 animate-float animation-delay-5000">
            <LiteratureIcon />
        </div>

        {/* Central AI Core */}
        <div className="relative w-64 h-64 animate-float">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-full opacity-50"></div>
            <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full shadow-2xl flex items-center justify-center">
                <div className="relative w-48 h-48">
                    {/* Glowing Core */}
                    <div className="absolute inset-10 bg-primary-500 rounded-full filter blur-xl opacity-60 animate-pulse"></div>
                    <div className="absolute inset-12 bg-primary-400 rounded-full filter blur-md opacity-80"></div>
                    
                    {/* Circuit Lines */}
                    <svg className="absolute inset-0 animate-spin-slow text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
                        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    
                     {/* Data Particles */}
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-orbit" style={{'--orbit-radius': '45px', '--orbit-duration': '5s', '--orbit-delay': '0s'} as React.CSSProperties}></div>
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-orbit" style={{'--orbit-radius': '56px', '--orbit-duration': '7s', '--orbit-delay': '-2s'} as React.CSSProperties}></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-sky-300 rounded-full animate-orbit" style={{'--orbit-radius': '68px', '--orbit-duration': '6s', '--orbit-delay': '-4s'} as React.CSSProperties}></div>
                </div>
            </div>
        </div>
        <style jsx>{`
            .animate-blob {
                animation: blob 8s infinite ease-in-out;
            }
            .animate-float {
                animation: float 6s infinite ease-in-out;
            }
            .animate-spin-slow {
                animation: spin 20s linear infinite;
            }
            .animate-orbit {
                transform-origin: center center;
                animation: orbit var(--orbit-duration) linear infinite;
                animation-delay: var(--orbit-delay);
            }
            .animation-delay-1000 { animation-delay: 1s; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-3000 { animation-delay: 3s; }
            .animation-delay-4000 { animation-delay: 4s; }
            .animation-delay-5000 { animation-delay: 5s; }

            @keyframes blob {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(20px, -30px) scale(1.1); }
                66% { transform: translate(-15px, 15px) scale(0.9); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }
            @keyframes orbit {
                from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
                to { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
            }
        `}</style>
    </div>
  );
};
