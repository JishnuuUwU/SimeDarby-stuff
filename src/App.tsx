import React from 'react';
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

export const App: React.FC = () => {
  const { activeTab } = useApp();

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
    <div className="device-wrapper">
      <main className="android-frame">
        {/* Android Native Status Bar */}
        <AndroidStatusBar />

        {/* Sime Darby Property Branded App Header */}
        <Header />

        {/* Real-time Toasts & Security Alerts */}
        <Toasts />

        {/* Tab Content Area */}
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
