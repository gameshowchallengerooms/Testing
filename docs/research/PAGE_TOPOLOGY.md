# Page Topology - gamestorii.com

## Overall Layout
- Single-page scrolling site
- Dark theme (black background throughout)
- No smooth scroll library (native scroll)
- Total height: ~6753px at desktop
- WhatsApp floating widget (bottom-right) - 3rd party, skip

## Sections (top to bottom)

### 1. Navbar
- **Position:** relative (not fixed/sticky from initial observation)
- **Z-index:** auto
- **Contents:** Logo (left), nav links (Games, Visitors, Cafe, Contact) as pill buttons, "Get Ticket" CTA with blue arrow
- **Interaction model:** static + scroll-triggered (need to verify if it becomes sticky)
- **Height:** 90px, padding: 16px 40px

### 2. Hero Section
- **Type:** Full-viewport section
- **Background:** Psychedelic swirl pattern (likely a video or animated canvas) with dark overlay
- **Content:** Large "GAMESTORII" text with blue-to-pink gradient, "Play. Compete. Sweat. Repeat" tagline in italic
- **3D crystal/gem decorations** in corners
- **Interaction model:** static (possibly parallax or video background)
- **Font:** "Gamestorii Regular" custom font for the logo text

### 3. About Section ("What is Gamestorii")
- **Background:** Black
- **Content:** Two H3 text blocks describing the arena
- **Heading:** "WHAT IS GAMESTORII"
- **Font:** Inter Display, 38px, weight 500, line-height 49.4px, letter-spacing -1.52px
- **Interaction model:** scroll-triggered text reveal animation (words appear one by one)
- **Text color:** White (rgb(255, 255, 255))

### 4. For Whom Section
- **Background:** Black
- **Content:** "For Whom?" heading + description paragraph
- **Font:** Inter Display
- **Interaction model:** scroll-triggered text animation

### 5. Game Rooms Carousel
- **Background:** Black
- **Content:** "Game Rooms" heading + "High-tech active game zones for 2-5 players" subheading
- **Carousel:** 9 game cards (Matrix, Mission Impossible, Times Square, Jordan's Dunk, Texas Hexas, Squid Games, UFO, Octopus, Himalayan Peaks)
- **Each card:** Image + game name heading + tagline
- **Controls:** Previous/Next buttons, pagination
- **Interaction model:** click-driven carousel with prev/next
- **Bottom:** "Game Rooms" label + "See All" link

### 6. FAQ Accordion Section
- **Background:** Black
- **Heading:** "Questions" + "All the Important Details Before Attending Gamestorii"
- **6 items:** How long, minimum age, group booking, what to expect, what to wear, lockers
- **Interaction model:** click-driven accordion (expand/collapse with + icon)

### 7. Testimonials Section
- **Background:** Black
- **Headings:** "Testimonial", "Praise", "Why people love Gamestorii..."
- **3 cards:** Each with avatar image, quote text, name
- **Reviewers:** Vaibhav Jain, Sumana Kothamas, Raman Chinna
- **Interaction model:** static (possibly scroll-triggered entrance)

### 8. Pricing/Tickets Section
- **Background:** Black
- **Heading:** "Tickets" + "Book Your Spot at Gamestorii!"
- **3 pricing cards:**
  - 60 mins Pass: Rs.1500 (discounted from Rs.2000)
  - 90 mins Pass: Rs.2000 (discounted from Rs.3000)
  - 30 mins Pass: Rs.1000
- **Each card:** Purple/pink gradient background, features list, "Buy Ticket" CTA
- **Cards have:** "Early Bird" badge
- **Interaction model:** static (possibly scroll-triggered entrance)

### 9. Footer
- **Background:** Black
- **Content:** "Social" label, Facebook/Instagram/X icons, "Terms and Conditions" link, copyright
- **Interaction model:** static

## Fonts
- **Inter** - body text, nav links (weight 600, 16px)
- **Inter Display** - headings (weight 500, 38px, letter-spacing -1.52px)
- **Inter Tight** - italic text (loaded from Google Fonts)
- **Gamestorii Regular** - custom font for hero logo text

## Key Colors
- Background: rgb(0, 0, 0) - pure black
- Text primary: rgb(255, 255, 255) - white
- Hero gradient: blue (#6B8DD6 approx) to pink (#E06BAA approx)
- Pricing cards: purple-to-pink gradient
- CTA blue: bright blue circle on "Get Ticket"
- Nav pill bg: dark gray/charcoal
