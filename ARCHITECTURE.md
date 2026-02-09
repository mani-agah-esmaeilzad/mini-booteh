# Architecture Documentation

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Radix Primitives)
- **Database:** PostgreSQL (via Prisma ORM)
- **State Management:** React Hook Form + URL State (for wizard)
- **Animations:** Framer Motion

## Database Schema (Prisma)
We leverage the existing schema with semantic usage for ADHD assessment:

- `Questionnaire`: Represents a specific test version (e.g., "ADHD Adult V1").
- `Question`: Individual items (Likert scale 1-5).
  - `subscale`: Logic mapping (e.g., "Inattention", "Hyperactivity").
- `ScoringRule`: JSON based rules for calculating results.
- `AssessmentSession`: A user's attempt. Stores `answers` and calculated `riskBand`.
- `PromptTemplate`: For generating the narrative report.

## API Routes
Designed for security and clean separation:

- `GET /api/assessments`: Fetch available active tests.
- `POST /api/assessment-runs`: Initialize a new session (Start Wizard).
- `PATCH /api/assessment-runs/:id`: Update answers (Auto-save).
- `POST /api/assessment-runs/:id/submit`: Finalize and calculate score.
- `GET /api/reports/:id`: Retrieve the final report (protected by token/session).

## Assessment Engine Logic
Located in `src/lib/engine`:

1.  **Score Computation:**
    - Inputs: `responses`, `scoring_rules`.
    - Process: Sum/Average per subscale.
    - Output: Raw scores + Percentiles (if data available).

2.  **Interpretation:**
    - Maps Raw Scores -> Risk Bands (Low, Moderate, High).
    - *Disclaimer strategy:* All outputs are labeled "Screening Result" not "Diagnosis".

## Frontend Architecture
- **`/start` (Wizard):**
    - Step 1: Agreements (Privacy/Disclaimer).
    - Step 2: Demographics (Age Group) - *affects test selection*.
    - Step 3: Assessment Runner (Question by Question or List view).
    - Step 4: Focus Test (Optional implementation of Reaction Time).
    - Step 5: Submission.
- **`/report/[id]`:**
    - Server Component for fetching data.
    - Client Component for interactive charts.

## Security & Privacy
- **Data Minimization:** No PII required for core flow. Email optional.
- **Session:** `HttpOnly` cookies for managing anonymous session IDs.
- **Rate Limiting:** On `POST` endpoints.
