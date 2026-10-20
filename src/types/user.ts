export type UserRole = 
  | 'public' 
  | 'prime_member' 
  | 'verified_resident' 
  | 'township_security';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone: string;
  email: string;
  primeTier?: 'Classic' | 'Gold' | 'Platinum';
  primePoints?: number;
  precinct?: string; // e.g. "Ilham Residence, City of Elmina"
  unitNo?: string;   // e.g. "B-12-03"
  isVerifiedResident: boolean;
  isOkuCardHolder: boolean;
  okuCardNumber?: string; // JKM OKU ID
  volunteerBadgeCount?: number;
  completedAssists?: number;
}
