import React from 'react';

export const AboutDeveloper: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 blur-xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">About the Developer</h2>
              <p className="text-xs text-slate-500 font-medium">Design & Engineering</p>
            </div>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Hi, I'm <strong>Juan Miguel</strong>. I build high-quality web applications and digital experiences. Check out my portfolio to see more of my work.
        </p>

        <a 
          href="https://www.juanmiguel.dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all duration-300 group-hover:border-indigo-300 group-hover:shadow-md">
            {/* Mock Browser Bar */}
            <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-2">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
               </div>
               <div className="flex-1 bg-slate-100 rounded text-[10px] text-slate-500 px-2 py-0.5 text-center truncate">
                 juanmiguel.dev
               </div>
            </div>
            
            {/* Content Preview */}
            <div className="p-4 flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors">
               <span className="text-indigo-600 font-semibold text-sm flex items-center gap-2">
                 Visit Website
                 <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};