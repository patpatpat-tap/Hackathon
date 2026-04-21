# SugboPulse - Design System (Compact)

## Core Philosophy
High-contrast, mobile-first platform for Cebu's night shift workers. Optimized for harsh sunlight visibility with thumb-friendly interactions.

---

## Color Palette
- **Primary**: Black (#000) background, Neon Yellow (#FBBF24) actions
- **Secondary**: Charcoal Gray (#111827), White text
- **Semantic**: Green (#10B981) success, Red (#EF4444) alerts
- **Heatmap**: Green (low) → Yellow (medium) → Red (high demand)

---

## Typography
- **H1**: 36px Bold, text-yellow-400
- **H2**: 24px Bold, text-yellow-400
- **Body**: 16px Regular, text-white
- **Small**: 14px Regular, text-gray-300
- Line height: 1.6 (body), 1.2 (headers)

---

## Commuter View (`/`)

```
┌─────────────────────────┐
│ Header (sticky)         │
│ SugboPulse | Driver View│
├─────────────────────────┤
│ Savings Card (yellow)   │
│ ₱67 Saved Today         │
├─────────────────────────┤
│ Status Section (gray)   │
├─────────────────────────┤
│ PING BUTTON (massive)   │
│ h-24 w-full yellow      │
├─────────────────────────┤
│ Quick Stats (2-column)  │
├─────────────────────────┤
│ Footer                  │
└─────────────────────────┘
```

### Header
- Gradient black → gray-900, bottom border 2px yellow
- Logo left, "Driver View" button right
- Sticky positioning

### Savings Card
- bg-yellow-400 text-black, p-6, rounded-lg
- Shows: ₱80 (trike) - ₱13 (jeep) = ₱67 saved
- Meta: "That's X kilos of rice"

### Ping Button (MAIN CTA)
- **Size**: w-full h-24 (thumb-sized)
- **Color**: bg-yellow-400 hover:bg-yellow-500
- **States**: "I Need a Ride" → "Sending..." → "✓ Ping Sent!"
- **Feedback**: Location display, error/success messages
- **Transform**: hover:scale-105, active:scale-95

### Stats Grid
- 2 columns: "Your Pings" (0) | "Points" (0)
- bg-gray-900 border-yellow-400 p-4

---

## Driver View (`/driver`)

```
┌──────────────────────────────┐
│ Header: SugboPulse Driver Map│
│ 🚗 5 Active Requests         │
├──────────────────────────────┤
│                              │
│   LEAFLET HEATMAP            │
│   (Dark CartoDB tiles)       │
│                              │
│   Legend (bottom-left)       │
│   Stats (top-right)          │
└──────────────────────────────┘
```

### Map Container
- Full screen minus header
- Centered: IT Park (10.3157, 123.8854), zoom 14
- Dark tile layer (CartoDB dark_all)
- Heatmap radius: 40px, blur: 25px

### Heatmap Layer
- Real-time from `pings` table
- Gradient: Green → Yellow → Red
- Intensity: 0.8 per ping
- Updates instantly on new pings (Supabase subscriptions)

### Legend (Overlay, bottom-left)
- bg-black border-yellow-400 p-4
- Shows: Green "Low", Yellow "Medium", Red "High"

### Stats Panel (Overlay, top-right)
- Live Requests count
- Last Updated timestamp

---

## Components

### Buttons
- **Primary**: bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg
- **Hover**: bg-yellow-500 scale-105
- **Active**: scale-95 (press feedback)
- **Transitions**: 200ms duration

### Cards
- Dark: bg-gray-900 border-2 border-yellow-400 p-4-6 rounded-lg
- Highlight: bg-yellow-400 text-black (Savings Card)

### Status Messages
- Success: text-green-400
- Error: text-red-400
- Info: text-gray-300

---

## Responsive Breakpoints
- **Mobile** (<640px): Single column, compact spacing, full-width buttons
- **Tablet** (640-1024px): Single column, max-w-2xl centered
- **Desktop** (>1024px): max-w-4xl, generous spacing, large overlays

---

## Accessibility
- **Contrast**: Yellow on Black = 16.5:1 ✓
- **Touch Targets**: Min 44x44px
- **Focus States**: border-2 border-yellow-400 on tab
- **Font Size**: Min 16px (no zoom required)
- **Keyboard Navigation**: Full support

---

## Design Principles
1. High contrast for harsh sunlight
2. Thumb-friendly large buttons
3. Fast visual feedback
4. Real-time priority (driver map)
5. Information hierarchy: savings → ping → stats
6. Mobile-first, scales to desktop
7. Flat design (no shadows)
8. System fonts (fast load)
9. Minimal animations (speed)
10. Purpose-driven every pixel

---

## User Interactions

### Commuter Flow
1. Open `/` → See savings motivation
2. Click massive yellow ping button
3. Geolocation triggered → coordinates captured
4. Ping sent to Supabase
5. Success message (3 seconds)
6. (Optional) Switch to `/driver` to see heatmap

### Driver Flow
1. Open `/driver` → See live heatmap
2. Identify red zones (high demand)
3. Watch map update in real-time
4. Request counter in header
5. Click area for more details (future)

---

## Animation Specifications
- **Button hover**: transform scale-105 (5% grow)
- **Button press**: active:scale-95 (5% shrink)
- **Duration**: 150-200ms
- **Heatmap**: Instant updates, no animation
- **Toast messages**: Brief display (3 sec success, dismiss error)

---

## Spacing Scale
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px

## Border Radius
- sm: 4px | md: 8px | lg: 12px

## Shadows
- None (flat design aesthetic)

---

## Summary
**SugboPulse** = Black background + Neon yellow CTAs + Real-time heatmap + Thumb-sized buttons. Designed for speed, accessibility, and hackathon impact. Every decision prioritizes function over form.
