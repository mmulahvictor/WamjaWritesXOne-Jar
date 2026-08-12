import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Menu, X, Mic, Sparkles, Lock } from 'lucide-react';
import { OneJarLogo } from './OneJarLogo';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; badge?: string; isRestricted?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'poetry', label: 'Poetry', badge: 'One-Jar' },
    { id: 'writing', label: 'Writing' },
    { id: 'about', label: 'About' },
    { id: 'work-with-wanja', label: 'Services' },
    { id: 'videos', label: 'Videos' },
    { id: 'cms', label: 'Admin Portal', badge: 'Restricted', isRestricted: true },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Identifiers with Official One-Jar Poetry Logo */}
        <button 
          id="nav-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg p-1"
          aria-label="Faith Wanja One-Jar Poetry Home"
        >
          <OneJarLogo size="sm" showText={true} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1" role="navigation" aria-label="Main Desktop Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold flex items-center gap-1 ${
                    item.isRestricted
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : item.badge === 'Creator'
                      ? 'bg-indigo-600 text-white'
                      : item.badge === 'WCAG'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {item.isRestricted && <Lock className="w-2.5 h-2.5 shrink-0" />}
                    <span>{item.badge}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Booking Button */}
        <div className="hidden xl:flex items-center space-x-3">
          <button
            id="nav-book-btn"
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-all shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Book / Collaborate</span>
          </button>
        </div>

        {/* Mobile / Tablet Menu Toggle Button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            id="mobile-book-btn"
            onClick={onOpenBooking}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
          >
            Book
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn" role="navigation" aria-label="Mobile Navigation Drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  item.isRestricted 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  {item.isRestricted && <Lock className="w-3 h-3 shrink-0" />}
                  <span>{item.badge}</span>
                </span>
              )}
            </button>
          ))}
          <div className="pt-2">
            <button
              id="mobile-menu-booking-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Book Wanja for Event / Campaign</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
