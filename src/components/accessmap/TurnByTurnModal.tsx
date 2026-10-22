import React from 'react';
import { StepFreeRoute } from '../../types/accessibility';
import { useApp } from '../../context/AppContext';
import { X, Volume2, Footprints, ShieldCheck, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

export const TurnByTurnModal: React.FC<{ route: StepFreeRoute; onClose: () => void }> = ({ route, onClose }) => {
  const { speakText } = useApp();

  const handlePlayVoice = () => {
    const fullText = route.audioGuidance.join(' ');
    speakText(fullText);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '90%' }}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-oku">Step-Free Guide</span>
              <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 700 }}>
                MS 1184 Compliant
              </span>
            </div>
            <h3 className="sheet-title" style={{ marginTop: '2px' }}>
              Turn-by-Turn Navigation
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Route Summary Metric Bar */}
        <div 
          style={{
            backgroundColor: 'var(--sd-crimson-subtle)',
            border: '1px solid var(--sd-crimson-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Step-Free Distance</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--sd-crimson)' }}>
              {route.totalDistanceMeters} meters
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Max Incline: {route.maxSlope} • Stairs: 0
            </div>
          </div>

          <button
            onClick={handlePlayVoice}
            className="btn-primary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
            title="Read directions aloud"
          >
            <Volume2 size={15} />
            Voice Cue
          </button>
        </div>

        {/* Waypoints Step-by-Step List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          {route.waypoints.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px' }}>
              {/* Step indicator column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: idx === route.waypoints.length - 1 ? 'var(--status-success-solid)' : 'var(--oku-blue-solid)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800
                  }}
                >
                  {idx + 1}
                </div>
                {idx < route.waypoints.length - 1 && (
                  <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border-strong)', margin: '4px 0' }} />
                )}
              </div>

              {/* Step details */}
              <div style={{ flex: 1, paddingBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {step.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {step.distanceMeters}m
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {step.instruction}
                </p>

                {/* Accessibility Note Badge */}
                <div 
                  style={{
                    marginTop: '6px',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderLeft: '3px solid var(--oku-blue)'
                  }}
                >
                  <CheckCircle2 size={12} color="var(--oku-blue)" />
                  <span>{step.accessibilityNote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="btn-secondary"
          style={{ width: '100%', marginTop: '4px' }}
          onClick={onClose}
        >
          Return to Map
        </button>
      </div>
    </div>
  );
};
