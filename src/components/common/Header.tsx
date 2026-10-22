import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Type, 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  Sparkles 
} from 'lucide-react';
import { TownshipModal } from './TownshipModal';

export const Header: React.FC = () => {
  const { 
    activeTownship, 
    currentUser, 
    setIsRoleModalOpen,
    theme,
    toggleTheme,
    fontSize, 
    setFontSize,
    voiceGuidanceEnabled, 
    setVoiceGuidanceEnabled,
    speakText
  } = useApp();

  const [isTownshipModalOpen, setIsTownshipModalOpen] = useState(false);

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const toggleVoice = () => {
    const nextState = !voiceGuidanceEnabled;
    setVoiceGuidanceEnabled(nextState);
    if (nextState) {
      speakText('Voice guidance and audio cues enabled.');
    }
  };

  const getRoleBadgeLabel = () => {
    switch (currentUser.role) {
      case 'public':
        return 'Visitor';
      case 'prime_member':
        return `PRIME ${currentUser.primeTier}`;
      case 'verified_resident':
        return 'Verified Resident';
      case 'township_security':
        return 'Polis Bantuan';
    }
  };

  const getRoleIcon = () => {
    switch (currentUser.role) {
      case 'public':
        return <User size={12} />;
      case 'prime_member':
        return <Sparkles size={12} />;
      case 'verified_resident':
        return <ShieldCheck size={12} />;
      case 'township_security':
        return <ShieldCheck size={12} />;
    }
  };

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-section">
          <img 
            src="/brand-icon.svg" 
            alt="Sime Darby Property" 
            className="brand-logo-img" 
          />
          <div className="brand-titles">
            <span className="brand-corp-name">Sime Darby Property</span>
            <span className="brand-badge-tag">Accessibility & Resident Care</span>
          </div>
        </div>

        {/* Accessibility Quick Toggles */}
        <div className="header-actions">
          <button 
            className={`header-icon-btn ${voiceGuidanceEnabled ? 'active' : ''}`}
            onClick={toggleVoice}
            title="Toggle Voice Guidance & Audio Cues"
            aria-label="Toggle Voice Guidance"
          >
            {voiceGuidanceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button 
            className={`header-icon-btn ${fontSize !== 'normal' ? 'active' : ''}`}
            onClick={cycleFontSize}
            title={`Font Size: ${fontSize.toUpperCase()} (Click to cycle)`}
            aria-label="Cycle Font Size"
          >
            <Type size={18} />
          </button>

          <button 
            className={`header-icon-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
          >
            <span className="theme-toggle-icon" key={theme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </span>
          </button>
        </div>
      </div>

      <div className="township-selector-row">
        <button 
          className="township-dropdown-btn"
          onClick={() => setIsTownshipModalOpen(true)}
          aria-label="Change Township"
        >
          <MapPin size={15} color="var(--sd-gold)" />
          <span>{activeTownship.name}</span>
          <ChevronDown size={14} />
        </button>

        {/* Role Switcher Button */}
        <button 
          className="role-badge-btn"
          onClick={() => setIsRoleModalOpen(true)}
          title="Switch User Role Persona"
        >
          {getRoleIcon()}
          <span>{getRoleBadgeLabel()}</span>
        </button>
      </div>

      {isTownshipModalOpen && (
        <TownshipModal onClose={() => setIsTownshipModalOpen(false)} />
      )}
    </header>
  );
};
