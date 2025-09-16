'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ComicText } from "@/components/ui/comic-text";

interface NavbarProps {
  onSettingsOpen: () => void;
}

export default function Navbar({ onSettingsOpen }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: '/notes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      label: 'Notes',
      color: 'yellow',
      hoverColor: 'hover:border-yellow-400/60 hover:text-yellow-300'
    },
    {
      onClick: onSettingsOpen,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Settings',
      color: 'blue',
      hoverColor: 'hover:border-blue-400/60 hover:text-blue-300'
    }
  ];

  const socialLinks = [
    {
      name: 'X (Twitter)',
      url: 'https://twitter.com/yash__patidar_',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Yash-Patidar/lock-in',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* App Logo/Name */}
            <div className="flex items-center gap-3">
              {/* Simple Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              {/* ComicText Branding */}
              <ComicText fontSize={1.5} className="text-white">
                LOCK-IN
              </ComicText>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item, index) => (
                item.href ? (
                  <Link
                    key={index}
                    href={item.href}
                    className={`glass-effect px-4 py-2 rounded-lg text-white/80 hover:text-white transition-all duration-300 border border-white/20 ${item.hoverColor} hover:scale-105 flex items-center gap-2`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`glass-effect px-4 py-2 rounded-lg text-white/80 hover:text-white transition-all duration-300 border border-white/20 ${item.hoverColor} hover:scale-105 flex items-center gap-2`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              ))}

              {/* Social Links */}
              <div className="flex items-center gap-2 ml-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-effect w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-cyan-400 hover:border-cyan-400/60 transition-all duration-300 border border-white/20 hover:scale-105 group"
                    title={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden glass-effect px-3 py-2 rounded-lg text-white/80 hover:text-white transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-80 opacity-100 border-t border-white/10'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-4 space-y-3 glass-effect">
            {navItems.map((item, index) => (
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full glass-effect px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all duration-300 border border-white/20 ${item.hoverColor} flex items-center gap-3`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full glass-effect px-4 py-3 rounded-lg text-white/80 hover:text-white transition-all duration-300 border border-white/20 ${item.hoverColor} flex items-center gap-3`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                  <span className="font-medium text-base">{item.label}</span>
                </button>
              )
            ))}

            {/* Mobile Social Links */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-effect w-12 h-12 flex items-center justify-center rounded-lg text-white/60 hover:text-cyan-400 hover:border-cyan-400/60 transition-all duration-300 border border-white/20 hover:scale-105"
                    title={link.name}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
}