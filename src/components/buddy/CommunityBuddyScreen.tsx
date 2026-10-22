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
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X,
  HelpCircle,
  Trash2,
  Lock
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
    deleteBuddyRequest,
    setIsRoleModalOpen,
    addToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'my_requests' | 'accepted'>('requests');
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
        return <HeartHandshake size={18} color="var(--tactile-yellow)" />;
      case 'medical_clinic_escort':
        return <Stethoscope size={18} color="var(--status-success)" />;
      case 'grocery_pickup':
        return <ShoppingBag size={18} color="var(--restroom-violet)" />;
      case 'other':
      default:
        return <HelpCircle size={18} color="var(--text-tertiary)" />;
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
      case 'grocery_pickup':
        return 'Groceries Support';
      case 'other':
      default:
        return 'Other Assistance';
    }
  };

  const handleCompleteWithCelebration = (requestId: string) => {
    completeBuddyRequest(requestId);
    confetti({
      particleCount: 90,
      spread: 70,
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

  const handleQuickSend = (text: string) => {
    if (!selectedCoordinationRequest) return;
    sendBuddyMessage(selectedCoordinationRequest.id, text);
  };

  const handleEscalateSOS = () => {
    addToast({
      type: 'security',
      title: 'Polis Bantuan SOS Notified',
      message: 'Auxiliary police patrol dispatched to assist with immediate residential mobility support.'
    });
  };

  // Check if role is verified resident
  const isResident = currentUser.isVerifiedResident;

  // Strict Persona Access Restriction: Public visitors and non-resident roles cannot access Community Buddy
  if (!isResident) {
    return (
      <div className="tab-screen-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-app)' }}>
        {/* Header */}
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderBottom: 'var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge-warning" style={{ fontSize: '10.5px' }}>Access Restricted</span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '4px' }}>
            Community Buddy System
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Sime Darby Property Verified Resident Network
          </p>
        </div>

        {/* Lock Screen Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            backgroundColor: 'var(--sd-crimson-subtle)',
            color: 'var(--sd-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            boxShadow: '0 8px 24px rgba(139, 29, 36, 0.15)'
          }}>
            <Lock size={32} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Residents-Only Feature
          </h3>

          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: '320px', marginBottom: '20px' }}>
            To safeguard resident privacy and physical security within Sime Darby Property townships, the <strong>Community Buddy System</strong> is strictly restricted to authenticated township residents.
          </p>

          {/* Current Persona Card */}
          <div style={{
            width: '100%',
            maxWidth: '340px',
            backgroundColor: 'var(--bg-card)',
            border: 'var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CURRENT ACTIVE PERSONA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Role: {currentUser.role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <span className="badge-outline" style={{ fontSize: '11px' }}>
                Unverified
              </span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', maxWidth: '340px', padding: '12px 18px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => setIsRoleModalOpen(true)}
          >
            <ShieldCheck size={18} />
            Switch to Verified Resident Persona
          </button>
        </div>
      </div>
    );
  }

  // Open requests from neighbours (excluding current user's own requests)
  const neighbourOpenRequests = buddyRequests.filter(
    r => r.status === 'open' && r.requesterId !== currentUser.id
  );

  // My requests (created by current user, whether open or matched)
  const myRequests = buddyRequests.filter(
    r => r.requesterId === currentUser.id
  );

  // Requests accepted by current user to help others
  const acceptedByMeRequests = buddyRequests.filter(
    r => r.matchedVolunteer?.id === currentUser.id && r.requesterId !== currentUser.id
  );

  return (
    <div className="tab-screen-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-verified-resident" style={{ padding: '2px 8px', fontSize: '10px' }}>
                Neighbourhood Connection
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                100% Resident Verified
              </span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '2px' }}>
              Community Buddy System
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Physical support network connecting verified neighbors
            </p>
          </div>

          <button 
            className="btn-primary"
            style={{ padding: '9px 13px', fontSize: '12.5px' }}
            onClick={() => {
              if (!isResident) {
                setIsRoleModalOpen(true);
              } else {
                setIsRequestModalOpen(true);
              }
            }}
            id="btn-request-help"
          >
            <Plus size={15} />
            Request Help
          </button>
        </div>

        {/* Precinct Authentication Tag & Security Microchip */}
        <div 
          style={{
            backgroundColor: isResident ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
            border: isResident ? '1px solid var(--success-border)' : '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: isResident ? 'var(--status-success-solid)' : 'var(--status-warning-solid)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {isResident ? currentUser.precinct : 'Non-Resident Persona Active'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {isResident ? `Authenticated Unit: ${currentUser.unitNo} • 24 Verified Neighbors Online` : 'Community Buddy matching is restricted to authenticated residents.'}
              </div>
            </div>
          </div>

          {!isResident ? (
            <button 
              className="role-badge-btn"
              onClick={() => setIsRoleModalOpen(true)}
              style={{ fontSize: '10.5px', padding: '4px 9px' }}
            >
              Switch Role
            </button>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--success-text)', backgroundColor: 'var(--success-bg)', padding: '2px 8px', borderRadius: '4px' }}>
              Precinct Match
            </span>
          )}
        </div>

        {/* Segmented Sub-tabs Pill (3 separated sections: Neighbor Requests, My Requests, Accepted by Me) */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', padding: '3px', gap: '4px' }}>
          <button
            onClick={() => setActiveSubTab('requests')}
            style={{
              flex: 1,
              padding: '6px 8px',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              background: activeSubTab === 'requests' ? 'var(--bg-card)' : 'transparent',
              fontSize: '11.5px',
              fontWeight: 700,
              color: activeSubTab === 'requests' ? 'var(--sd-crimson)' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'requests' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            Neighbour Feed ({neighbourOpenRequests.length})
          </button>

          <button
            onClick={() => setActiveSubTab('my_requests')}
            style={{
              flex: 1,
              padding: '6px 8px',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              background: activeSubTab === 'my_requests' ? 'var(--bg-card)' : 'transparent',
              fontSize: '11.5px',
              fontWeight: 700,
              color: activeSubTab === 'my_requests' ? 'var(--sd-crimson)' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'my_requests' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            My Requests ({myRequests.length})
          </button>

          <button
            onClick={() => setActiveSubTab('accepted')}
            style={{
              flex: 1,
              padding: '6px 8px',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              background: activeSubTab === 'accepted' ? 'var(--bg-card)' : 'transparent',
              fontSize: '11.5px',
              fontWeight: 700,
              color: activeSubTab === 'accepted' ? 'var(--sd-crimson)' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'accepted' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            Accepted by Me ({acceptedByMeRequests.length})
          </button>
        </div>
      </div>

      {/* Main List Area with Adaptive Grid for Foldables/Tablets */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {/* Sub-tab 1: Neighbour Feed (Open requests to help with) */}
        {activeSubTab === 'requests' && (
          <div className="adaptive-grid-2col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {neighbourOpenRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                <CheckCircle2 size={44} color="var(--status-success)" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>All Neighbors Assisted!</h4>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                  No open physical assistance requests waiting from neighbors in your precinct right now.
                </p>
              </div>
            ) : (
              neighbourOpenRequests.map(req => (
                <div key={req.id} className="sd-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {getCategoryIcon(req.category)}
                      </div>
                      <div>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          {getCategoryLabel(req.category)}
                        </span>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                          {req.title}
                        </h4>
                      </div>
                    </div>

                    <span className={req.urgency === 'urgent' ? 'badge-danger' : 'badge-warning'} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                      {req.urgency}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {req.description}
                  </p>

                  {/* Precinct & Location metadata */}
                  <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--sd-crimson)" />
                      <span><strong>From:</strong> {req.pickupLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--status-success)" />
                      <span><strong>To:</strong> {req.dropoffLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: 'var(--border-subtle)', paddingTop: '6px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} />
                        <span>{req.scheduledTime}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {req.requesterName} ({req.requesterUnit})
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button 
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                      onClick={() => {
                        acceptBuddyRequest(req.id);
                        setActiveSubTab('accepted');
                      }}
                    >
                      <HeartHandshake size={15} />
                      Offer Neighborly Help
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sub-tab 2: My Requests (Created by Me) */}
        {activeSubTab === 'my_requests' && (
          <div className="adaptive-grid-2col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                <Package size={44} color="var(--text-tertiary)" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>You Have No Active Requests</h4>
                <p style={{ fontSize: '13px', marginTop: '4px', marginBottom: '16px' }}>
                  Need physical assistance with a heavy delivery, clinic visit, or ramp companion?
                </p>
                <button
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto', padding: '10px 16px' }}
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  <Plus size={15} />
                  Create a Help Request
                </button>
              </div>
            ) : (
              myRequests.map(req => {
                const isMatched = req.status === 'matched';
                return (
                  <div 
                    key={req.id} 
                    className="sd-card" 
                    style={{ 
                      border: isMatched ? '2px solid var(--status-success)' : '1px solid var(--border-light)',
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          {getCategoryIcon(req.category)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                              {getCategoryLabel(req.category)}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: isMatched ? 'var(--success-bg)' : 'var(--warning-bg)',
                              color: isMatched ? 'var(--success-text)' : 'var(--warning-text)'
                            }}>
                              {isMatched ? 'Volunteer Assigned' : 'Awaiting Neighbor'}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginTop: '2px' }}>
                            {req.title}
                          </h4>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={req.urgency === 'urgent' ? 'badge-danger' : 'badge-warning'} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                          {req.urgency}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete request "${req.title}"?`)) {
                              deleteBuddyRequest(req.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-tertiary)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            transition: 'var(--transition-fast)'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--status-error)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                          title="Delete Request"
                          aria-label={`Delete request ${req.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {req.description}
                    </p>

                    {/* Volunteer Info if matched */}
                    {isMatched && req.matchedVolunteer && (
                      <div style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--success-text)' }}>
                            Helper: {req.matchedVolunteer.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--success-text)' }}>
                            {req.matchedVolunteer.unitNo} • ★ {req.matchedVolunteer.rating}
                          </div>
                        </div>
                        <a 
                          href={`tel:${req.matchedVolunteer.phone}`}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--status-success-solid)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          <Phone size={14} />
                        </a>
                      </div>
                    )}

                    {/* Metadata */}
                    <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} color="var(--sd-crimson)" />
                        <span><strong>From:</strong> {req.pickupLocation}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} color="var(--status-success)" />
                        <span><strong>To:</strong> {req.dropoffLocation}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: 'var(--border-subtle)', paddingTop: '6px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} />
                          <span>{req.scheduledTime}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>
                          Created {req.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {isMatched ? (
                        <>
                          <button 
                            className="btn-secondary"
                            style={{ flex: 1, padding: '9px', fontSize: '12.5px' }}
                            onClick={() => setSelectedCoordinationRequest(req)}
                          >
                            <MessageSquare size={14} />
                            Chat with Volunteer ({req.liveMessages.length})
                          </button>
                          <button 
                            className="btn-primary"
                            style={{ flex: 1, padding: '9px', fontSize: '12.5px', backgroundColor: 'var(--status-success-solid)' }}
                            onClick={() => handleCompleteWithCelebration(req.id)}
                          >
                            <CheckCircle2 size={14} />
                            Mark Resolved
                          </button>
                        </>
                      ) : (
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                          <Sparkles size={14} color="var(--tactile-yellow)" />
                          <span>Broadcasted to verified neighbors in {req.requesterPrecinct}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Sub-tab 3: Accepted by Me (Requests I am assisting with) */}
        {activeSubTab === 'accepted' && (
          <div className="adaptive-grid-2col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {acceptedByMeRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                <Users size={44} color="var(--text-tertiary)" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>No Accepted Neighbor Sessions</h4>
                <p style={{ fontSize: '13px', marginTop: '4px', marginBottom: '14px' }}>
                  You haven't accepted any neighbor requests yet. Check the Neighbour Feed to lend a hand!
                </p>
                <button
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto', padding: '8px 14px' }}
                  onClick={() => setActiveSubTab('requests')}
                >
                  <ArrowRight size={14} />
                  View Neighbour Requests
                </button>
              </div>
            ) : (
              acceptedByMeRequests.map(req => (
                <div 
                  key={req.id} 
                  className="sd-card" 
                  style={{ border: '2px solid var(--status-success)', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge-verified-resident">
                      <CheckCircle2 size={12} /> Paired Neighbor Match
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Active Coordination
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {req.title}
                  </h4>

                  {/* Requester Profile */}
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Assisting: {req.requesterName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {req.requesterPrecinct} ({req.requesterUnit})
                      </div>
                    </div>

                    <a 
                      href={`tel:${req.requesterPhone}`} 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--status-success-solid)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                      }}
                      title="Call Neighbor Directly"
                    >
                      <Phone size={16} />
                    </a>
                  </div>

                  {/* Location metadata */}
                  <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--sd-crimson)" />
                      <span><strong>From:</strong> {req.pickupLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--status-success)" />
                      <span><strong>To:</strong> {req.dropoffLocation}</span>
                    </div>
                  </div>

                  {/* Coordination Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn-secondary"
                      style={{ flex: 1, padding: '9px', fontSize: '12.5px' }}
                      onClick={() => setSelectedCoordinationRequest(req)}
                    >
                      <MessageSquare size={14} />
                      Coordination Chat ({req.liveMessages.length})
                    </button>

                    <button 
                      className="btn-primary"
                      style={{ flex: 1, padding: '9px', fontSize: '12.5px', backgroundColor: 'var(--status-success-solid)' }}
                      onClick={() => handleCompleteWithCelebration(req.id)}
                    >
                      <CheckCircle2 size={14} />
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Live Coordination Chat Modal / Drawer */}
      {selectedCoordinationRequest && (
        <div className="modal-backdrop" onClick={() => setSelectedCoordinationRequest(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '88%' }}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge-verified-resident" style={{ fontSize: '10px' }}>Direct Neighbor Link</span>
                  <button 
                    onClick={handleEscalateSOS}
                    style={{ background: 'none', border: 'none', color: 'var(--status-error)', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <ShieldAlert size={12} /> SOS Auxiliary Dispatch
                  </button>
                </div>
                <h3 className="sheet-title" style={{ marginTop: '2px' }}>
                  Resident Chat Coordination
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Encrypted within {selectedCoordinationRequest.requesterPrecinct}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCoordinationRequest(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Message History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', padding: '6px 2px' }}>
              {selectedCoordinationRequest.liveMessages.map((msg, i) => (
                <div 
                  key={i} 
                  style={{
                    backgroundColor: msg.senderId === currentUser.id ? 'var(--sd-crimson-subtle)' : 'var(--bg-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: msg.senderId === currentUser.id ? '3px solid var(--sd-crimson)' : '3px solid var(--text-tertiary)',
                    alignSelf: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start',
                    maxWidth: '88%'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', gap: '12px' }}>
                    <span>{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '13px', marginTop: '2px', color: 'var(--text-primary)' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Quick response chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0' }}>
              {[
                "I'm at the guardhouse",
                "Bringing parcel trolley now",
                "Arrived at your doorstep",
                "Wheelchair is ready"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSend(chip)}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: 'var(--border-light)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Send Form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Type coordinate message to neighbor..."
                style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'var(--border-light)', fontSize: '13px', outline: 'none' }}
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
