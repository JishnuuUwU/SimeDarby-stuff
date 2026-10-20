import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/user';
import { X, User, Sparkles, ShieldCheck, ShieldAlert, Check } from 'lucide-react';

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleModalOpen, setIsRoleModalOpen, currentUser, switchUserRole } = useApp();

  if (!isRoleModalOpen) return null;

  const rolesList: {
    role: UserRole;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      role: 'public',
      title: 'Public Visitor',
      subtitle: 'Township Guests, Mall Shoppers, Drivers',
      icon: <User size={22} />,
      features: ['AccessMap step-free navigation', 'Live OKU parking bay status', 'Direct misuse reporting']
    },
    {
      role: 'prime_member',
      title: 'PRIME Member (Platinum)',
      subtitle: 'Sime Darby Property Rewards & Lifestyle',
      icon: <Sparkles size={22} />,
      features: ['AccessMap step-free mall routing', 'Priority OKU bay alerts', 'PRIME points & tier benefits']
    },
    {
      role: 'verified_resident',
      title: 'Verified Resident',
      subtitle: 'Ilham Residence, City of Elmina (Unit IR-03-12)',
      icon: <ShieldCheck size={22} />,
      features: ['Community Buddy assistance requests', 'Neighbor volunteer matching', 'Precinct trust network', 'OKU parking reporting']
    },
    {
      role: 'township_security',
      title: 'Township Auxiliary Police (Polis Bantuan)',
      subtitle: 'Sime Darby Property Security Division',
      icon: <ShieldAlert size={22} />,
      features: ['Live OKU bay misuse alerts', 'Patrol dispatch & incident logging', 'Wheel clamp enforcement workflow']
    }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setIsRoleModalOpen(false)}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <h3 className="sheet-title">Switch User Persona</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Test accessibility features from each user role's perspective
            </p>
          </div>
          <button 
            onClick={() => setIsRoleModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          {rolesList.map(item => {
            const isCurrent = currentUser.role === item.role;
            return (
              <div
                key={item.role}
                onClick={() => switchUserRole(item.role)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: isCurrent ? '2px solid var(--sd-crimson)' : 'var(--border-light)',
                  backgroundColor: isCurrent ? 'var(--sd-crimson-subtle)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isCurrent ? 'var(--sd-crimson)' : 'var(--bg-subtle)',
                      color: isCurrent ? '#FFFFFF' : 'var(--sd-crimson)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <div style={{ color: 'var(--sd-crimson)' }}>
                      <Check size={20} strokeWidth={2.8} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginLeft: '46px' }}>
                  {item.features.map((feat, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: isCurrent ? 'rgba(139, 29, 36, 0.1)' : 'var(--bg-subtle)',
                        color: isCurrent ? 'var(--sd-crimson)' : 'var(--text-secondary)'
                      }}
                    >
                      • {feat}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
