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
  AlertTriangle
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
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #8B1D24 0%, #641117 100%)',
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
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} color="var(--sd-gold)" />
              {activeTownship.name}
            </span>

            {currentUser.isVerifiedResident && (
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(18, 183, 106, 0.3)',
                  border: '1px solid #12B76A',
                  color: '#A6F4C5',
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
            )}
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
            Selamat Datang, {currentUser.name.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '13px', color: '#F2F4F7', lineHeight: 1.4, marginBottom: '16px' }}>
            Inclusive living & step-free spatial mobility across Sime Darby Property developments.
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-primary"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--sd-crimson)',
                padding: '8px 14px',
                fontSize: '12px',
                boxShadow: 'none'
              }}
              onClick={() => {
                setActiveTab('accessmap');
                speakText('Opening AccessMap for step-free spatial navigation.');
              }}
            >
              <Compass size={14} />
              Open AccessMap
            </button>

            <button 
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => setIsRoleModalOpen(true)}
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
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197, 168, 128, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Feature 1: AccessMap Card */}
      <div 
        className="sd-card" 
        style={{ cursor: 'pointer', borderLeft: '4px solid var(--oku-blue)' }}
        onClick={() => setActiveTab('accessmap')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--oku-blue-light)',
              color: 'var(--oku-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Map size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>AccessMap Directory</h3>
                <span className="badge-oku">Step-Free</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Continuous obstacle-free routing in {activeTownship.name}
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--text-tertiary)" />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '4px' }}>
            ♿ Wheelchair Ramps (1:12 Slope)
          </span>
          <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '4px' }}>
            🟡 Tactile Paving Routes
          </span>
          <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '4px' }}>
            🛗 Live Elevators
          </span>
          <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '4px' }}>
            🚻 Tandas OKU
          </span>
        </div>
      </div>

      {/* Feature 2: Community Buddy System Card */}
      <div 
        className="sd-card" 
        style={{ cursor: 'pointer', borderLeft: '4px solid var(--status-success)' }}
        onClick={() => setActiveTab('buddy')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Community Buddy Network</h3>
                <span className="badge-verified-resident">Precinct Match</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Verified neighbor assistance for physical tasks & events
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
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {openBuddyCount} neighbors currently requesting assistance
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sd-crimson)' }}>
            View & Help →
          </span>
        </div>
      </div>

      {/* Feature 3: Smart OKU Parking Protection Card */}
      <div 
        className="sd-card" 
        style={{ cursor: 'pointer', borderLeft: '4px solid var(--tactile-yellow)' }}
        onClick={() => setActiveTab('parking')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--tactile-yellow-bg)',
              color: 'var(--tactile-yellow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Car size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Smart OKU Parking</h3>
                <span className="badge-warning">Live Bays</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Real-time sensors & Polis Bantuan auxiliary enforcement
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--text-tertiary)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
          <div style={{
            backgroundColor: 'var(--status-success-bg)',
            border: '1px solid #A6F4C5',
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
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Bays Vacant</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--status-error-bg)',
            border: '1px solid #FECDCA',
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
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Flag Misuse</div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency & Auxiliary Police Support Hotline */}
      <div 
        style={{
          backgroundColor: '#1E242B',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--sd-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PhoneCall size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Polis Bantuan SD Property</h4>
            <p style={{ fontSize: '11px', color: '#98A2B3' }}>24/7 Accessibility Escort & Patrol</p>
          </div>
        </div>

        <a 
          href="tel:0378495000"
          style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          Call 24/7
        </a>
      </div>
    </div>
  );
};
