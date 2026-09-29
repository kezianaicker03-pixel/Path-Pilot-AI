import React, { useState } from 'react';
import {
  Compass,
  GraduationCap,
  Sparkles,
  Bookmark,
  Calendar,
  Sliders,
  Award,
  Trash2,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  MapPin,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useStudent, NavigationTab } from '../context/StudentContext';

interface NavbarProps {
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPrivacy }) => {
  const {
    profile,
    activeTab,
    setActiveTab,
    setIsAskPilotOpen,
    loadDemoProfile,
    isDarkMode,
    toggleDarkMode,
    applications,
  } = useStudent();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'report', label: 'My Report ✨', icon: FileText },
    { id: 'discover', label: 'Discover', icon: Sparkles },
    { id: 'careers', label: 'Careers', icon: TrendingUp },
    { id: 'universities', label: 'Universities', icon: GraduationCap },
    { id: 'what-if', label: 'What If? 👀', icon: Sliders },
    { id: 'roadmap', label: 'My Roadmap', icon: MapPin },
    { id: 'planner', label: 'Applications', icon: Calendar },
    { id: 'funding', label: 'Funding', icon: Award },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab(profile ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/80">
                <Compass className="h-5 w-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-lg font-heading">
                  PathPilot <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-700/50">
                  BETA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Discover your path. Plan your future.</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          {profile && (
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                    {item.id === 'planner' && applications.length > 0 && (
                      <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
                        {applications.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Profile Load */}
          {!profile && (
            <button
              onClick={loadDemoProfile}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 rounded-lg transition-all shadow-sm"
              title="Load Grade 11 Demo Profile"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Load Demo Profile</span>
            </button>
          )}

          {/* Ask Pilot ✨ Button */}
          <button
            onClick={() => setIsAskPilotOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 rounded-lg shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-98"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span>Ask Pilot ✨</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Privacy & Settings */}
          <button
            onClick={onOpenPrivacy}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Privacy & Data Settings"
            aria-label="Privacy & Data Settings"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-900/98 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {profile ? (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 p-2.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/50'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('onboarding');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-lg"
              >
                <span>Start Discovery Quiz ✨</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  loadDemoProfile();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 text-indigo-300 text-sm font-semibold border border-indigo-800/40"
              >
                <span>Load Alex Demo Profile</span>
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Requirement 30: Home, Discover, Saved, Roadmap, Pilot) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab(profile ? 'dashboard' : 'landing')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'dashboard' || activeTab === 'landing' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'discover' || activeTab === 'onboarding' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'saved' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span>Saved</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'roadmap' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="h-5 w-5" />
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => setIsAskPilotOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold text-yellow-300 hover:text-yellow-200"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white">
            <Sparkles className="h-3 w-3" />
          </div>
          <span>Pilot</span>
        </button>
      </div>
    </header>
  );
};
