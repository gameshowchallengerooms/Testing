# AboutSection Specification

## Overview
- **Target file:** `src/components/AboutSection.tsx`
- **Interaction model:** scroll-triggered word-by-word reveal animation

## Structure
- Section with two large text blocks
- "WHAT IS GAMESTORII" heading below
- Decorative image: marquee-style banner

## Container
- display: flex
- padding: 0px 40px
- width: 100%
- background: transparent (black page)
- overflow: hidden
- position: relative

## Text Block 1 (H3)
- Text: "Gamestorii is a new kind of gaming arena, a world where your decisions shape your story. Every challenge, every puzzle, every win loss becomes chapter your personal journey."
- Font: Inter Display, 38px, weight 500
- Color: rgb(255, 255, 255)
- Line-height: 49.4px
- Letter-spacing: -1.52px
- Each word individually wrapped in a span for scroll-triggered reveal animation
- Words start at opacity 0.2 and animate to opacity 1 as they enter viewport

## Text Block 2 (H3)
- Text: "These aren't video games you watch. They're physical, immersive missions that demand you run, think, strategize, and push your limits real time and real life."
- Same styles as Text Block 1

## Section Label
- Text: "WHAT IS GAMESTORII"
- Likely smaller, uppercase text above or below

## Decorative Image
- `public/images/jFQf7YQJEPbIFQ2mkSrGItZaTLw.png` (1493x248) - horizontal banner/marquee

## Animation
- Words reveal one by one as user scrolls
- IntersectionObserver on each word span
- Transition: opacity 0.2 -> 1, with slight translateY animation
- Stagger delay per word

## Responsive
- Desktop: 38px font, 40px horizontal padding
- Mobile: smaller font, reduced padding
