"use server";

import { signIn } from "@/auth";

export async function adminLoginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const email = (() => {
    const value = formData.get("email");
    return typeof value === "string" ? value.trim().toLowerCase() : value;
  })();
  const password = formData.get("password");
  if (!email || !password) {
    return { error: "وارد کردن ایمیل و رمز عبور الزامی است." };
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
    return { success: true };
  } catch {
    return { error: "نام کاربری یا رمز عبور نادرست است." };
  }
}
