import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OKUParkingBay } from '../../types/parking';
import { 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Camera, 
  Radio, 
  Clock, 
  MapPin, 
  Filter,
  Check,
  PhoneCall,
  Navigation,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import { ReportMisuseModal } from './ReportMisuseModal';

export const SmartParkingScreen: React.FC = () => {
  const { 
    parkingBays, 
    activeTownship, 
    securityLogs, 
    dispatchSecurityPatrol, 
    resolveSecurityViolation,
    currentUser,
    setIsRoleModalOpen,
    addToast,
    speakText,
    setActiveTab,
    calculateStepFreeRoute
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'available' | 'alerts'>('all');
  const [reportingBay, setReportingBay] = useState<OKUParkingBay | null>(null);

  // Filter bays by active township
  const townshipBays = parkingBays.filter(b => b.townshipId === activeTownship.id);

  const displayedBays = townshipBays.filter(b => {
    if (filterMode === 'available') return b.status === 'available';
    if (filterMode === 'alerts') return b.status === 'unauthorized_misuse';
    return true;
  });

  const availableCount = townshipBays.filter(b => b.status === 'available').length;
  const misuseCount = townshipBays.filter(b => b.status === 'unauthorized_misuse').length;

  const isSecurityOfficer = currentUser.role === 'township_security';

  const handleNavigateToBay = (bay: OKUParkingBay) => {
    addToast({
      type: 'info',
      title: `Navigating to ${bay.bayNumber}`,
      message: `Direct step-free guidance to ${bay.hubName}. Total distance: ${bay.distanceToLiftMeters}m to priority lift.`
    });
    speakText(`Guiding to accessible bay ${bay.bayNumber} at ${bay.hubName}.`);
    setActiveTab('accessmap');
  };

  return (
    <div className="tab-screen-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Header */}
      <div 
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: 'var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-oku" style={{ padding: '2px 8px', fontSize: '10px' }}>
                IoT Telemetry Live
              </span>
              <span 
                className="pulse-sensor"
                style={{ 
                  display: 'inline-flex', 
                  width: '9px', 
                  height: '9px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--status-success)' 
                }} 
              />
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '2px' }}>
              Smart OKU Parking Safeguard
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Real-time bay monitoring & auxiliary enforcement in {activeTownship.name}
            </p>
          </div>

          {/* Auxiliary Police Status Badge */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--sd-crimson)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
              <ShieldCheck size={13} /> Polis Bantuan
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Active Patrol On Duty
            </div>
          </div>
        </div>

        {/* Real-Time Availability Metrics Banner (Interactive Filter Pills) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div 
            onClick={() => setFilterMode('available')}
            style={{
              backgroundColor: 'var(--status-success-bg)',
              border: filterMode === 'available' ? '2px solid var(--status-success)' : '1px solid var(--success-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: filterMode === 'available' ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--status-success)' }}>
                {availableCount}
              </div>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '2px' }}>Available Bays</div>
          </div>

          <div 
            onClick={() => setFilterMode('alerts')}
            style={{
              backgroundColor: 'var(--status-error-bg)',
              border: filterMode === 'alerts' ? '2px solid var(--status-error)' : '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: filterMode === 'alerts' ? '0 2px 8px rgba(239, 68, 68, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--status-error)' }}>
                {misuseCount}
              </div>
              <span 
                className={misuseCount > 0 ? "pulse-violation" : ""}
                style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-error)' }} 
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '2px' }}>Misuse Alerts</div>
          </div>

          <div 
            onClick={() => setFilterMode('all')}
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: filterMode === 'all' ? '2px solid var(--text-primary)' : 'var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: filterMode === 'all' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {townshipBays.length}
              </div>
              <Layers size={14} color="var(--text-tertiary)" />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '2px' }}>All Monitored</div>
          </div>
        </div>

        {/* Security Officer Persona Terminal Notice */}
        {isSecurityOfficer && (
          <div 
            style={{
              backgroundColor: 'var(--bg-inverse)',
              color: 'var(--text-inverse)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="var(--sd-gold)" />
              <span><strong>Polis Bantuan Console:</strong> Direct auxiliary dispatch & citation controls active.</span>
            </div>
          </div>
        )}
      </div>

      {/* Bays List Area with Adaptive Grid for Foldables/Tablets */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        <div className="adaptive-grid-2col" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayedBays.map(bay => {
            const isMisuse = bay.status === 'unauthorized_misuse';
            const isAvailable = bay.status === 'available';
            const isAuthorized = bay.status === 'occupied_authorized';

            return (
              <div 
                key={bay.id}
                className="sd-card"
                style={{
                  border: isMisuse 
                    ? '2px solid var(--status-error)' 
                    : isAvailable 
                    ? '1.5px solid var(--success-border)' 
                    : 'var(--border-light)',
                  backgroundColor: isMisuse ? 'var(--danger-bg)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: isAvailable ? 'var(--status-success-solid)' : isMisuse ? 'var(--status-error-solid)' : 'var(--oku-blue-solid)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        boxShadow: '0 3px 8px rgba(0,0,0,0.18)'
                      }}
                    >
                      <Car size={19} />
                      <span style={{ fontSize: '9px', fontWeight: 800 }}>OKU</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{bay.bayNumber}</h3>
                        {isAvailable && (
                          <span className="badge-verified-resident" style={{ fontSize: '10.5px' }}>Vacant / Open</span>
                        )}
                        {isAuthorized && (
                          <span className="badge-oku" style={{ fontSize: '10.5px' }}>Verified Permit</span>
                        )}
                        {isMisuse && (
                          <span className="badge-danger" style={{ fontSize: '10.5px' }}>Unauthorized Misuse</span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {bay.hubName}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {bay.lastUpdated}
                  </span>
                </div>

                {/* Bay Specifications & Sensor Telemetry */}
                <div 
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    fontSize: '12px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Bay Dimensions</span>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{bay.widthMeters}m (1.2m transfer corridor)</div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Distance to Lift</span>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{bay.distanceToLiftMeters} meters (Step-free)</div>
                  </div>

                  {/* IoT Telemetry State */}
                  <div style={{ gridColumn: 'span 2', borderTop: 'var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={14} color={isAvailable ? "var(--status-success)" : "var(--sd-crimson)"} />
                      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        Sensor: <strong>{bay.telemetry.ultrasonicReading === 'clear' ? 'Sonar Clear (Ground Ready)' : 'Vehicle Detected (Ultrasonic)'}</strong>
                      </span>
                    </div>

                    <span style={{ fontSize: '11px', fontWeight: 700, color: bay.telemetry.cameraVerifiedOKU ? 'var(--status-success)' : 'var(--text-secondary)' }}>
                      {bay.telemetry.cameraVerifiedOKU ? '✓ Decal Verified' : 'Camera LPR Active'}
                    </span>
                  </div>

                  {bay.telemetry.detectedPlate && (
                    <div style={{ gridColumn: 'span 2', backgroundColor: isMisuse ? 'var(--danger-bg)' : 'var(--info-bg)', padding: '6px 10px', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '10.5px', fontWeight: 700 }}>LPR Camera Detected Plate</span>
                      <div style={{ fontWeight: 800, color: isMisuse ? 'var(--danger-text)' : 'var(--oku-blue)' }}>
                        {bay.telemetry.detectedPlate}
                      </div>
                    </div>
                  )}
                </div>

                {/* Misuse Violation Status Banner & Actions */}
                {isMisuse && (
                  <div 
                    style={{
                      backgroundColor: 'var(--status-error-bg)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-error)', fontWeight: 800, fontSize: '12px' }}>
                      <ShieldAlert size={15} />
                      <span>Auxiliary Police Alert: {bay.activeViolationReport?.securityDispatchStatus.toUpperCase() || 'DISPATCHED'}</span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {bay.activeViolationReport?.violationReason || 'Non-OKU vehicle parked without valid decal.'}
                    </p>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Assigned: {bay.activeViolationReport?.patrolOfficerId || 'Polis Bantuan Unit'}
                    </div>

                    {/* Actions for Security Officers */}
                    {isSecurityOfficer && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button 
                          className="btn-primary"
                          style={{ flex: 1, padding: '9px', fontSize: '12px' }}
                          onClick={() => dispatchSecurityPatrol(bay.id)}
                        >
                          Officer On Scene
                        </button>
                        <button 
                          className="btn-secondary"
                          style={{ flex: 1, padding: '9px', fontSize: '12px' }}
                          onClick={() => resolveSecurityViolation(bay.id)}
                        >
                          Clear & Resolve
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Community Quick Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  {!isMisuse && (
                    <button 
                      className="btn-outline-crimson"
                      style={{ flex: 1, padding: '9px 12px', fontSize: '12px', borderColor: 'var(--status-error)', color: 'var(--status-error)' }}
                      onClick={() => setReportingBay(bay)}
                      id={`btn-report-${bay.id}`}
                    >
                      <AlertTriangle size={14} />
                      Quick Report Non-OKU Vehicle
                    </button>
                  )}

                  {isAvailable && (
                    <button 
                      className="btn-primary"
                      style={{ flex: 1, padding: '9px 12px', fontSize: '12px', backgroundColor: 'var(--oku-blue-solid)' }}
                      onClick={() => handleNavigateToBay(bay)}
                    >
                      <Navigation size={14} />
                      Navigate Step-Free
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Misuse Report Modal */}
      {reportingBay && (
        <ReportMisuseModal bay={reportingBay} onClose={() => setReportingBay(null)} />
      )}
    </div>
  );
};
