import { MapMarkerFeature, StepFreeRoute } from '../types/accessibility';

export const MAP_MARKER_FEATURES: MapMarkerFeature[] = [
  // --- CITY OF ELMINA ---
  {
    id: 'feat_elmina_ramp_01',
    name: 'North Promenade Gentle Ramp',
    type: 'ramp',
    townshipId: 'elmina',
    locationName: 'Lakeside Mall to Promenade Concourse',
    coordinates: [3.1894, 101.5118],
    description: 'Continuous low-gradient ramp with 1:14 slope ratio and dual tactile handrails.',
    status: 'good_condition',
    details: {
      slopeRatio: '1:14 (Gentle, MS 1184 Compliant)',
      handrail: true,
      doorWidth: '1.8m width',
      lastInspected: 'Yesterday, 14:00'
    }
  },
  {
    id: 'feat_elmina_ramp_02',
    name: 'Rainbow Bridge Accessible Approach',
    type: 'ramp',
    townshipId: 'elmina',
    locationName: 'Rainbow Bridge South Ascent',
    coordinates: [3.1912, 101.5138],
    description: 'Step-free switchback ramp with resting platforms every 5 meters for wheelchair and stroller ease.',
    status: 'good_condition',
    details: {
      slopeRatio: '1:12 (Standard OKU)',
      handrail: true,
      doorWidth: '2.0m switchback',
      lastInspected: 'Today, 09:30'
    }
  },
  {
    id: 'feat_elmina_tactile_01',
    name: 'Lakeside Central Tactile Corridor',
    type: 'tactile_paving',
    townshipId: 'elmina',
    locationName: 'Drop-off A to Mall Main Concourse',
    coordinates: [3.1892, 101.5122],
    description: 'High-contrast yellow tactile guiding pavers leading directly from taxi drop-off to elevator lobby.',
    status: 'good_condition',
    details: {
      tactileType: 'guiding',
      lastInspected: 'Today, 08:00'
    }
  },
  {
    id: 'feat_elmina_tactile_02',
    name: 'Central Park Transition Warning Domes',
    type: 'tactile_paving',
    townshipId: 'elmina',
    locationName: 'Park Boardwalk Crossing',
    coordinates: [3.1905, 101.5130],
    description: 'Blister warning paving indicating pedestrian crossing approach and surface transition.',
    status: 'good_condition',
    details: {
      tactileType: 'warning',
      lastInspected: '3 days ago'
    }
  },
  {
    id: 'feat_elmina_lift_01',
    name: 'Lakeside Mall Glass Panorama Lift #1',
    type: 'elevator',
    townshipId: 'elmina',
    locationName: 'Lakeside Mall - Concourse to Promenade (L1 to G)',
    coordinates: [3.1896, 101.5115],
    description: 'Spacious 1600kg elevator with lowered braille buttons, audio floor announcer, and wide 1100mm doors.',
    status: 'operational',
    details: {
      elevatorCabinClearance: '1800mm x 1600mm (Double wheelchair capacity)',
      hasBrailleButtons: true,
      doorWidth: '1100mm automatic sliding',
      lastInspected: 'Today, 06:15 (Polis Bantuan Checked)'
    }
  },
  {
    id: 'feat_elmina_lift_02',
    name: 'Pavilion Resident Access Lift #2',
    type: 'elevator',
    townshipId: 'elmina',
    locationName: 'Elmina Pavilion North Wing',
    coordinates: [3.1885, 101.5132],
    description: 'Direct step-free lift connecting underground resident parking to community hall.',
    status: 'operational',
    details: {
      elevatorCabinClearance: '1500mm x 1500mm',
      hasBrailleButtons: true,
      doorWidth: '1000mm automatic sliding',
      lastInspected: 'Yesterday'
    }
  },
  {
    id: 'feat_elmina_wc_01',
    name: 'Inclusive OKU Restroom (Tandas Mesra OKU)',
    type: 'restroom',
    townshipId: 'elmina',
    locationName: 'Lakeside Mall Concourse Floor (Next to Concierge)',
    coordinates: [3.1893, 101.5120],
    description: 'Equipped with electronic sliding sensor door, folding horizontal support bars, and 24/7 Polis Bantuan emergency cord.',
    status: 'good_condition',
    details: {
      doorWidth: '950mm sensor slide',
      hasEmergencyAlarm: true,
      lastInspected: 'Today, 11:45 (Sanitized)'
    }
  },
  {
    id: 'feat_elmina_wc_02',
    name: 'Central Park Rest Pavilion OKU Toilet',
    type: 'restroom',
    townshipId: 'elmina',
    locationName: 'Central Park Trailhead Kiosk',
    coordinates: [3.1918, 101.5135],
    description: 'Zero threshold entry, adult nursing station, slip-resistant floor tiles, and emergency buzzer.',
    status: 'good_condition',
    details: {
      doorWidth: '900mm lever handle',
      hasEmergencyAlarm: true,
      lastInspected: 'Today, 10:00'
    }
  },

  // --- KL EAST ---
  {
    id: 'feat_kleast_ramp_01',
    name: 'KL East Mall Ground Step-Free Link',
    type: 'ramp',
    townshipId: 'kl_east',
    locationName: 'East Entrance from Drop-off to Atrium',
    coordinates: [3.2253, 101.7305],
    description: 'Wide gentle slope connecting outdoor transit plaza directly to mall level G.',
    status: 'good_condition',
    details: { slopeRatio: '1:15 (Very Gentle)', handrail: true, doorWidth: '2.4m width' }
  },
  {
    id: 'feat_kleast_lift_01',
    name: 'Main Atrium Priority Elevator Core #3',
    type: 'elevator',
    townshipId: 'kl_east',
    locationName: 'KL East Mall Central Core (LG to L3)',
    coordinates: [3.2256, 101.7310],
    description: 'High-speed priority accessibility lift with voice synthesize floor cues in BM and English.',
    status: 'operational',
    details: { elevatorCabinClearance: '1900mm x 1700mm', hasBrailleButtons: true, doorWidth: '1200mm' }
  },
  {
    id: 'feat_kleast_tactile_01',
    name: 'Gombak LRT Transit Link Tactile Trail',
    type: 'tactile_paving',
    townshipId: 'kl_east',
    locationName: 'Transit Walkway to The Ridge Concourse',
    coordinates: [3.2248, 101.7300],
    description: 'Continuous yellow directional tactile guide along pedestrian bridge.',
    status: 'good_condition',
    details: { tactileType: 'continuous_corridor' }
  },
  {
    id: 'feat_kleast_wc_01',
    name: 'Premium Family & OKU Accessible Restroom',
    type: 'restroom',
    townshipId: 'kl_east',
    locationName: 'Level 1 West Wing (Beside Nursery)',
    coordinates: [3.2259, 101.7308],
    description: 'Touchless automatic wave door, height-adjustable wash basin, and auxiliary security alarm.',
    status: 'good_condition',
    details: { doorWidth: '1000mm wave-sensor', hasEmergencyAlarm: true }
  }
];

export const MOCK_STEP_FREE_ROUTES: Record<string, StepFreeRoute> = {
  'elmina_default': {
    id: 'route_elmina_01',
    originName: 'Elmina Lakeside Mall - Drop-off A',
    destinationName: 'Rainbow Bridge & Viewpoint',
    totalDistanceMeters: 480,
    estimatedMinutesWheelchair: 8,
    estimatedMinutesWalking: 6,
    maxSlope: '1:14 (Gentle - Obstacle-free)',
    stairsCount: 0,
    pathCoordinates: [
      [3.1891, 101.5115],
      [3.1893, 101.5117],
      [3.1896, 101.5121],
      [3.1899, 101.5126],
      [3.1904, 101.5132],
      [3.1908, 101.5136],
      [3.1912, 101.5139],
      [3.1915, 101.5142]
    ],
    waypoints: [
      {
        name: 'Accessible Drop-off Bay A',
        instruction: 'Start at the curb-free tactile tactile drop-off zone. Head northeast along the sheltered promenade.',
        accessibilityNote: 'Flush curb transition (0mm step). Tactile guiding pavers on left.',
        coordinates: [3.1891, 101.5115],
        distanceMeters: 0,
        slopeDegrees: 0.5,
        isStepFree: true
      },
      {
        name: 'Promenade North Ramp Transition',
        instruction: 'Follow the gentle 1:14 ramp downwards towards the lake boardwalk.',
        accessibilityNote: 'Stainless steel continuous handrail on both sides. Zero steps.',
        coordinates: [3.1896, 101.5121],
        distanceMeters: 120,
        slopeDegrees: 3.2,
        isStepFree: true
      },
      {
        name: 'Lakeside Smooth Composite Boardwalk',
        instruction: 'Continue straight along the vibration-dampened inclusive timber boardwalk.',
        accessibilityNote: 'Slip-resistant textured finish. Width 3.0 meters.',
        coordinates: [3.1904, 101.5132],
        distanceMeters: 260,
        slopeDegrees: 1.0,
        isStepFree: true
      },
      {
        name: 'Rainbow Bridge Accessible Ascent',
        instruction: 'Take the switchback ramp with resting platforms to reach the bridge deck.',
        accessibilityNote: 'Resting landings every 6 meters. Grade 1:12.',
        coordinates: [3.1912, 101.5139],
        distanceMeters: 410,
        slopeDegrees: 3.8,
        isStepFree: true
      },
      {
        name: 'Rainbow Bridge Viewing Deck',
        instruction: 'Destination reached. Enjoy 360-degree views of Elmina Central Park.',
        accessibilityNote: 'Level viewing platform with lowered glass barrier for wheelchair sightlines.',
        coordinates: [3.1915, 101.5142],
        distanceMeters: 480,
        slopeDegrees: 0,
        isStepFree: true
      }
    ],
    audioGuidance: [
      'Starting step-free guidance from Elmina Lakeside Mall Drop-off A.',
      'In 30 meters, continue straight along the yellow tactile paving strip.',
      'Approaching North Ramp: gentle downhill slope of 3 degrees ahead.',
      'Boardwalk surface is smooth and free of curbs or gratings.',
      'Approaching Rainbow Bridge: take the left switchback ramp for step-free access.',
      'You have arrived at your destination: Rainbow Bridge Viewing Deck.'
    ]
  },

  'kleast_default': {
    id: 'route_kleast_01',
    originName: 'KL East Mall - Level G Main Drop-off',
    destinationName: 'Central Atrium & Lift Core',
    totalDistanceMeters: 190,
    estimatedMinutesWheelchair: 3,
    estimatedMinutesWalking: 2,
    maxSlope: '1:20 (Nearly Flat)',
    stairsCount: 0,
    pathCoordinates: [
      [3.2252, 101.7302],
      [3.2254, 101.7305],
      [3.2256, 101.7308],
      [3.2258, 101.7309]
    ],
    waypoints: [
      {
        name: 'Main Drop-off Accessible Gate',
        instruction: 'Enter via automatic wide revolving doors or power push-pad gate.',
        accessibilityNote: 'Push-button power door with 1200mm opening.',
        coordinates: [3.2252, 101.7302],
        distanceMeters: 0,
        slopeDegrees: 0.2,
        isStepFree: true
      },
      {
        name: 'Concourse Walkway',
        instruction: 'Proceed along the marble floor following tactile directional ridges.',
        accessibilityNote: 'High slip-resistance coefficient > 0.6.',
        coordinates: [3.2256, 101.7308],
        distanceMeters: 110,
        slopeDegrees: 0.5,
        isStepFree: true
      },
      {
        name: 'Central Atrium & Priority Lift Core',
        instruction: 'Arrived at Central Atrium. Priority elevator is on your immediate right.',
        accessibilityNote: 'Braille indicator and chime speaker active.',
        coordinates: [3.2258, 101.7309],
        distanceMeters: 190,
        slopeDegrees: 0,
        isStepFree: true
      }
    ],
    audioGuidance: [
      'Step-free indoor route started from KL East Mall Drop-off.',
      'Pass through the power accessible door directly into the air-conditioned concourse.',
      'Destination is directly ahead: Priority Lift Core #3.'
    ]
  }
};
