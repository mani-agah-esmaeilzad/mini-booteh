import { Activity, Check, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { texts } from "@/lib/texts/fa";

const featureIcons = [Check, Activity, Sparkles, Shield];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="container grid gap-8 py-20 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit">
            {texts.landing.badge}
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
            {texts.landing.heroTitle}
          </h1>
          <p className="text-lg text-slate-600">{texts.landing.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/start"
              className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
            >
              {texts.landing.ctaPrimary}
            </Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">{texts.landing.stats.focusLabel}</dt>
              <dd className="text-4xl font-semibold text-primary">{texts.landing.stats.focusValue}</dd>
              <p className="text-sm text-muted-foreground">{texts.landing.stats.focusDescription}</p>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">{texts.landing.stats.reportLabel}</dt>
              <dd className="text-4xl font-semibold text-primary">{texts.landing.stats.reportValue}</dd>
              <p className="text-sm text-muted-foreground">{texts.landing.stats.reportDescription}</p>
            </div>
          </dl>
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>{texts.landing.reportPreview.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{texts.landing.reportPreview.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 rounded-xl border bg-slate-100 p-4 focus-sparkle">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{texts.landing.reportPreview.gaugeLabel}</span>
                <span className="font-medium text-primary">متوسط</span>
              </div>
              <div className="h-2 rounded-full bg-white/50">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {texts.landing.reportPreview.checklist.map((heading) => (
                <li key={heading} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{heading}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
      <section className="container grid gap-6 pb-20 md:grid-cols-2 lg:grid-cols-4">
        {texts.landing.features.map((feature, index) => {
          const Icon = featureIcons[index];
          return (
            <Card key={feature.title} className="h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{feature.description}</CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
