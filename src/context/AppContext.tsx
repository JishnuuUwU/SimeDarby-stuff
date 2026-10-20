import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile } from '../types/user';
import { TownshipLocation, MapMarkerFeature, StepFreeRoute, AccessibilityFeatureType } from '../types/accessibility';
import { AssistanceRequest, AssistanceCategory } from '../types/buddy';
import { OKUParkingBay, MisuseReportSubmission, SecurityDispatchLog } from '../types/parking';
import { TOWNSHIPS } from '../data/mockTownships';
import { MAP_MARKER_FEATURES, MOCK_STEP_FREE_ROUTES } from '../data/mockMapFeatures';
import { MOCK_BUDDY_REQUESTS } from '../data/mockBuddyData';
import { MOCK_PARKING_BAYS, MOCK_SECURITY_LOGS } from '../data/mockParkingBays';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'security';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  // Townships
  townships: TownshipLocation[];
  activeTownship: TownshipLocation;
  setActiveTownship: (township: TownshipLocation) => void;

  // User & Roles
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;

  // Accessibility Toggles & Settings
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  voiceGuidanceEnabled: boolean;
  setVoiceGuidanceEnabled: (enabled: boolean) => void;
  speakText: (text: string) => void;

  // AccessMap
  featureFilters: Record<AccessibilityFeatureType, boolean>;
  toggleFeatureFilter: (type: AccessibilityFeatureType) => void;
  allFeatures: MapMarkerFeature[];
  activeRoute: StepFreeRoute | null;
  calculateStepFreeRoute: (originId: string, destinationId: string) => void;
  clearRoute: () => void;
  selectedMarker: MapMarkerFeature | null;
  setSelectedMarker: (marker: MapMarkerFeature | null) => void;

  // Community Buddy System
  buddyRequests: AssistanceRequest[];
  createBuddyRequest: (data: {
    category: AssistanceCategory;
    title: string;
    description: string;
    pickupLocation: string;
    dropoffLocation: string;
    needsWheelchairSupport: boolean;
    urgency: 'normal' | 'priority' | 'urgent';
  }) => void;
  acceptBuddyRequest: (requestId: string) => void;
  sendBuddyMessage: (requestId: string, text: string) => void;
  completeBuddyRequest: (requestId: string) => void;
  activeBuddyRequestId: string | null;
  setActiveBuddyRequestId: (id: string | null) => void;

  // Smart OKU Parking
  parkingBays: OKUParkingBay[];
  securityLogs: SecurityDispatchLog[];
  submitMisuseReport: (report: MisuseReportSubmission) => void;
  dispatchSecurityPatrol: (bayId: string) => void;
  resolveSecurityViolation: (bayId: string) => void;
  selectedBayForReport: OKUParkingBay | null;
  setSelectedBayForReport: (bay: OKUParkingBay | null) => void;

  // Active Bottom Tab
  activeTab: 'home' | 'accessmap' | 'buddy' | 'parking' | 'profile';
  setActiveTab: (tab: 'home' | 'accessmap' | 'buddy' | 'parking' | 'profile') => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  public: {
    id: 'usr_pub_01',
    name: 'Visitor / Public Guest',
    role: 'public',
    phone: '+60 11-2098 7761',
    email: 'guest.visitor@simedarby.com',
    isVerifiedResident: false,
    isOkuCardHolder: false
  },
  prime_member: {
    id: 'usr_prm_02',
    name: 'Ahmad Faiz (PRIME Platinum)',
    role: 'prime_member',
    phone: '+60 12-441 9088',
    email: 'faiz.ahmad@prime.my',
    primeTier: 'Platinum',
    primePoints: 14850,
    isVerifiedResident: false,
    isOkuCardHolder: false
  },
  verified_resident: {
    id: 'usr_res_03',
    name: 'Hafidz Rahman (Ilham Resident)',
    role: 'verified_resident',
    phone: '+60 19-211 7743',
    email: 'hafidz.rahman@elmina.my',
    primeTier: 'Gold',
    primePoints: 8200,
    precinct: 'Ilham Residence, City of Elmina',
    unitNo: 'IR-03-12',
    isVerifiedResident: true,
    isOkuCardHolder: false,
    volunteerBadgeCount: 3,
    completedAssists: 28
  },
  township_security: {
    id: 'usr_sec_04',
    name: 'Kpl. Shamsul (Polis Bantuan SD Property)',
    role: 'township_security',
    phone: '+60 19-338 0099',
    email: 'auxsecurity.elmina@simedarbyproperty.com',
    isVerifiedResident: false,
    isOkuCardHolder: false
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTownship, setActiveTownship] = useState<TownshipLocation>(TOWNSHIPS[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS['verified_resident']);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'accessmap' | 'buddy' | 'parking' | 'profile'>('home');

  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(false);

  // AccessMap Feature Toggles
  const [featureFilters, setFeatureFilters] = useState<Record<AccessibilityFeatureType, boolean>>({
    ramp: true,
    tactile_paving: true,
    elevator: true,
    restroom: true
  });
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerFeature | null>(null);
  const [activeRoute, setActiveRoute] = useState<StepFreeRoute | null>(null);

  // Community Buddy State
  const [buddyRequests, setBuddyRequests] = useState<AssistanceRequest[]>(MOCK_BUDDY_REQUESTS);
  const [activeBuddyRequestId, setActiveBuddyRequestId] = useState<string | null>(null);

  // Parking State
  const [parkingBays, setParkingBays] = useState<OKUParkingBay[]>(MOCK_PARKING_BAYS);
  const [securityLogs, setSecurityLogs] = useState<SecurityDispatchLog[]>(MOCK_SECURITY_LOGS);
  const [selectedBayForReport, setSelectedBayForReport] = useState<OKUParkingBay | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply high contrast and font scaling to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', highContrast ? 'true' : 'false');
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Date.now();
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const speakText = (text: string) => {
    if (!voiceGuidanceEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const switchUserRole = (role: UserRole) => {
    setCurrentUser(DEFAULT_USERS[role]);
    setIsRoleModalOpen(false);
    addToast({
      type: 'info',
      title: 'Active Persona Switched',
      message: `Now viewing as ${DEFAULT_USERS[role].name} (${role.replace('_', ' ').toUpperCase()})`
    });
  };

  const toggleFeatureFilter = (type: AccessibilityFeatureType) => {
    setFeatureFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const calculateStepFreeRoute = (originId: string, destinationId: string) => {
    const route = activeTownship.id === 'kl_east' 
      ? MOCK_STEP_FREE_ROUTES['kleast_default'] 
      : MOCK_STEP_FREE_ROUTES['elmina_default'];
    
    setActiveRoute(route);
    addToast({
      type: 'success',
      title: 'Step-Free Route Calculated',
      message: `${route.totalDistanceMeters}m continuous obstacle-free path with 0 stairs.`
    });
    speakText(`Step-free route calculated to ${route.destinationName}. Total distance is ${route.totalDistanceMeters} meters with zero stairs.`);
  };

  const clearRoute = () => {
    setActiveRoute(null);
  };

  const createBuddyRequest = (data: {
    category: AssistanceCategory;
    title: string;
    description: string;
    pickupLocation: string;
    dropoffLocation: string;
    needsWheelchairSupport: boolean;
    urgency: 'normal' | 'priority' | 'urgent';
  }) => {
    const newReq: AssistanceRequest = {
      id: 'req_' + Date.now(),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterPrecinct: currentUser.precinct || 'Ilham Residence, City of Elmina',
      requesterUnit: currentUser.unitNo || 'IR-03-12',
      requesterPhone: currentUser.phone,
      category: data.category,
      title: data.title,
      description: data.description,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      estimatedDurationMins: 25,
      scheduledTime: 'Immediate / Next 30 Mins',
      urgency: data.urgency,
      needsWheelchairSupport: data.needsWheelchairSupport,
      status: 'open',
      createdAt: 'Just now',
      liveMessages: []
    };

    setBuddyRequests(prev => [newReq, ...prev]);
    setActiveBuddyRequestId(newReq.id);
    addToast({
      type: 'success',
      title: 'Buddy Assistance Request Broadcasted',
      message: `Notified 14 verified residents in ${newReq.requesterPrecinct}.`
    });
  };

  const acceptBuddyRequest = (requestId: string) => {
    setBuddyRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'matched',
          matchedVolunteer: {
            id: currentUser.id,
            name: currentUser.name,
            precinct: currentUser.precinct || 'Ilham Residence, City of Elmina',
            unitNo: currentUser.unitNo || 'IR-03-12',
            rating: 5.0,
            completedAssists: (currentUser.completedAssists || 0) + 1,
            phone: currentUser.phone,
            matchedAt: 'Just now'
          },
          liveMessages: [
            ...req.liveMessages,
            {
              senderId: currentUser.id,
              senderName: `${currentUser.name} (Neighbor Volunteer)`,
              text: `Hello neighbor! I accepted your request and am ready to help. I am heading over from ${currentUser.unitNo || 'nearby'}.`,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return req;
    }));

    addToast({
      type: 'success',
      title: 'Assistance Accepted!',
      message: 'You have been paired with your verified neighbor.'
    });
  };

  const sendBuddyMessage = (requestId: string, text: string) => {
    if (!text.trim()) return;
    setBuddyRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          liveMessages: [
            ...req.liveMessages,
            {
              senderId: currentUser.id,
              senderName: currentUser.name,
              text,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return req;
    }));
  };

  const completeBuddyRequest = (requestId: string) => {
    setBuddyRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'completed' };
      }
      return req;
    }));

    addToast({
      type: 'success',
      title: 'Assistance Marked Completed!',
      message: 'Thank you for fostering a caring Sime Darby Property community!'
    });
  };

  const submitMisuseReport = (submission: MisuseReportSubmission) => {
    const reportId = 'REP-' + Date.now().toString().slice(-4);
    
    // Update parking bay status to misuse and attach violation report
    setParkingBays(prev => prev.map(bay => {
      if (bay.id === submission.bayId) {
        return {
          ...bay,
          status: 'unauthorized_misuse',
          activeViolationReport: {
            reportId,
            reportedBy: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
            reportedAt: 'Just now',
            vehiclePlate: submission.vehiclePlate.toUpperCase(),
            vehicleModel: submission.vehicleDescription,
            violationReason: submission.notes || 'Unauthorized parking in designated OKU accessibility bay without valid permit.',
            photoUrl: submission.photoPreview,
            securityDispatchStatus: 'dispatched',
            patrolOfficerId: 'PB-Auxiliary Unit Dispatched'
          }
        };
      }
      return bay;
    }));

    // Add security dispatch log
    const newLog: SecurityDispatchLog = {
      id: 'LOG-' + Date.now().toString().slice(-3),
      timestamp: 'Just now',
      bayNumber: submission.bayNumber,
      location: submission.hubName,
      reportedVehiclePlate: submission.vehiclePlate.toUpperCase(),
      actionTaken: 'patrol_dispatched',
      officerName: 'Township Auxiliary Police (Polis Bantuan Dispatch)',
      status: 'active'
    };
    setSecurityLogs(prev => [newLog, ...prev]);

    setSelectedBayForReport(null);
    addToast({
      type: 'security',
      title: 'Alert Dispatched to Polis Bantuan',
      message: `Report #${reportId} logged for ${submission.bayNumber}. Auxiliary patrol unit notified.`
    });
  };

  const dispatchSecurityPatrol = (bayId: string) => {
    setParkingBays(prev => prev.map(bay => {
      if (bay.id === bayId && bay.activeViolationReport) {
        return {
          ...bay,
          activeViolationReport: {
            ...bay.activeViolationReport,
            securityDispatchStatus: 'on_scene',
            patrolOfficerId: 'Kpl. Shamsul (Polis Bantuan On Scene)'
          }
        };
      }
      return bay;
    }));

    addToast({
      type: 'security',
      title: 'Patrol Officer Arrived',
      message: 'Auxiliary officer is currently inspecting the vehicle and issuing citation.'
    });
  };

  const resolveSecurityViolation = (bayId: string) => {
    setParkingBays(prev => prev.map(bay => {
      if (bay.id === bayId) {
        return {
          ...bay,
          status: 'available',
          activeViolationReport: undefined,
          telemetry: {
            ultrasonicReading: 'clear',
            cameraVerifiedOKU: false
          }
        };
      }
      return bay;
    }));

    addToast({
      type: 'success',
      title: 'Violation Resolved',
      message: 'Bay has been vacated and is now available for genuine OKU permit holders.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        townships: TOWNSHIPS,
        activeTownship,
        setActiveTownship,
        currentUser,
        switchUserRole,
        isRoleModalOpen,
        setIsRoleModalOpen,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        voiceGuidanceEnabled,
        setVoiceGuidanceEnabled,
        speakText,
        featureFilters,
        toggleFeatureFilter,
        allFeatures: MAP_MARKER_FEATURES,
        activeRoute,
        calculateStepFreeRoute,
        clearRoute,
        selectedMarker,
        setSelectedMarker,
        buddyRequests,
        createBuddyRequest,
        acceptBuddyRequest,
        sendBuddyMessage,
        completeBuddyRequest,
        activeBuddyRequestId,
        setActiveBuddyRequestId,
        parkingBays,
        securityLogs,
        submitMisuseReport,
        dispatchSecurityPatrol,
        resolveSecurityViolation,
        selectedBayForReport,
        setSelectedBayForReport,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
