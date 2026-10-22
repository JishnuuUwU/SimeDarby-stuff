export type AccessibilityFeatureType = 
  | 'ramp' 
  | 'tactile_paving' 
  | 'elevator' 
  | 'restroom';

export interface MapMarkerFeature {
  id: string;
  name: string;
  type: AccessibilityFeatureType;
  townshipId: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  status: 'operational' | 'maintenance' | 'good_condition';
  details: {
    slopeRatio?: string;       // e.g. "1:14 (Gentle)"
    handrail?: boolean;
    tactileType?: 'guiding' | 'warning' | 'continuous_corridor';
    elevatorCabinClearance?: string;
    hasBrailleButtons?: boolean;
    doorWidth?: string;
    hasEmergencyAlarm?: boolean;
    hasAdultChangingBench?: boolean;
    lastInspected?: string;
  };
}

export interface StepFreeRouteWaypoint {
  name: string;
  instruction: string;
  accessibilityNote: string;
  coordinates: [number, number];
  distanceMeters: number;
  slopeDegrees: number; // 0 = flat, max 4.5 degrees
  isStepFree: boolean;
}

export interface StepFreeRoute {
  id: string;
  originName: string;
  destinationName: string;
  totalDistanceMeters: number;
  estimatedMinutesWheelchair: number;
  estimatedMinutesWalking: number;
  maxSlope: string;
  stairsCount: number; // Guaranteed 0 for step-free!
  pathCoordinates: [number, number][];
  waypoints: StepFreeRouteWaypoint[];
  audioGuidance: string[];
}

export interface TownshipLocation {
  id: string;
  name: string;
  state: string;
  hubType: 'Township & Commercial Hub' | 'Lifestyle Mall & Transit' | 'Integrated Industrial & Urban' | 'Commercial & Residential';
  center: [number, number];
  zoom: number;
  popularOrigins: { id: string; name: string; coordinates: [number, number] }[];
  popularDestinations: { id: string; name: string; coordinates: [number, number] }[];
}
