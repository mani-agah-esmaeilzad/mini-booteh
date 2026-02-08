import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, QuestionType } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL ?? "admin@focus.local";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD ?? "FocusAdmin!2025";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  const questionnaire =
    (await prisma.questionnaire.findFirst({
      where: { title: "پرسشنامه اصلی توجه" },
    })) ??
    (await prisma.questionnaire.create({
      data: {
        title: "پرسشنامه اصلی توجه",
        description: "گویه‌های کوتاه برای بررسی دو خرده‌مقیاس بی‌توجهی و بیش‌فعالی/تکانشگری.",
        isPublished: true,
      },
    }));
  await prisma.questionnaire.update({
    where: { id: questionnaire.id },
    data: { isPublished: true },
  });

  const questionSeeds = [
    { text: "اگر مراحل کار را ننویسم، بخشی از دستورالعمل را گم می‌کنم.", subscale: "بی‌توجهی" },
    { text: "قبل از تمام کردن کار فعلی، سراغ کار جدید می‌روم.", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "وسایل روزمره مثل کلید یا کارت بانکی را گم می‌کنم.", subscale: "بی‌توجهی" },
    { text: "در صحبت دیگران می‌پرم یا جمله‌شان را کامل می‌کنم.", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "کارهایی که نیاز به تمرکز طولانی دارند را عقب می‌اندازم.", subscale: "بی‌توجهی" },
    { text: "در فعالیت‌های آرام حس بی‌قراری درونی دارم.", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "در مکالمات طولانی حواسم پرت یا خیال‌پردازی می‌کنم.", subscale: "بی‌توجهی" },
    { text: "بلندتر یا سریع‌تر از حد انتظار صحبت می‌کنم.", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "برای انجام تعهدات به یادآور بیرونی نیاز دارم.", subscale: "بی‌توجهی" },
    { text: "زیر فشار زمان واکنش‌های تکانشی نشان می‌دهم.", subscale: "بیش‌فعالی/تکانشگری" },
  ];

  await prisma.question.deleteMany({ where: { questionnaireId: questionnaire.id } });
  const createdQuestions = await Promise.all(
    questionSeeds.map((seed, index) =>
      prisma.question.create({
        data: {
          questionnaireId: questionnaire.id,
          text: seed.text,
          subscale: seed.subscale,
          reverse: false,
          type: QuestionType.LIKERT,
          order: index,
        },
      }),
    ),
  );

  await prisma.scoringRule.deleteMany({ where: { questionnaireId: questionnaire.id } });
  const inattentionIds = createdQuestions.filter((q) => q.subscale === "بی‌توجهی").map((q) => q.id);
  const hyperIds = createdQuestions.filter((q) => q.subscale?.startsWith("بیش")).map((q) => q.id);

  await prisma.scoringRule.createMany({
    data: [
      {
        questionnaireId: questionnaire.id,
        name: "بی‌توجهی",
        description: "میانگین گویه‌های بی‌توجهی (۰ تا ۴).",
        calculation: {
          method: "average",
          items: inattentionIds.map((id) => ({ questionId: id })),
          scale: { min: 0, max: 4 },
        },
        thresholds: [
          { label: "کم", min: 0, max: 1.5 },
          { label: "متوسط", min: 1.5, max: 2.5 },
          { label: "زیاد", min: 2.5 },
        ],
      },
      {
        questionnaireId: questionnaire.id,
        name: "بیش‌فعالی/تکانشگری",
        description: "میانگین گویه‌های مربوط به بی‌قراری و واکنش سریع.",
        calculation: {
          method: "average",
          items: hyperIds.map((id) => ({ questionId: id })),
          scale: { min: 0, max: 4 },
        },
        thresholds: [
          { label: "کم", min: 0, max: 1.5 },
          { label: "متوسط", min: 1.5, max: 2.5 },
          { label: "زیاد", min: 2.5 },
        ],
      },
    ],
  });

  await prisma.appSetting.upsert({
    where: { id: "app-setting" },
    update: {},
    create: {
      allowUserEmail: true,
      focusTestOptional: true,
      defaultLanguage: "fa",
      disclaimerText:
        "این ابزار جایگزین ارزیابی تخصصی نیست و صرفاً برای آگاهی فردی استفاده می‌شود.",
      enableShareLinks: true,
    },
  });

  await prisma.focusTestSetting.upsert({
    where: { id: "focus-default" },
    update: {},
    create: {
      durationSeconds: 120,
      symbolFrequencyMs: 900,
      targetRatio: 0.35,
      targetSymbol: "X",
      nonTargetSymbol: "O",
    },
  });

  await prisma.promptTemplate.upsert({
    where: { name_version: { name: "default-report", version: 1 } },
    update: { isActive: true },
    create: {
      name: "default-report",
      version: 1,
      systemPrompt:
        "تو یک متخصص سلامت روان هستی که به فارسی می‌نویسد. لحن همدلانه و غیرتشخیصی داشته باش و یادآوری کن که این گزارش جای تشخیص را نمی‌گیرد.",
      userTemplate: `لطفاً گزارشی فارسی و ساختاریافته با بخش‌های «نمای کلی»، «نقاط قوت»، «چالش‌ها»، «پیشنهادهای کاربردی»، «چه زمانی به متخصص ارجاع داده شود» و «سلب مسئولیت» بنویس.
بازه ریسک: {{risk_band}}
خرده‌مقیاس‌ها: {{subscales_json}}
شاخص‌های تمرکز: {{focus_metrics_json}}
متن سلب مسئولیت: {{disclaimer_text}}`,
      isActive: true,
    },
  });

  console.log(`Seeded admin ${adminEmail} (password: ${adminPassword})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
