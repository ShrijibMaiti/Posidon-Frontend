import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 mb-2">
    {children}
  </div>
);

const PipelineStep = ({ 
  icon: Icon, 
  title, 
  description, 
  active = false,
  isLast = false
}: { 
  icon: any, 
  title: string, 
  description: string, 
  active?: boolean,
  isLast?: boolean
}) => (
  <div className="flex gap-8 group">
    <div className="flex flex-col items-center">
      <div className={`w-8 h-8 flex items-center justify-center border transition-colors duration-500 rounded-none ${
        active ? 'bg-neutral-900 border-neutral-900' : 'bg-neutral-100 border-neutral-200'
      }`}>
        <Icon size={16} className={active ? 'text-white' : 'text-neutral-400'} />
      </div>
      {!isLast && (
        <div className="w-[1px] flex-1 bg-neutral-200 overflow-hidden">
          <motion.div 
            className="w-full bg-neutral-900"
            initial={{ height: "0%" }}
            animate={{ height: active ? "100%" : "0%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
    <div className="pb-12 pt-1">
      <h4 className={`text-[15px] font-semibold transition-colors duration-500 ${active ? 'text-neutral-900' : 'text-neutral-400'}`}>
        {title}
      </h4>
      <p className="text-[13px] text-neutral-500 leading-relaxed mt-2 max-width-[400px]">
        {description}
      </p>
    </div>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const [utcTime, setUtcTime] = useState(new Date().toISOString().slice(11, 19));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(new Date().toISOString().slice(11, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Hero */}
      <section className="h-screen flex flex-col justify-center px-8 relative overflow-hidden bg-white border-b border-neutral-100">
        {/* River Animation */}
        <svg className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none opacity-[0.15] z-0">
          <motion.path
            d="M 0 50 Q 200 10, 400 50 T 800 50 T 1200 50 T 1600 50"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="1"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </svg>

        <div className="z-10 max-w-4xl">
          <h1 className="text-[64px] font-[800] leading-[1.05] tracking-[-0.02em] text-neutral-900 m-0">
            On August 17, 2021, 1.5 million people flooded.
          </h1>
          <h1 className="text-[64px] font-[800] leading-[1.05] tracking-[-0.02em] text-red-600 m-0">
            Nobody was warned.
          </h1>
          
          <p className="text-[18px] text-neutral-500 max-w-[520px] mt-8 leading-relaxed font-[400]">
            Poseidon exists so it never happens again. Physics-based flood prediction. 
            Cryptographic accountability. Bengali-language alerts. Built for the Damodar basin.
          </p>

          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-10 px-8 py-4 border border-neutral-900 bg-transparent text-neutral-900 text-[14px] font-[600] tracking-[0.04em] uppercase transition-all hover:bg-neutral-900 hover:text-white cursor-pointer rounded-none group flex items-center gap-2"
          >
            View Live Dashboard
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="absolute bottom-8 right-8 font-mono text-[11px] text-neutral-300 tracking-wider">
          {utcTime} UTC
        </div>
      </section>

      {/* 2. The Three Failures */}
      <section className="py-32 px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="text-[36px] font-[800] text-neutral-900 mt-2 mb-16">Three failures. One catastrophe.</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            {[
              {
                id: '01',
                title: "Black-box forecasts",
                desc: "DVC dam release decisions came with no auditable explanation. When warnings were wrong, nobody was accountable and nobody could verify what had been issued."
              },
              {
                id: '02',
                title: "Language barrier",
                desc: "Official flood alerts were issued in English and Hindi. The farmers and fisherfolk of Ghatal speak Bengali — a warning in the wrong language cannot save a life."
              },
              {
                id: '03',
                title: "Data desert",
                desc: "Standard flood models need decades of sensor data to calibrate. The remote Damodar tributaries are severely under-gauged — models fail precisely where and when they are most needed."
              }
            ].map((failure) => (
              <motion.div 
                key={failure.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white border border-neutral-200 p-8 rounded-lg transition-colors hover:border-neutral-400 group"
              >
                <div className="text-[48px] font-[800] text-neutral-900 lining-nums tabular-nums mb-4">{failure.id}</div>
                <h3 className="text-[16px] font-[600] text-neutral-900 mb-2">{failure.title}</h3>
                <p className="text-[14px] text-neutral-500 leading-[1.75] font-[400]">{failure.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-32 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-[36px] font-[800] text-neutral-900 mt-2 mb-16">From anomaly to alert in seconds.</h2>
          
          <div className="max-w-xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              onViewportEnter={() => {
                // Sequential activation logic could go here if needed
                const interval = setInterval(() => {
                  setActiveStep(prev => (prev < 4 ? prev + 1 : prev));
                }, 1000);
                return () => clearInterval(interval);
              }}
            >
              {[
                { 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="12" cy="12" r="7" className="animate-pulse" />
                    </svg>
                  ),
                  title: "CWC Anomaly Detected", 
                  description: "Water level anomaly triggers the simulation pipeline via REST API." 
                },
                { 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
                      <path d="M2 12h3l2-5 3 10 3-10 3 10 3-5h3" />
                    </svg>
                  ),
                  title: "FNO Inference", 
                  description: "DVC Panchet discharge data feeds the FNO inference engine." 
                },
                { 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  ),
                  title: "ZK Proof Anchored", 
                  description: "SP1 generates a cryptographic proof of the prediction hash, permanently anchored on Polygon Amoy." 
                },
                { 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ),
                  title: "Gemini Generates Alert", 
                  description: "Gemini 2.0 Flash converts the flood forecast JSON into bilingual English and Bengali plain-language text." 
                },
                { 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
                      <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  ),
                  title: "Bengali Audio Broadcast", 
                  description: "Google Cloud TTS Neural2 Bengali voice generates the .mp3. A district official can broadcast it immediately." 
                }
              ].map((step, idx) => (
                <div key={idx}>
                  <PipelineStep 
                    {...step} 
                    active={activeStep >= idx}
                    isLast={idx === 4}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Tech Stack */}
      <section className="py-24 px-8 bg-neutral-50 mb-1">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Built With</SectionLabel>
          <div className="flex flex-col gap-12 mt-12">
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10">
              {['Google Cloud', 'JAX', 'Gemini', 'Cloud Run', 'Cloud TTS', 'Google Earth Engine'].map(tech => (
                <span key={tech} className="text-[13px] font-[600] text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-[0.06em] cursor-default">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10">
              {['Polygon', 'Succinct SP1', 'Next.js', 'deck.gl'].map(tech => (
                <span key={tech} className="text-[13px] font-[600] text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-[0.06em] cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Impact */}
      <section className="py-32 px-8 bg-white border-y border-neutral-100 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <ImpactValue value={1.5} />
          <p className="text-[20px] text-neutral-500 mt-4 leading-relaxed font-[400]">
            People displaced in the August 2021 Damodar floods.
          </p>
          <p className="text-[15px] text-neutral-300 mt-2 font-[400]">
            This is who Poseidon was built for.
          </p>
        </div>
      </section>

      {/* 6. Footer CTA */}
      <footer className="py-20 px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 border border-neutral-900 bg-transparent text-neutral-900 text-[14px] font-[600] tracking-[0.04em] uppercase transition-all hover:bg-neutral-900 hover:text-white cursor-pointer rounded-none"
            >
              View Live Dashboard →
            </button>
            <div className="mt-12 text-neutral-300">
               <div className="text-[13px] font-[600] tracking-[0.12em] uppercase mb-4">Poseidon</div>
               <div className="flex gap-6 text-[12px] font-medium">
                 <a href="#" className="hover:text-black transition-colors underline-offset-4 hover:underline">GitHub</a>
                 <a href="#" className="hover:text-black transition-colors underline-offset-4 hover:underline">Documentation</a>
                 <span className="text-neutral-200">|</span>
                 <span>GDG Hackathon 2026 Submission</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ImpactValue({ value }: { value: number }) {
  const [inView, setInView] = useState(false);
  const count = useCountUp(inView ? value : 0, 2000, 0);

  return (
    <motion.div 
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true }}
      className="text-[96px] font-[800] text-red-600 tabular-nums leading-none flex items-baseline justify-center"
    >
      {count.toFixed(1)}
      <span className="ml-1">M</span>
    </motion.div>
  );
}
