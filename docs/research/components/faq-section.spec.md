# FAQSection Specification

## Overview
- **Target file:** `src/components/FAQSection.tsx`
- **Interaction model:** click-driven accordion

## Structure
- "Questions" label with dash line
- Large heading
- 6 accordion items with + icon to expand
- Decorative background image

## Container
- background: black
- padding: ~80px 40px
- width: 100%

## Label
- Text: "Questions"
- Dash line before text, white

## Heading
- Text: "All the Important Details Before Attending Gamestorii"
- Font: Inter Display, ~48px, weight 500, white
- Letter-spacing: -2px
- Word-by-word reveal animation

## Accordion Items
Each item:
- Background: #1a1a1a (dark card)
- borderRadius: 16px
- padding: ~24px
- Heading text on left, + icon on right
- Click to expand/collapse
- Transition: smooth height animation

### Questions:
1. "How long can I play for?"
2. "What is the minimum age for Gamestorii?"
3. "Can I make a group booking?"
4. "What can I expect from Gamestroii?"
5. "What should I wear?"
6. "Do you provide lockers?"

### Heading style
- Font: Inter, ~18px, weight 500, white
- + icon: white, transitions to x on open

## Decorative
- Background image: `public/images/3pCUVCONlMbPw2vvJvV9TGG1gVY.png` (1515x473)

## Responsive
- Desktop: full-width accordion items
- Mobile: same layout, smaller padding
