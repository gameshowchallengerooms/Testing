# ForWhomSection Specification

## Overview
- **Target file:** `src/components/ForWhomSection.tsx`
- **Interaction model:** scroll-triggered word-by-word reveal

## Structure
- "For Whom?" label with dash line on left
- Description heading with word-by-word reveal animation

## Container
- padding: 0px
- width: 100%
- display: flex
- flexDirection: column
- gap: 10px
- background: transparent (black page)

## Label
- Text: "For Whom?"
- Font: Inter, 18px, weight 400
- Color: white
- Has a horizontal dash/line before the text (~60px wide, white)

## Description (H3)
- Text: "Gamestorii is a live-action challenge arena where you move, solve, jump, dodge, and think your way through epic physical game rooms. Each room a story. Every second counts."
- Font: Inter Display, 38px, weight 500
- Color: white
- Line-height: 49.4px
- Letter-spacing: -1.52px
- Word-by-word reveal animation (same as About section)

## Responsive
- Desktop: 38px font
- Mobile: smaller font, full-width
