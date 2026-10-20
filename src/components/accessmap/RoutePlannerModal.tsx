import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Navigation, MapPin, Footprints, CheckCircle, ShieldCheck } from 'lucide-react';

export const RoutePlannerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeTownship, calculateStepFreeRoute } = useApp();

  const [originId, setOriginId] = useState(activeTownship.popularOrigins[0]?.id || '');
  const [destinationId, setDestinationId] = useState(activeTownship.popularDestinations[0]?.id || '');
  const [avoidSteepRamps, setAvoidSteepRamps] = useState(true);
  const [preferTactilePaving, setPreferTactilePaving] = useState(true);

  const handleCalculate = () => {
    calculateStepFreeRoute(originId, destinationId);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <h3 className="sheet-title">Step-Free Route Planner</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Obstacle-free navigation for wheelchairs, strollers & seniors
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Origin Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--oku-blue)" /> STARTING POINT
          </label>
          <select
            value={originId}
            onChange={e => setOriginId(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'var(--border-light)',
              backgroundColor: 'var(--bg-card)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          >
            {activeTownship.popularOrigins.map(orig => (
              <option key={orig.id} value={orig.id}>{orig.name}</option>
            ))}
          </select>
        </div>

        {/* Destination Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={14} color="var(--sd-crimson)" /> DESTINATION
          </label>
          <select
            value={destinationId}
            onChange={e => setDestinationId(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'var(--border-light)',
              backgroundColor: 'var(--bg-card)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          >
            {activeTownship.popularDestinations.map(dest => (
              <option key={dest.id} value={dest.id}>{dest.name}</option>
            ))}
          </select>
        </div>

        {/* Accessibility Safeguard Preferences */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
            ACCESSIBILITY SAFEGUARDS (MALAYSIA MS 1184)
          </span>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', cursor: 'pointer' }}>
            <span>Strict Zero Stairs (Step-Free Only)</span>
            <input type="checkbox" checked disabled style={{ accentColor: 'var(--sd-crimson)', width: '16px', height: '16px' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', cursor: 'pointer' }}>
            <span>Limit Incline (Max 1:12 Ramp Slope)</span>
            <input 
              type="checkbox" 
              checked={avoidSteepRamps} 
              onChange={e => setAvoidSteepRamps(e.target.checked)} 
              style={{ accentColor: 'var(--sd-crimson)', width: '16px', height: '16px' }} 
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', cursor: 'pointer' }}>
            <span>Prioritize Tactile Paving Corridor</span>
            <input 
              type="checkbox" 
              checked={preferTactilePaving} 
              onChange={e => setPreferTactilePaving(e.target.checked)} 
              style={{ accentColor: 'var(--sd-crimson)', width: '16px', height: '16px' }} 
            />
          </label>
        </div>

        {/* Submit */}
        <button 
          className="btn-primary"
          style={{ width: '100%', padding: '14px' }}
          onClick={handleCalculate}
        >
          <Navigation size={18} />
          Calculate Step-Free Route
        </button>
      </div>
    </div>
  );
};
