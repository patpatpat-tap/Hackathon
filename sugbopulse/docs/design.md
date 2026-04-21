# SugboPulse - Complete UI/UX Design System

## Design Philosophy
SugboPulse is a **high-contrast, driver-focused mobile-first platform** designed for Cebu's night shift workers in harsh sunlight. The design prioritizes **visibility, speed, and accessibility** over aesthetics. Every color, size, and interaction is intentional for BPO workers and habal-habal drivers.

---

## Color Palette

### Primary Colors
- **Black (#000000)**: Primary background. Pure black for maximum contrast in bright sunlight
- **Neon Yellow (#FBBF24)**: Primary action color. High-visibility yellow that cuts through Cebu's glare
- **Charcoal Gray (#111827)**: Secondary background for depth and visual hierarchy

### Semantic Colors
- **Success Green (#10B981)**: Confirmation, approved badges, low-demand zones
- **Warning Red (#EF4444)**: High demand, urgent requests, high-demand zones
- **Yellow Accent (#FCD34D)**: Medium demand, secondary CTAs, highlights
- **White (#FFFFFF)**: Text on dark backgrounds for maximum contrast
- **Gray-400 (#9CA3AF)**: Secondary text, subtle information

### Heatmap Gradient
- **Green (#00FF00)**: Low demand (1-10 requests)
- **Yellow (#FFFF00)**: Medium demand (10-30 requests)
- **Red (#FF0000)**: High demand (30+ requests)

---

## Typography

### Font Family
- **Primary**: System fonts (no external fonts for performance on poor mobile networks)
- Default: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Font Sizes & Weights
- **H1 (Hero)**: 36px, Bold (font-weight: 700), text-yellow-400
- **H2 (Section Headers)**: 24px, Bold, text-yellow-400
- **H3 (Subsection)**: 20px, Bold, text-white
- **Body (Default)**: 16px, Regular, text-white
- **Small (Secondary)**: 14px, Regular, text-gray-300
- **Tiny (Tertiary)**: 12px, Regular, text-gray-400

### Line Height
- Headers: 1.2
- Body text: 1.6
- Compact info: 1.4

---

## Commuter View (Main Page: `/`)

### Layout Structure
```
┌─────────────────────────────────────┐
│   HEADER (STICKY)                   │
│   SugboPulse | 🚗 Driver View       │
├─────────────────────────────────────┤
│                                     │
│   SAVINGS CARD                      │
│   ₱67 Saved Today                   │
│                                     │
│   STATUS SECTION                    │
│   "Tap below to log your shift"     │
│                                     │
│   MASSIVE PING BUTTON               │
│   "I Need a Ride"                   │
│   (thumb-sized, yellow, pulsing)    │
│                                     │
│   QUICK STATS (2-column grid)       │
│   Your Pings | Points               │
│                                     │
├─────────────────────────────────────┤
│   FOOTER                            │
│   "Smart Commuting for Cebu"        │
└─────────────────────────────────────┘
```

### Header Component
- **Background**: Gradient from pure black to charcoal gray (left to right)
- **Border**: Bottom border 2px yellow (#FBBF24)
- **Content**: Logo on left, "Driver View" button on right
- **Padding**: py-6 px-4
- **Position**: Sticky (stays at top while scrolling)
- **CTA Button**: bg-yellow-400, hover:bg-yellow-500, text-black, font-bold, rounded-lg, px-6 py-3

### Savings Card Component
- **Background**: Gradient yellow-400 to yellow-500
- **Text Color**: Pure black (maximum contrast)
- **Padding**: p-6
- **Border Radius**: rounded-lg
- **Content Layout**:
  - H2 Header: "💰 SAVINGS CHECK"
  - Two rows with flex justify-between:
    - "Special Trike Cost: ₱80"
    - "Standard Jeep Fare: ₱13"
  - Divider: border-t-2 border-black
  - Big number: "You Save Today: ₱67" (lg font-bold)
  - Meta info: "This Week: ₱335" (sm text-black/80)
  - Info box: bg-black/10, "That's X kilos of rice"
- **Visual Weight**: High (eye-catching)
- **Margin Bottom**: mb-6

### Status Section
- **Background**: bg-gray-900
- **Border**: 2px border-yellow-400
- **Padding**: p-6
- **Content**:
  - H2: "📍 Your Shift Status" (text-yellow-400)
  - Body text explaining the ping action
  - Info box: bg-black/50, border border-yellow-400, "💡 Tip: Make sure location is enabled"
- **Spacing**: mb-6

### Ping Button (MAIN CALL-TO-ACTION)
- **Size**: w-full h-24 (massive, thumb-friendly)
- **Background**: bg-yellow-400
- **Hover State**: bg-yellow-500, transform scale-105
- **Active State**: active:scale-95 (press feedback)
- **Text**: font-bold text-xl text-black
- **Border Radius**: rounded-lg
- **States**:
  - Normal: "I Need a Ride"
  - Loading: "Sending..."
  - Success: "✓ Ping Sent!" (shows for 3 seconds)
- **Feedback**: 
  - Location coordinates display below (text-sm text-gray-400)
  - Success message in green (text-green-400)
  - Error message in red (text-red-400)

### Quick Stats Grid
- **Layout**: grid-cols-2 gap-4
- **Margin**: mt-8
- **Each Card**:
  - Background: bg-gray-900
  - Border: border border-yellow-400
  - Padding: p-4
  - Border Radius: rounded-lg
  - Content:
    - Label: text-gray-400 text-sm
    - Number: text-3xl font-bold text-yellow-400
  - Hover: subtle highlight

### Footer
- **Background**: bg-gray-900
- **Border**: border-t border-yellow-400
- **Padding**: py-4 px-4
- **Text**: text-gray-400 text-sm
- **Content**: "🌍 Smart Commuting for Cebu's Night Shift Workers"
- **Margin Top**: mt-8

---

## Driver View (Full-Screen Map: `/driver`)

### Overall Layout
```
┌─────────────────────────────────────────┐
│  HEADER (STICKY)                        │
│  SugboPulse Driver Map | 5 Requests    │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│       LEAFLET HEATMAP                   │
│       (Full height, dark tile layer)    │
│                                         │
│       Legend (bottom-left)              │
│       Stats Panel (top-right)           │
│                                         │
└─────────────────────────────────────────┘
```

### Header
- **Background**: Gradient black to gray-900
- **Border**: Bottom 2px border-yellow-400
- **Content Layout**: flex items-center justify-between
  - Left: Title + description
    - "SugboPulse Driver Map" (H1, text-yellow-400)
    - "🔴 Red zones = high demand..." (text-gray-300, text-sm)
  - Right: Badge showing active requests
    - Background: bg-yellow-400
    - Text: text-black font-bold text-lg
    - Content: "🚗 5 Active Requests"

### Map Container (`#map-container`)
- **Size**: flex-1 (fills all available space)
- **Height**: Full viewport minus header
- **Tile Layer**: CartoDB Dark Mode (`cartodb_positron_nolabels` or `dark_all`)
- **Center**: IT Park Cebu (10.3157, 123.8854)
- **Zoom Level**: 14 (perfect for seeing demand clusters)

### Heatmap Layer
- **Data Points**: Array of [lat, lng, intensity] from pings table
- **Intensity**: 0-1 scale (0.8 for all pings in MVP)
- **Radius**: 40px blur radius
- **Blur**: 25px
- **Max Zoom**: 17
- **Gradient**: Green → Yellow → Red (as described in color palette)
- **Updates**: Real-time via Supabase subscriptions (instant refresh on new pings)

### Legend Component (Overlaid, bottom-left)
- **Position**: absolute bottom-6 left-6
- **Background**: bg-black border-2 border-yellow-400 rounded-lg
- **Padding**: p-4
- **Max Width**: max-w-xs
- **Text Color**: text-white
- **Content**:
  - H3: "Heatmap Legend" (text-yellow-400, font-bold, mb-3)
  - Three rows, each with:
    - Color square (w-4 h-4 bg-[color] rounded)
    - Description text (text-sm)
  - Rows:
    1. Green square: "Low demand (1-10 requests)"
    2. Yellow square: "Medium demand (10-30 requests)"
    3. Red square: "High demand (30+ requests)"

### Stats Panel (Overlaid, top-right)
- **Position**: absolute top-24 right-6
- **Background**: bg-black border-2 border-yellow-400 rounded-lg
- **Padding**: p-4
- **Max Width**: max-w-xs
- **Text Color**: text-white
- **Content**:
  - H3: "Quick Stats" (text-yellow-400, font-bold, mb-3)
  - Row 1: "Live Requests: " + number (text-yellow-400 font-bold)
  - Row 2: "Last Updated: " + timestamp (text-gray-400, text-sm)

### Interaction Patterns
- **Click on heatmap**: (Optional) Could show list of specific pings
- **Auto-refresh**: Instant when new pings arrive
- **Zoom behavior**: Heatmap becomes more granular as you zoom in
- **Mobile**: Map stays full-screen, legend/stats are floating panels

---

## Component-Level Design Details

### Buttons
- **Primary Button (Yellow)**:
  - Background: bg-yellow-400
  - Hover: bg-yellow-500
  - Text: text-black font-bold
  - Padding: px-6 py-3
  - Border Radius: rounded-lg
  - Transition: transition-colors duration-200
  - Transform: hover:scale-105 active:scale-95 (haptic feedback feel)

- **Secondary Button (Ghost)**:
  - Background: transparent
  - Border: border-2 border-yellow-400
  - Text: text-yellow-400 font-bold
  - Hover: bg-yellow-400/10

### Cards
- **Dark Card**:
  - Background: bg-gray-900
  - Border: border-2 border-yellow-400
  - Padding: p-4 to p-6
  - Border Radius: rounded-lg
  - Shadow: None (flat design)

- **Highlight Card (Yellow)**:
  - Background: bg-yellow-400
  - Text: text-black
  - Border: None
  - Padding: p-6
  - Border Radius: rounded-lg

### Input Fields
- **Text Input**:
  - Background: bg-black
  - Border: border-2 border-gray-700
  - Focus: border-yellow-400
  - Text: text-white
  - Padding: px-4 py-2
  - Border Radius: rounded-lg

### Icons & Emojis
- Used throughout for quick visual scanning
- Examples: 🚗 (driver), 📍 (location), 💰 (savings), 🔴 (red zone), ✓ (success), ⚠️ (error)
- Placed before text for visual hierarchy

---

## Responsive Design

### Mobile (< 640px)
- **Layout**: Single column, full width
- **Button Height**: h-24 (thumb-sized)
- **Font Sizes**: Reduced by 1-2 sizes
- **Spacing**: Compact padding and margins
- **Map**: Takes 100% of available space
- **Overlays**: Reduced size, positioned to not block interactive elements

### Tablet (640px - 1024px)
- **Layout**: Single column, max-w-2xl centered
- **Button Height**: h-24 (maintained)
- **Font Sizes**: Normal
- **Spacing**: Standard padding
- **Map**: Full screen with side panels

### Desktop (> 1024px)
- **Layout**: max-w-4xl, centered
- **Button Height**: h-24 (maintained)
- **Font Sizes**: Normal
- **Spacing**: Generous padding
- **Map**: Full screen with large overlays
- **Sidebar**: (Optional) Could add driver profile sidebar

---

## Animation & Transitions

### Button Interactions
- **Hover Scale**: transform hover:scale-105 (5% grow)
- **Active Press**: active:scale-95 (5% shrink)
- **Duration**: 150-200ms

### Loading States
- **Button Text Change**: "I Need a Ride" → "Sending..." → "✓ Ping Sent!"
- **Loading Indicator**: Optional spinner (text-yellow-400)
- **Duration**: Instant feedback, 3-second success message

### Heatmap Updates
- **Transition**: Smooth fade-in of new heat layers
- **Animation**: None (real-time, instant update)
- **Visual Feedback**: New ping = brief pulse at location

### Toast/Alert Messages
- **Success**: Text in green (#10B981), briefly displayed
- **Error**: Text in red (#EF4444), displayed until dismissed
- **Info**: Text in gray-300, brief display

---

## Accessibility Considerations

### Contrast
- Yellow (#FBBF24) on Black (#000000): 16.5:1 contrast ratio ✓
- White on Black: 21:1 contrast ratio ✓
- Gray-300 on Black: 8.5:1 contrast ratio ✓

### Touch Targets
- **Minimum Size**: 44x44px (mobile)
- **Ping Button**: 100% width × 96px height (massive)
- **Driver View Link**: 44x44px (meets standard)

### Focus States
- **Focus Outline**: border-2 border-yellow-400 when tabbed
- **Keyboard Navigation**: Full support for all interactive elements

### Text Readability
- **Line Height**: 1.6 for body text (comfortable reading)
- **Font Size**: Minimum 16px on mobile (no zoom required)
- **Max Line Width**: max-w-2xl (optimal reading length)

---

## Design System Summary

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px

### Shadows
- None (flat design aesthetic)

### Breakpoints (Tailwind)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

---

## Design Principles Applied

1. **High Contrast First**: Yellow on black readable in harsh Cebu sun
2. **Thumb-Friendly**: Large buttons, no small tap targets
3. **Fast Feedback**: Instant visual responses to user actions
4. **Real-Time Focus**: Driver map updates instantly
5. **Information Hierarchy**: Most important info (savings, ping button) prominent
6. **Mobile-First**: Desktop is secondary, mobile is primary
7. **Accessibility Default**: All interactions keyboard navigable
8. **Flat Design**: No gradients (except subtle header), no shadows
9. **Speed Optimized**: System fonts, minimal animations, fast load
10. **Purpose-Driven**: Every pixel serves the hackathon goal

---

## User Flows

### Commuter User Flow
1. Open `/` (commuter view)
2. See savings card (motivation)
3. See ping button (single action)
4. Click button (trigger geolocation)
5. Location captured
6. Ping sent to Supabase
7. Success message shown (3 seconds)
8. User waits for driver response
9. (Optional) Check driver view to see heatmap

### Driver User Flow
1. Open `/driver` (heatmap view)
2. See live heatmap with red zones
3. See request counter in header
4. Identify high-demand area (red zone)
5. Click area (optional expansion)
6. Pick up commuter
7. Map updates in real-time as new pings arrive

---

## Color Usage Examples

### Header
- Background: Black with gray gradient
- Text: Yellow (h1), White (p)
- Border: Yellow

### Ping Button
- Background: Yellow
- Text: Black
- Hover: Yellow (darker shade)

### Heatmap Legend
- Background: Black
- Border: Yellow
- Text: White
- Indicator dots: Green, Yellow, Red

### Error/Success Messages
- Error: Red background or red text
- Success: Green background or green text
- Warning: Yellow background or yellow text

---

## Final Notes

This design system prioritizes **functionality over beauty**, making SugboPulse a practical tool for Cebu's night workers. The high-contrast yellow and black are non-negotiable for visibility in harsh sunlight. The large touch targets and simplified flows ensure accessibility for drivers on-the-go.

The design is **mobile-first but scales elegantly** to tablets and desktops, making it perfect for a PWA deployment. Every decision—from color to spacing to animation—serves the core mission: connecting BPO workers with habal-habal drivers in real-time.
