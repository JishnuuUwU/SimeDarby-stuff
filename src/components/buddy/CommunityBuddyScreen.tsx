import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssistanceRequest } from '../../types/buddy';
import { 
  Users, 
  ShieldCheck, 
  Package, 
  Calendar, 
  HeartHandshake, 
  Stethoscope, 
  ShoppingBag, 
  Plus, 
  MapPin, 
  Clock, 
  Phone, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RequestAssistanceModal } from './RequestAssistanceModal';

export const CommunityBuddyScreen: React.FC = () => {
  const { 
    currentUser, 
    buddyRequests, 
    acceptBuddyRequest, 
    sendBuddyMessage, 
    completeBuddyRequest,
    setIsRoleModalOpen 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'active'>('requests');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedCoordinationRequest, setSelectedCoordinationRequest] = useState<AssistanceRequest | null>(null);
  const [chatInput, setChatInput] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'parcel_delivery':
        return <Package size={18} color="var(--sd-crimson)" />;
      case 'event_navigation':
        return <Calendar size={18} color="var(--oku-blue)" />;
      case 'mobility_support':
        return <HeartHandshake size={18} color="var(--status-warning)" />;
      case 'medical_clinic_escort':
        return <Stethoscope size={18} color="var(--status-success)" />;
      default:
        return <ShoppingBag size={18} color="var(--restroom-violet)" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'parcel_delivery':
        return 'Heavy Parcel Drop';
      case 'event_navigation':
        return 'Event Navigation';
      case 'mobility_support':
        return 'Wheelchair / Ramp';
      case 'medical_clinic_escort':
        return 'Clinic Escort';
      default:
        return 'Groceries Support';
    }
  };

  const handleCompleteWithCelebration = (requestId: string) => {
    completeBuddyRequest(requestId);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setSelectedCoordinationRequest(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoordinationRequest || !chatInput.trim()) return;
    sendBuddyMessage(selectedCoordinationRequest.id, chatInput.trim());
    setChatInput('');
  };

  // Check if role is verified resident
  const isResident = currentUser.isVerifiedResident;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Header & Precinct Trust Banner */}
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
            <h2 style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Community Buddy System
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Physical support network connecting verified neighbors
            </p>
          </div>

          <button 
            className="btn-primary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
            onClick={() => {
              if (!isResident) {
                setIsRoleModalOpen(true);
              } else {
                setIsRequestModalOpen(true);
              }
            }}
          >
            <Plus size={15} />
            Request Help
          </button>
        </div>

        {/* Precinct Authentication Tag */}
        <div 
          style={{
            backgroundColor: isResident ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
            border: isResident ? '1px solid #A6F4C5' : '1px solid #FEDF89',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color={isResident ? 'var(--status-success)' : 'var(--status-warning)'} />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {isResident ? currentUser.precinct : 'Non-Resident Persona Active'}
              </span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {isResident ? `Authenticated Unit: ${currentUser.unitNo} • Trust Level 100%` : 'Community Buddy matching is restricted to authenticated residents.'}
              </div>
            </div>
          </div>

          {!isResident && (
            <button 
              className="role-badge-btn"
              onClick={() => setIsRoleModalOpen(true)}
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              Switch to Resident
            </button>
          )}
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: 'var(--border-subtle)', paddingTop: '2px' }}>
          <button
            onClick={() => setActiveSubTab('requests')}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              color: activeSubTab === 'requests' ? 'var(--sd-crimson)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'requests' ? '2px solid var(--sd-crimson)' : 'none',
              cursor: 'pointer'
            }}
          >
            Neighbour Requests ({buddyRequests.filter(r => r.status === 'open').length})
          </button>

          <button
            onClick={() => setActiveSubTab('active')}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              color: activeSubTab === 'active' ? 'var(--sd-crimson)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'active' ? '2px solid var(--sd-crimson)' : 'none',
              cursor: 'pointer'
            }}
          >
            Active & Coordinated ({buddyRequests.filter(r => r.status === 'matched').length})
          </button>
        </div>
      </div>

      {/* Main List Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeSubTab === 'requests' ? (
          <>
            {buddyRequests.filter(r => r.status === 'open').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={40} color="var(--status-success)" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>All Neighbors Assisted!</h4>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                  No open physical assistance requests waiting in your precinct right now.
                </p>
              </div>
            ) : (
              buddyRequests.filter(r => r.status === 'open').map(req => (
                <div key={req.id} className="sd-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getCategoryIcon(req.category)}
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          {getCategoryLabel(req.category)}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {req.title}
                        </h4>
                      </div>
                    </div>

                    <span className="badge-warning">
                      {req.urgency.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {req.description}
                  </p>

                  {/* Precinct & Location metadata */}
                  <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--sd-crimson)" />
                      <span><strong>From:</strong> {req.pickupLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--status-success)" />
                      <span><strong>To:</strong> {req.dropoffLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <Clock size={13} />
                      <span>{req.scheduledTime} • Requester: {req.requesterName} ({req.requesterUnit})</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button 
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                      onClick={() => {
                        acceptBuddyRequest(req.id);
                        setActiveSubTab('active');
                      }}
                    >
                      <HeartHandshake size={15} />
                      Offer Neighborly Help
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          /* Active Tasks Tab */
          <>
            {buddyRequests.filter(r => r.status === 'matched').map(req => (
              <div 
                key={req.id} 
                className="sd-card" 
                style={{ border: '2px solid var(--status-success)', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge-verified-resident">
                    <CheckCircle2 size={12} /> Paired Neighbor Match
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Active Coordination
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>
                  {req.title}
                </h4>

                {/* Volunteer & Requester Match Profile */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>
                      Volunteer: {req.matchedVolunteer?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {req.matchedVolunteer?.precinct} ({req.matchedVolunteer?.unitNo}) • ★ {req.matchedVolunteer?.rating}
                    </div>
                  </div>

                  <a 
                    href={`tel:${req.matchedVolunteer?.phone}`} 
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--status-success)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                    title="Call Neighbor Directly"
                  >
                    <Phone size={16} />
                  </a>
                </div>

                {/* Coordination Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                    onClick={() => setSelectedCoordinationRequest(req)}
                  >
                    <MessageSquare size={14} />
                    Live Chat ({req.liveMessages.length})
                  </button>

                  <button 
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px', backgroundColor: 'var(--status-success)' }}
                    onClick={() => handleCompleteWithCelebration(req.id)}
                  >
                    <CheckCircle2 size={14} />
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Live Coordination Chat Drawer */}
      {selectedCoordinationRequest && (
        <div className="modal-backdrop" onClick={() => setSelectedCoordinationRequest(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85%' }}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div>
                <h3 className="sheet-title">Resident Chat Coordination</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Encrypted within {selectedCoordinationRequest.requesterPrecinct}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCoordinationRequest(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                &times;
              </button>
            </div>

            {/* Message History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', padding: '6px 0' }}>
              {selectedCoordinationRequest.liveMessages.map((msg, i) => (
                <div 
                  key={i} 
                  style={{
                    backgroundColor: msg.senderId === currentUser.id ? 'var(--sd-crimson-subtle)' : 'var(--bg-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: msg.senderId === currentUser.id ? '3px solid var(--sd-crimson)' : '3px solid var(--text-tertiary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    <span>{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '13px', marginTop: '2px', color: 'var(--text-primary)' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Send Form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Type coordinate message to neighbor..."
                style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'var(--border-light)', fontSize: '13px' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 14px' }}>
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {isRequestModalOpen && (
        <RequestAssistanceModal onClose={() => setIsRequestModalOpen(false)} />
      )}
    </div>
  );
};
