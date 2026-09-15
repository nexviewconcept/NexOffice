import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Server, Zap, Monitor, Lock, Globe, ChevronRight, CheckCircle2 } from 'lucide-react';
import { IconCAC, IconNIN, IconSCUML, IconTIN, IconLMS, IconWeb } from '../../components/icons/ServiceIcons';

export default function Landing() {
  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* 1. HERO SECTION (Explicitly Dark) */}
      <section className="relative overflow-hidden bg-[#030305] text-white pt-20 pb-28 lg:pt-36 lg:pb-40 border-b border-gray-900">
        
        {/* CUSTOM ANIMATIONS FOR HERO */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateZ(var(--tz, 0)) rotateX(var(--rx, 0)) rotateY(var(--ry, 0)); }
            50% { transform: translateY(-12px) translateZ(var(--tz, 0)) rotateX(calc(var(--rx, 0) + 1deg)) rotateY(calc(var(--ry, 0) + 1deg)); }
          }
          @keyframes flow {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
          .animate-float-1 { animation: float 7s ease-in-out infinite; }
          .animate-float-2 { animation: float 5.5s ease-in-out infinite 1s; }
          .animate-float-3 { animation: float 6.5s ease-in-out infinite 2s; }
          .animate-flow { stroke-dasharray: 8; animation: flow 3s linear infinite; }
          .preserve-3d { transform-style: preserve-3d; }
          
          .panel-1 { --tz: -40px; --rx: 15deg; --ry: -15deg; transform: translateZ(var(--tz)) rotateX(var(--rx)) rotateY(var(--ry)); }
          .panel-2 { --tz: 30px; --rx: 5deg; --ry: -5deg; transform: translateZ(var(--tz)) rotateX(var(--rx)) rotateY(var(--ry)); }
          .panel-3 { --tz: 90px; --rx: 15deg; --ry: -20deg; transform: translateZ(var(--tz)) rotateX(var(--rx)) rotateY(var(--ry)); }
          
          .panel-hover { transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s ease; }
          .panel-hover:hover {
             --tz-hover: calc(var(--tz) + 30px);
             transform: translateZ(var(--tz-hover)) rotateX(calc(var(--rx) * 0.3)) rotateY(calc(var(--ry) * 0.3)) scale(1.03) !important;
             z-index: 50;
          }
          @media (prefers-reduced-motion) {
             .animate-float-1, .animate-float-2, .animate-float-3, .animate-flow { animation: none; }
          }
        `}</style>

        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E50914]/10 via-[#030305] to-[#030305] z-0" />
        <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] bg-[#E50914]/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] z-0 opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left side: Copy */}
            <div className="flex flex-col items-start text-left z-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-700/60 bg-gray-900/60 backdrop-blur-md mb-8 shadow-lg shadow-black/50">
                <span className="relative flex h-2.5 w-2.5 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E50914]"></span>
                </span>
                <span className="text-[11px] font-bold tracking-[0.2em] text-gray-300 uppercase">Premium Technology Ecosystem</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Connected <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Infrastructure</span> <br className="hidden lg:block" />
                for Enterprise.
              </h1>
              <p className="text-lg lg:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed font-light">
                Nexview Concept unifies public identity verification, secure back-office operations, and robust desktop clients into a single, scalable technology ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/services" className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-bold text-white bg-[#E50914] hover:bg-red-700 shadow-[0_0_30px_rgba(229,9,20,0.25)] hover:shadow-[0_0_40px_rgba(229,9,20,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
                  Explore Ecosystem <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/contact" className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-bold text-gray-300 bg-gray-900/60 hover:bg-gray-800 border border-gray-700/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5">
                  Contact Sales
                </Link>
              </div>
            </div>

            {/* Right side: Live Digital Ecosystem UI */}
            <div className="relative w-full aspect-[4/3] max-w-[650px] mx-auto lg:mr-[-40px] hidden sm:block perspective-[1000px] pointer-events-none @container">
              
              {/* Background Atmospheric Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-[#E50914]/10 via-blue-900/5 to-transparent rounded-full blur-[60px] pointer-events-none" />

              <div className="absolute top-0 left-0 preserve-3d origin-top-left pointer-events-auto" style={{ width: '650px', height: '487px', transform: 'scale(calc(100cqi / 650))' }}>
                
                {/* CONNECTION LINES (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 650 487" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}>
                   {/* NVerify (160,214) to NexOffice (460,166) */}
                   <path d="M 160 214 Q 310 100 460 166" fill="none" stroke="url(#grad-blue-green)" strokeWidth="2" className="animate-flow opacity-70" />
                   {/* NVerify (160,214) to NDesk (410,373) */}
                   <path d="M 160 214 Q 250 350 410 373" fill="none" stroke="url(#grad-blue-red)" strokeWidth="2" className="animate-flow opacity-70" />
                   {/* NDesk (410,373) to NexOffice (460,166) */}
                   <path d="M 410 373 Q 500 270 460 166" fill="none" stroke="url(#grad-red-green)" strokeWidth="2" className="animate-flow opacity-70" />
                   
                   <defs>
                     <linearGradient id="grad-blue-green" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                       <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                     </linearGradient>
                     <linearGradient id="grad-red-green" x1="0%" y1="100%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#E50914" stopOpacity="0.8" />
                       <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                     </linearGradient>
                     <linearGradient id="grad-blue-red" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                       <stop offset="100%" stopColor="#E50914" stopOpacity="0.8" />
                     </linearGradient>
                   </defs>
                </svg>

                {/* BACKGROUND LAYER: NexOffice Dashboard */}
                <Link to="/login" className="absolute top-[10%] right-[0%] w-[380px] bg-[#0c0c11]/90 backdrop-blur-2xl border border-gray-800 rounded-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,1)] overflow-hidden panel-1 animate-float-1 panel-hover cursor-pointer group flex flex-col">
                  <div className="h-9 border-b border-gray-800/80 bg-[#13131a] flex items-center px-4 gap-2">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/80"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"/><div className="w-2.5 h-2.5 rounded-full bg-green-500/80"/></div>
                    <div className="ml-2 text-[10px] text-gray-500 font-mono tracking-wider flex items-center gap-2">
                      <Server className="w-3 h-3 text-green-500/70" /> NEXOFFICE ADMIN
                    </div>
                  </div>
                  <div className="flex h-[200px]">
                    <div className="w-14 border-r border-gray-800/80 p-2 space-y-2 bg-[#0c0c11]/50">
                       <div className="w-full h-8 rounded-md bg-gray-800/60" />
                       <div className="w-full h-8 rounded-md bg-gray-800/30" />
                       <div className="w-full h-8 rounded-md bg-gray-800/30" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center mb-1">
                         <div className="h-3 w-24 bg-gray-700/50 rounded" />
                         <div className="h-4 w-16 bg-green-500/10 border border-green-500/20 rounded-full" />
                      </div>
                      <div className="flex gap-3 h-14">
                         <div className="flex-1 rounded-lg bg-gray-800/40 border border-gray-700/50 p-2 flex flex-col justify-end">
                           <div className="h-1.5 w-8 bg-gray-600 rounded mb-1.5" /><div className="h-3 w-12 bg-gray-300 rounded" />
                         </div>
                         <div className="flex-1 rounded-lg bg-gray-800/40 border border-gray-700/50 p-2 flex flex-col justify-end">
                           <div className="h-1.5 w-10 bg-gray-600 rounded mb-1.5" /><div className="h-3 w-10 bg-gray-300 rounded" />
                         </div>
                      </div>
                      <div className="flex-1 rounded-lg bg-gray-800/30 border border-gray-700/50 flex items-end p-3 gap-2 overflow-hidden relative group-hover:border-gray-600/50 transition-colors">
                         <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent" />
                         {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-green-500/40 rounded-t-sm transition-all duration-1000 group-hover:bg-green-500/60" style={{ height: `${h}%` }} />
                         ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-green-500/0 group-hover:border-green-500/30 rounded-xl transition-colors duration-500 pointer-events-none" />
                </Link>

                {/* MIDDLE LAYER: NVerify Panel */}
                <Link to="/verify" className="absolute top-[25%] left-[0%] w-[320px] bg-[#0c0c11]/95 backdrop-blur-2xl border border-gray-700/80 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden panel-2 animate-float-2 panel-hover cursor-pointer group flex flex-col">
                  <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-gradient-to-r from-blue-900/10 to-transparent">
                     <div className="flex items-center gap-3">
                       <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors flex items-center justify-center">
                         <img src="/nverify-logo.png" alt="NVerify" className="w-5 h-5 object-contain drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-white tracking-tight">NVerify Identity Sync</div>
                         <div className="text-[9px] text-blue-400 font-mono flex items-center gap-1.5 mt-0.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> LIVE STREAM
                         </div>
                       </div>
                     </div>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-green-500/80 p-0.5 flex items-center justify-center">
                          <div className="w-full h-full bg-gray-700 rounded-full" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0c0c11] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-[#0c0c11]" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-24 bg-gray-200/90 rounded" />
                        <div className="h-1.5 w-32 bg-gray-600 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2.5 mt-2">
                      <div className="h-9 rounded-lg flex items-center px-3 bg-gray-800/60 border border-gray-700/50 justify-between group-hover:bg-gray-800/80 transition-colors">
                        <div className="h-1.5 w-16 bg-gray-500 rounded" />
                        <div className="text-[10px] font-mono text-green-400">VERIFIED</div>
                      </div>
                      <div className="h-9 rounded-lg flex items-center px-3 bg-gray-800/60 border border-gray-700/50 justify-between group-hover:bg-gray-800/80 transition-colors">
                        <div className="h-1.5 w-20 bg-gray-500 rounded" />
                        <div className="text-[10px] font-mono text-gray-400">24 MS PING</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/30 rounded-2xl transition-colors duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(59,130,246,0)] group-hover:shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" />
                </Link>

                {/* FOREGROUND LAYER: NDesk Client */}
                <Link to="/ndesk" className="absolute bottom-[5%] right-[10%] w-[350px] bg-[#050508]/95 backdrop-blur-3xl border border-[#E50914]/40 rounded-2xl shadow-[0_40px_80px_-20px_rgba(229,9,20,0.25)] overflow-hidden panel-3 animate-float-3 panel-hover cursor-pointer group flex flex-col">
                   <div className="h-10 bg-gradient-to-r from-[#111] to-[#050508] border-b border-gray-800/80 flex items-center px-4 justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700/80" />
                      </div>
                      <div className="bg-[#111] border border-gray-800 rounded-md px-3 py-1 flex items-center justify-center gap-2 w-48 mx-4 group-hover:border-gray-700 transition-colors">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] text-gray-400 font-mono">ndesk://secure-client</span>
                      </div>
                      <Monitor className="w-4 h-4 text-[#E50914]/80 group-hover:text-[#E50914] transition-colors" />
                   </div>
                   <div className="p-5 flex flex-col gap-4 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50914]/10 blur-2xl rounded-full pointer-events-none group-hover:bg-[#E50914]/20 transition-colors duration-700" />
                      
                      <div className="flex justify-between items-start z-10">
                        <div>
                          <div className="text-lg font-bold text-white mb-1 tracking-tight">NDesk Secure Workspace</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">End-to-End Encrypted</div>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-[#0a0a0a] border border-gray-800 flex items-center justify-center group-hover:border-[#E50914]/50 transition-colors overflow-hidden p-1 shadow-lg shadow-black/50">
                           <img src="/ndesk-logo.jpg" alt="NDesk" className="w-full h-full object-cover rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 z-10">
                         <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-800/80 group-hover:border-gray-700 transition-colors">
                            <div className="text-[9px] text-gray-500 mb-1.5 uppercase tracking-wider">Local Proxy</div>
                            <div className="text-xs text-white font-mono">127.0.0.1:4040</div>
                         </div>
                         <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-800/80 group-hover:border-gray-700 transition-colors">
                            <div className="text-[9px] text-gray-500 mb-1.5 uppercase tracking-wider">Session Status</div>
                            <div className="text-xs text-[#E50914] font-mono flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" /> ACTIVE
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute inset-0 border border-[#E50914]/0 group-hover:border-[#E50914]/30 rounded-2xl transition-colors duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(229,9,20,0)] group-hover:shadow-[inset_0_0_20px_rgba(229,9,20,0.1)]" />
                </Link>

              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. PRODUCTS / ECOSYSTEM */}
      <section className="py-24 bg-gray-50 dark:bg-[#09090b] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-[#E50914] tracking-widest uppercase mb-3">Our Core Products</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">The Three Pillars of Nex.</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              A deeply integrated suite of applications powering seamless public verification, private administration, and edge computing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* NVerify */}
            <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col items-start transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:border-gray-700">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800/50">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">NVerify Portal</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed flex-grow">
                The public-facing gateway for individuals and businesses. Register companies, verify identities, and access our digital services securely.
              </p>
              <Link to="/verify" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 group">
                Open NVerify <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* NexOffice */}
            <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col items-start transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:border-gray-700">
              <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-6 border border-green-100 dark:border-green-800/50">
                <Server className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">NexOffice Hub</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed flex-grow">
                The enterprise control center. Manage staff profiles, process public service requests, handle invoicing, and audit system activities.
              </p>
              <Link to="/login" className="inline-flex items-center text-green-600 dark:text-green-400 font-bold hover:text-green-700 dark:hover:text-green-300 group">
                Staff Access <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* NDesk */}
            <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2rem] shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col items-start transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:border-gray-700 relative overflow-hidden w-full">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Biometric Ready</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-6 border border-purple-100 dark:border-purple-800/50">
                <Monitor className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">NDesk Client</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed flex-grow">
                A highly secure, native desktop and mobile application featuring AI integration, isolated browsing, and localized document handling.
              </p>
              <Link to="/ndesk" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 group">
                Download App <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES CATALOGUE */}
      <section className="py-24 bg-white dark:bg-[#030305] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-[#E50914] tracking-widest uppercase mb-3">Enterprise Solutions</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Our Core Services</h3>
            </div>
            <Link to="/services" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconCAC className="w-6 h-6" />, title: 'CAC Registration', cat: 'Corporate', desc: 'Complete company registration: Limited Liability Companies, Business Names & Incorporated Trustees.' },
              { icon: <IconNIN className="w-6 h-6" />, title: 'NIN Verification', cat: 'Identity', desc: 'Verify date of birth, retrieve NIMC records, and download NIN or Premium slips instantly.' },
              { icon: <IconSCUML className="w-6 h-6" />, title: 'SCUML Compliance', cat: 'Compliance', desc: 'Obtain SCUML registration for Anti-Money Laundering compliance.' },
              { icon: <IconTIN className="w-6 h-6" />, title: 'TIN Registration', cat: 'Tax', desc: 'Get your corporate or individual Tax Identification Number (TIN) registered with FIRS.' },
              { icon: <IconLMS className="w-6 h-6" />, title: 'LMS Development', cat: 'Technology', desc: 'Custom Learning Management Systems for schools, training institutes, and enterprise.' },
              { icon: <IconWeb className="w-6 h-6" />, title: 'Web & App Design', cat: 'Technology', desc: 'Modern, high-performance websites, e-commerce platforms, and custom portals.' },
            ].map((svc, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-default flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-[#E50914]/10 flex items-center justify-center mb-6 text-[#E50914] group-hover:scale-110 transition-transform">
                  {svc.icon}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">{svc.cat}</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{svc.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST & TECHNOLOGY (WHY NEX) */}
      <section className="py-24 bg-gray-50 dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-[#E50914] tracking-widest uppercase mb-3">Enterprise Grade</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                Built for scale, secured by design.
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We combine regulatory expertise with modern software architecture to deliver compliance and identity services that Nigerian businesses can rely on.
              </p>
              <ul className="space-y-6">
                {[
                  { icon: <Lock className="w-6 h-6 text-[#E50914]"/>, title: 'Secure & Confidential', text: 'All personal data and documents are handled with strict encryption and isolation protocols.' },
                  { icon: <Zap className="w-6 h-6 text-[#E50914]"/>, title: 'Fast Execution', text: 'Instant processing for identity slips. Priority handling for corporate registrations.' },
                  { icon: <Globe className="w-6 h-6 text-[#E50914]"/>, title: 'Centralized Architecture', text: 'One account, one backend, multiple integrated applications.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/20 to-transparent z-10" />
                {/* Abstract tech pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-20">
                   <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">System Status</div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">All APIs Operational</div>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-4/6" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 bg-white dark:bg-[#030305]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Ready to integrate with Nexview?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience a modern approach to corporate compliance, identity verification, and enterprise management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/services" className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-bold text-white bg-[#E50914] hover:bg-red-700 shadow-lg transition-all">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/contact" className="inline-flex justify-center items-center px-8 py-4 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
