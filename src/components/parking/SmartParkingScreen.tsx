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
  PhoneCall
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
    setIsRoleModalOpen 
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
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
              <span className="badge-oku">IoT Telemetry Live</span>
              <span style={{ display: 'inline-flex', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)', animation: 'pulseGlow 2s infinite' }} />
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '2px' }}>
              Smart OKU Parking Safeguard
            </h2>
          </div>

          {/* Auxiliary Police Status */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sd-crimson)' }}>
              Polis Bantuan
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Active Patrol En Route</div>
          </div>
        </div>

        {/* Real-Time Availability Metrics Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div 
            onClick={() => setFilterMode('available')}
            style={{
              backgroundColor: 'var(--status-success-bg)',
              border: filterMode === 'available' ? '2px solid var(--status-success)' : '1px solid #A6F4C5',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--status-success)' }}>
              {availableCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Available Bays</div>
          </div>

          <div 
            onClick={() => setFilterMode('alerts')}
            style={{
              backgroundColor: 'var(--status-error-bg)',
              border: filterMode === 'alerts' ? '2px solid var(--status-error)' : '1px solid #FECDCA',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--status-error)' }}>
              {misuseCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Misuse Alerts</div>
          </div>

          <div 
            onClick={() => setFilterMode('all')}
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: filterMode === 'all' ? '2px solid var(--text-primary)' : 'var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {townshipBays.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>All Monitored</div>
          </div>
        </div>

        {/* Security Persona Notice Banner */}
        {isSecurityOfficer && (
          <div 
            style={{
              backgroundColor: '#1E242B',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="var(--status-error)" />
              <span><strong>Auxiliary Officer Mode:</strong> Direct dispatch controls unlocked.</span>
            </div>
          </div>
        )}
      </div>

      {/* Bays List Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  ? '1.5px solid #A6F4C5' 
                  : 'var(--border-light)',
                backgroundColor: isMisuse ? '#FFFBFB' : 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: isAvailable ? 'var(--status-success)' : isMisuse ? 'var(--status-error)' : 'var(--oku-blue)',
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Car size={18} />
                    <span style={{ fontSize: '9px' }}>OKU</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{bay.bayNumber}</h3>
                      {isAvailable && (
                        <span className="badge-verified-resident">Vacant / Open</span>
                      )}
                      {isAuthorized && (
                        <span className="badge-oku">Verified OKU Permit</span>
                      )}
                      {isMisuse && (
                        <span className="badge-danger">Unauthorized Misuse</span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {bay.hubName}
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
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
                  gap: '8px',
                  fontSize: '12px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Bay Dimensions</span>
                  <div style={{ fontWeight: 700 }}>{bay.widthMeters}m (1.2m transfer corridor)</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Distance to Lift</span>
                  <div style={{ fontWeight: 700 }}>{bay.distanceToLiftMeters} meters (Step-free)</div>
                </div>

                {bay.telemetry.detectedPlate && (
                  <div style={{ gridColumn: 'span 2', borderTop: 'var(--border-subtle)', paddingTop: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>LPR Camera Detected Vehicle</span>
                    <div style={{ fontWeight: 800, color: isMisuse ? 'var(--status-error)' : 'var(--text-primary)' }}>
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
                    border: '1px solid #FECDCA',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-error)', fontWeight: 800, fontSize: '12px' }}>
                    <ShieldAlert size={14} />
                    <span>Auxiliary Police Alert: {bay.activeViolationReport?.securityDispatchStatus.toUpperCase() || 'DISPATCHED'}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                    {bay.activeViolationReport?.violationReason || 'Non-OKU vehicle parked without valid decal.'}
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Assigned: {bay.activeViolationReport?.patrolOfficerId || 'Polis Bantuan Unit'}
                  </div>

                  {/* Actions for Security Officers */}
                  {isSecurityOfficer && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button 
                        className="btn-primary"
                        style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                        onClick={() => dispatchSecurityPatrol(bay.id)}
                      >
                        Officer On Scene
                      </button>
                      <button 
                        className="btn-secondary"
                        style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                        onClick={() => resolveSecurityViolation(bay.id)}
                      >
                        Clear & Resolve
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Community Quick Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {!isMisuse && (
                  <button 
                    className="btn-outline-crimson"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '12px', borderColor: 'var(--status-error)', color: 'var(--status-error)' }}
                    onClick={() => setReportingBay(bay)}
                  >
                    <AlertTriangle size={14} />
                    Quick Report Non-OKU Vehicle
                  </button>
                )}

                {isAvailable && (
                  <button 
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '12px', backgroundColor: 'var(--oku-blue)' }}
                    onClick={() => {
                      alert(`Reserved navigation route to ${bay.bayNumber}. Follow step-free indoor signage.`);
                    }}
                  >
                    Navigate to Bay
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Security Dispatch Feed Section */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Polis Bantuan Dispatch Log</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Live Enforcement Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {securityLogs.slice(0, 3).map(log => (
              <div 
                key={log.id} 
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  border: 'var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {log.bayNumber} ({log.reportedVehiclePlate})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {log.actionTaken.replace('_', ' ').toUpperCase()} • {log.officerName}
                  </div>
                </div>

                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: log.status === 'active' ? 'var(--status-error-bg)' : 'var(--status-success-bg)',
                  color: log.status === 'active' ? 'var(--status-error)' : 'var(--status-success)',
                  padding: '3px 6px',
                  borderRadius: '4px'
                }}>
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Misuse Report Modal */}
      {reportingBay && (
        <ReportMisuseModal bay={reportingBay} onClose={() => setReportingBay(null)} />
      )}
    </div>
  );
};
