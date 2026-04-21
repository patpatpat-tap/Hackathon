# SugboPulse - System Documentation
**Last Updated:** April 22, 2026

---

## 📋 Project Overview

**SugboPulse** is a smart ride-sharing platform designed for BPO workers in Cebu, Philippines. The system connects commuters with drivers through real-time location tracking, gamified incentives (badges), and emergency flood alert capabilities.

### Core Value Propositions
- **Smart Matching**: Real-time heatmap showing where ride requests are concentrated
- **Cost Savings**: Transparent display of daily savings vs. traditional jeepneys (₱67/day average)
- **Safety & Reliability**: Emergency flood alerts with proof verification
- **Gamification**: Badges and points system to incentivize both drivers and commuters

---

## 🏗️ System Architecture

### Tech Stack
```
Frontend:       Next.js 16.2.4 (React 19.2.4)
Styling:        Tailwind CSS 4
UI Maps:        Leaflet + React-Leaflet + Leaflet.Heat
Backend/DB:     Supabase (PostgreSQL + Real-time Subscriptions)
Hosting Ready:  Vercel (Frontend) + Supabase Cloud (Database)
```

### Architecture Layers

```
┌─────────────────────────────────────────┐
│      Frontend (Next.js App Router)       │
│  - Commuter View (page.tsx)              │
│  - Driver View (driver/page.tsx)         │
│  - Real-time UI Updates                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Supabase Client (Real-time)         │
│  - REST API Queries                      │
│  - Real-time Subscriptions               │
│  - Authentication Ready                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    PostgreSQL Database (Supabase)        │
│  - profiles table                        │
│  - pings table (ride requests)           │
│  - flood_alerts table                    │
│  - Row Level Security (RLS)              │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Tables

#### `profiles`
Stores user account information and achievements.
```sql
- id (UUID, PK)
- username (TEXT, UNIQUE)
- role (TEXT: 'driver' | 'commuter')
- points (INTEGER, default: 0)
- badges (JSONB array)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```
**Purpose**: Track user identity, role, accumulated points, and badge history.

#### `pings`
Stores ride requests from commuters.
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles.id)
- lat (DECIMAL 10,8)
- lng (DECIMAL 11,8)
- route_destination (TEXT: 'IT Park', 'Ayala Center', etc.)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```
**Purpose**: Capture real-time ride requests with geolocation for the driver heatmap.

#### `flood_alerts`
Stores emergency flood/rainfall reports with proof.
```sql
- id (UUID, PK)
- lat (DECIMAL 10,8)
- lng (DECIMAL 11,8)
- type (TEXT: 'flood' | 'rainfall')
- proof_url (TEXT, mock URL in MVP)
- created_at (TIMESTAMP)
```
**Purpose**: Allow commuters to report flood hazards with photographic evidence; alerts appear on driver heatmap.

### Indexes
- `idx_pings_user_id` — Fast lookup of user's ride requests
- `idx_pings_created_at` — Sort recent requests first
- `idx_profiles_role` — Filter by driver/commuter
- `idx_flood_alerts_created_at` — Sort recent flood alerts

### Row Level Security (RLS)
All tables have permissive RLS policies for MVP:
- `SELECT`: Public read access
- `INSERT`: Anyone can insert (unauthenticated OK for demo)
- `UPDATE`: Open (will be restricted in production)

---

## 🎨 Frontend Components

### 1. **PingButton** (`app/components/PingButton.tsx`)
**Purpose**: Main action button for commuters to request a ride.

**Features**:
- Multi-step modal flow: Details → Finding → Found → Status
- Destination selector (IT Park, Ayala Center, SM City Cebu, etc.)
- Real-time geolocation capture via `navigator.geolocation`
- Simulated ride-finding animation (1.5s search time)
- Live status updates: passengers needed, ETA, ride status
- Supabase integration: creates profile & inserts ping record
- Demo mode: shows placeholder stats (passengers, ETA)

**Props**: None (self-contained)

### 2. **FloodAlertButton** (`app/components/FloodAlertButton.tsx`)
**Purpose**: Emergency alert system for reporting floods/hazards.

**Features**:
- Modal dialog with file upload for proof (photo/video)
- Geolocation capture on submission
- Sends data to `flood_alerts` table
- Success/error feedback with 3-second auto-close
- Demo mode: bypasses upload failures to avoid blocking presentation
- Form validation: requires proof before submission

**Props**: None

### 3. **HeatmapComponent** (`app/components/HeatmapComponent.tsx`)
**Purpose**: Real-time driver view showing demand hotspots and emergency zones.

**Features**:
- Leaflet.js map centered on IT Park Cebu (10.3157°N, 123.8854°E)
- Dark mode tile layer (CartoDB)
- **Heatmap layer**: Visualizes `pings` data as intensity gradient (green → red)
- **Alert markers**: Displays `flood_alerts` as interactive markers with icons
- Real-time subscriptions: updates when new pings/alerts are inserted
- Count display: shows number of active drivers
- Responsive sizing: adapts to screen dimensions

**Props**: None

### 4. **SavingsCard** (`app/components/SavingsCard.tsx`)
**Purpose**: Displays daily/weekly cost savings vs. traditional transport.

**Features**:
- Hardcoded formula: (Trike ₱80 - Jeep ₱13) = ₱67 savings/day
- Weekly projection: 67 × 7 = ₱469 saved
- Motivational context: "That's 2 extra kilos of rice for your family"
- High-contrast styling for sunlight visibility

**Props**: None

---

## 🖥️ Pages & Routes

### Commuter View (`app/page.tsx`)
**Route**: `/`

**Layout**:
```
┌─────────────────────────────────────────┐
│     Header (Logo + Driver View Link)    │
├─────────────────────────────────────────┤
│          SavingsCard Component           │
├─────────────────────────────────────────┤
│     Shift Status Info + Tip Alert        │
├─────────────────────────────────────────┤
│          PingButton Component            │
├─────────────────────────────────────────┤
│          FloodAlertButton                │
├─────────────────────────────────────────┤
│   Stats Grid (Pings Count + Points)     │
└─────────────────────────────────────────┘
```

**Styling**: High-contrast (black background, neon yellow accents) for glaring sun readability.

### Driver View (`app/driver/page.tsx`)
**Route**: `/driver`

**Layout**:
```
┌─────────────────────────────────────────┐
│        Driver Dashboard Header           │
├─────────────────────────────────────────┤
│   HeatmapComponent (Full-screen map)    │
├─────────────────────────────────────────┤
│   Live Stats: Active Pings, Drivers     │
└─────────────────────────────────────────┘
```

**Purpose**: Real-time monitoring of demand hotspots and emergency zones.

---

## ✨ Features Implemented

### ✅ **Phase 1: Database Heart**
- [x] Supabase PostgreSQL project created
- [x] Tables: `profiles`, `pings`, `flood_alerts`
- [x] Indexes for query performance
- [x] Row Level Security (RLS) policies
- [x] SQL schema in `supabase/PHASE1_DATABASE_SETUP.sql`

### ✅ **Phase 2: Commuter "Pulse" UI**
- [x] High-contrast design (black + neon yellow)
- [x] PingButton with multi-step flow
- [x] Geolocation integration
- [x] Destination selector
- [x] SavingsCard with savings math
- [x] Status display cards

### ✅ **Phase 3: Driver's Live Heatmap**
- [x] Leaflet map with dark mode
- [x] Heatmap visualization (leaflet.heat)
- [x] Real-time ping display
- [x] Flood alert markers
- [x] Active driver counter
- [x] Responsive sizing

### ✅ **Phase 4: Emergency Alerts**
- [x] FloodAlertButton modal
- [x] Proof file upload (photo/video)
- [x] Geolocation capture for alerts
- [x] Flood alert marker display on heatmap
- [x] Demo-safe error handling

### 🔄 **Phase 4: Badge & Incentive Logic** (In Progress)
- [ ] Badge unlock logic (5 pings → "Night Owl")
- [ ] Confetti animation on unlock
- [ ] QR code generation for partner rewards
- [ ] Points accumulation tracking
- [ ] Leaderboard display

### 🔄 **Phase 5: Mobile Responsiveness & Deployment** (Partial)
- [x] Tailwind responsive utilities implemented
- [x] Flex/grid layouts
- [ ] PWA manifest.json setup
- [ ] Service worker configuration
- [ ] Vercel deployment ready

---

## 🚀 How It Works: Data Flow

### Commuter Requesting a Ride
1. Commuter opens app at `/`
2. Taps **PingButton** → Modal opens
3. Selects destination (e.g., "IT Park")
4. Taps "Find Rides" → Simulated search (1.5s)
5. Taps "Confirm Booking"
6. Browser captures geolocation
7. PingButton creates/fetches user profile
8. Inserts record into `pings` table with lat/lng/destination
9. Supabase real-time notifies subscribed clients (drivers)
10. Heatmap updates instantly showing new ride request

### Driver Viewing Demand
1. Driver opens app at `/driver`
2. HeatmapComponent initializes Leaflet map
3. Fetches last 100 pings from `pings` table
4. Renders heatmap overlay (intensity = rider concentration)
5. Subscribes to `pings` real-time channel
6. As new pings arrive, heatmap updates live
7. Also displays flood alerts as markers

### Emergency Flood Report
1. Commuter notices flooding
2. Taps **FloodAlertButton**
3. Selects/captures photo proof
4. Taps "Report Alert"
5. Browser captures geolocation
6. Sends to `flood_alerts` table
7. Real-time alert notifies drivers
8. Red alert marker appears on heatmap

---

## 🛠️ Setup Instructions

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
Git
```

### 1. Clone & Install
```bash
git clone <repo-url>
cd sugbopulse
npm install
```

### 2. Set Up Supabase
- Go to [supabase.com](https://supabase.com)
- Create a new PostgreSQL project
- Copy the **Project URL** and **Anon Key**
- In SQL Editor, run the schema from `supabase/PHASE1_DATABASE_SETUP.sql`
- **Important**: In Replication settings, enable real-time for `pings` and `flood_alerts` tables

### 3. Environment Variables
Create `.env.local` in the `sugbopulse/` folder:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Test Features
- **Commuter**: Click PingButton, select destination, confirm
- **Flood Alert**: Click FloodAlertButton, upload proof, submit
- **Driver**: Navigate to `/driver`, watch heatmap for live updates
- **Geolocation**: Grant permission to see your real coordinates on map

---

## 📈 Current Status

### Completed
- ✅ Full database schema with RLS
- ✅ Commuter request flow (PingButton)
- ✅ Live heatmap visualization
- ✅ Flood alert system
- ✅ High-contrast UI for sunlight
- ✅ Real-time data subscriptions ready
- ✅ Multi-step booking modal
- ✅ Responsive design
- ✅ Demo-safe error handling

### In Progress / Next Steps
1. **Badge System**: Unlock "Night Owl" badge after 5 pings, "Swift Responder" after 10 pickups
2. **Confetti Animation**: Celebrate badge unlocks with canvas-confetti
3. **QR Code Integration**: Generate partner reward QR codes
4. **User Profiles**: Persist user data, show profile stats
5. **Driver Acceptance**: Allow drivers to accept ride requests (currently one-way)
6. **Payment Integration**: Connect ride cost to payment gateway
7. **PWA Setup**: Add manifest.json for "Install to Home Screen"
8. **Authentication**: Supabase Auth for secure user sessions
9. **Production Deployment**: Deploy to Vercel + Supabase Cloud
10. **Flood Alert File Upload**: Connect proof_url to Supabase Storage

---

## 📱 Mobile Responsiveness

### Breakpoints Implemented
- **Mobile (< 768px)**: Single column, map takes 50% of screen, stacked buttons
- **Tablet (768px - 1024px)**: Two-column flexible layout
- **Desktop (> 1024px)**: Full-width with sidebar options (future)

### Key Responsive Classes
- `max-w-2xl` — Content container limiting width
- `flex flex-col` / `grid grid-cols-2` — Flexible layouts
- `px-4` — Mobile padding
- `w-full` — Full-width sections

---

## 🎯 Hackathon Pitch Checklist

- [x] **Requirement 01**: Cost savings display (SavingsCard)
- [x] **Requirement 02**: High-contrast UI for sun visibility (Black + Yellow)
- [x] **Requirement 03**: Real-time heatmap showing rider concentration
- [x] **Requirement 04**: Flood alert emergency system
- [x] **Requirement 05**: Gamified badges & points (structure ready, logic in progress)
- [x] **Requirement 06**: Mobile-first responsive design
- [ ] **Requirement 07**: Live demo with real data (pending Supabase setup)

---

## 🔗 Useful Links & Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint check
```

### Database
- Supabase Dashboard: https://app.supabase.com
- SQL Editor: Run queries directly
- Real-time Replication: Database → Replication → Enable tables

### Deployment
```bash
git push             # Triggers Vercel deployment
# OR manually: vercel deploy
```

### Debugging
- Browser DevTools: Network tab for Supabase API calls
- Supabase Logs: Database → Logs for query errors
- Real-time Subscriptions: Console logs in components

---

## 📞 Support & Next Collaboration Steps

### Immediate Next Steps (For Next Sprint)
1. Test real Supabase connection with live database
2. Implement badge unlock logic in PingButton
3. Add confetti animation for badge celebration
4. Implement QR code generation for partner rewards
5. Add driver acceptance/decline flow
6. Optimize heatmap performance with query limits

### Known Limitations (MVP)
- Proof file upload mocked (will point to Supabase Storage in production)
- Profile data not persisted across sessions (demo-only)
- No authentication yet (permissive RLS for hackathon)
- Ride matching is visual heatmap only (backend assignment logic pending)
- No payment processing

---

**Version**: 0.1.0 (MVP Hackathon Build)  
**Last Commit**: `1b6f70b` (April 22, 2026)  
**Team**: SugboPulse Dev Team
