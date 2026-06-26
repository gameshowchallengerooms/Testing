# PricingSection Specification

## Overview
- **Target file:** `src/components/PricingSection.tsx`
- **Interaction model:** static

## Structure
- "Tickets" label with dash line
- "Book Your Spot at Gamestorii!" heading
- 3 pricing cards in horizontal layout
- Left side: decorative neon arcade machine image

## Container
- background: black
- padding: ~80px 40px
- width: 100%

## Label
- Text: "Tickets"
- Dash line + white text

## Heading
- Text: "Book Your Spot at Gamestorii!"
- Font: Inter Display, ~48px, weight 500, white
- Word-by-word reveal

## Pricing Cards (3 cards)

### Card 1: 60 mins Pass
- Background: purple-to-blue gradient (linear-gradient(135deg, #7C5CFC, #5B8DEF))
- borderRadius: 24px
- padding: ~32px
- Title: "60 mins Pass"
- Description: "Get entry to the full gaming arena and enjoy all challenges"
- Features:
  - Access to Gamestorii Experience (60 mins)
  - Rotate freely between games as many times as you want
  - Real-time score tracking on your profile
  - Standard entry for Min 2 or small groups
- Badge: "Early Bird"
- Price: "₹1500"
- Strikethrough: "Discounted from ₹2000"
- Subtext: "Single admission per hour"
- CTA: "Buy Ticket" button with arrow icon
- Links to: https://bookings.gamestorii.com/

### Card 2: 90 mins Pass
- Same gradient style
- Title: "90 mins Pass"
- Same features but 90 mins
- Price: "₹2000"
- Strikethrough: "Discounted from ₹3000"
- Subtext: "Single admission per 90 mins"
- CTA: "Buy Ticket"

### Card 3: 30 mins Pass
- Background: pink-to-purple gradient (linear-gradient(135deg, #E8A0BF, #C77DBA))
- Title: "30 mins Pass"
- Description: "Get entry to the gaming arena and enjoy upto 5 games"
- Subtitle: "Bring the squad. Win together."
- Features:
  - Access to Gamestorii Experience (30 mins)
  - Real-time score tracking on your profile
  - Standard entry for Min 2 or small groups
- Badge: "Early Bird"
- Price: "₹1000"
- Subtext: "Single admission per 30 mins"
- CTA: "Buy Ticket"

### Card typography
- Title: ~24px, weight 700, white
- Price: ~72px, weight 800, white
- Features: ~14px, weight 400, white/semi-transparent
- CTA button: dark bg, white text, borderRadius pill, arrow icon

## Decorative Image
- Left side: neon arcade machine image (CrUPNjiFg8LHxyxPkJDaPSvx6E.png, 7.8MB)

## Responsive
- Desktop: 3 cards in a row
- Mobile: stacked single column
