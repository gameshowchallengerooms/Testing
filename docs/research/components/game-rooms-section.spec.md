# GameRoomsSection Specification

## Overview
- **Target file:** `src/components/GameRoomsSection.tsx`
- **Interaction model:** click-driven carousel with prev/next buttons

## Structure
- Section label "Game Rooms" with dash line
- Large heading
- Horizontal carousel of 9 game cards
- Prev/Next buttons
- "Game Rooms" + "See All" footer link

## Container
- background: rgb(84, 84, 84) - gray
- padding: 100px 40px
- width: 100%
- display: flex
- flexDirection: column
- overflow: hidden

## Section Label
- Text: "Game Rooms"
- Font: Inter, ~16px, white
- Dash line before text

## Heading (H2)
- Text: "High-tech active game zones for 2-5 players."
- Font: Inter Display, 60px, weight 500
- Color: white
- Line-height: 72px
- Letter-spacing: -2.4px

## Game Cards (9 total)
Each card:
- Width: 380px
- Height: ~557px
- borderRadius: 0px (or small)
- Dark background with game room image and title overlay at bottom

### Cards data:
1. Matrix - "Every Step Matters" - image: oHin3lbqO7tteZ1HgFuQLu0V2fs.png
2. Mission Impossible - "Dodge. Crawl. Survive" - image: Q38ypNMBsBVK6qjiF6kKfrobM24.png
3. Times Square - "Bright Lights. Fast Moves." - image: hwfGboafSiaVSNxgHI3RAzUZw.png
4. Jordan's Dunk - "Precision wins the battle" - image: tN8WgMuSZBg5gEA7bH6lhdoVKbs.png
5. Texas Hexas - "Aim Fast. Shoot Faster." - image: oIkjl5UzpBOIq5IYexjvpzeqQDI.png
6. Squid Games - "Now you see me, now you don't" - image: vt5i1qX2nps9VOvw3U6x7sbEFw.png
7. UFO - "Only Fast Minds Survive" - image: AVLnSCMId620Xj6gKFiZrOe4G0.png
8. Octopus - "Too Many Arms to Handle" - image: 2534QApTtXFvKYQrEbU80KtEc.png
9. Himalayan Peaks - "Survive the Climb" - image: WYwksWcgznbX1VSN7tG09p5PM.png

### Card title
- Font: Inter Display or Inter, ~24px, weight 600, white
- Positioned at bottom of card over dark gradient overlay

### Card tagline
- Smaller text below title, lighter color

## Carousel Controls
- Previous/Next buttons (arrow icons)
- Positioned at edges of carousel

## Footer
- "Game Rooms" text left, "See All" link right
- "See All" links to ./games

## Responsive
- Desktop: horizontal carousel, 380px cards
- Mobile: smaller cards, possible horizontal scroll
