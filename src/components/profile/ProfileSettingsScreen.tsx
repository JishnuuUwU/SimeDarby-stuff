import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Sliders, 
  Eye, 
  Type, 
  Volume2, 
  Phone, 
  LogOut, 
  HeartHandshake,
  CheckCircle2,
  QrCode,
  Shield,
  FileCheck
} from 'lucide-react';

export const ProfileSettingsScreen: React.FC = () => {
  const { 
    currentUser, 
    setIsRoleModalOpen, 
    highContrast, 
    setHighContrast, 
    fontSize, 
    setFontSize,
    voiceGuidanceEnabled,
    setVoiceGuidanceEnabled,
    speakText 
  } = useApp();

  return (
    <div className="tab-screen-container" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Digital Resident / PRIME Pass Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #181E26 0%, #0F141B 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px',
          color: '#FFFFFF',
          border: '1px solid #2D3A4B',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--sd-gold)', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              SIME DARBY PROPERTY DIGITAL RESIDENT PASS
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '3px' }}>
              {currentUser.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>
              {currentUser.email}
            </p>
          </div>

          <div style={{
            width: '46px',
            height: '46px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}>
            <QrCode size={38} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '16px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>PRECINCT & UNIT</span>
            <div style={{ fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {currentUser.precinct ? `${currentUser.precinct} (${currentUser.unitNo})` : 'Public Visitor Access'}
            </div>
          </div>

          <div>
            <span style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>PRIME TIER</span>
            <div style={{ fontWeight: 800, color: 'var(--sd-gold)', marginTop: '2px' }}>
              {currentUser.primeTier || 'Standard Guest'}
            </div>
          </div>
        </div>
      </div>

      <div className="adaptive-grid-2col" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Role Persona Switcher Quick Card */}
        <div className="sd-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--sd-crimson-subtle)',
              color: 'var(--sd-crimson)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sliders size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Switch User Persona</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Active: {currentUser.role.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>

          <button 
            className="btn-outline-crimson"
            onClick={() => setIsRoleModalOpen(true)}
            id="profile-btn-change-persona"
          >
            Change Persona
          </button>
        </div>

        {/* Universal Accessibility & Ergonomic Preferences */}
        <div className="sd-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-primary)' }}>Universal Accessibility Settings</h4>

          {/* High Contrast */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={18} color="var(--sd-crimson)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>High Contrast Mode</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Enhanced contrast ratios for low vision & sunlight readability
                </div>
              </div>
            </div>
            <input 
              type="checkbox"
              checked={highContrast}
              onChange={e => setHighContrast(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--sd-crimson)', cursor: 'pointer' }}
            />
          </div>

          {/* Font Scaling */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-subtle)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Type size={18} color="var(--oku-blue)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Text Scaling</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Scale base typography size for improved legibility
                </div>
              </div>
            </div>
            <select 
              value={fontSize}
              onChange={e => setFontSize(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-light)',
                fontSize: '12px',
                fontWeight: 700,
                outline: 'none',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <option value="normal">Normal (100%)</option>
              <option value="large">Large (112%)</option>
              <option value="xlarge">Extra Large (125%)</option>
            </select>
          </div>

          {/* Voice Guidance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-subtle)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={18} color="var(--status-success)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Speech Synthesis Audio Cues</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Spoken turn-by-turn guidance along step-free paths
                </div>
              </div>
            </div>
            <input 
              type="checkbox"
              checked={voiceGuidanceEnabled}
              onChange={e => {
                setVoiceGuidanceEnabled(e.target.checked);
                if (e.target.checked) speakText('Spoken audio guidance is now activated.');
              }}
              style={{ width: '18px', height: '18px', accentColor: 'var(--sd-crimson)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Sime Darby Official Compliance Standards */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5, border: 'var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          <FileCheck size={14} color="var(--sd-crimson)" />
          <span>Malaysian Universal Accessibility Compliance:</span>
        </div>
        <p>• Malaysia Standard MS 1184:2014 Code of Practice on Access for Disabled Persons to Public Buildings.</p>
        <p>• Integrated directly with Sime Darby Property Polis Bantuan (Township Auxiliary Police) dispatch terminal.</p>
      </div>
    </div>
  );
};
