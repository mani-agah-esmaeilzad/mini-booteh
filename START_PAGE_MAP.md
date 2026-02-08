# /start Page Refactoring Map

## Overview
The `/start` page has been completely transformed from a static grid layout into a 4-step interactive Wizard flow, inspired by WiseWorld's product onboarding.

## Modified Files
- **`src/app/(public)/start/page.tsx`**: Replaced entirely. Now acts as a server-side wrapper fetching settings and rendering the `StartWizard`.
- **`src/components/forms/start-assessment-form.tsx`**: Updated background style (`bg-white` -> `bg-card/50`) to blend better with the new wizard theme.

## New Components
- **`src/app/(public)/start/components/StartWizard.tsx`**: The core client component managing:
  - State: `step` (1-4), `goal`, `mode`, `duration`.
  - UI: Renders the active step with animated transitions.
  - Logic: Handles navigation (Next/Back) and validation.
- **`src/app/(public)/start/components/StepIndicator.tsx`**: A visual progress bar with circular step nodes and labels.

## Structure of the New Flow
1. **Step 1: Goal Selection (انتخاب هدف)**
   - 3 Cards: Leadership, Communication, Strategy.
2. **Step 2: Experience Mode (نوع تجربه)**
   - 2 Large Cards: Evaluation (Shield) vs Practice (Zap).
3. **Step 3: Depth & Duration (عمق و زمان)**
   - 3 List Items: Short, Standard, Challenge.
4. **Step 4: Confirmation & Start (شروع)**
   - Shows a summary of choices (Tags).
   - Renders the original `StartAssessmentForm` (Email + Consent) to trigger the actual server action.

## Key Features
- **RTL Native**: Layouts, text alignment, and icon positioning are optimized for Persian.
- **Micro-interactions**: Hover effects on cards, smooth step transitions, progress bar animation.
- **Responsive**: Adapts from 3 columns (desktop) to stacked (mobile).
