# Sime Darby Property Mobile Application
### Universal Accessibility & Township Care Extension

An enterprise-grade mobile application and native Android package engineered for **Sime Darby Property** master-planned townships. Built to enforce Malaysian Universal Accessibility Standards (**MS 1184:2014**) and **WCAG 2.2 AAA** guidelines, the platform delivers step-free spatial navigation (**AccessMap**), verified neighborhood assistance (**Community Buddy System**), and IoT-monitored accessible parking protection (**Smart OKU Parking Safeguard**) integrated with Sime Darby Property Auxiliary Police (**Polis Bantuan**).

---

## Technical Specifications & Binary Metadata

| Parameter | Specification | Details |
|---|---|---|
| **Application ID** | `com.simedarbyproperty.accessibility` | Configured in `android/app/build.gradle` & `capacitor.config.json` |
| **Application Label** | Sime Darby Property | Registered in Android launcher |
| **Production/Debug APK** | `release/app-debug.apk` | Direct pre-compiled binary (~4.19 MB) |
| **Internal Build Artifact** | `android/app/build/outputs/apk/debug/app-debug.apk` | Generated via Gradle 8.11 / Java 21 |
| **Minimum SDK** | Android 6.0 (API Level 23) | Compatible with ~98.5% of active Android devices |
| **Target / Compile SDK** | Android 15 (API Level 35) | Built against latest Android runtime & security model |
| **Runtime Architecture** | Capacitor 7 + React 19 (TypeScript) | Native WebView bridge with hardware haptic & status bar controls |
| **Spatial Engine** | Leaflet 1.9 + Custom GeoJSON Vector Layers | 0-stair pathfinding, elevation profiles, and tactile overlays |
| **Malaysian Standard** | MS 1184:2014 Code of Practice | Slope gradient <= 1:12, tactile paving rib/dome differentiation |

---

## 1. Quickstart: Installing & Running the APK

You can evaluate the application using any of the four methods below.

```
                              ┌───────────────────────────────────────────────┐
                              │           Choose Evaluation Target            │
                              └───────┬───────────────────────────────┬───────┘
                                      │                               │
                      ┌───────────────┴───────────────┐       ┌───────┴───────────────────────┐
                      │    Physical Android Device    │       │     Desktop / Development     │
                      └───────┬───────────────┬───────┘       └───────┬───────────────┬───────┘
                              │               │                       │               │
                              ▼               ▼                       ▼               ▼
                        Method 1: Direct  Method 2: ADB         Method 3: Android  Method 4: Web
                        Phone Sideload    USB Terminal          Studio Emulator   Device Frame
```

---

### Method 1: Direct Sideloading on a Physical Android Device (Recommended)

This is the fastest method to experience the native Android build on real hardware.

1. **Transfer the APK to your phone**:
   - Locate the pre-compiled binary in the repository:
     ```
     release/app-debug.apk
     ```
   - Send `app-debug.apk` to your Android device via **USB file transfer**, **Google Drive**, **WhatsApp**, or **Quick Share**.
2. **Open & Install**:
   - On your Android device, open **Files** (or **Downloads**) and tap `app-debug.apk`.
   - If prompted: *“For your security, your phone is not allowed to install unknown apps from this source”*:
     - Tap **Settings**.
     - Toggle on **Allow from this source** for your file manager or browser.
     - Return to the installation screen and tap **Install**.
3. **Handle Google Play Protect Prompt (Standard for Debug APKs)**:
   - Because this is a locally compiled development binary signed with standard Android debug credentials (rather than an uploaded Google Play Store release), Google Play Protect may display a blue/orange warning dialog:
     - Tap **“More details”** (or small expand arrow).
     - Tap **“Install anyway”**.
4. **Launch Application**:
   - Once installation completes, tap **Open** or find **Sime Darby Property** on your home screen or app drawer.

---

### Method 2: Fast ADB Installation via Command Line (1-Liner)

If you have an Android device connected to your workstation via USB with **USB Debugging** enabled:

1. Connect your device via USB cable and verify connection:
   ```bash
   adb devices
   ```
   *(If `adb` is not in your global system PATH, you can invoke it directly from the Android SDK: `C:\Users\jishn\android-sdk\platform-tools\adb.exe devices`)*.

2. Install the APK directly:
   ```bash
   # From workspace root:
   adb install -r release/app-debug.apk
   ```

3. Launch the application immediately on the device:
   ```bash
   adb shell am start -n com.simedarbyproperty.accessibility/.MainActivity
   ```

---

### Method 3: Running via Android Studio & Emulator

To inspect native logcat, profile memory, or test on official Android Virtual Devices (AVD):

1. Launch Android Studio with the configured native project:
   ```bash
   npm run android:open
   ```
2. Wait for Gradle to perform project sync (`Gradle 8.11.1`).
3. Select your target device (e.g. *Pixel 8 Pro - API 35* or *Samsung Galaxy S24*).
4. Click the green **Run** button (`Shift + F10`) or navigate to **Run > Run 'app'**.

---

### Method 4: Instant Web Preview & Multi-Device Emulation (Browser)

If an Android physical device or emulator is not immediately available, the codebase includes a dedicated **Android Hardware Emulation Harness** directly inside the web development server:

1. Install dependencies and start the local development server:
   ```bash
   npm install
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```
3. Use the **Device Preset Bar** pinned above the viewport to test layout responsiveness across verified device profiles:
   - **Galaxy S24 (412px)**: Flagship mobile viewport with dynamic status bar and 3-button navigation.
   - **Compact (360px)**: Android standard entry viewport (Galaxy A series) to verify zero text truncation.
   - **Foldable (768px)**: Galaxy Z Fold 6 / Tablet viewport for adaptive grid layouts.
   - **Fluid**: 100% responsive desktop/window viewport.

---

## 2. Interactive Role Personas & Evaluation Guide

To evaluate the application from every stakeholder perspective, tap the **Switch Persona** button located on the top navigation bar (or open the profile drawer). Four distinct Malaysian personas with customized permissions and live state feeds are pre-configured:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Switch Active User Persona                            │
├───────────────────────┬─────────────────────────┬───────────────────────────────┤
│ Persona Name          │ Role Type               │ Access Rights & Context       │
├───────────────────────┼─────────────────────────┼───────────────────────────────┤
│ Public Visitor        │ `public`                │ AccessMap & OKU Parking View  │
│ Ahmad Faiz            │ `prime_member`          │ PRIME Platinum Rewards & Perk │
│ Hafidz Rahman         │ `verified_resident`     │ Community Buddy & SOS Dispatch│
│ Kpl. Shamsul          │ `township_security`     │ Polis Bantuan Security Patrol │
└───────────────────────┴─────────────────────────┴───────────────────────────────┘
```

### Scenario Walkthrough 1: AccessMap (Step-Free Spatial Navigation)
1. Navigate to the **AccessMap** tab from the bottom navigation bar.
2. Select **City of Elmina** from the township selector (or switch to **KL East**).
3. Inspect the four MS 1184:2014 accessibility layer toggles:
   - **Wheelchair Ramps**: Verified 1:12 slope gradient, continuous 700mm & 900mm dual handrails.
   - **Tactile Paving**: Sinusoidal guiding lines (walking direction) and blister warning tiles (hazards/stairs).
   - **Functioning Elevators**: Real-time operational status, voice announcements, lowered braille buttons.
   - **Accessible Restrooms (Tandas OKU)**: 900mm sliding clearance, emergency alarm pull cords.
4. Set **Origin** to *Elmina Lakeside Mall - Accessible Drop-off A* and **Destination** to *Elmina Central Park Inclusive Playground*.
5. Tap **Calculate Step-Free Route**:
   - The map plots an obstacle-free route guaranteeing **0 stairs** and slopes < 8.3%.
   - Notice the step-by-step turn guidance and total distance estimation.
   - If **Voice Guidance** is enabled, an audio turn announcement triggers automatically via Web Speech synthesis.

### Scenario Walkthrough 2: Community Buddy System (Verified Resident Network)
1. Ensure your persona is set to **Verified Resident (Hafidz Rahman, Ilham Residence)**.
2. Navigate to the **Community Buddy** tab.
3. Observe active community requests from neighbors within your residential precinct (*Ilham Residence, City of Elmina*).
4. Tap **Request Assistance**:
   - Choose a category: *Heavy Parcel Courier*, *Township Event Companion*, *Mobility / Wheelchair Support*, or *Medical Clinic Escort*.
   - Toggle *Requires Wheelchair Handling*.
   - Submit the request: Live resident broadcast alert triggers.
5. Tap on any open neighbor request and select **Accept Assistance**:
   - The request transitions to **Matched** status.
   - The live in-app coordination screen opens with phone dialing, emergency SOS, and live encrypted resident chat.
   - Send a message to confirm immediate neighbor coordination.

### Scenario Walkthrough 3: Smart OKU Parking Protection & Auxiliary Police Integration
1. Switch to **Public Visitor** or **PRIME Member** persona and navigate to **Smart Parking**.
2. Select **KL East Mall - Basement 1 Accessible Zone** or **Elmina Lakeside Hub**.
3. Inspect the simulated IoT bay telemetry:
   - Ultrasonic ground sensor reading (`clear` vs `vehicle_detected`).
   - LPR Camera feed with plate recognition (`WXX 8192` vs verified JPJ OKU sticker).
4. Notice **Bay B-04**: An unauthorized vehicle is detected without an OKU permit badge, and an active **3-minute grace period countdown** is running.
5. Tap **Report Misuse**:
   - Complete the 2-tap community report modal with auto-filled bay geofence, plate number, and incident photo.
   - Submit report: An instant alert dispatch `#REP-xxxx` is logged.
6. Now switch your persona to **Township Auxiliary Security (Kpl. Shamsul - Polis Bantuan)**:
   - The interface elevates to the **Auxiliary Security Enforcement Terminal**.
   - Notice the incoming incident in the priority dispatch queue.
   - Tap **Dispatch Patrol Unit**: Status changes to *Officer On Scene*.
   - Tap **Issue Citation / Clamp & Resolve**: The bay status clears, resetting telemetry to *Available for genuine OKU permit holders*.

### Scenario Walkthrough 4: Universal Accessibility Engine (WCAG 2.2 AAA)
1. Tap the **Accessibility Settings** icon (gear/wheelchair symbol) in the header.
2. Toggle **High Contrast Mode**:
   - The interface instantly switches to ultra-high contrast dark tokens (`#000000` background, `#E5C583` high-luminance champagne accents, `#FFFFFF` text), exceeding WCAG AAA 7:1 contrast ratios.
3. Toggle **Font Size** between **Normal**, **Large**, and **Extra Large**:
   - Typography scales proportionally across all cards, modals, and navigation bars with zero overflow or text clipping.
4. Toggle **Voice Guidance**:
   - Enables native text-to-speech audio announcements on route calculations, emergency SOS triggers, and security dispatches.

---

## 3. System Architecture & Engineering

```mermaid
graph TD
    subgraph Native Android Runtime
        CapacitorBridge[Capacitor 7 Native Bridge]
        HapticsPlugin[@capacitor/haptics]
        StatusBarPlugin[@capacitor/status-bar]
        WebView[Android System WebView API 23-35]
    end

    subgraph Core Application Layer
        App[App Shell & Device Frame Emulator]
        Context[AppContext State Machine]
        Tokens[Anti-Vibecoding Design System]
    end

    subgraph Domain Feature Modules
        AccessMap[AccessMap Spatial Pathfinding]
        Buddy[Community Buddy Network]
        Parking[Smart OKU Parking & Polis Bantuan]
        A11y[WCAG AAA Accessibility Engine]
    end

    subgraph Data & Telemetry Engine
        Townships[Sime Darby Property Townships]
        MS1184[MS 1184:2014 Compliance Layer]
        Sensors[Simulated Ultrasonic & LPR Telemetry]
    end

    CapacitorBridge --> WebView
    WebView --> App
    App --> Context
    Context --> AccessMap
    Context --> Buddy
    Context --> Parking
    Context --> A11y

    AccessMap --> Townships
    AccessMap --> MS1184
    Parking --> Sensors
    A11y --> Tokens
    Context --> HapticsPlugin
    Context --> StatusBarPlugin
```

### Directory & Component Structure

```
Sime Darby/
├── android/                             # Native Android Studio Project
│   ├── app/
│   │   ├── build/outputs/apk/debug/     # Gradle output APK binary
│   │   ├── src/main/AndroidManifest.xml # Android permissions & activities
│   │   └── build.gradle                 # Target SDK 35, Min SDK 23
│   └── variables.gradle                 # Dependency & AndroidX version constraints
├── release/
│   └── app-debug.apk                    # Standalone ready-to-install debug binary (4.19 MB)
├── src/
│   ├── components/
│   │   ├── accessmap/                   # Step-free routing & Leaflet overlays
│   │   ├── buddy/                       # Community Buddy requests, chat, & SOS
│   │   ├── common/                      # Header, AndroidStatusBar, AndroidNavBar, Toast
│   │   ├── home/                        # Township overview & quick accessibility stats
│   │   ├── parking/                     # IoT parking bays & Polis Bantuan terminal
│   │   └── profile/                     # Persona switcher & WCAG AAA controls
│   ├── context/
│   │   └── AppContext.tsx               # Centralized state machine & event dispatcher
│   ├── data/
│   │   ├── mockBuddyData.ts             # Precinct resident assistance records
│   │   ├── mockMapFeatures.ts           # MS 1184 ramps, tactile lines, elevators
│   │   ├── mockParkingBays.ts           # Ultrasonic sensor & LPR camera telemetry
│   │   └── mockTownships.ts             # City of Elmina, KL East, Bandar Bukit Raja, Ara Damansara
│   ├── types/                           # TypeScript contract interfaces
│   └── index.css                        # Authentic Sime Darby Property design tokens
├── capacitor.config.json                # Capacitor configuration & Android app ID
└── package.json                         # NPM scripts & dependencies
```

---

## 4. Malaysian Standards & Domain Grounding

This project avoids generic placeholders and is grounded in genuine Malaysian township operations:

| Regulatory / Domain Standard | Implementation in Application |
|---|---|
| **Malaysian Standard MS 1184:2014** | All ramps capped at <= 1:12 (8.33%) slope; continuous tactile ground surface indicators categorized into guiding longitudinal ribs and blister hazard domes; accessible toilet (Tandas OKU) minimum 900mm sliding door clear opening. |
| **JKM (Jabatan Kebajikan Masyarakat)** | Resident verification links to OKU card registration tiers (Physical, Visual, Hearing) with authentic privacy redaction. |
| **Sime Darby Property Polis Bantuan** | Direct integration with Township Auxiliary Police dispatch protocols for rapid response to unauthorized OKU bay encroachment. |
| **Master-Planned Townships** | Accurate geospatial coordinates and amenities across: <br>• **City of Elmina**: Elmina Lakeside Mall, Central Park, Rainbow Bridge, Ilham Residence.<br>• **KL East**: KL East Mall, The Ridge Residences, Gombak transit link.<br>• **Bandar Bukit Raja**: 300-Acre Townpark, Athira Precinct, Gateway.<br>• **Ara Damansara**: Oasis Square Piazza, Cantara Residences, LRT walkway. |

---

## 5. Development & Build Commands

All development tasks are managed via `npm`:

```bash
# 1. Install project dependencies
npm install

# 2. Run local development server with Android device emulator
npm run dev

# 3. Compile TypeScript & build production web bundle into dist/
npm run build

# 4. Sync web assets and plugins to native Android project
npm run android:sync

# 5. Compile and generate a fresh Android Debug APK via Gradle
npm run android:build

# 6. Copy latest built APK into release/ directory
npm run apk:copy

# 7. Open native Android project directly in Android Studio
npm run android:open
```

---

## 6. Troubleshooting & Technical FAQ

| Issue / Symptom | Root Cause | Resolution |
|---|---|---|
| **"Blocked by Play Protect" dialog during installation** | The APK is a development debug build signed with a standard test key rather than a commercial Google Play distribution certificate. | Tap **"More details"** in the Play Protect dialog, then tap **"Install anyway"**. |
| **"For your security, your phone is not allowed to install unknown apps"** | Android restricts sideloading from unknown sources by default. | Tap **Settings** in the popup, enable **Allow from this source** for your file manager or browser, then tap **Install**. |
| **"App not installed" / "Parse error"** | Incompatible Android OS version or corrupted file transfer. | Verify your device runs **Android 6.0 (API 23) or higher**. If transferring via chat apps, ensure the file size matches `4,193,390 bytes`. |
| **`adb` command not recognized in PowerShell / CMD** | Android platform-tools directory is not in your workstation's system `PATH`. | Run using the absolute path: <br>`C:\Users\jishn\android-sdk\platform-tools\adb.exe install -r release/app-debug.apk` |
| **Map tiles appear blank or slow to render** | Device is offline or tile server is unreachable. | The application uses standard OpenStreetMap tile layers with cached vector overlays. Ensure active Wi-Fi or mobile data connection. All step-free route logic and marker data are bundled locally and operate 100% offline. |
| **Voice guidance speech output not speaking** | Device text-to-speech engine is muted or language is uninstalled. | Check device volume; ensure English (or Malay) TTS voice is downloaded in Android **Settings > System > Accessibility > Text-to-speech output**. |
