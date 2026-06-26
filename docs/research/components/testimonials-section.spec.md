# TestimonialsSection Specification

## Overview
- **Target file:** `src/components/TestimonialsSection.tsx`
- **Interaction model:** static (cards displayed in fan layout)

## Structure
- Left side: "Testimonial" and "Praise" labels with dash lines
- Right side: 3 testimonial cards stacked/fanned with slight rotation
- Below: "Why people love Gamestorii..." heading

## Container
- background: black
- padding: ~80px 40px
- display: flex
- Two-column layout: labels left, cards right

## Labels (left column)
- "Testimonial" with dash line, white text
- "Praise" with dash line, white text
- Font: Inter, ~16px, weight 400

## Heading
- Text: "Why people love Gamestorii..."
- Font: Inter Display, ~48px, weight 500, white
- Word-by-word reveal animation

## Testimonial Cards (right column)
3 cards in a fan/stacked layout with slight rotation:

### Card style
- Background: #1a1a1a (dark)
- borderRadius: 24px
- padding: ~32px
- Width: ~350px
- boxShadow: subtle dark shadow
- Each card slightly rotated (-5deg, 0deg, 5deg) and offset

### Card content
1. **Raman Chinna** - Avatar: pGEpsxpGy4MIjqcG471RdJ7f6Y.png
   - "Had an amazing time at GameStorii! The variety of game rooms makes the experience incredibly fun and exciting. Each room has its own unique vibe, making the whole place feel immersive and engaging. A perfect spot to relax, play, and create great memories with friends & family"

2. **Sumana Kothamas** - Avatar: yty5EEX6I11lbzFXsM3fcTIx0.png
   - "Looking for a gang out place with friends, cousins or colleagues ? Def. The best place to go..."

3. **Vaibhav Jain** - Avatar: 6XVmyesSGqTBk7i6vi9Nai70Q.png
   - "Had an amazing time at this gaming zone! The experience was super fun and engaging from start to finish..."

### Card elements
- Circular avatar image (~80px diameter) at top center, overlapping card edge
- Quote text: Inter, ~14px, weight 400, white, text-align center
- Red hearts emoji at bottom of quote
- Name: Inter, ~14px, weight 600, white, below card

## Responsive
- Desktop: side-by-side layout, fan arrangement
- Mobile: stacked cards, single column
