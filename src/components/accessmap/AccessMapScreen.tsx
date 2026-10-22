import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccessibilityFeatureType, MapMarkerFeature } from '../../types/accessibility';
import { 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  Info, 
  Compass, 
  SlidersHorizontal, 
  Maximize2,
  Volume2,
  X,
  Footprints,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Accessibility,
  CornerDownRight,
  Plus,
  Minus,
  Locate,
  Crosshair,
  RotateCcw
} from 'lucide-react';
import { RoutePlannerModal } from './RoutePlannerModal';
import { TurnByTurnModal } from './TurnByTurnModal';

export const AccessMapScreen: React.FC = () => {
  const { 
    activeTownship, 
    allFeatures, 
    featureFilters, 
    toggleFeatureFilter, 
    activeRoute,
    clearRoute,
    selectedMarker,
    setSelectedMarker,
    speakText,
    currentUser,
    addToast
  } = useApp();

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isTurnByTurnOpen, setIsTurnByTurnOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [gpsTrackingActive, setGpsTrackingActive] = useState(true);

  // Prototype Simulated GPS user position (% coordinates on map canvas)
  const [userLocation, setUserLocation] = useState({ x: 38, y: 38, accuracyMeters: 4 });

  // Handle Drag / Pan Events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for mobile panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panOffset.x, y: e.touches[0].clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRecenterGPS = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1.1);
    setGpsTrackingActive(true);
    addToast({
      type: 'info',
      title: 'GPS Signal Locked',
      message: 'Accuracy ±4m. Continuous step-free sensor telemetry active.'
    });
    speakText(`GPS locked at ${activeTownship.name} Promenade. Tracking real-time accessible route.`);
  };

  // Filter features by township and active toggles
  const visibleFeatures = allFeatures.filter(f => {
    if (f.townshipId !== activeTownship.id) return false;
    return featureFilters[f.type];
  });

  // Dedicated high-craft vector icon renderers (Anti-vibecoding: no emojis)
  const renderFeatureVectorIcon = (type: AccessibilityFeatureType, size: number = 18, color?: string) => {
    switch (type) {
      case 'ramp':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--oku-blue)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Wheelchair Ramp Vector */}
            <circle cx="12" cy="5" r="2.5" />
            <path d="M6 19 L19 12" strokeDasharray="2 2" />
            <path d="M9 19 L19 19" />
            <path d="M10 13 L14 13 L16 19" />
            <path d="M8 17 A 4 4 0 0 1 12 9" />
          </svg>
        );
      case 'tactile_paving':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--tactile-yellow)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Tactile Paving Guidance Ribs */}
            <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.8" />
            <line x1="8" y1="6" x2="8" y2="18" strokeWidth="2.5" />
            <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" />
            <line x1="16" y1="6" x2="16" y2="18" strokeWidth="2.5" />
          </svg>
        );
      case 'elevator':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--elevator-emerald)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Elevator Vector */}
            <rect x="4" y="3" width="16" height="18" rx="2.5" />
            <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="3 2" />
            <path d="M8 9 L9.5 7 L11 9" />
            <path d="M13 15 L14.5 17 L16 15" />
          </svg>
        );
      case 'restroom':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--restroom-violet)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Accessible Restroom (Tandas OKU) */}
            <circle cx="8" cy="5" r="2" />
            <path d="M8 8 L8 15 M6 11 L10 11 M6 15 L8 20 L10 20" />
            <circle cx="16" cy="5" r="2" />
            <path d="M16 8 L14 14 L18 14 Z M15 14 L15 20 M17 14 L17 20" />
          </svg>
        );
    }
  };

  const getMarkerAccentColor = (type: AccessibilityFeatureType) => {
    switch (type) {
      case 'ramp':
        return 'var(--oku-blue)';
      case 'tactile_paving':
        return 'var(--tactile-yellow)';
      case 'elevator':
        return 'var(--elevator-emerald)';
      case 'restroom':
        return 'var(--restroom-violet)';
    }
  };

  const isElmina = activeTownship.id === 'elmina';

  return (
    <div className="tab-screen-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Filter & Route Action Bar */}
      <div 
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: 'var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-oku" style={{ padding: '2px 8px', fontSize: '10px' }}>
                MS 1184 Certified
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                Universal Access
              </span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '2px' }}>
              AccessMap Directory
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step-free spatial navigation in {activeTownship.name}
            </p>
          </div>

          <button 
            className="btn-primary"
            style={{ padding: '9px 15px', fontSize: '12.5px' }}
            onClick={() => setIsRouteModalOpen(true)}
            id="btn-plan-route"
          >
            <Navigation size={15} />
            Plan Route
          </button>
        </div>

        {/* Feature Layer Toggles */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          {/* Wheelchair Ramps */}
          <button
            onClick={() => toggleFeatureFilter('ramp')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.ramp ? '1.5px solid var(--oku-blue)' : 'var(--border-light)',
              backgroundColor: featureFilters.ramp ? 'var(--oku-blue-light)' : 'var(--bg-card)',
              color: featureFilters.ramp ? 'var(--oku-blue)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('ramp', 15, featureFilters.ramp ? 'var(--oku-blue)' : 'var(--text-secondary)')}
            <span>Ramps (≤1:12)</span>
          </button>

          {/* Tactile Paving */}
          <button
            onClick={() => toggleFeatureFilter('tactile_paving')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.tactile_paving ? '1.5px solid var(--tactile-yellow)' : 'var(--border-light)',
              backgroundColor: featureFilters.tactile_paving ? 'var(--tactile-yellow-bg)' : 'var(--bg-card)',
              color: featureFilters.tactile_paving ? 'var(--tactile-yellow)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('tactile_paving', 15, featureFilters.tactile_paving ? 'var(--tactile-yellow)' : 'var(--text-secondary)')}
            <span>Tactile Paths</span>
          </button>

          {/* Elevators */}
          <button
            onClick={() => toggleFeatureFilter('elevator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.elevator ? '1.5px solid var(--elevator-emerald)' : 'var(--border-light)',
              backgroundColor: featureFilters.elevator ? 'var(--elevator-emerald-bg)' : 'var(--bg-card)',
              color: featureFilters.elevator ? 'var(--elevator-emerald)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('elevator', 15, featureFilters.elevator ? 'var(--elevator-emerald)' : 'var(--text-secondary)')}
            <span>Live Lifts</span>
          </button>

          {/* Tandas OKU */}
          <button
            onClick={() => toggleFeatureFilter('restroom')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.restroom ? '1.5px solid var(--restroom-violet)' : 'var(--border-light)',
              backgroundColor: featureFilters.restroom ? 'var(--restroom-violet-bg)' : 'var(--bg-card)',
              color: featureFilters.restroom ? 'var(--restroom-violet)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('restroom', 15, featureFilters.restroom ? 'var(--restroom-violet)' : 'var(--text-secondary)')}
            <span>Tandas OKU</span>
          </button>
        </div>
      </div>

      {/* Interactive Spatial Architectural Vector Canvas */}
      <div 
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#E7EDE9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Vector Architectural Blueprint Canvas with Real-Time Pan & Zoom Transform */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #EBF1ED 0%, #DDE6E1 100%)',
            backgroundSize: '24px 24px',
            backgroundImage: 'radial-gradient(circle, #CBD5E1 1.2px, transparent 1.2px)',
            userSelect: 'none',
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              {/* Lake water gradient */}
              <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9E6F8" />
                <stop offset="100%" stopColor="#A8D6F2" />
              </linearGradient>

              {/* Park green zone gradient */}
              <linearGradient id="parkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D9EAD3" />
                <stop offset="100%" stopColor="#C4DFBD" />
              </linearGradient>

              {/* Mall Building footprint */}
              <linearGradient id="mallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>

              {/* Glow filter for active route */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Township Geographic Elements */}
            {isElmina ? (
              <g>
                {/* Elmina Central Park Green Area */}
                <path
                  d="M 10 90 Q 140 70 300 90 T 420 180 L 420 540 L 0 540 Z"
                  fill="url(#parkGradient)"
                  opacity="0.75"
                />

                {/* Elmina Central Lake Water Body */}
                <path
                  d="M 40 190 C 130 160, 240 180, 290 240 C 340 300, 310 390, 420 430 L 420 620 L 0 620 Z"
                  fill="url(#lakeGradient)"
                  stroke="#98CAE9"
                  strokeWidth="2.5"
                />
                <text x="110" y="380" fill="#6691AD" fontSize="12" fontWeight="800" letterSpacing="1.2">
                  ELMINA CENTRAL LAKE
                </text>

                {/* Elmina Lakeside Mall Footprint */}
                <rect x="25" y="30" width="170" height="90" rx="14" fill="url(#mallGradient)" stroke="#94A3B8" strokeWidth="2" />
                <text x="38" y="70" fill="#1E293B" fontSize="11" fontWeight="800">
                  ELMINA LAKESIDE MALL
                </text>
                <text x="38" y="88" fill="#64748B" fontSize="9.5" fontWeight="600">
                  Ground Concourse & Promenade
                </text>

                {/* UNICEF Inclusive Playground Zone */}
                <rect x="250" y="40" width="130" height="65" rx="12" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="2" strokeDasharray="4 3" />
                <text x="262" y="66" fill="#92400E" fontSize="9.5" fontWeight="800">
                  INCLUSIVE PLAYGROUND
                </text>
                <text x="262" y="82" fill="#B45309" fontSize="8.5" fontWeight="600">
                  UNICEF Certified Universal
                </text>

                {/* Rainbow Bridge Feature */}
                <path
                  d="M 285 240 C 310 270, 325 310, 360 380"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 285 240 C 310 270, 325 310, 360 380"
                  fill="none"
                  stroke="#8B1D24"
                  strokeWidth="3.5"
                  strokeDasharray="5 3"
                />
                <text x="235" y="340" fill="#8B1D24" fontSize="10.5" fontWeight="800">
                  Rainbow Bridge (Ramped)
                </text>

                {/* Base Step-Free Boardwalk Paths */}
                <path
                  d="M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g>
                {/* KL East Masterplan Layout */}
                <rect x="30" y="30" width="340" height="120" rx="14" fill="url(#mallGradient)" stroke="#94A3B8" strokeWidth="2" />
                <text x="45" y="65" fill="#1E293B" fontSize="13" fontWeight="800">
                  KL EAST MALL (B1 to L3)
                </text>
                <text x="45" y="85" fill="#64748B" fontSize="10" fontWeight="600">
                  Connected to The Ridge Residences & Park
                </text>

                <rect x="40" y="190" width="320" height="220" rx="14" fill="url(#parkGradient)" stroke="#86EFAC" strokeWidth="2" />
                <text x="120" y="290" fill="#166534" fontSize="12" fontWeight="800">
                  KL EAST FOREST PARK LINK
                </text>

                {/* Base path */}
                <path
                  d="M 60 150 L 60 280 L 220 280 L 220 370"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Active Continuous Step-Free Route Overlay with Animated Marching Ants */}
            {activeRoute && (
              <g>
                {/* Glow Underlay */}
                <path
                  d={isElmina 
                    ? "M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                    : "M 60 150 L 60 280 L 220 280 L 220 370"
                  }
                  fill="none"
                  stroke="rgba(0, 98, 210, 0.35)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  filter="url(#routeGlow)"
                />

                {/* Continuous Solid Inner Bed */}
                <path
                  d={isElmina 
                    ? "M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                    : "M 60 150 L 60 280 L 220 280 L 220 370"
                  }
                  fill="none"
                  stroke="#0062D2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                {/* Animated Dash Ants Line */}
                <path
                  d={isElmina 
                    ? "M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                    : "M 60 150 L 60 280 L 220 280 L 220 370"
                  }
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  className="animated-route-line"
                  strokeLinecap="round"
                />

                {/* Origin Flag Pin */}
                <g transform={isElmina ? "translate(55, 120)" : "translate(60, 150)"}>
                  <circle cx="0" cy="0" r="11" fill="#0062D2" stroke="#FFFFFF" strokeWidth="3" />
                  <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                  <rect x="15" y="-14" width="135" height="24" rx="6" fill="#0F172A" />
                  <text x="24" y="2" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
                    START: Drop-off (Step-free)
                  </text>
                </g>

                {/* Destination Flag Pin */}
                <g transform={isElmina ? "translate(360, 380)" : "translate(220, 370)"}>
                  <circle cx="0" cy="0" r="11" fill="#8B1D24" stroke="#FFFFFF" strokeWidth="3" />
                  <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                  <rect x="-140" y="8" width="135" height="24" rx="6" fill="#8B1D24" />
                  <text x="-132" y="24" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
                    DEST: {activeRoute.destinationName.slice(0, 15)}
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Precision Vector Markers on Spatial Map */}
          {visibleFeatures.map((feat, index) => {
            const positions = [
              { left: '26%', top: '22%' },
              { left: '72%', top: '74%' },
              { left: '42%', top: '35%' },
              { left: '56%', top: '48%' },
              { left: '30%', top: '16%' },
              { left: '68%', top: '24%' },
              { left: '34%', top: '26%' },
              { left: '80%', top: '68%' }
            ];
            const pos = positions[index % positions.length];
            const isSelected = selectedMarker?.id === feat.id;

            return (
              <div
                key={feat.id}
                onClick={() => {
                  setSelectedMarker(feat);
                  speakText(`${feat.name}. ${feat.description}`);
                }}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 15 : 6,
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: `2.5px solid ${getMarkerAccentColor(feat.type)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected 
                      ? `0 0 0 5px ${feat.type === 'ramp' ? 'rgba(0,98,210,0.3)' : 'rgba(217,119,6,0.3)'}, 0 6px 14px rgba(0,0,0,0.2)`
                      : '0 4px 10px rgba(15, 23, 42, 0.16)',
                    transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                    transition: 'all var(--transition-spring)'
                  }}
                  title={feat.name}
                >
                  {renderFeatureVectorIcon(feat.type, 20, getMarkerAccentColor(feat.type))}
                </div>

                {/* Subtitle tag below marker */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '44px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: isSelected ? 'var(--sd-crimson)' : 'rgba(15, 23, 42, 0.88)',
                    color: '#FFFFFF',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{feat.name.slice(0, 15)}</span>
                </div>
              </div>
            );
          })}

          {/* Prototype Live GPS User Location Marker with Pulse Radar */}
          <div
            style={{
              position: 'absolute',
              left: `${userLocation.x}%`,
              top: `${userLocation.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 14,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* GPS Accuracy Halo Pulse */}
            <div
              style={{
                position: 'absolute',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 98, 210, 0.16)',
                border: '1.5px solid rgba(0, 98, 210, 0.45)',
                animation: 'routeMarch 2s ease-out infinite'
              }}
            />

            {/* GPS Core Pin */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--oku-blue)',
                border: '3px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 98, 210, 0.6)',
                zIndex: 2
              }}
            />

            {/* "You Are Here" GPS Pill */}
            <div
              style={{
                marginTop: '6px',
                backgroundColor: 'var(--text-primary)',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '9.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>You (±4m)</span>
            </div>
          </div>
        </div>

        {/* Floating Controls (Zoom, Compass, Voice Guidance) */}
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10
          }}
        >
          {/* Compass Orient & Recenter Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
            <button 
              onClick={() => {
                setPanOffset({ x: 0, y: 0 });
                setZoomLevel(1);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'var(--border-light)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'var(--transition-fast)'
              }}
              title="Reset View to Center"
            >
              <Compass size={14} color="var(--sd-crimson)" />
              <span>North Oriented</span>
            </button>

            {/* GPS My-Location Recenter Button */}
            <button
              onClick={handleRecenterGPS}
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: gpsTrackingActive ? '#FFFFFF' : 'var(--bg-card)',
                borderRadius: '50%',
                boxShadow: '0 3px 10px rgba(0, 98, 210, 0.22)',
                border: gpsTrackingActive ? '2px solid var(--oku-blue)' : 'var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--oku-blue)',
                transition: 'var(--transition-fast)'
              }}
              title="Locate My Position (GPS)"
              aria-label="Locate My Position (GPS)"
            >
              <Locate size={18} />
            </button>
          </div>

          {/* Premium Zoom In / Out Controls */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
              border: 'var(--border-light)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              style={{
                width: '38px',
                height: '38px',
                border: 'none',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background var(--transition-fast)'
              }}
              title="Zoom In"
              aria-label="Zoom In"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.7))}
              style={{
                width: '38px',
                height: '38px',
                border: 'none',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background var(--transition-fast)'
              }}
              title="Zoom Out"
              aria-label="Zoom Out"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Minus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Active Step-Free Route Floater Panel */}
        {activeRoute && (
          <div 
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '12px',
              right: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--oku-blue)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'sheetSpringUp 280ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className="badge-oku" style={{ padding: '2px 8px', fontSize: '10.5px' }}>
                    Continuous Step-Free Path
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 700 }}>
                    ✓ 0 Stairs Guaranteed
                  </span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeRoute.originName.split('-')[0]} → {activeRoute.destinationName}
                </h4>
              </div>

              <button 
                onClick={clearRoute}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px' }}
                title="Clear Route"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-subtle)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Footprints size={14} color="var(--oku-blue)" />
                  <span style={{ fontWeight: 700 }}>{activeRoute.totalDistanceMeters}m</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="var(--text-secondary)" />
                  <span>{activeRoute.estimatedMinutesWheelchair} mins (Wheelchair)</span>
                </div>
              </div>

              <button 
                className="btn-primary"
                style={{ padding: '7px 13px', fontSize: '12px' }}
                onClick={() => setIsTurnByTurnOpen(true)}
              >
                Turn-by-Turn
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Marker Detail Modal / Bottom Sheet */}
      {selectedMarker && (
        <div className="modal-backdrop" onClick={() => setSelectedMarker(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: `${getMarkerAccentColor(selectedMarker.type)}15`,
                  border: `1.5px solid ${getMarkerAccentColor(selectedMarker.type)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {renderFeatureVectorIcon(selectedMarker.type, 22, getMarkerAccentColor(selectedMarker.type))}
                </div>
                <div>
                  <h3 className="sheet-title">{selectedMarker.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedMarker.locationName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMarker(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {selectedMarker.description}
            </p>

            {/* Specifications Grid based on MS 1184 Universal Accessibility Code */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {selectedMarker.details.slopeRatio && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Slope Gradient</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--oku-blue)' }}>
                    {selectedMarker.details.slopeRatio}
                  </div>
                </div>
              )}
              {selectedMarker.details.doorWidth && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Door Clearance</span>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>
                    {selectedMarker.details.doorWidth}
                  </div>
                </div>
              )}
              {selectedMarker.details.elevatorCabinClearance && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cabin Dimension</span>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>
                    {selectedMarker.details.elevatorCabinClearance}
                  </div>
                </div>
              )}
              {selectedMarker.details.tactileType && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tactile Standard</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--tactile-yellow)' }}>
                    {selectedMarker.details.tactileType === 'guiding' ? 'Sinusoidal Guiding Ribs' : 'Blister Hazard Domes'}
                  </div>
                </div>
              )}
              {selectedMarker.details.hasAdultChangingBench !== undefined && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Adult Changing Bench</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: selectedMarker.details.hasAdultChangingBench ? 'var(--status-success)' : 'var(--text-secondary)' }}>
                    {selectedMarker.details.hasAdultChangingBench ? 'Available & Powered' : 'Standard Flip Bench'}
                  </div>
                </div>
              )}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Operational Status</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Operational (Polis Bantuan Checked)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1 }}
                onClick={() => {
                  setSelectedMarker(null);
                  setIsRouteModalOpen(true);
                }}
              >
                <Navigation size={16} />
                Route to This Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Planner Modal */}
      {isRouteModalOpen && (
        <RoutePlannerModal onClose={() => setIsRouteModalOpen(false)} />
      )}

      {/* Turn By Turn Directions Sheet */}
      {isTurnByTurnOpen && activeRoute && (
        <TurnByTurnModal route={activeRoute} onClose={() => setIsTurnByTurnOpen(false)} />
      )}
    </div>
  );
};
