"use client";

import { Button } from "@/components/ui/button";

const defaultLabels = [
  { value: 0, label: "هیچ‌وقت" },
  { value: 1, label: "به‌ندرت" },
  { value: 2, label: "گاهی" },
  { value: 3, label: "معمولاً" },
  { value: 4, label: "تقریباً همیشه" },
];

type LikertProps = {
  value: number | null;
  onChange: (value: number) => void;
  labels?: { value: number; label: string }[];
};

export function LikertScale({ value, onChange, labels = defaultLabels }: LikertProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "outline"}
          onClick={() => onChange(option.value)}
          className="flex-1 min-w-[120px]"
        >
          <span className="text-sm font-medium">{option.label}</span>
        </Button>
      ))}
    </div>
  );
}
