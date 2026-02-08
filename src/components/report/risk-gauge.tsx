import { texts } from "@/lib/texts/fa";
import { toPersianDigits } from "@/lib/i18n/format";

type Props = {
  score: number;
  label?: string;
};

export function RiskGauge({ score, label }: Props) {
  const normalized = Math.min(100, Math.max(0, score));
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative h-32 w-32 rounded-full border-4 border-muted bg-gradient-to-br from-primary/20 to-primary/40 shadow-inner"
        style={{ background: `conic-gradient(var(--primary) ${normalized}%, #e2e8f0 ${normalized}%)` }}
      >
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="text-2xl font-semibold">{toPersianDigits(Math.round(normalized))}</span>
          <span className="text-xs tracking-wide text-muted-foreground">
            {texts.report.percentLabel}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label ?? texts.report.pendingRisk}</p>
    </div>
  );
}
