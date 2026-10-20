import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OKUParkingBay } from '../../types/parking';
import { X, Camera, AlertTriangle, ShieldAlert, Check } from 'lucide-react';

export const ReportMisuseModal: React.FC<{ bay: OKUParkingBay; onClose: () => void }> = ({ bay, onClose }) => {
  const { submitMisuseReport, activeTownship } = useApp();

  const [vehiclePlate, setVehiclePlate] = useState(bay.telemetry.detectedPlate?.split(' ')[0] || '');
  const [vehicleDescription, setVehicleDescription] = useState('Black Sedan');
  const [violationType, setViolationType] = useState<'no_sticker' | 'expired_card' | 'blocked_aisle'>('no_sticker');
  const [notes, setNotes] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiclePlate.trim()) return;

    submitMisuseReport({
      bayId: bay.id,
      bayNumber: bay.bayNumber,
      townshipId: bay.townshipId,
      hubName: bay.hubName,
      vehiclePlate: vehiclePlate.trim().toUpperCase(),
      vehicleDescription,
      hasStickerOrCard: violationType,
      photoPreview: hasPhoto ? 'captured_vehicle_evidence.jpg' : undefined,
      notes: notes || 'Parked in designated OKU bay without valid OKU accessibility decal or card.'
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '92%' }}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-danger">
                <AlertTriangle size={12} /> Community-Led Safeguard
              </span>
            </div>
            <h3 className="sheet-title" style={{ marginTop: '2px' }}>
              Report OKU Bay Misuse
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Direct alert to Sime Darby Property Polis Bantuan (Auxiliary Police)
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Bay Info */}
        <div 
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: 'var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>LOCATION & BAY</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {bay.bayNumber}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {bay.hubName}
            </div>
          </div>

          <span className="badge-oku">3.8m OKU Bay</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* License Plate Number */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              VEHICLE LICENSE PLATE
            </label>
            <input
              type="text"
              required
              value={vehiclePlate}
              onChange={e => setVehiclePlate(e.target.value)}
              placeholder="e.g. WXX 1234 or BMQ 3390"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '15px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                outline: 'none'
              }}
            />
          </div>

          {/* Vehicle Model & Color */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              VEHICLE MODEL / COLOR
            </label>
            <input
              type="text"
              value={vehicleDescription}
              onChange={e => setVehicleDescription(e.target.value)}
              placeholder="e.g. White SUV, Silver Sedan"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-light)',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Reason Classification */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              MISUSE OBSERVATION
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { id: 'no_sticker', label: 'No OKU Sticker or JKM Card on Windshield' },
                { id: 'blocked_aisle', label: 'Straddling / Blocking Wheelchair Transfer Aisle' },
                { id: 'expired_card', label: 'Suspicious / Expired OKU Permit Displayed' }
              ].map(opt => (
                <label 
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: violationType === opt.id ? '1.5px solid var(--status-error)' : 'var(--border-light)',
                    backgroundColor: violationType === opt.id ? 'var(--status-error-bg)' : 'var(--bg-card)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="violation"
                    checked={violationType === opt.id}
                    onChange={() => setViolationType(opt.id as any)}
                    style={{ accentColor: 'var(--status-error)' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Simulated Photo Evidence Capture */}
          <div 
            style={{
              border: '2px dashed var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-subtle)',
              cursor: 'pointer'
            }}
            onClick={() => setHasPhoto(!hasPhoto)}
          >
            <Camera size={24} color="var(--text-secondary)" style={{ margin: '0 auto 6px auto' }} />
            <div style={{ fontSize: '13px', fontWeight: 700 }}>
              {hasPhoto ? '✓ Evidence Photo Attached (LPR Match Ready)' : 'Tap to Attach Vehicle Photo'}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Township AI auto-detects plate and lack of OKU decal
            </p>
          </div>

          <button 
            type="submit"
            className="btn-danger"
            style={{ width: '100%', padding: '14px' }}
          >
            <ShieldAlert size={18} />
            Dispatch Alert to Polis Bantuan
          </button>
        </form>
      </div>
    </div>
  );
};
