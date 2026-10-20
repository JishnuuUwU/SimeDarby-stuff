import { AssistanceRequest, CommunityVolunteer } from '../types/buddy';

export const MOCK_VOLUNTEERS: CommunityVolunteer[] = [
  {
    id: 'vol_hafidz_01',
    name: 'Hafidz Rahman',
    precinct: 'Ilham Residence, City of Elmina',
    unitNo: 'IR-03-12',
    isVerifiedResident: true,
    rating: 4.96,
    completedTasks: 28,
    badges: ['Verified Resident', 'Prime Community Champion', 'First-Aid Certified'],
    isAvailableNow: true,
    preferredCategories: ['parcel_delivery', 'event_navigation', 'mobility_support']
  },
  {
    id: 'vol_sarah_02',
    name: 'Sarah Tan Wei Ling',
    precinct: 'Ilham Residence, City of Elmina',
    unitNo: 'IR-01-08',
    isVerifiedResident: true,
    rating: 5.0,
    completedTasks: 19,
    badges: ['Verified Resident', 'Youth Volunteer Lead', 'Wheelchair Escort Pro'],
    isAvailableNow: true,
    preferredCategories: ['medical_clinic_escort', 'grocery_pickup', 'event_navigation']
  },
  {
    id: 'vol_kumar_03',
    name: 'Dr. Kumaravelu',
    precinct: 'Elmina Valley 3, City of Elmina',
    unitNo: 'EV3-08-22',
    isVerifiedResident: true,
    rating: 4.9,
    completedTasks: 14,
    badges: ['Verified Resident', 'Retired Physician', 'Community Caregiver'],
    isAvailableNow: false,
    preferredCategories: ['medical_clinic_escort', 'mobility_support']
  },
  {
    id: 'vol_nurul_04',
    name: 'Nurul Aina',
    precinct: 'The Ridge, KL East',
    unitNo: 'TR-A-21-04',
    isVerifiedResident: true,
    rating: 4.95,
    completedTasks: 22,
    badges: ['Verified Resident', 'KL East Community Council'],
    isAvailableNow: true,
    preferredCategories: ['parcel_delivery', 'grocery_pickup']
  }
];

export const MOCK_BUDDY_REQUESTS: AssistanceRequest[] = [
  {
    id: 'req_001',
    requesterId: 'usr_pak_ismail',
    requesterName: 'Pakcik Ismail (Senior Resident)',
    requesterPrecinct: 'Ilham Residence, City of Elmina',
    requesterUnit: 'IR-02-15',
    requesterPhone: '+60 12-389 4410',
    category: 'parcel_delivery',
    title: 'Bulky Medical Supplies & Package from Guardhouse',
    description: 'Received a heavy box of dialysis and physiotherapy supplies at the precinct parcel drop. Need a kind neighbor with a trolley or physical help to bring it up to Level 2.',
    pickupLocation: 'Ilham Residence Guardhouse Parcel Locker',
    dropoffLocation: 'Block B, Unit IR-02-15 (Direct doorstep)',
    estimatedDurationMins: 20,
    scheduledTime: 'Today, 3:30 PM (Flexible)',
    urgency: 'priority',
    needsWheelchairSupport: false,
    status: 'open',
    createdAt: '35 mins ago',
    liveMessages: []
  },
  {
    id: 'req_002',
    requesterId: 'usr_meiling_oku',
    requesterName: 'Mei Ling (Wheelchair User)',
    requesterPrecinct: 'Ilham Residence, City of Elmina',
    requesterUnit: 'IR-04-02',
    requesterPhone: '+60 17-622 1899',
    category: 'event_navigation',
    title: 'Companion for Elmina Central Park Sunset Concert',
    description: 'Looking for a verified resident buddy to walk together to the inclusive seating area at the Central Park Pavilion. Just need someone along the slight ramp section.',
    pickupLocation: 'Ilham Residence Main Gate',
    dropoffLocation: 'Central Park Inclusive Seating Deck',
    estimatedDurationMins: 45,
    scheduledTime: 'Today, 5:45 PM',
    urgency: 'normal',
    needsWheelchairSupport: true,
    status: 'matched',
    createdAt: '2 hours ago',
    matchedVolunteer: {
      id: 'vol_hafidz_01',
      name: 'Hafidz Rahman',
      precinct: 'Ilham Residence, City of Elmina',
      unitNo: 'IR-03-12',
      rating: 4.96,
      completedAssists: 28,
      phone: '+60 19-211 7743',
      matchedAt: '1 hour ago'
    },
    liveMessages: [
      {
        senderId: 'vol_hafidz_01',
        senderName: 'Hafidz Rahman (Volunteer)',
        text: 'Hi Mei Ling! Hafidz here from IR-03-12. Happy to walk with you to the concert today. I have the ramp route mapped out!',
        timestamp: '1 hour ago'
      },
      {
        senderId: 'usr_meiling_oku',
        senderName: 'Mei Ling',
        text: 'Terima kasih banyak Hafidz! See you at the lobby around 5:40 PM. Truly appreciate it!',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'req_003',
    requesterId: 'usr_uncle_raj',
    requesterName: 'Uncle Rajagopal (82 y/o)',
    requesterPrecinct: 'Ilham Residence, City of Elmina',
    requesterUnit: 'IR-01-03',
    requesterPhone: '+60 16-904 3321',
    category: 'medical_clinic_escort',
    title: 'Step-Free Escort to Township Poliklinik',
    description: 'Routine blood pressure checkup at the clinic across the road. Require physical steadying assistance while walking with cane.',
    pickupLocation: 'IR Block A Foyer',
    dropoffLocation: 'Klinik Mediviron Elmina Lakeside',
    estimatedDurationMins: 40,
    scheduledTime: 'Tomorrow, 9:00 AM',
    urgency: 'normal',
    needsWheelchairSupport: false,
    status: 'open',
    createdAt: '3 hours ago',
    liveMessages: []
  }
];
