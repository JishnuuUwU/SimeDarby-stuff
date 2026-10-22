import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Map, 
  Users, 
  Car, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  Compass, 
  HeartHandshake, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Award,
  Shield,
  Layers,
  Lock
} from 'lucide-react';

export const HomeOverview: React.FC = () => {
  const { 
    currentUser, 
    activeTownship, 
    setActiveTab, 
    parkingBays, 
    buddyRequests,
    setIsRoleModalOpen,
    speakText 
  } = useApp();

  const availableBaysCount = parkingBays.filter(
    b => b.townshipId === activeTownship.id && b.status === 'available'
  ).length;

  const totalTownshipBays = parkingBays.filter(
    b => b.townshipId === activeTownship.id
  ).length;

  const openBuddyCount = buddyRequests.filter(r => r.status === 'open').length;

  return (
    <div className="tab-screen-container" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Welcome Banner with Sime Darby Crimson Gradient & Gold Motif */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--sd-crimson-solid) 0%, #600E14 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-crimson)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span 
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(255,255,255,0.18)',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Sparkles size={11} color="var(--sd-gold)" />
              {activeTownship.name}
            </span>

            {currentUser.isVerifiedResident ? (
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid #10B981',
                  color: '#A7F3D0',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ShieldCheck size={11} />
                Verified Resident
              </span>
            ) : (
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Selamat Datang, {currentUser.name.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: 1.45, marginBottom: '16px' }}>
            Inclusive township living & step-free spatial mobility across Sime Darby Property masterplans.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--sd-crimson-solid)',
                padding: '9px 15px',
                fontSize: '12.5px',
                boxShadow: 'none',
                fontWeight: 800
              }}
              onClick={() => {
                setActiveTab('accessmap');
                speakText('Opening AccessMap for step-free spatial navigation.');
              }}
              id="home-btn-open-map"
            >
              <Compass size={14} />
              Open AccessMap
            </button>

            <button 
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 13px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              onClick={() => setIsRoleModalOpen(true)}
              id="home-btn-switch-role"
            >
              Switch Role
            </button>
          </div>
        </div>

        {/* Decorative gold background accent curve */}
        <div 
          style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197, 168, 128, 0.28) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Core Township Accessibility Pillars Grid (Adaptive 2-col on Foldable/Tablet) */}
      <div className="adaptive-grid-2col" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Pillar 1: AccessMap Directory */}
        <div 
          className="sd-card" 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--oku-blue)' }}
          onClick={() => setActiveTab('accessmap')}
          id="card-nav-accessmap"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--oku-blue-light)',
                color: 'var(--oku-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 98, 210, 0.15)'
              }}>
                <Map size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800 }}>AccessMap Directory</h3>
                  <span className="badge-oku" style={{ fontSize: '10px' }}>Step-Free</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Continuous obstacle-free routing in {activeTownship.name}
                </p>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-tertiary)" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '5px', fontWeight: 600 }}>
              Wheelchair Ramps (≤1:12)
            </span>
            <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '5px', fontWeight: 600 }}>
              Tactile Paving Paths
            </span>
            <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '5px', fontWeight: 600 }}>
              Live Elevators
            </span>
            <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '5px', fontWeight: 600 }}>
              Tandas OKU
            </span>
          </div>
        </div>

        {/* Pillar 2: Community Buddy Network */}
        <div 
          className="sd-card" 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--status-success)' }}
          onClick={() => setActiveTab('buddy')}
          id="card-nav-buddy"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)'
              }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800 }}>Community Buddy System</h3>
                  {currentUser.isVerifiedResident ? (
                    <span className="badge-verified-resident" style={{ fontSize: '10px' }}>Precinct Match</span>
                  ) : (
                    <span className="badge-warning" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Lock size={9} /> Residents Only
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {currentUser.isVerifiedResident 
                    ? 'Verified resident support for physical tasks & events'
                    : 'Restricted to authenticated township residents'}
                </p>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-tertiary)" />
          </div>

          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartHandshake size={16} color="var(--sd-crimson)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser.isVerifiedResident 
                  ? `${openBuddyCount} neighbors currently requesting assistance`
                  : 'Authenticated precinct link required'}
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--sd-crimson)' }}>
              {currentUser.isVerifiedResident ? 'View & Help →' : 'Learn More →'}
            </span>
          </div>
        </div>

        {/* Pillar 3: Smart OKU Parking Protection */}
        <div 
          className="sd-card" 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--tactile-yellow)' }}
          onClick={() => setActiveTab('parking')}
          id="card-nav-parking"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--tactile-yellow-bg)',
                color: 'var(--tactile-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.15)'
              }}>
                <Car size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800 }}>Smart OKU Parking</h3>
                  <span className="badge-warning" style={{ fontSize: '10px' }}>IoT Telemetry</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Live bay monitoring & auxiliary police enforcement
                </p>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-tertiary)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
            <div style={{
              backgroundColor: 'var(--status-success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={16} color="var(--status-success)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--status-success)' }}>
                  {availableBaysCount} / {totalTownshipBays}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Bays Vacant</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--status-error-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} color="var(--status-error)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--status-error)' }}>
                  Quick Report
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Flag Misuse</div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency & Auxiliary Police Support Hotline */}
        <div 
          style={{
            backgroundColor: 'var(--bg-inverse)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
            border: 'var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--sd-crimson-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(139, 29, 36, 0.4)'
            }}>
              <PhoneCall size={18} color="#FFFFFF" />
            </div>
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-inverse)' }}>Polis Bantuan SD Property</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-inverse-muted)' }}>24/7 Accessibility Escort & Auxiliary Patrol</p>
            </div>
          </div>

          <a 
            href="tel:0378495000"
            style={{
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: 'var(--text-inverse)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255,255,255,0.22)'
            }}
          >
            Call 24/7
          </a>
        </div>
      </div>
    </div>
  );
};
