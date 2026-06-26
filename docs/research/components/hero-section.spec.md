# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Interaction model:** static with animated canvas background

## Structure
- Full viewport height section
- Canvas background (psychedelic swirl pattern) - use static image fallback
- Large "GAMESTORII" text centered with gradient
- Subtitle "Play. Compete. Sweat. Repeat" below
- 3D crystal decorations (cube and triangle images) positioned at corners

## Container (header)
- display: flex
- flexDirection: row
- justifyContent: center
- alignItems: center
- padding: 200px 40px 145px
- width: 100%
- height: 100vh (760px at 1440)
- overflow: hidden
- position: relative
- gap: 10px

## Background
- Canvas element rendering psychedelic swirl pattern (WebGL)
- For clone: use `public/images/hero-bg.webp` or `public/images/pSSINVOSMIf4PhqxNRckBByjw.webp` as fallback
- Position: absolute, fill parent, z-index: 0

## Title "GAMESTORII"
- Two layers for each word (fill + outline effect):
  - "GAME": solid fill rgb(20, 126, 255) blue
  - "GAME": transparent fill (outline layer)
  - "STORII": solid fill rgb(252, 25, 237) pink
  - "STORII": transparent fill (outline layer)
- Font: "Gamestorii Regular", 135px, weight 400
- Line-height: 135px
- Use CSS gradient text: linear-gradient(90deg, #147EFF, #FC19ED)
- Alternative: use -webkit-background-clip: text with gradient

## Subtitle
- Text: "Play. Compete. Sweat. Repeat"
- Font: Inter Display, 56px, weight 900, italic
- Color: rgb(237, 237, 237)
- Line-height: 78.4px
- Positioned below the title

## 3D Decorations
- Cube image: `public/images/wX62SMRMN1v1X6SFoJaoNdwo.webp` (257x257) - positioned top-right and elsewhere
- Triangle image: `public/images/93NVWJJQujdEcPewVpg3Xp7ip4.webp` (239x239) - positioned at corners
- These are absolutely positioned with some rotation/transform

## Assets
- Hero background: `public/images/pSSINVOSMIf4PhqxNRckBByjw.webp` (1496x895)
- Cube: `public/images/wX62SMRMN1v1X6SFoJaoNdwo.webp`
- Triangle: `public/images/93NVWJJQujdEcPewVpg3Xp7ip4.webp`
- Video (3D animation): `public/videos/25vAAVNHXPB5rX5qv52YL576GE.webm`

## Responsive
- Desktop: 135px font, full-width background
- Mobile: reduced font size, stacked layout
