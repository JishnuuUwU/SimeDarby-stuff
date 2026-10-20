export type BayStatus = 
  | 'available' 
  | 'occupied_authorized' 
  | 'unauthorized_misuse' 
  | 'under_investigation';

export interface OKUParkingBay {
  id: string;
  bayNumber: string; // e.g. "OKU-B1-04"
  townshipId: string;
  hubName: string; // e.g. "KL East Mall - Basement 1 Lobby A"
  status: BayStatus;
  widthMeters: number; // e.g. 3.6m (includes wheelchair transfer aisle)
  hasTransferCorridor: boolean;
  distanceToLiftMeters: number;
  coveredRoof: boolean;
  lastUpdated: string;
  telemetry: {
    ultrasonicReading: 'clear' | 'vehicle_detected';
    cameraVerifiedOKU: boolean;
    detectedPlate?: string;
    occupancyDurationMins?: number;
    gracePeriodRemainingSecs?: number;
  };
  activeViolationReport?: {
    reportId: string;
    reportedBy: string;
    reportedAt: string;
    vehiclePlate: string;
    vehicleModel: string;
    violationReason: string;
    photoUrl?: string;
    securityDispatchStatus: 'dispatched' | 'en_route' | 'on_scene' | 'resolved';
    patrolOfficerId?: string;
  };
}

export interface MisuseReportSubmission {
  bayId: string;
  bayNumber: string;
  townshipId: string;
  hubName: string;
  vehiclePlate: string;
  vehicleDescription: string;
  hasStickerOrCard: 'no_sticker' | 'expired_card' | 'blocked_aisle';
  photoPreview?: string;
  notes: string;
}

export interface SecurityDispatchLog {
  id: string;
  timestamp: string;
  bayNumber: string;
  location: string;
  reportedVehiclePlate: string;
  actionTaken: 'patrol_dispatched' | 'wheel_clamp_warning' | 'verbal_advisory' | 'citation_issued';
  officerName: string; // e.g. "Kpl. Azman (Polis Bantuan SD Property)"
  status: 'active' | 'resolved';
}
