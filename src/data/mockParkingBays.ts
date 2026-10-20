import { OKUParkingBay, SecurityDispatchLog } from '../types/parking';

export const MOCK_PARKING_BAYS: OKUParkingBay[] = [
  // --- KL EAST MALL ---
  {
    id: 'bay_kleast_b1_01',
    bayNumber: 'OKU-B1-01',
    townshipId: 'kl_east',
    hubName: 'KL East Mall - Basement 1 Priority Zone',
    status: 'available',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 18,
    coveredRoof: true,
    lastUpdated: 'Just now',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_kleast_b1_02',
    bayNumber: 'OKU-B1-02',
    townshipId: 'kl_east',
    hubName: 'KL East Mall - Basement 1 Priority Zone',
    status: 'occupied_authorized',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 22,
    coveredRoof: true,
    lastUpdated: '12 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: true,
      detectedPlate: 'VCH 8921 (OKU Sticker #MY-OKU-5541)',
      occupancyDurationMins: 45
    }
  },
  {
    id: 'bay_kleast_b1_03',
    bayNumber: 'OKU-B1-03',
    townshipId: 'kl_east',
    hubName: 'KL East Mall - Basement 1 Priority Zone',
    status: 'unauthorized_misuse',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 26,
    coveredRoof: true,
    lastUpdated: '4 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: false,
      detectedPlate: 'BMQ 3390 (No OKU Sticker Detected)',
      occupancyDurationMins: 16,
      gracePeriodRemainingSecs: 0
    },
    activeViolationReport: {
      reportId: 'REP-KLE-0941',
      reportedBy: 'PRIME Resident (Anonymous)',
      reportedAt: '10 mins ago',
      vehiclePlate: 'BMQ 3390',
      vehicleModel: 'Black SUV (No OKU Decal)',
      violationReason: 'Parked across wheelchair hatched corridor without accessible badge.',
      securityDispatchStatus: 'en_route',
      patrolOfficerId: 'PB-7442 (Kpl. Shamsul, Polis Bantuan SD Property)'
    }
  },
  {
    id: 'bay_kleast_b1_04',
    bayNumber: 'OKU-B1-04',
    townshipId: 'kl_east',
    hubName: 'KL East Mall - Basement 1 South Lobby',
    status: 'available',
    widthMeters: 3.6,
    hasTransferCorridor: true,
    distanceToLiftMeters: 30,
    coveredRoof: true,
    lastUpdated: '1 min ago',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },

  // --- CITY OF ELMINA ---
  {
    id: 'bay_elmina_g_01',
    bayNumber: 'OKU-LAKE-01',
    townshipId: 'elmina',
    hubName: 'Elmina Lakeside Mall - North Ground Plaza',
    status: 'available',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 15,
    coveredRoof: true,
    lastUpdated: 'Just now',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_elmina_g_02',
    bayNumber: 'OKU-LAKE-02',
    townshipId: 'elmina',
    hubName: 'Elmina Lakeside Mall - North Ground Plaza',
    status: 'occupied_authorized',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 18,
    coveredRoof: true,
    lastUpdated: '8 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: true,
      detectedPlate: 'BRP 4421 (Verified Resident OKU Pass)',
      occupancyDurationMins: 25
    }
  },
  {
    id: 'bay_elmina_park_01',
    bayNumber: 'OKU-PARK-01',
    townshipId: 'elmina',
    hubName: 'Elmina Central Park Rainbow Bridge Trailhead',
    status: 'available',
    widthMeters: 3.6,
    hasTransferCorridor: true,
    distanceToLiftMeters: 40,
    coveredRoof: false,
    lastUpdated: '3 mins ago',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_elmina_park_02',
    bayNumber: 'OKU-PARK-02',
    townshipId: 'elmina',
    hubName: 'Elmina Central Park Inclusive Playground Bay',
    status: 'unauthorized_misuse',
    widthMeters: 3.6,
    hasTransferCorridor: true,
    distanceToLiftMeters: 35,
    coveredRoof: false,
    lastUpdated: '2 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: false,
      detectedPlate: 'WTR 707 (Unregistered Commercial Van)',
      occupancyDurationMins: 9,
      gracePeriodRemainingSecs: 0
    }
  }
];

export const MOCK_SECURITY_LOGS: SecurityDispatchLog[] = [
  {
    id: 'LOG-001',
    timestamp: '14:22 Today',
    bayNumber: 'OKU-B1-03',
    location: 'KL East Mall Basement 1',
    reportedVehiclePlate: 'BMQ 3390',
    actionTaken: 'patrol_dispatched',
    officerName: 'Kpl. Shamsul (Polis Bantuan Unit 4)',
    status: 'active'
  },
  {
    id: 'LOG-002',
    timestamp: '11:05 Today',
    bayNumber: 'OKU-LAKE-02',
    location: 'Elmina Lakeside Plaza',
    reportedVehiclePlate: 'WKP 1102',
    actionTaken: 'verbal_advisory',
    officerName: 'L/Kpl. Firdaus (Township Patrol)',
    status: 'resolved'
  },
  {
    id: 'LOG-003',
    timestamp: 'Yesterday, 17:40',
    bayNumber: 'OKU-B1-01',
    location: 'KL East Mall Basement 1',
    reportedVehiclePlate: 'NDJ 8218',
    actionTaken: 'wheel_clamp_warning',
    officerName: 'Insp. Zainal (Auxiliary Security Lead)',
    status: 'resolved'
  }
];
