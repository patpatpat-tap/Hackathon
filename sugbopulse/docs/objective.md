# The Complete "SugboPulse" Tech Stack
Here is exactly what we are using for the Frontend, Backend, and Database to hit all of your hackathon requirements:
- 1. The Frontend (What the User & Driver Sees)
The Framework: Next.js (React). This builds the structure of your website and mobile app.

The Styling: Tailwind CSS. This is how we hit the Requirement 03: Habal-Habal Reality Check. Tailwind lets you instantly create a high-contrast, "solar-black and neon-yellow" UI that drivers can easily see under the glaring Cebu sun.

The Wow Factor Map: Leaflet.js + Leaflet.heat. Instead of standard Google Maps, this allows us to build a custom, dark-mode smart map that visually pulses red and yellow where the most BPO workers are waiting.

- 2. The Backend & Database (The Brains & Memory)
The All-in-One Engine: Supabase.

As the Database: Under the hood, it is a powerful PostgreSQL database. It will store all the user profiles, their badge progress (like the "Night Owl" or "Swift Responder" badges), and the GPS coordinates of everyone asking for a ride.

As the Backend API: Supabase has a magical feature called Real-Time Subscriptions. When a BPO worker at IT Park taps "I need a ride," Supabase instantly pushes that data to the Driver's map without you having to write any complex backend server code. The heatmap updates live!

- 3. Hosting (Going Live for the Pitch)
Vercel: To host your Next.js frontend and API routes.

Supabase Cloud: To host your database. (Both have excellent free tiers perfect for a hackathon).

The Architecture Flow
User Action: A commuter at IT Park taps "Log Shift" on the Next.js frontend.

Data Saved: Next.js sends their location directly to the Supabase Database.

Real-Time Trigger: Supabase sees the new data and immediately alerts the frontend.

Map Update: The Leaflet map on the driver's phone receives the alert and makes the IT Park area on the heatmap glow red.


# This is the home stretch! We have about 10 hours before the sun comes up and you have to pitch SugboPulse to the judges. To go from a blank terminal to a venture-ready platform, we need to be surgical.

# Here is the complete breakdown of the SugboPulse Implementation Roadmap.

- Phase 1: The Database Heart (Supabase)
Goal: Create a place for the "Pulse" to live.

Table: pings – Stores coordinates from BPO workers.

id, created_at, lat, lng, route_destination (e.g., 'Mandaue', 'Talamban').

Table: profiles – Stores user data and badges.

id, username, role ('driver' or 'commuter'), points, badges (JSON array).

The Magic: Enable Real-time on the pings table in the Supabase dashboard so the driver's map updates without refreshing.

- Phase 2: The Commuter "Pulse" UI (Mobile View)
Goal: Hit Requirement 03 (Habal-Habal Reality Check).

High-Contrast Design: Use a pure black background (bg-black) and neon yellow buttons (bg-yellow-400).

The "Ping" Button: A massive, thumb-sized button. When tapped, it uses the browser's navigator.geolocation API to get the user's coordinates and sends them to Supabase.

The "Savings Math" Card: A dedicated component that shows: "You've saved ₱150 this week by syncing your ride."

- Phase 3: The Driver’s Live Heatmap (Web/Mobile View)
Goal: The "Wow Factor" for the judges.

The Map: Use react-leaflet to render the map.

The Heatmap Layer: Use leaflet.heat. It takes an array of coordinates from your Supabase pings table.

Real-time Update: Use the Supabase client to "subscribe" to new inserts. As BPO workers log out, the map in the IT Park area will visually turn from green to pulsing red.

- Phase 4: The Badge & Incentive Logic
Goal: Full-scale functionality and corporate sponsorship.

For Commuters: Every 5 "Pings" = 1 "Night Owl" Badge. This triggers a confetti-canvas effect and displays a QR code for a partner coffee shop (e.g., "Free Coffee at IT Park Cafe").

For Drivers: Every 10 pickups in a "Red Zone" = 1 "Swift Responder" Badge.

Implementation: A simple React useEffect that checks the user's points in Supabase and unlocks the badge in the UI.

- Phase 5: Mobile Responsiveness & Deployment
Goal: Accessibility and Pitch Readiness.

Responsive Engine: We use Tailwind's flex and grid systems. On mobile, the map takes up 50% of the screen; on desktop, it’s a full-screen "Command Center."

PWA Setup: Add a manifest.json so judges can "Install" the website on their phones during the demo.

Vercel Deployment: Run git push to trigger a live URL.

The "Savings Math" Component Logic
To satisfy Requirement 02, we will hardcode this logic into your "Stats" tab:

Formula: (Special_Trike_Cost - Standard_Jeep_Fare) = Daily_Savings.

Display: A bold, high-contrast card:

SAVINGS CHECK: > ₱80 (Trike) - ₱13 (Jeep) = ₱67 SAVED TODAY.
That's 2 extra kilos of rice for your family.

Your Immediate Next Steps (The 11:00 PM Sprint)
Initialize Supabase: Go to supabase.com, create a project, and create the pings table.

Environment Variables: Create a .env.local file in your sugbopulse folder and paste your Supabase URL and Anon Key.

The Layout: Open src/app/page.tsx and delete the default Next.js code. Replace it with a basic flex-col layout: a Header, the Map Container, and a "Ping" Button.

Ready to start coding the actual Map Component, or do you want the Supabase SQL code to set up your tables in one click?