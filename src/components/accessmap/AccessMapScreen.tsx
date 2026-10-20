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
  ArrowRight
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
    speakText
  } = useApp();

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isTurnByTurnOpen, setIsTurnByTurnOpen] = useState(false);

  // Filter features by township and active toggles
  const visibleFeatures = allFeatures.filter(f => {
    if (f.townshipId !== activeTownship.id) return false;
    return featureFilters[f.type];
  });

  const getMarkerIcon = (type: AccessibilityFeatureType) => {
    switch (type) {
      case 'ramp':
        return '♿';
      case 'tactile_paving':
        return '🟡';
      case 'elevator':
        return '🛗';
      case 'restroom':
        return '🚻';
    }
  };

  const getMarkerColor = (type: AccessibilityFeatureType) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Filter Bar */}
      <div 
        style={{
          padding: '12px 14px',
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
            <h2 style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              AccessMap Directory
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step-free spatial navigation in {activeTownship.name}
            </p>
          </div>

          <button 
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
            onClick={() => setIsRouteModalOpen(true)}
          >
            <Navigation size={14} />
            Plan Route
          </button>
        </div>

        {/* Feature Toggles */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          <button
            onClick={() => toggleFeatureFilter('ramp')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.ramp ? '1.5px solid var(--oku-blue)' : 'var(--border-light)',
              backgroundColor: featureFilters.ramp ? 'var(--oku-blue-light)' : 'var(--bg-card)',
              color: featureFilters.ramp ? 'var(--oku-blue)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>♿</span> Wheelchair Ramps
          </button>

          <button
            onClick={() => toggleFeatureFilter('tactile_paving')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.tactile_paving ? '1.5px solid var(--tactile-yellow)' : 'var(--border-light)',
              backgroundColor: featureFilters.tactile_paving ? 'var(--tactile-yellow-bg)' : 'var(--bg-card)',
              color: featureFilters.tactile_paving ? 'var(--tactile-yellow)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>🟡</span> Tactile Paving
          </button>

          <button
            onClick={() => toggleFeatureFilter('elevator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.elevator ? '1.5px solid var(--elevator-emerald)' : 'var(--border-light)',
              backgroundColor: featureFilters.elevator ? 'var(--elevator-emerald-bg)' : 'var(--bg-card)',
              color: featureFilters.elevator ? 'var(--elevator-emerald)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>🛗</span> Live Lifts
          </button>

          <button
            onClick={() => toggleFeatureFilter('restroom')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.restroom ? '1.5px solid var(--restroom-violet)' : 'var(--border-light)',
              backgroundColor: featureFilters.restroom ? 'var(--restroom-violet-bg)' : 'var(--bg-card)',
              color: featureFilters.restroom ? 'var(--restroom-violet)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>🚻</span> Tandas OKU
          </button>
        </div>
      </div>

      {/* Interactive Map Visualizer / Spatial Canvas */}
      <div 
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#E5ECE8',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Spatial Map Vector Canvas */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #E8EEEA, #DFE7E2)',
            backgroundSize: '30px 30px',
            backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
            userSelect: 'none'
          }}
        >
          {/* Township Hub Ground Outlines (Simulating Elmina Central Park Lake / Mall footprint) */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            {/* Water body / Lake Promenade */}
            <path
              d="M 50 180 Q 180 150 260 210 T 400 320 L 400 600 L 0 600 Z"
              fill="#D4EAF7"
              stroke="#B2D8EE"
              strokeWidth="2"
            />
            <text x="180" y="380" fill="#7FA9C6" fontSize="13" fontWeight="700" letterSpacing="1">
              ELMINA CENTRAL LAKE
            </text>

            {/* Step-Free Boardwalk Path Layer */}
            <path
              d="M 60 120 C 120 120, 160 160, 210 220 S 300 310, 360 410"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Active Continuous Step-Free Route Overlay */}
            {activeRoute && (
              <g>
                {/* Glow underlay */}
                <path
                  d="M 60 120 C 120 120, 160 160, 210 220 S 300 310, 360 410"
                  fill="none"
                  stroke="rgba(0, 98, 210, 0.25)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Continuous Step-Free line */}
                <path
                  d="M 60 120 C 120 120, 160 160, 210 220 S 300 310, 360 410"
                  fill="none"
                  stroke="#0062D2"
                  strokeWidth="6"
                  strokeDasharray="8 4"
                  strokeLinecap="round"
                />

                {/* Origin Marker */}
                <circle cx="60" cy="120" r="10" fill="#0062D2" stroke="#FFFFFF" strokeWidth="3" />
                <text x="75" y="125" fill="#0062D2" fontSize="12" fontWeight="800">
                  START (Step-Free Drop-off)
                </text>

                {/* Destination Marker */}
                <circle cx="360" cy="410" r="10" fill="#8B1D24" stroke="#FFFFFF" strokeWidth="3" />
                <text x="240" y="440" fill="#8B1D24" fontSize="12" fontWeight="800">
                  END (Rainbow Bridge)
                </text>
              </g>
            )}
          </svg>

          {/* Interactive Feature Markers on Map */}
          {visibleFeatures.map((feat, index) => {
            // Position simulation points across canvas
            const positions = [
              { left: '22%', top: '22%' },
              { left: '74%', top: '78%' },
              { left: '38%', top: '34%' },
              { left: '55%', top: '48%' },
              { left: '28%', top: '16%' },
              { left: '68%', top: '26%' },
              { left: '32%', top: '24%' },
              { left: '80%', top: '70%' },
            ];
            const pos = positions[index % positions.length];

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
                  zIndex: 5
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: `3px solid ${getMarkerColor(feat.type)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    transition: 'var(--transition-fast)'
                  }}
                  title={feat.name}
                >
                  {getMarkerIcon(feat.type)}
                </div>
                <div 
                  style={{
                    position: 'absolute',
                    top: '42px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(18, 24, 38, 0.85)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                >
                  {feat.name.slice(0, 16)}...
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Township Compass & Layer Legend */}
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
          <div 
            style={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'var(--border-light)'
            }}
          >
            <Compass size={14} color="var(--sd-crimson)" />
            <span>North Oriented</span>
          </div>
        </div>

        {/* Active Step-Free Route Floater Panel */}
        {activeRoute && (
          <div 
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '14px',
              right: '14px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--oku-blue)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className="badge-oku">Continuous Step-Free Path</span>
                  <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 700 }}>
                    0 Stairs Guaranteed
                  </span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>
                  {activeRoute.originName.split('-')[0]} → {activeRoute.destinationName}
                </h4>
              </div>

              <button 
                onClick={clearRoute}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
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
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setIsTurnByTurnOpen(true)}
              >
                Guidance
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Marker Detail Sheet */}
      {selectedMarker && (
        <div className="modal-backdrop" onClick={() => setSelectedMarker(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{getMarkerIcon(selectedMarker.type)}</span>
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

            <p style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text-primary)' }}>
              {selectedMarker.description}
            </p>

            {/* Specifications Grid */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {selectedMarker.details.slopeRatio && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Slope Gradient</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--oku-blue)' }}>
                    {selectedMarker.details.slopeRatio}
                  </div>
                </div>
              )}
              {selectedMarker.details.doorWidth && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Door Clearance</span>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>
                    {selectedMarker.details.doorWidth}
                  </div>
                </div>
              )}
              {selectedMarker.details.elevatorCabinClearance && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cabin Dimension</span>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>
                    {selectedMarker.details.elevatorCabinClearance}
                  </div>
                </div>
              )}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Status</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Operational
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
