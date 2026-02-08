-- AlterTable
ALTER TABLE "AppSetting" ALTER COLUMN "defaultLanguage" SET DEFAULT 'fa',
ALTER COLUMN "disclaimerText" SET DEFAULT 'این غربالگری جایگزین تشخیص تخصصی نیست و صرفاً برای آگاهی فردی ارائه می‌شود.';

-- AlterTable
ALTER TABLE "AssessmentSession" ALTER COLUMN "language" SET DEFAULT 'fa';
