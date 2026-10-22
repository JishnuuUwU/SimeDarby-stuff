import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { AndroidStatusBar } from './components/common/AndroidStatusBar';
import { Header } from './components/common/Header';
import { BottomTabs } from './components/common/BottomTabs';
import { AndroidNavBar } from './components/common/AndroidNavBar';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { Toasts } from './components/common/Toasts';

import { HomeOverview } from './components/home/HomeOverview';
import { AccessMapScreen } from './components/accessmap/AccessMapScreen';
import { CommunityBuddyScreen } from './components/buddy/CommunityBuddyScreen';
import { SmartParkingScreen } from './components/parking/SmartParkingScreen';
import { ProfileSettingsScreen } from './components/profile/ProfileSettingsScreen';
import { Smartphone, Tablet, Maximize, SmartphoneCharging } from 'lucide-react';

type DeviceMode = 'galaxy' | 'pixel' | 'compact' | 'foldable' | 'responsive';

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('galaxy');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeOverview />;
      case 'accessmap':
        return <AccessMapScreen />;
      case 'buddy':
        return <CommunityBuddyScreen />;
      case 'parking':
        return <SmartParkingScreen />;
      case 'profile':
        return <ProfileSettingsScreen />;
      default:
        return <HomeOverview />;
    }
  };

  return (
    <div className={`device-wrapper mode-${deviceMode}`}>
      {/* Evaluator Multi-Size Android Device Switcher Toolbar */}
      <aside className="device-preset-bar" aria-label="Android Device Size Selector">
        <span className="preset-title">
          <Smartphone size={13} />
          Android Device:
        </span>

        <button 
          className={`preset-btn ${deviceMode === 'galaxy' ? 'active' : ''}`}
          onClick={() => setDeviceMode('galaxy')}
          title="Samsung Galaxy S24 (412x890)"
        >
          Galaxy S24 (412px)
        </button>

        <button 
          className={`preset-btn ${deviceMode === 'compact' ? 'active' : ''}`}
          onClick={() => setDeviceMode('compact')}
          title="Compact Android / Galaxy A Series (360x780)"
        >
          Compact (360px)
        </button>

        <button 
          className={`preset-btn ${deviceMode === 'foldable' ? 'active' : ''}`}
          onClick={() => setDeviceMode('foldable')}
          title="Galaxy Z Fold 6 Unfolded / Tablet (768x920)"
        >
          <Tablet size={12} style={{ display: 'inline', marginRight: '3px' }} />
          Foldable (768px)
        </button>

        <button 
          className={`preset-btn ${deviceMode === 'responsive' ? 'active' : ''}`}
          onClick={() => setDeviceMode('responsive')}
          title="Native Fluid Responsive (100%)"
        >
          <Maximize size={12} style={{ display: 'inline', marginRight: '3px' }} />
          Fluid
        </button>
      </aside>

      <main className="android-frame">
        {/* Android Native Status Bar */}
        <AndroidStatusBar />

        {/* Sime Darby Property Branded App Header */}
        <Header />

        {/* Real-time Toasts & Security Alerts */}
        <Toasts />

        {/* Tab Content Area with Smooth Animation */}
        <section className="app-content">
          {renderActiveTabContent()}
        </section>

        {/* Bottom Tab Bar */}
        <BottomTabs />

        {/* Android Native 3-Button Navigation Bar */}
        <AndroidNavBar />

        {/* Persona Role Switcher Modal */}
        <RoleSwitcherModal />
      </main>
    </div>
  );
};
