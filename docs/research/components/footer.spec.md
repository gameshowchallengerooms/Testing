# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Interaction model:** static

## Structure
- "Social" label centered
- 3 social icons (Facebook, Instagram, X/Twitter)
- "Terms and Conditions" link
- Copyright text

## Container (footer)
- background: rgb(0, 0, 0)
- padding: 84px 0px 26px
- text-align: center
- width: 100%

## Social Label
- Text: "Social"
- Font: Inter, ~14px, white

## Social Icons
- Facebook, Instagram, X (Twitter)
- White SVG icons, ~24px
- Horizontal row with gap
- Links:
  - Facebook: https://www.facebook.com
  - Instagram: https://www.instagram.com/gamestorii/
  - X: https://x.com/
- SVG files: 6tTbkXggWgQCAJ4DO2QEdXXmgM.svg, 11KSGbIZoRSg4pjdnUoif6MKHI.svg

## Terms Link
- Text: "Terms and Conditions"
- Links to: ./terms-and-conditions
- Font: Inter, ~14px, white

## Copyright
- Text: "All copyrights @gamestorii"
- Font: Inter, ~12px, muted gray

## Responsive
- Always centered, stacks vertically
