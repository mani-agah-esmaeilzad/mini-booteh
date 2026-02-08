# UI Blueprint: Modern Persian SaaS Architecture

## Vision
A premium, dark-mode-first aesthetic (with light mode support) inspired by WiseWorld.ai but tailored for Persian users. Key characteristics:
- **Atmosphere**: Deep, cosmic backgrounds (Midnight Blue/Black) with vibrant gradients.
- **Typography**: Clean, readable Vazirmatn with a robust scale.
- **Components**: Glassmorphism cards, subtle borders, glowing interactions.
- **Layout**: RTL-native, spacious, bento-grid inspired sections.

## Design Tokens

### Colors (HSL)
**Dark Mode (Default/Primary Feel)**
- **Background**: `224 71% 4%` (Deepest Navy/Black)
- **Foreground**: `210 40% 98%` (Crisp White)
- **Card**: `222 47% 11%` (Dark Blue-Grey) // With glass effect opacity
- **Primary**: `250 95% 64%` (Electric Violet)
- **Secondary**: `217 33% 17%` (Muted Blue-Grey)
- **Accent**: `170 85% 45%` (Vibrant Mint/Teal)
- **Muted**: `215 16% 47%` (Grey text)

### Typography (Vazirmatn)
- **H1 (Hero)**: `text-5xl md:text-7xl font-bold tracking-tight`
- **H2 (Section)**: `text-3xl md:text-5xl font-semibold`
- **H3 (Card)**: `text-xl md:text-2xl font-medium`
- **Body**: `text-base md:text-lg text-muted-foreground`
- **Caption**: `text-sm text-muted-foreground/80`

### Spacing & Layout
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-20 md:py-32`
- **Grid Gap**: `gap-6 md:gap-8`

## Component Map

### 1. Layout Components
- `Header`: Sticky, glass effect, responsive mobile menu (Sheet).
- `Footer`: Clean grid layout with copyright and social links.
- `Section`: Wrapper with `id` for navigation and standard padding.

### 2. UI Elements
- `Button`:
  - `default`: Solid Primary, glow effect on hover.
  - `outline`: Border with hover fill.
  - `ghost`: Text only, hover background.
- `Card`:
  - `glass`: Backdrop blur, thin border `border-white/10`.
  - `solid`: Solid background for contrast.
- `Badge`: Pill shape, subtle background + strong text color.

### 3. Landing Sections (Page Structure)
1. **Hero**: Headline + Subhead + 2 CTAs + Illustration.
2. **Metrics**: Simple grid of 3-4 stats with icons.
3. **SocialProof**: "Trusted by" text + marquee/grid of logos.
4. **GapAnalysis**: Text + Graphic showing "Why now?".
5. **SectionNav**: Sticky secondary nav for features.
6. **FeatureSplit**: "Meet [Product Name]" - Two columns (Analysis vs Experience).
7. **Roadmap**: Horizontal stepper or vertical timeline.
8. **Episodes**: Grid of interactive scenario cards.
9. **Analytics**: Radar/Spider chart visualization.
10. **CaseStudy**: KPI cards with "Before/After" implication.
11. **Workspace**: 3-column pricing/persona selector.
12. **Hiring**: Feature list for HR/Recruitment use case.
13. **FAQ**: Simple accordion.
14. **CTA**: Final large banner.

## Tech Stack
- **Framework**: Next.js App Router
- **Styling**: Tailwind CSS + `tailwindcss-animate`
- **Icons**: Lucide React
- **Motion**: CSS Transitions + Tailwind Animate (Keep it light as requested)

