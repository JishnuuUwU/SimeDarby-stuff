import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Map, 
  Users, 
  Car, 
  Shield,
  Lock
} from 'lucide-react';

export const BottomTabs: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    buddyRequests, 
    parkingBays,
    currentUser 
  } = useApp();

  const isResident = currentUser.isVerifiedResident;

  // Active open buddy requests count (only for verified residents)
  const openRequestsCount = isResident 
    ? buddyRequests.filter(r => r.status === 'open').length 
    : 0;

  // Active parking violations count
  const activeMisuseCount = parkingBays.filter(b => b.status === 'unauthorized_misuse').length;

  return (
    <nav className="bottom-tab-bar" aria-label="Bottom Navigation">
      <button 
        id="tab-btn-home"
        className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
        aria-label="Home"
      >
        <div className="tab-icon-wrap">
          <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        </div>
        <span>Township</span>
      </button>

      <button 
        id="tab-btn-accessmap"
        className={`tab-btn ${activeTab === 'accessmap' ? 'active' : ''}`}
        onClick={() => setActiveTab('accessmap')}
        aria-label="AccessMap"
      >
        <div className="tab-icon-wrap">
          <Map size={20} strokeWidth={activeTab === 'accessmap' ? 2.5 : 2} />
        </div>
        <span>AccessMap</span>
      </button>

      <button 
        id="tab-btn-buddy"
        className={`tab-btn ${activeTab === 'buddy' ? 'active' : ''}`}
        onClick={() => setActiveTab('buddy')}
        aria-label="Community Buddy"
      >
        <div className="tab-icon-wrap">
          <Users size={20} strokeWidth={activeTab === 'buddy' ? 2.5 : 2} />
        </div>
        <span>Buddy</span>
        {isResident && openRequestsCount > 0 ? (
          <span className="tab-badge" title={`${openRequestsCount} neighbor requests waiting`}>
            {openRequestsCount}
          </span>
        ) : !isResident ? (
          <span 
            style={{
              position: 'absolute',
              top: '5px',
              right: '22%',
              backgroundColor: 'var(--text-tertiary)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Resident Access Only"
          >
            <Lock size={9} />
          </span>
        ) : null}
      </button>

      <button 
        id="tab-btn-parking"
        className={`tab-btn ${activeTab === 'parking' ? 'active' : ''}`}
        onClick={() => setActiveTab('parking')}
        aria-label="Smart OKU Parking"
      >
        <div className="tab-icon-wrap">
          <Car size={20} strokeWidth={activeTab === 'parking' ? 2.5 : 2} />
        </div>
        <span>OKU Parking</span>
        {activeMisuseCount > 0 && (
          <span className="tab-badge" title={`${activeMisuseCount} unauthorized parking alerts`}>
            {activeMisuseCount}
          </span>
        )}
      </button>

      <button 
        id="tab-btn-profile"
        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
        aria-label="Profile and Security"
      >
        <div className="tab-icon-wrap">
          <Shield size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        </div>
        <span>{currentUser.role === 'township_security' ? 'Security' : 'MyPass'}</span>
      </button>
    </nav>
  );
};
