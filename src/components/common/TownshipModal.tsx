import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, X, Check } from 'lucide-react';

export const TownshipModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { townships, activeTownship, setActiveTownship, addToast } = useApp();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <h3 className="sheet-title">Select Sime Darby Township</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Explore step-free spatial paths and dedicated OKU facilities
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          {townships.map(t => {
            const isSelected = t.id === activeTownship.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setActiveTownship(t);
                  addToast({
                    type: 'info',
                    title: 'Township Switched',
                    message: `Now viewing accessibility services in ${t.name}.`
                  });
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--sd-crimson)' : 'var(--border-light)',
                  backgroundColor: isSelected ? 'var(--sd-crimson-subtle)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'var(--sd-crimson)' : 'var(--bg-subtle)',
                    color: isSelected ? '#FFFFFF' : 'var(--sd-crimson)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.state} • {t.hubType}</p>
                  </div>
                </div>

                {isSelected && (
                  <div style={{ color: 'var(--sd-crimson)' }}>
                    <Check size={20} strokeWidth={2.8} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
