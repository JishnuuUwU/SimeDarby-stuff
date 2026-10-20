---
name: accessible-design-systems
description: >-
  Guidance on building universal accessibility (OKU / WCAG 2.2 AAA) features,
  including step-free spatial mapping, obstacle-free pedestrian routing, verified community
  assistance networks, and IoT parking bay monitoring.
---

# Universal Accessible Design Systems (OKU & Township Accessibility)

## 1. AccessMap: Step-Free Spatial Navigation Standards
- **Wheelchair Ramps**: Maximum permissible slope ratio of 1:12 (8.33%). Ramp widths >= 1200mm with double-level handrails (700mm & 900mm). Ramps with slopes > 1:15 must have resting platforms every 6 meters.
- **Tactile Paving Paths**:
  - *Guiding / Directional Paving*: Sinusoidal longitudinal ribs indicating continuous straight walking paths for visually impaired persons.
  - *Hazard / Warning Paving*: Blister / truncated domes indicating elevation changes, curb ramps, stairs, or pedestrian crossings.
- **Functioning Elevators**: Real-time operational status (Operational, Under Maintenance, Priority OKU Mode), cabin door clearance >= 900mm, low braille control panels, audio floor announcements.
- **Accessible Restrooms (Tandas OKU)**: Sliding door with minimum 900mm opening, outward swing, emergency pull cord alarm, grab bars (horizontal & flip-up vertical), adult changing bench where available.
- **Continuous Path Routing**: The routing algorithm must dynamically calculate paths avoiding stairs, high curbs (> 15mm), steep inclines (> 8.3%), and turnstile obstacles.

## 2. Community Buddy Network Protocols
- **Trust & Verification**:
  - Every volunteer and beneficiary must have authenticated resident status in the same precinct (e.g., Elmina Valley, The Ridge KL East, Cyme Bandar Bukit Raja).
  - Show verification tier: Digital Resident Pass, MyKad OKU ID link, background safety check.
- **Assistance Categories**:
  - Heavy Parcel / Groceries Courier (from parcel drop lockers / guardhouse to doorstep)
  - Township Event Escort (community carnivals, night walks, park festivals)
  - Medical / Clinic Escort (to township clinic / wellness center)
  - Mobility Equipment Support (collapsible wheelchair handling, ramp assistance)
- **Safety Mechanisms**: Emergency SOS dispatch button, location check-in during active buddy sessions, mutual feedback rating.

## 3. Smart OKU Parking Safeguard & Auxiliary Security Integration
- **Bay Dimensions & Specs**: 3,600mm width (2,500mm parking space + 1,100mm hatched transfer corridor for wheelchair lifts/doors).
- **IoT Bay Telemetry**:
  - Dual ultrasonic & magnetic ground sensors detect vehicle presence.
  - Smart camera with LPR (License Plate Recognition) reads vehicle plate and cross-references JPJ OKU sticker / Sime Darby Resident OKU registry.
  - Status states:
    - `VACANT`: Available for eligible OKU drivers.
    - `AUTHORIZED`: Verified OKU permit vehicle parked.
    - `UNAUTHORIZED_OCCUPANCY`: Non-permit vehicle occupying bay > 3 minutes (Grace period countdown).
- **Community-Led Enforcement**:
  - Quick 2-tap report interface for township residents.
  - Photo attachment & automatic bay geofencing.
  - Direct alert push to Sime Darby Property Polis Bantuan (Township Auxiliary Police) dispatch terminal.
