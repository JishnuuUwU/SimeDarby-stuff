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
  QrCode
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
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Digital Resident / PRIME Pass Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1E242B 0%, #111418 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: '#FFFFFF',
          border: '1px solid #333F4E',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--sd-gold)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              SIME DARBY PROPERTY DIGITAL PASS
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
              {currentUser.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#98A2B3' }}>
              {currentUser.email}
            </p>
          </div>

          <div style={{
            width: '44px',
            height: '44px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#121826'
          }}>
            <QrCode size={36} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '16px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#98A2B3', fontSize: '10px' }}>PRECINCT & UNIT</span>
            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
              {currentUser.precinct ? `${currentUser.precinct} (${currentUser.unitNo})` : 'Public Visitor'}
            </div>
          </div>

          <div>
            <span style={{ color: '#98A2B3', fontSize: '10px' }}>PRIME TIER</span>
            <div style={{ fontWeight: 700, color: 'var(--sd-gold)' }}>
              {currentUser.primeTier || 'Standard Guest'}
            </div>
          </div>
        </div>
      </div>

      {/* Role Persona Switcher Quick Button */}
      <div className="sd-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--sd-crimson-subtle)',
            color: 'var(--sd-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sliders size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Switch User Persona</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Currently: {currentUser.role.toUpperCase()}
            </p>
          </div>
        </div>

        <button 
          className="btn-outline-crimson"
          onClick={() => setIsRoleModalOpen(true)}
        >
          Change Persona
        </button>
      </div>

      {/* Accessibility & Ergonomic Preferences */}
      <div className="sd-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Universal Accessibility Settings</h4>

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
            style={{ width: '18px', height: '18px', accentColor: 'var(--sd-crimson)' }}
          />
        </div>

        {/* Font Scaling */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-subtle)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Type size={18} color="var(--oku-blue)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Text Scaling</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Scale base font size for improved legibility
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
              fontWeight: 700
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
                Turn-by-turn spoken guidance along step-free paths
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
            style={{ width: '18px', height: '18px', accentColor: 'var(--sd-crimson)' }}
          />
        </div>
      </div>

      {/* Sime Darby Official Compliance Standards */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <p><strong>Standards & Verification:</strong></p>
        <p>• Malaysia Standard MS 1184:2014 Code of Practice on Access for Disabled Persons to Public Buildings.</p>
        <p>• Integrated with Sime Darby Property Polis Bantuan (Township Auxiliary Police).</p>
      </div>
    </div>
  );
};
