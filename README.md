# Sime Darby Property Mobile Application (Accessibility & Township Extension)

An extension to the Sime Darby Property mobile platform designed to promote universal accessibility, community care, and smart township parking protection. Built using deliberate, anti-vibecoded design principles, authentic Sime Darby Property brand tokens, and packaged as a native Android project with Capacitor.

---

## 🌟 Core Features

### 1. AccessMap (Step-Free Spatial Navigation)
- **User Roles:** All App Users (Public Visitors, PRIME Members, & Residents).
- **Accessibility Feature Toggles:** Interactive toggles for:
  - ♿ **Wheelchair Ramps:** 1:12 slope gradient, continuous handrails, and resting landings every 6m.
  - 🟡 **Tactile Paving Routes:** High-contrast yellow guiding ribs and blister warning dome clusters.
  - 🛗 **Functioning Elevators:** Live operational status, cabin clearance (1800mm x 1600mm), lowered braille controls, and voice announcements.
  - 🚻 **Accessible Restrooms (Tandas OKU):** Wide automatic/sliding doors, emergency call cords, and grab bars.
- **Continuous Step-Free Route Planning:** Dynamic route calculation guaranteeing **0 stairs**, gentle inclines (< 1:12), and audio turn-by-turn guidance.
- **Township Support:** City of Elmina, KL East (KL East Mall), Bandar Bukit Raja, and Ara Damansara (Oasis Square).

---

### 2. Community Buddy System
- **User Roles:** Verified Residents (Neighbourhood Connection / Resident Role).
- **Verified Resident Matching:** Connects requests exclusively with authenticated neighbors within the same residential precinct (e.g., *Ilham Residence, City of Elmina*) to guarantee safety and trust.
- **Volunteer Assistance Requests:** Enables elderly or disabled residents to request local help:
  - 📦 Heavy parcel courier from guardhouse / parcel drop hubs to doorstep
  - 🎪 Township event companion (concerts, park carnivals, night walks)
  - ♿ Physical wheelchair & ramp assistance
  - 🏥 Clinic and medical escort to township wellness centers
- **Coordination & Safety:** Live encrypted neighbor chat, direct phone dial, emergency SOS, and task completion verification with community volunteer badges.

---

### 3. Smart OKU Parking Protection
- **User Roles:** All App Users (Public Visitors, Drivers, & Township Auxiliary Security).
- **Real-Time Bay Availability:** Live open vs. occupied status powered by simulated ultrasonic ground sensors and LPR cameras across township commercial hubs (KL East Mall Basement 1, Elmina Lakeside Hub, Oasis Square).
- **Unauthorized Occupancy Alerts:** Flags non-OKU vehicles occupying accessible bays without valid JKM OKU cards or permits.
- **Community-Led Enforcement:** Quick 2-tap report interface allowing residents and visitors to flag violations directly to **Sime Darby Property Polis Bantuan (Township Auxiliary Police)** with instant dispatch tracking.
- **Security Officer Terminal:** Dedicated Auxiliary Police interface to dispatch patrol units, issue citations or wheel clamp warnings, and clear violations.

---

### 4. Interactive Role Persona Switcher
Switch between 4 perspectives directly from the app header:
1. **Public Visitor:** General access to AccessMap routes and live OKU parking.
2. **PRIME Member (Platinum):** Member rewards, tier points, and priority access.
3. **Verified Resident:** Full access to Community Buddy requests and neighbor matching.
4. **Township Auxiliary Security (Polis Bantuan):** Active bay enforcement and incident dispatch feeds.

---

## 🎨 Anti-Vibecoding Design Standards

This project adheres to strict anti-vibecoding guidelines located in `.agents/skills/anti-vibecoding/SKILL.md`:
- **No Generic AI Slop:** Banned generic purple gradients, empty placeholder cards, and ungrounded "lorem ipsum" data.
- **Sime Darby Property Brand Fidelity:** Authentic corporate crimson (`#8B1D24` / `#9E1B32`), warm champagne gold (`#C5A880`), dark slate neutrals, and high-contrast accessible surfaces.
- **Malaysian Context:** Standardized against Malaysian OKU (Orang Kurang Upaya) standards (MS 1184:2014) and Sime Darby Property Polis Bantuan procedures.
- **Universal Accessibility (WCAG AAA):** Built-in High Contrast mode, 3-tier font size scaling (Normal, Large, Extra Large), and text-to-speech voice guidance.

---

## 📱 Android Native App Structure

The codebase is configured as a native Android project using Capacitor:
- **Android Project Directory:** `/android`
- **Native Files:** `android/app/src/main/AndroidManifest.xml`, Gradle build configurations, assets, and icons.
- **Capacitor Configuration:** `capacitor.config.json`
- **Building & Running on Android:**
  ```bash
  # Build web assets and sync to native Android project
  npm run build
  npm run android:sync

  # Open in Android Studio
  npx cap open android
  ```

---

## 🚀 Running the Web Development Server

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Navigate to `http://localhost:5173/` to experience the app.
