import type { PromptTemplate } from "@prisma/client";

import { TotalsPayload } from "@/lib/scoring";

type NarrativeVariables = {
  user_language: string;
  risk_band?: string;
  subscales_json: TotalsPayload["subscales"];
  focus_metrics_json?: Record<string, unknown>;
  disclaimer_text: string;
};

type AvalAiResponse = {
  content: string;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const baseUrl = process.env.AVALAI_BASE_URL ?? "https://api.avalai.ir/v1";
const apiKey = process.env.AVALAI_API_KEY;
const model = process.env.AVALAI_MODEL ?? "gpt-4o-mini";
const timeoutMs = Number.parseInt(process.env.AVALAI_TIMEOUT_MS ?? "60000", 10);

function ensureEnv(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function validateBaseUrl(url: string) {
  if (url.includes("your-avalai-gateway.com")) {
    throw new Error(
      "آدرس AVALAI_BASE_URL هنوز مقداردهی واقعی نشده است. لطفاً دامنه AvalAI خود را در فایل env قرار بده.",
    );
  }
  return url;
}

function renderTemplate(
  template: string,
  variables: NarrativeVariables,
): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key: keyof NarrativeVariables) => {
    const normalizedKey = key as keyof NarrativeVariables;
    const value = variables[normalizedKey];
    if (value === undefined || value === null) {
      return "";
    }
    if (typeof value === "string") {
      return value;
    }
    return JSON.stringify(value, null, 2);
  });
}

async function callAvalAi(payload: unknown): Promise<AvalAiResponse> {
  const url = validateBaseUrl(ensureEnv(baseUrl, "AVALAI_BASE_URL"));
  const key = ensureEnv(apiKey, "AVALAI_API_KEY");
  const controller = new AbortController();
  const safeTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 60_000;
  const timeout = setTimeout(() => controller.abort(), safeTimeoutMs);
  try {
    const response = await fetch(`${url}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AvalAI error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    const choice = data.choices?.[0]?.message?.content ?? "";
    return {
      content: choice,
      model: data.model,
      usage: data.usage,
    };
  } catch (error) {
    console.error("AvalAI fetch error", error);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `زمان پاسخ AvalAI بیشتر از حد مجاز بود (timeout=${safeTimeoutMs}ms). مقدار AVALAI_TIMEOUT_MS را افزایش بده یا بعداً دوباره تلاش کن.`,
      );
    }
    throw new Error(
      "ارتباط با AvalAI برقرار نشد. تنظیمات AVALAI_BASE_URL و AVALAI_API_KEY را بررسی کن یا بعداً دوباره تلاش کن.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function chatWithAvalAi({
  messages,
  systemPrompt,
  temperature = 0.4,
  modelOverride,
}: {
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  modelOverride?: string;
}): Promise<AvalAiResponse> {
  const payloadMessages = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;
  const payload = {
    model: modelOverride ?? model,
    temperature,
    messages: payloadMessages,
  };
  return callAvalAi(payload);
}

export async function generateReportNarrative({
  promptTemplate,
  totals,
  focusMetrics,
  disclaimer,
  language,
  riskBand,
}: {
  promptTemplate: PromptTemplate;
  totals: TotalsPayload;
  focusMetrics?: Record<string, unknown>;
  disclaimer: string;
  language: string;
  riskBand?: string;
}): Promise<AvalAiResponse> {
  const variables: NarrativeVariables = {
    user_language: language,
    risk_band: riskBand,
    subscales_json: totals.subscales,
    focus_metrics_json: focusMetrics,
    disclaimer_text: disclaimer,
  };
  const userPrompt = renderTemplate(promptTemplate.userTemplate, variables);

  const payload = {
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: promptTemplate.systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await callAvalAi(payload);
    } catch (error) {
      if (attempt === 1) {
        console.error("AvalAI failure", error);
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("Unable to reach AvalAI");
}
