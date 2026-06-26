# Navbar Specification

## Overview
- **Target file:** `src/components/Navbar.tsx`
- **Interaction model:** scroll-triggered (full nav at top, compact nav on scroll)

## Structure
- Framer-built nav with two states:
  - **Default (scroll 0):** Full-width nav with logo left, pill nav links center-right, Get Ticket CTA
  - **Scrolled:** Compact floating bar with logo + Get Ticket only

## Default State (top of page)
### Container (nav)
- display: flex
- padding: 16px 40px
- height: 90px
- gap: 20px
- position: relative (becomes fixed on scroll)
- background: transparent

### Inner wrapper
- display: flex
- borderRadius: 33px
- padding: 4px 4px 4px 12px
- gap: 10px
- background: rgba(30, 30, 30, 0.6) with backdrop blur

### Logo
- Image: `public/images/n0if1GYc13neSTWx3htJSJWrlwU.png` (152x24)
- Links to "./"

### Nav Links (Games, Visitors, Cafe, Contact)
- Font: Inter, 16px, weight 600
- Color: white
- Each in a pill-shaped button with dark bg
- borderRadius: ~20px
- padding: ~8px 16px

### Get Ticket CTA
- Text: "Get Ticket"
- Font: Inter, 16px, weight 600, white
- Black background pill with blue circle arrow icon
- borderRadius: 33px
- Links to bookings.gamestorii.com

## Scrolled State
- Compact centered bar with logo "GAMESTORII" text (gradient blue-to-pink using Gamestorii Regular font) + "Get Ticket" button
- Fixed position, centered horizontally
- Background: dark semi-transparent with blur
- borderRadius: 33px
- Transition: smooth

## Text Content
- Logo text: "GAMESTORII" (gradient: blue #147EFF to pink #FC19ED)
- Nav items: Games, Visitors, Cafe, Contact
- CTA: "Get Ticket"
- CTA links to: https://bookings.gamestorii.com/

## Responsive
- Desktop: full horizontal nav
- Mobile: likely hamburger menu or simplified
