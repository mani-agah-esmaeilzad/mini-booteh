# QA Checklist: WiseWorld-Inspired Persian UI

## Visual & Design
- [ ] **Dark Mode Aesthetics**: Verify background is Deep Blue/Black (`#050A14`) and not plain black.
- [ ] **Typography**: Text should be legible Vazirmatn. Headings bold, body regular.
- [ ] **Glassmorphism**: Check overlay cards for backdrop-blur and subtle borders.
- [ ] **Primary Color**: Electric Violet should pop against the dark background.

## Responsive Design
- [ ] **Mobile Menu**: Open content on mobile (Hamburger icon). Verify sheet opens from right/left correctly (RTL).
- [ ] **Hero Stacking**: On mobile, text should be above visual. On desktop, side-by-side.
- [ ] **Grid Layouts**: Metrics, Features, and Pricing should switch from 1 column (mobile) to 2-4 columns (desktop).
- [ ] **Spacing**: Ensure no horizontal scroll on mobile (overflow-x-hidden on container).

## RTL & Localization
- [ ] **Direction**: `dir="rtl"` is set on `<html>`.
- [ ] **Text Alignment**: Most text should be `text-right` or `text-start`.
- [ ] **Icons**: Directional icons (ArrowLeft/Right) should point correctly for RTL (Back/Forward). Note: In RTL, logical 'next' is usually left, but sometimes icons need flipping.
- [ ] **Persian Content**: No Lorem Ipsum. All text is meaningful Persian placeholder.

## Functionality
- [ ] **Sticky Nav**: Section Navigator should stick to top on scroll.
- [ ] **Anchors**: Clicking "همراه هوشمند" should scroll to `#companion`.
- [ ] **Tabs/Accordions**: FAQ Accordion expands/collapses smoothly.
- [ ] **Charts**: Radar chart renders with animation.

## Accessibility
- [ ] **Contrast**: Check text contrast on dark backgrounds.
- [ ] **Focus States**: Tab navigation should show focus rings on buttons/links.
- [ ] **Semantic HTML**: Use `<main>`, `<section>`, `<header>`, `<footer>`, `<h1>`-`<h6>`.
