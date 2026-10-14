import React, { useState } from 'react';
import {
  Sprout,
  Compass,
  Building2,
  ShieldCheck,
  Languages,
  Menu,
  X,
  UserCheck,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { UserProfile, UserRole, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface NavbarProps {
  currentUser: UserProfile;
  currentRole: UserRole;
  language: Language;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onToggleLanguage: () => void;
  onResetData: () => void;
  onOpenTestRunner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  language,
  activeTab,
  onSelectTab,
  onSwitchRole,
  onToggleLanguage,
  onResetData,
  onOpenTestRunner,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return { label: t.roleFarmer, bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600' };
      case 'tourist':
        return { label: t.roleTourist, bg: 'bg-sky-100 text-sky-800 border-sky-300', dot: 'bg-sky-600' };
      case 'community_manager':
        return { label: t.roleCommunity, bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-600' };
      case 'administrator':
        return { label: t.roleAdmin, bg: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-600' };
    }
  };

  const currentBadge = getRoleBadge(currentRole);

  const getNavLinks = () => {
    const base = [
      { id: 'landing', label: t.navHome, icon: Sprout },
    ];

    if (currentRole === 'farmer') {
      base.push(
        { id: 'farmer_dashboard', label: t.navFarmerHub, icon: Sprout },
        { id: 'soil_analysis', label: t.navSoilAnalysis, icon: Sprout },
        { id: 'crop_suitability', label: t.navCropSuitability, icon: Sprout },
        { id: 'crop_profit', label: t.navCropPlanner, icon: Sprout },
        { id: 'crop_health', label: t.navCropHealth, icon: Sprout },
        { id: 'market_data', label: t.navMarket, icon: ShoppingBag },
        { id: 'govt_schemes', label: t.navSchemes, icon: Building2 },
        { id: 'farmstay_register', label: 'My Farm-Stay', icon: Compass },
      );
    } else if (currentRole === 'tourist') {
      base.push(
        { id: 'tourist_search', label: t.navFarmStays, icon: Compass },
        { id: 'tourist_enquiries', label: 'My Enquiries', icon: UserCheck },
        { id: 'marketplace', label: t.navMarketplace, icon: ShoppingBag },
        { id: 'community_hub', label: t.navCommunity, icon: Building2 },
      );
    } else if (currentRole === 'community_manager') {
      base.push(
        { id: 'community_hub', label: t.navCommunity, icon: Building2 },
        { id: 'infra_gap_reports', label: 'Infrastructure Gaps', icon: Building2 },
        { id: 'community_directory', label: 'Local Business Directory', icon: Building2 },
        { id: 'marketplace', label: t.navMarketplace, icon: ShoppingBag },
        { id: 'tourist_search', label: t.navFarmStays, icon: Compass },
      );
    } else if (currentRole === 'administrator') {
      base.push(
        { id: 'admin_dashboard', label: t.navAdmin, icon: ShieldCheck },
        { id: 'tourist_search', label: t.navFarmStays, icon: Compass },
        { id: 'farmer_dashboard', label: t.navFarmerHub, icon: Sprout },
        { id: 'community_hub', label: t.navCommunity, icon: Building2 },
        { id: 'marketplace', label: t.navMarketplace, icon: ShoppingBag },
      );
    }

    return base;
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs" role="banner">
      {/* Top Notification / Demo Role Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4" aria-label="System notification bar">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/60">
              <Sparkles className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              Verified Agritech & Rural Tourism Platform
            </span>
            <span className="hidden sm:inline text-stone-500" aria-hidden="true">|</span>
            <span className="hidden md:inline text-stone-300">
              Active Persona: <strong className="text-white font-medium">{currentUser.name}</strong> ({currentBadge.label})
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Acceptance Test Runner Trigger */}
            <button
              onClick={onOpenTestRunner}
              className="flex items-center gap-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600/70 px-2.5 py-1 rounded text-xs transition font-semibold focus-visible:outline-2 focus-visible:outline-purple-400"
              title="Execute Acceptance Tests"
              aria-label="Run automated acceptance test suite"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
              <span>Run Acceptance Tests</span>
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white px-2.5 py-1 rounded text-xs transition border border-stone-700 focus-visible:outline-2 focus-visible:outline-emerald-400"
                title="Switch demo persona"
                aria-haspopup="true"
                aria-expanded={roleMenuOpen}
                aria-label={`Current role: ${currentBadge.label}. Click to switch persona`}
              >
                <span>Role:</span>
                <span className="font-semibold text-emerald-300">{currentBadge.label}</span>
                <span className="text-stone-400" aria-hidden="true">▾</span>
              </button>

              {roleMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-stone-200 py-1.5 text-stone-800 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Switch Test Persona
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => { onSwitchRole('farmer'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between focus:bg-emerald-50 focus:outline-hidden"
                  >
                    <div>
                      <div className="font-medium text-stone-900">Ramesh Kumar (Farmer)</div>
                      <div className="text-[11px] text-stone-500">Choutuppal, Telangana • 12 Acres</div>
                    </div>
                    {currentRole === 'farmer' && <span className="text-emerald-600 font-bold" aria-hidden="true">✓</span>}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { onSwitchRole('tourist'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 flex items-center justify-between focus:bg-sky-50 focus:outline-hidden"
                  >
                    <div>
                      <div className="font-medium text-stone-900">Ananya Sharma (Tourist)</div>
                      <div className="text-[11px] text-stone-500">Exploring authentic farm stays</div>
                    </div>
                    {currentRole === 'tourist' && <span className="text-sky-600 font-bold" aria-hidden="true">✓</span>}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { onSwitchRole('community_manager'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between focus:bg-amber-50 focus:outline-hidden"
                  >
                    <div>
                      <div className="font-medium text-stone-900">Priya Patil (Community)</div>
                      <div className="text-[11px] text-stone-500">Panchayat & Infrastructure lead</div>
                    </div>
                    {currentRole === 'community_manager' && <span className="text-amber-600 font-bold" aria-hidden="true">✓</span>}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { onSwitchRole('administrator'); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center justify-between focus:bg-purple-50 focus:outline-hidden"
                  >
                    <div>
                      <div className="font-medium text-stone-900">Dr. K. Srinivas (Admin)</div>
                      <div className="text-[11px] text-stone-500">Farm verification & criteria lead</div>
                    </div>
                    {currentRole === 'administrator' && <span className="text-purple-600 font-bold" aria-hidden="true">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-white px-2 py-1 rounded text-xs transition border border-stone-700 focus-visible:outline-2 focus-visible:outline-emerald-400"
              title="Toggle English / Telugu"
              aria-label="Toggle language between English and Telugu"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Reset Seed Data */}
            <button
              onClick={onResetData}
              className="hidden lg:flex items-center gap-1 text-stone-400 hover:text-stone-200 px-1 text-xs focus-visible:outline-2 focus-visible:outline-emerald-400"
              title="Reset to default clean data"
              aria-label="Reset all application data to default sample state"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-3 group text-left focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg p-1"
            aria-label="FarmBridge AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform" aria-hidden="true">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-stone-900">FarmBridge</span>
                <span className="text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">Agriculture • Agritourism • Rural Growth</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main menu">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} aria-hidden="true" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User profile & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-stone-200">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80'}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 rounded-full object-cover border-2 border-stone-200"
              />
              <div className="text-left text-xs">
                <div className="font-semibold text-stone-800 leading-tight">{currentUser.name}</div>
                <div className="text-stone-500 text-[11px] truncate max-w-[120px]">{currentUser.location}</div>
              </div>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-5 space-y-1 shadow-lg" role="navigation" aria-label="Mobile navigation">
          <div className="py-2 mb-2 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentBadge.dot}`} aria-hidden="true" />
              <span className="text-xs font-semibold text-stone-700">Active Persona: {currentBadge.label}</span>
            </div>
            <button
              onClick={onToggleLanguage}
              className="text-xs text-emerald-700 font-semibold px-2 py-1 rounded bg-emerald-50"
            >
              {language === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
            </button>
          </div>

          <button
            onClick={() => {
              onOpenTestRunner();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 mb-2"
          >
            <FlaskConical className="w-4 h-4 text-purple-700" />
            <span>Run Master Acceptance Tests</span>
          </button>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-700'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} aria-hidden="true" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">{currentUser.name}</span>
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
