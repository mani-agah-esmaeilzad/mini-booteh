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
    // Inattention (bi-tavajohi)
    { text: "چقدر پیش می‌آید که در انجام جزئیات دقیق یک پروژه اشتباهات کوچک ناشی از بی‌دقتی داشته باشی؟", subscale: "بی‌توجهی" },
    { text: "وقتی قرار است روی یک کار شنیداری یا متنی طولانی تمرکز کنی، چقدر سختت می‌شود؟", subscale: "بی‌توجهی" },
    { text: "آیا پیش می‌آید که وقتی کسی مستقیماً با تو صحبت می‌کند، ذهنت جای دیگری باشد؟", subscale: "بی‌توجهی" },
    { text: "چقدر اتفاق می‌افتد که کارها را نیمه‌کاره رها کنی (بدون اینکه مشکل از سختی کار باشد)؟", subscale: "بی‌توجهی" },
    { text: "ساماندهی کارها و فعالیت‌های زمان‌بندی‌شده چقدر برایت چالش‌برانگیز است؟", subscale: "بی‌توجهی" },
    { text: "چقدر از کارهایی که نیاز به تلاش ذهنی مداوم دارند (مثل گزارش‌نویسی طولانی) طفره می‌روی؟", subscale: "بی‌توجهی" },

    // Hyperactivity (bish-faali)
    { text: "چقدر پیش می‌آید در جلسات یا موقعیت‌هایی که باید نشسته باشی، تکان بخوری یا بی‌قرار باشی؟", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "آیا احساس می‌کنی موتوری در درون داری که مدام تو را به حرکت وامی‌دارد؟", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "چقدر پیش می‌آید وسط حرف دیگران بپری یا جمله‌شان را تمام کنی؟", subscale: "بیش‌فعالی/تکانشگری" },
    { text: "چقدر منتظر ماندن در صف یا نوبت برایت دشوار است؟", subscale: "بیش‌فعالی/تکانشگری" },
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
        description: "مجموع نمرات بی‌توجهی (۰ تا ۲۴).",
        calculation: {
          method: "sum",
          items: inattentionIds.map((id) => ({ questionId: id })),
          scale: { min: 0, max: 24 },
        },
        thresholds: [
          { label: "low", min: 0, max: 12 },
          { label: "moderate", min: 13, max: 18 },
          { label: "high", min: 19 },
        ],
      },
      {
        questionnaireId: questionnaire.id,
        name: "بیش‌فعالی/تکانشگری",
        description: "مجموع نمرات بیش‌فعالی (۰ تا ۱۶).",
        calculation: {
          method: "sum",
          items: hyperIds.map((id) => ({ questionId: id })),
          scale: { min: 0, max: 16 },
        },
        thresholds: [
          { label: "low", min: 0, max: 8 },
          { label: "moderate", min: 9, max: 12 },
          { label: "high", min: 13 },
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
