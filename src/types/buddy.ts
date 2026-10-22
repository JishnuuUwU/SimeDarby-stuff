export type AssistanceCategory = 
  | 'parcel_delivery' 
  | 'event_navigation' 
  | 'mobility_support' 
  | 'medical_clinic_escort' 
  | 'grocery_pickup'
  | 'other';

export type BuddyRequestStatus = 
  | 'open' 
  | 'matched' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface AssistanceRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPrecinct: string; // Must match volunteer's precinct
  requesterUnit: string;
  requesterPhone: string;
  category: AssistanceCategory;
  title: string;
  description: string;
  pickupLocation: string;
  dropoffLocation: string;
  estimatedDurationMins: number;
  scheduledTime: string; // e.g. "Today, 4:30 PM"
  urgency: 'normal' | 'priority' | 'urgent';
  needsWheelchairSupport: boolean;
  status: BuddyRequestStatus;
  createdAt: string;
  matchedVolunteer?: {
    id: string;
    name: string;
    precinct: string;
    unitNo: string;
    rating: number;
    completedAssists: number;
    phone: string;
    matchedAt: string;
  };
  liveMessages: {
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface CommunityVolunteer {
  id: string;
  name: string;
  precinct: string;
  unitNo: string;
  isVerifiedResident: boolean;
  rating: number;
  completedTasks: number;
  badges: string[];
  isAvailableNow: boolean;
  preferredCategories: AssistanceCategory[];
}
