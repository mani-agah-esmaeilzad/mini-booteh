import path from "node:path";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import type { FocusMetrics } from "@/lib/focus";
import { toPersianDigits } from "@/lib/i18n/format";
import type { TotalsPayload } from "@/lib/scoring";
import { texts } from "@/lib/texts/fa";

const regularFont = path.resolve(process.cwd(), "public/fonts/Vazirmatn-Regular.ttf");
const boldFont = path.resolve(process.cwd(), "public/fonts/Vazirmatn-Bold.ttf");

Font.register({
  family: "Vazirmatn",
  fonts: [
    { src: regularFont },
    {
      src: boldFont,
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Vazirmatn",
    fontSize: 12,
    color: "#0f172a",
    backgroundColor: "#ffffff",
    textAlign: "right",
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
  },
  paragraph: {
    lineHeight: 1.4,
    marginBottom: 4,
  },
  listItem: {
    marginBottom: 2,
    paddingLeft: 8,
  },
});

type PdfPayload = {
  narrative: string;
  totals: TotalsPayload;
  focusMetrics?: FocusMetrics;
  disclaimer: string;
  riskBand?: string;
};

function formatNumber(value: number | string) {
  return toPersianDigits(
    typeof value === "number" ? Number(value).toString() : value,
  );
}

export async function generateReportPdf(payload: PdfPayload) {
  const doc = (
    <Document title={`${texts.brand} | گزارش تمرکز`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>گزارش ترکیبی تمرکز و خودگزارش ADHD</Text>
          {payload.riskBand ? (
            <Text style={styles.paragraph}>بازه ریسک کلی: {payload.riskBand}</Text>
          ) : (
            <Text style={styles.paragraph}>{texts.report.pendingRisk}</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>{texts.report.questionnaireCard}</Text>
          {payload.totals.subscales.map((subscale) => (
            <View key={subscale.id} style={styles.listItem}>
              <Text>
                {subscale.name} · {formatNumber(subscale.rawScore)} (
                {formatNumber(subscale.normalizedScore.toFixed(1))}٪)
              </Text>
            </View>
          ))}
        </View>
        {payload.focusMetrics ? (
          <View style={styles.section}>
            <Text style={styles.subheading}>{texts.report.focusCard}</Text>
            <Text style={styles.listItem}>
              دقت: {formatNumber(payload.focusMetrics.accuracy)}٪
            </Text>
            <Text style={styles.listItem}>
              میانگین واکنش: {formatNumber(payload.focusMetrics.reactionAvgMs)} میلی‌ثانیه
            </Text>
            <Text style={styles.listItem}>
              نوسان واکنش: {formatNumber(payload.focusMetrics.reactionStdMs)} میلی‌ثانیه
            </Text>
            <Text style={styles.listItem}>
              خطای انجام: {formatNumber(payload.focusMetrics.commissionErrors ?? 0)}
            </Text>
            <Text style={styles.listItem}>
              خطای حذف: {formatNumber(payload.focusMetrics.omissionErrors ?? 0)}
            </Text>
          </View>
        ) : null}
        <View style={styles.section}>
          <Text style={styles.subheading}>{texts.report.narrativeCard}</Text>
          {payload.narrative.split("\n").map((line, index) => (
            <Text key={index} style={styles.paragraph}>
              {line}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading}>{texts.report.disclaimerTitle}</Text>
          <Text style={styles.paragraph}>{payload.disclaimer}</Text>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
