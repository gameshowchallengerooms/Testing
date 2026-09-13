# TeamBenefitsSection Specification

## Overview
- **Target file:** `src/components/TeamBenefitsSection.tsx`
- **Reference:** `https://mysteryrooms.in/corporate-events`
- **Interaction model:** Static content with hover and scroll-reveal motion
- **Placement:** Team-building page, after the promises/inclusions section and before the photo marquee

## Adaptation
The reference page's most useful idea is its “How will it benefit your team?” content and five visual benefit symbols. Rebuild that idea in the Game Show visual language rather than copying Mystery Rooms branding, assets, or escape-room wording.

## DOM Structure
- Dark full-width section
- Centered eyebrow and large headline
- Short supporting paragraph
- Five responsive benefit cards
- Each card contains an oversized two-digit number, Lucide icon, title, and one-line outcome
- A thin connecting line sits behind the cards on desktop to suggest a shared team journey

## Computed Reference Styles
- Reference page background: near-black (`rgb(0, 0, 0)`)
- Reference content width: approximately `1250px` at a 1920px viewport
- Reference accent heading: warm orange, approximately `#f3a24b`
- Reference body copy: white, approximately `16px`, compact line height
- Reference benefits: five equal visual items in one desktop row; circular white/orange icons

## Local Visual Styles
- Section background: `bg-gs-surface-black`
- Max width: `1200px`
- Vertical padding: `80px` mobile, `112px` desktop
- Headline: 40px mobile through 60px desktop, black weight, tight tracking, white
- Intro copy: 18–20px, white at 60–70% opacity
- Benefit card: deep near-black, 1px white/10 border, 24px radius, translucent gradient glow
- Icons: brand gradient tile; no downloaded reference assets
- Hover: card translates up 6px; border and glow strengthen over 300ms

## Text Content
- Eyebrow: “What Monday gets back”
- Headline: “More than a fun hour out.”
- Intro: “The laughs happen here. The better team dynamic follows you back to work.”
- Communication — “Fast rounds get everyone talking, listening and calling the play.”
- Collaboration — “Different strengths become the fastest route to the buzzer.”
- Creative thinking — “Unexpected challenges reward ideas nobody saw coming.”
- Friendly competition — “A scoreboard gives the room energy without office hierarchy.”
- Shared memories — “Your team leaves with stories that outlast another team lunch.”

## Responsive Behavior
- **Desktop (1024px+):** five equal columns with a connecting line behind them
- **Tablet (640–1023px):** two-column grid; fifth card spans naturally without forced width
- **Mobile (<640px):** single-column cards, compact horizontal icon/text layout

## Accessibility
- Semantic section labelled by its heading
- Benefit cards rendered as a list
- Decorative numbers and connector hidden from assistive technology
- Icons marked decorative

