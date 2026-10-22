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
    },
    activeViolationReport: {
      reportId: 'REP-ELM-0412',
      reportedBy: 'Hafidz Rahman (Resident)',
      reportedAt: '5 mins ago',
      vehiclePlate: 'WTR 707',
      vehicleModel: 'White Delivery Van',
      violationReason: 'Unattended parcel delivery van parked across wheelchair access ramp.',
      securityDispatchStatus: 'en_route',
      patrolOfficerId: 'PB-3011 (L/Kpl. Firdaus, Polis Bantuan)'
    }
  },
  {
    id: 'bay_elmina_pavilion_01',
    bayNumber: 'OKU-PAV-01',
    townshipId: 'elmina',
    hubName: 'Elmina Pavilion Community Hub',
    status: 'available',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 12,
    coveredRoof: true,
    lastUpdated: 'Just now',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_elmina_pavilion_02',
    bayNumber: 'OKU-PAV-02',
    townshipId: 'elmina',
    hubName: 'Elmina Pavilion Community Hub',
    status: 'occupied_authorized',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 14,
    coveredRoof: true,
    lastUpdated: '18 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: true,
      detectedPlate: 'VK 5002 (JKM Disabled Driver Permit)',
      occupancyDurationMins: 32
    }
  },

  // --- BANDAR BUKIT RAJA ---
  {
    id: 'bay_bbr_townpark_01',
    bayNumber: 'OKU-BBR-01',
    townshipId: 'bukit_raja',
    hubName: 'Townpark Central Pavilion & Boardwalk',
    status: 'available',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 20,
    coveredRoof: true,
    lastUpdated: 'Just now',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_bbr_townpark_02',
    bayNumber: 'OKU-BBR-02',
    townshipId: 'bukit_raja',
    hubName: 'Townpark Central Pavilion & Boardwalk',
    status: 'occupied_authorized',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 24,
    coveredRoof: true,
    lastUpdated: '22 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: true,
      detectedPlate: 'BLQ 9821 (Selangor OKU Sticker #8812)',
      occupancyDurationMins: 40
    }
  },
  {
    id: 'bay_bbr_gateway_01',
    bayNumber: 'OKU-BBR-03',
    townshipId: 'bukit_raja',
    hubName: 'Gateway Commercial Square - Block A Priority',
    status: 'unauthorized_misuse',
    widthMeters: 3.6,
    hasTransferCorridor: true,
    distanceToLiftMeters: 18,
    coveredRoof: false,
    lastUpdated: '6 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: false,
      detectedPlate: 'KDJ 6112 (No OKU Sticker)',
      occupancyDurationMins: 14,
      gracePeriodRemainingSecs: 0
    },
    activeViolationReport: {
      reportId: 'REP-BBR-0108',
      reportedBy: 'Klang Auxiliary Patrol',
      reportedAt: '12 mins ago',
      vehiclePlate: 'KDJ 6112',
      vehicleModel: 'Silver Sedan',
      violationReason: 'Parked in priority blue zone without valid JKM sticker or disabled permit.',
      securityDispatchStatus: 'on_scene',
      patrolOfficerId: 'PB-5509 (Konst. Ridzuan)'
    }
  },
  {
    id: 'bay_bbr_athira_01',
    bayNumber: 'OKU-ATH-01',
    townshipId: 'bukit_raja',
    hubName: 'Athira Residents Clubhouse Main Lobby',
    status: 'available',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 10,
    coveredRoof: true,
    lastUpdated: '4 mins ago',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },

  // --- ARA DAMANSARA ---
  {
    id: 'bay_ara_oasis_01',
    bayNumber: 'OKU-OAS-01',
    townshipId: 'ara_damansara',
    hubName: 'Oasis Square - Water Piazza Drop-off West',
    status: 'available',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 16,
    coveredRoof: true,
    lastUpdated: 'Just now',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_ara_oasis_02',
    bayNumber: 'OKU-OAS-02',
    townshipId: 'ara_damansara',
    hubName: 'Oasis Square - Medical & Dialysis Clinic Wing',
    status: 'occupied_authorized',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 8,
    coveredRoof: true,
    lastUpdated: '15 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: true,
      detectedPlate: 'WPP 3122 (Verified Dialysis Transport OKU Pass)',
      occupancyDurationMins: 55
    }
  },
  {
    id: 'bay_ara_cantara_01',
    bayNumber: 'OKU-CAN-01',
    townshipId: 'ara_damansara',
    hubName: 'Cantara Residences - Retail & LRT Linkway',
    status: 'available',
    widthMeters: 3.6,
    hasTransferCorridor: true,
    distanceToLiftMeters: 22,
    coveredRoof: true,
    lastUpdated: '7 mins ago',
    telemetry: {
      ultrasonicReading: 'clear',
      cameraVerifiedOKU: false
    }
  },
  {
    id: 'bay_ara_cantara_02',
    bayNumber: 'OKU-CAN-02',
    townshipId: 'ara_damansara',
    hubName: 'Cantara Residences - Grand Residential Foyer',
    status: 'unauthorized_misuse',
    widthMeters: 3.8,
    hasTransferCorridor: true,
    distanceToLiftMeters: 15,
    coveredRoof: true,
    lastUpdated: '3 mins ago',
    telemetry: {
      ultrasonicReading: 'vehicle_detected',
      cameraVerifiedOKU: false,
      detectedPlate: 'PJA 9090 (No Permit Detected)',
      occupancyDurationMins: 19,
      gracePeriodRemainingSecs: 0
    },
    activeViolationReport: {
      reportId: 'REP-ARA-0773',
      reportedBy: 'Cantara Building Management',
      reportedAt: '8 mins ago',
      vehiclePlate: 'PJA 9090',
      vehicleModel: 'Blue Coupe',
      violationReason: 'Parked in designated wheelchair bay with wheelchair hatched zone blocked.',
      securityDispatchStatus: 'en_route',
      patrolOfficerId: 'PB-8821 (Kpl. Hisham)'
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
