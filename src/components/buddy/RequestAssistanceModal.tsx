import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssistanceCategory } from '../../types/buddy';
import { X, Package, Calendar, HeartHandshake, Stethoscope, ShoppingBag, ShieldCheck } from 'lucide-react';

export const RequestAssistanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createBuddyRequest, currentUser } = useApp();

  const [category, setCategory] = useState<AssistanceCategory>('parcel_delivery');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Guardhouse / Parcel Drop Hub');
  const [dropoffLocation, setDropoffLocation] = useState(currentUser.unitNo ? `Unit ${currentUser.unitNo} Doorstep` : 'Doorstep');
  const [needsWheelchairSupport, setNeedsWheelchairSupport] = useState(false);
  const [urgency, setUrgency] = useState<'normal' | 'priority' | 'urgent'>('priority');

  const categories: { id: AssistanceCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'parcel_delivery', 
      label: 'Heavy Parcel from Drop Point', 
      icon: <Package size={18} />, 
      desc: 'Help carrying bulky delivery boxes from guardhouse / lockers' 
    },
    { 
      id: 'event_navigation', 
      label: 'Township Event Companion', 
      icon: <Calendar size={18} />, 
      desc: 'Accompaniment for concerts, community carnivals, and park walks' 
    },
    { 
      id: 'mobility_support', 
      label: 'Wheelchair / Ramp Support', 
      icon: <HeartHandshake size={18} />, 
      desc: 'Physical assistance over ramps, slopes, or curb transitions' 
    },
    { 
      id: 'medical_clinic_escort', 
      label: 'Clinic / Medical Escort', 
      icon: <Stethoscope size={18} />, 
      desc: 'Escort to township clinic, pharmacy, or wellness center' 
    },
    { 
      id: 'grocery_pickup', 
      label: 'Grocery / Essentials Aid', 
      icon: <ShoppingBag size={18} />, 
      desc: 'Assistance carrying weekly groceries to residence' 
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createBuddyRequest({
      category,
      title,
      description: description || `Assistance needed by resident at ${currentUser.precinct || 'precinct'}.`,
      pickupLocation,
      dropoffLocation,
      needsWheelchairSupport,
      urgency
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
              <span className="badge-verified-resident">Verified Resident Request</span>
            </div>
            <h3 className="sheet-title" style={{ marginTop: '2px' }}>
              Request Local Assistance
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Broadcasts exclusively to authenticated neighbors in {currentUser.precinct || 'your precinct'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Category Picker */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              TYPE OF PHYSICAL SUPPORT
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {categories.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid var(--sd-crimson)' : 'var(--border-light)',
                      backgroundColor: isSelected ? 'var(--sd-crimson-subtle)' : 'var(--bg-card)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ color: isSelected ? 'var(--sd-crimson)' : 'var(--text-secondary)' }}>
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              REQUEST TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Need help carrying 2 heavy carton boxes"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              DETAILS / PHYSICAL NEED
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide details (e.g. Box is around 15kg, trolley available at lobby)."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Locations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                PICKUP POINT
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'var(--border-light)',
                  fontSize: '12px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                DESTINATION / UNIT
              </label>
              <input
                type="text"
                value={dropoffLocation}
                onChange={e => setDropoffLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'var(--border-light)',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          {/* Wheelchair Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={needsWheelchairSupport}
              onChange={e => setNeedsWheelchairSupport(e.target.checked)}
              style={{ accentColor: 'var(--sd-crimson)', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 600 }}>Physical mobility / Wheelchair handling support needed</span>
          </label>

          <button 
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px' }}
          >
            <ShieldCheck size={18} />
            Broadcast to Verified Neighbors
          </button>
        </form>
      </div>
    </div>
  );
};
