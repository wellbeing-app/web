'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Globe, ArrowUpRight } from 'lucide-react';
import { useInView, motion } from 'framer-motion';
import { Apple, Android, Microsoft, Linux, Github } from '@/components/icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface DeveloperFriendlyProps {
  isFullPage?: boolean;
}

export function DeveloperFriendly({ isFullPage = false }: DeveloperFriendlyProps) {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true, amount: 0.5 });

  const platforms = [
    { name: 'iOS', icon: Apple, label: 'Download for iOS' },
    { name: 'Android', icon: Android, label: 'Download for Android' },
    { name: 'Windows', icon: Microsoft, label: 'Download for Windows' },
    { name: 'Linux', icon: Linux, label: 'Download for Linux' },
    { name: 'Web', icon: Globe, label: 'Open in browser' },
  ];

  type SequenceItem = 
    | { type: 'cmd', dir: string, text: string }
    | { type: 'out', lines: string[] };

  const sequence: SequenceItem[] = [
    { type: 'cmd', dir: '~/wellbeing', text: 'git clone https://github.com/wellbeing-app/web' },
    { type: 'out', lines: [
      "Cloning into 'web'...",
      "remote: Enumerating objects: 1027, done.",
      "remote: Counting objects: 100% (80/80), done.",
      "remote: Compressing objects: 100% (17/17), done.",
      "remote: Total 1027 (delta 66), reused 65 (delta 62), pack-reused 947 (from 1)",
      "Receiving objects: 100% (1027/1027), 2.54 MiB | 7.29 MiB/s, done.",
      "Resolving deltas: 100% (588/588), done."
    ]},
    { type: 'cmd', dir: '~/wellbeing', text: 'cd web' },
    { type: 'cmd', dir: '~/wellbeing/web', text: 'npm install' },
    { type: 'out', lines: [
      "added 998 packages, and audited 999 packages in 17s",
      "",
      "221 packages are looking for funding",
      "  run `npm fund` for details"
    ]},
    { type: 'cmd', dir: '~/wellbeing/web', text: 'npm run dev' },
    { type: 'out', lines: [
      "> web@0.1.0 dev",
      "> next dev",
      "",
      "▲ Next.js 16.2.3 (Turbopack)",
      "- Local:         http://localhost:3000",
      "- Network:       http://192.168.0.10:3000",
      "✓ Ready in 466ms"
    ]}
  ];

  const [step, setStep] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [currentDir, setCurrentDir] = useState('~/wellbeing');

  const scrollToBottom = () => {
    if (terminalRef.current) {
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [step, charIndex, lineIndex]);

  useEffect(() => {
    if (!isInView || step >= sequence.length) return;

    let timeoutId: NodeJS.Timeout;
    const currentAction = sequence[step];

    if (currentAction.type === 'cmd') {
      setCurrentDir(currentAction.dir);
      if (charIndex < currentAction.text.length) {
        timeoutId = setTimeout(() => {
          setCharIndex(prev => prev + 1);
          scrollToBottom();
        }, 30 + Math.random() * 50);
      } else {
        timeoutId = setTimeout(() => {
          setHistory(prev => [
            ...prev,
            <div key={`cmd-${step}`} className="mt-1">
              <span className="text-green-400">{currentAction.dir}</span>
              <span className="text-muted-foreground mx-2">$</span>
              <span className="text-foreground">{currentAction.text}</span>
            </div>
          ]);
          setStep(prev => prev + 1);
          setCharIndex(0);
          scrollToBottom();
        }, 400); // Wait after typing command before pressing enter
      }
    } else if (currentAction.type === 'out') {
      if (lineIndex < currentAction.lines.length) {
        timeoutId = setTimeout(() => {
          setHistory(prev => [
            ...prev,
            <div key={`out-${step}-${lineIndex}`} className="text-muted-foreground mt-1">
              {currentAction.lines[lineIndex] || '\u00A0'}
            </div>
          ]);
          setLineIndex(prev => prev + 1);
          scrollToBottom();
        }, 100 + Math.random() * 200);
      } else {
        timeoutId = setTimeout(() => {
          setStep(prev => prev + 1);
          setLineIndex(0);
        }, 200);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [step, charIndex, lineIndex, isInView]);

  const isFinished = step >= sequence.length;
  const currentAction = sequence[step];

  return (
    <div className="relative pt-12 md:pt-16 space-y-8 flex flex-col items-center w-full max-w-2xl mx-auto font-sans animate-fade-in">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight font-pixel uppercase [-webkit-text-stroke:0.3px_currentColor]">
          {dict.developer.title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {dict.developer.description}
        </p>
      </div>
      
      {!isFullPage && (
        <div className="w-full -mt-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm text-left flex flex-col h-[220px] md:h-[250px] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border/10 bg-black/5 dark:bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          <div 
            ref={terminalRef}
            data-scroll-lock="true"
            data-lenis-prevent="true"
            className="flex-1 p-6 overflow-y-auto scroll-smooth custom-scrollbar font-mono text-sm md:text-base whitespace-pre-wrap break-all sm:wrap-break-word flex flex-col min-h-[24px]"
          >
            {history}
            
            {!isFinished && currentAction?.type === 'cmd' && (
              <div className="mt-1">
                <span className="text-green-400">{currentAction.dir}</span>
                <span className="text-muted-foreground mx-2">$</span>
                <span className="text-foreground">{currentAction.text.slice(0, charIndex)}</span>
                <span className="inline-block w-2.5 h-4 md:h-5 ml-1 bg-foreground animate-pulse align-middle" />
              </div>
            )}
            
            {isFinished && (
              <div className="mt-2">
                <span className="text-green-400">{currentDir}</span>
                <span className="text-muted-foreground mx-2">$</span>
                <span className="inline-block w-2.5 h-4 md:h-5 ml-1 bg-foreground animate-pulse align-middle" />
              </div>
            )}
          </div>
        </div>
      )}

      {isFullPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex flex-col items-center gap-4 mt-12 md:mt-16"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">
            {dict.home.targetPlatforms}
          </span>
          <div className="flex flex-wrap justify-center gap-3 md:gap-5">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-card/50 border border-border/50 backdrop-blur-md rounded-xl md:rounded-2xl transition-all duration-500 hover:bg-secondary/80 hover:scale-110 active:scale-95 touch-manipulation hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] cursor-pointer group"
                aria-label={platform.label}
              >
                <platform.icon className="w-6 h-6 md:w-8 md:h-8 text-foreground/70 group-hover:text-foreground transition-all duration-300" />
              </div>
            ))}
          </div>

          <a
            href="https://github.com/wellbeing-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm md:text-base font-medium hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
          >
            <Github className="w-5 h-5" />
            {dict.developer.githubLink}
          </a>
        </motion.div>
      )}
    </div>
  );
}
