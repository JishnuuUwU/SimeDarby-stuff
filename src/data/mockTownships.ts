import { TownshipLocation } from '../types/accessibility';

export const TOWNSHIPS: TownshipLocation[] = [
  {
    id: 'elmina',
    name: 'City of Elmina',
    state: 'Shah Alam, Selangor',
    hubType: 'Township & Commercial Hub',
    center: [3.1895, 101.5126],
    zoom: 16,
    popularOrigins: [
      { id: 'elmina_dropoff_a', name: 'Elmina Lakeside Mall - Accessible Drop-off A', coordinates: [3.1891, 101.5115] },
      { id: 'elmina_community_center', name: 'Elmina Pavilion & Residents Hub', coordinates: [3.1882, 101.5134] },
      { id: 'elmina_lake_promenade', name: 'Lakeside Promenade Entrance', coordinates: [3.1902, 101.5108] },
    ],
    popularDestinations: [
      { id: 'elmina_rainbow_bridge', name: 'Rainbow Bridge & Iconic Viewpoint', coordinates: [3.1915, 101.5142] },
      { id: 'elmina_central_park', name: 'Elmina Central Park Inclusive Playground', coordinates: [3.1925, 101.5128] },
      { id: 'elmina_wellness_trail', name: 'Wellness Trail & Sensor Garden', coordinates: [3.1878, 101.5150] },
      { id: 'elmina_mall_anchor', name: 'Elmina Lakeside Mall - North Wing Plaza', coordinates: [3.1898, 101.5119] }
    ]
  },
  {
    id: 'kl_east',
    name: 'KL East',
    state: 'Kuala Lumpur',
    hubType: 'Lifestyle Mall & Transit',
    center: [3.2255, 101.7308],
    zoom: 17,
    popularOrigins: [
      { id: 'kl_east_mall_main', name: 'KL East Mall - Level G Main Drop-off', coordinates: [3.2252, 101.7302] },
      { id: 'kl_east_ridge_lobby', name: 'The Ridge Residences - Tower A Lobby', coordinates: [3.2263, 101.7314] },
      { id: 'kl_east_mrt_feeder', name: 'Gombak LRT / KL East Feeder Bay', coordinates: [3.2244, 101.7295] }
    ],
    popularDestinations: [
      { id: 'kl_east_atrium', name: 'KL East Mall - Central Atrium (L1)', coordinates: [3.2258, 101.7309] },
      { id: 'kl_east_jaya_grocer', name: 'Jaya Grocer Accessible Checkout (LG)', coordinates: [3.2251, 101.7311] },
      { id: 'kl_east_camp5', name: 'Camp5 & Sky Deck Viewing Lounge', coordinates: [3.2260, 101.7316] }
    ]
  },
  {
    id: 'bukit_raja',
    name: 'Bandar Bukit Raja',
    state: 'Klang, Selangor',
    hubType: 'Integrated Industrial & Urban',
    center: [3.0782, 101.4421],
    zoom: 16,
    popularOrigins: [
      { id: 'bbr_townpark_gate', name: 'Townpark Central Pavillion', coordinates: [3.0779, 101.4415] },
      { id: 'bbr_athira_club', name: 'Athira Precinct Resident Clubhouse', coordinates: [3.0792, 101.4430] }
    ],
    popularDestinations: [
      { id: 'bbr_inclusive_loop', name: '300-Acre Townpark Step-Free Boardwalk', coordinates: [3.0788, 101.4442] },
      { id: 'bbr_commercial_hub', name: 'Gateway Commercial Square', coordinates: [3.0770, 101.4402] }
    ]
  },
  {
    id: 'ara_damansara',
    name: 'Ara Damansara',
    state: 'Petaling Jaya, Selangor',
    hubType: 'Commercial & Residential',
    center: [3.1165, 101.5794],
    zoom: 16,
    popularOrigins: [
      { id: 'oasis_square_piazza', name: 'Oasis Square - Water Piazza Drop-off', coordinates: [3.1161, 101.5788] },
      { id: 'cantara_lobby', name: 'Cantara Residences - Grand Lobby', coordinates: [3.1178, 101.5802] }
    ],
    popularDestinations: [
      { id: 'oasis_medical_clinic', name: 'Oasis Wellness & Dialysis Clinic', coordinates: [3.1169, 101.5796] },
      { id: 'oasis_lrt_bridge', name: 'Lembah Subang LRT Step-Free Walkway', coordinates: [3.1150, 101.5815] }
    ]
  }
];
