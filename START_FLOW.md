# Start Wizard Flow Mapping

**URL:** `/start`

## Phase 1: Onboarding & Consent
1.  **Welcome Screen:**
    - Title: "شناخت الگوی تمرکز"
    - Body: "این مسیر حدود ۵ تا ۱۰ دقیقه زمان می‌برد."
    - **Action:** Button "شروع مسیر"
2.  **Disclaimer Modal/Step:**
    - Checkbox: "می‌دانم که این یک ابزار غربالگری است و نه تشخیص پزشکی."
    - Checkbox: "قوانین حریم خصوصی را می‌پذیرم."
    - **Action:** Next (Disabled until checked).

## Phase 2: Configuration
3.  **Group Selection:**
    - Imagine cards: "برای خودم (بزرگسال)" | "برای فرزندم (والد)" | "دانش‌آموز/دانشجو"
    - *Selection sets the `questionnaireId` in the background.*
4.  **Goal Setup (Optional context):**
    - "چالش اصلی شما چیست؟" (تمرکز، فراموشی، بی‌قراری، ...)
    - *Stored as metadata for the report introduction.*

## Phase 3: The Assessment (Engine)
5.  **Instruction Screen:**
    - "به سوالات زیر بر اساس تجربه ۶ ماه گذشته پاسخ دهید."
6.  **Question Loop:**
    - Display Question Text (Large, readable typography).
    - Display Options (Likert Scale).
    - Auto-advance on selection (smooth transition).
    - "Previous" button allowed.
    - Progress Bar visible.

## Phase 4: Focus Test (Optional Integration)
7.  **Transition:** "بخش پرسشنامه تمام شد. حالا یک تست کوتاه واکنش‌سنجی داریم."
8.  **Focus Task (Go/No-Go):**
    - Runs client-side logic.
    - Result (Accuracy/Reaction Time) stored in `session`.

## Phase 5: Conclusion
9.  **Submit & Processing:**
    - Show "Analysing..." animation.
    - Call `POST /api/assessment-runs/:id/submit`.
10. **Redirect:**
    - Go to `/report/[id]`.
