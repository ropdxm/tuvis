"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  cleanNationalPhoneInput,
  isValidPhoneForCountry,
  normalizePhoneNumber,
  phoneCountries,
  splitPhoneNumber,
} from "@/lib/contact";
import { t } from "@/lib/translations";

type Mode = "login" | "register";

function getAuthErrorMessage(code: string, language: "RU" | "KZ") {
  switch (code) {
    case "auth/email-already-in-use":
      return language === "RU" ? "Этот email уже используется." : "Бұл email әлдеқашан қолданылып жатыр.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return language === "RU" ? "Неверный email или пароль." : "Email немесе құпия сөз қате.";
    case "auth/popup-closed-by-user":
      return language === "RU" ? "Вход через Google был закрыт." : "Google арқылы кіру терезесі жабылды.";
    default:
      return language === "RU" ? "Не удалось выполнить вход. Попробуйте снова." : "Кіру мүмкін болмады. Қайта көріңіз.";
  }
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.4 14.5 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12Z" />
      <path fill="#34A853" d="M2.5 12c0 5.2 4.3 9.5 9.5 9.5 5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6Z" />
      <path fill="#FBBC05" d="M4.7 7.6 7.9 10c.9-1.8 2.3-3 4.1-3 1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.4 14.5 2.5 12 2.5c-3.7 0-6.9 2.1-8.5 5.1Z" />
      <path fill="#4285F4" d="M12 21.5c2.4 0 4.5-.8 6-2.3l-2.9-2.4c-.8.6-1.8 1.1-3.1 1.1-3.8 0-5.1-2.5-5.4-3.8l-3.1 2.4c1.5 3 4.7 5 8.5 5Z" />
    </svg>
  );
}

function AccountPageContent() {
  const { language } = useLanguage();
  const {
    user,
    profile,
    loading,
    profileLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    saveProfile,
    refreshUser,
    sendVerification,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("next") || "/menu", [searchParams]);
  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+7");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profilePhoneCountryCode, setProfilePhoneCountryCode] = useState("+7");
  const [profilePhoneNumber, setProfilePhoneNumber] = useState("");

  useEffect(() => {
    if (!user) return;
    const phone = splitPhoneNumber(profile?.phone);
    setProfileName(profile?.displayName || user.displayName || "");
    setProfilePhoneCountryCode(phone.countryCode);
    setProfilePhoneNumber(phone.nationalNumber);
  }, [profile, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password.trim() || (mode === "register" && (!displayName.trim() || !phoneNumber.trim()))) {
      setError(t("fillAllFields", language));
      return;
    }

    if (mode === "register" && password.trim().length < 6) {
      setError(t("passwordMin", language));
      return;
    }

    if (mode === "register" && !isValidPhoneForCountry(phoneNumber, phoneCountryCode)) {
      setError(t("invalidPhone", language));
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "register") {
        await register({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          phoneCountryCode,
          phoneNationalNumber: phoneNumber,
        });
        setInfo(t("verificationEmailSent", language));
      } else {
        await login({ email: email.trim(), password });
        router.push(redirectTo);
      }
    } catch (authError: any) {
      setError(getAuthErrorMessage(authError?.code ?? "", language));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setInfo("");
    setSubmitting(true);

    try {
      await loginWithGoogle();
      router.push(redirectTo);
    } catch (authError: any) {
      setError(getAuthErrorMessage(authError?.code ?? "", language));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const handleProfileSave = async () => {
    setError("");
    setInfo("");

    if (!profileName.trim() || !profilePhoneNumber.trim()) {
      setError(t("fillAllFields", language));
      return;
    }

    if (!isValidPhoneForCountry(profilePhoneNumber, profilePhoneCountryCode)) {
      setError(t("invalidPhone", language));
      return;
    }

    setSubmitting(true);

    try {
      await saveProfile({
        displayName: profileName.trim(),
        phone: normalizePhoneNumber(profilePhoneNumber, profilePhoneCountryCode),
      });
      setInfo(t("phoneSaved", language));
    } catch {
      setError(language === "RU" ? "Не удалось сохранить профиль." : "Профильді сақтау мүмкін болмады.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setInfo("");

    try {
      await sendVerification();
      setInfo(t("verificationEmailSent", language));
    } catch {
      setError(language === "RU" ? "Не удалось отправить письмо." : "Хатты жіберу мүмкін болмады.");
    }
  };

  const handleRefreshStatus = async () => {
    setError("");
    setInfo("");

    try {
      await refreshUser();
    } catch {
      setError(language === "RU" ? "Не удалось обновить статус." : "Күйді жаңарту мүмкін болмады.");
    }
  };

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-16 pb-10">
        <div className="pt-4 pb-4">
          <h1 className="font-display text-2xl font-bold text-surface-900">
            {t("account", language)}
          </h1>
          <p className="font-body text-sm text-surface-500 mt-1">
            {t("authSubtitle", language)}
          </p>
        </div>

        {loading || profileLoading ? (
          <div className="bg-white border border-surface-200 rounded-2xl p-6 animate-pulse">
            <div className="h-5 w-1/2 rounded bg-surface-100 mb-3" />
            <div className="h-10 rounded-xl bg-surface-100 mb-3" />
            <div className="h-10 rounded-xl bg-surface-100" />
          </div>
        ) : user ? (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white border border-surface-200 rounded-2xl p-5 space-y-4">
              <div>
                <p className="font-display text-lg font-semibold text-surface-900">{t("authWelcome", language)}</p>
                <p className="font-body text-sm text-surface-500 mt-1">
                  {t("signedInAs", language)} {user.email}
                </p>
              </div>

              <div className={`rounded-xl border px-4 py-3 ${user.emailVerified ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                <p className="font-display text-sm font-semibold">
                  {user.emailVerified ? t("emailVerified", language) : t("emailNotVerified", language)}
                </p>
                {!user.emailVerified && (
                  <p className="font-body text-xs mt-1">{t("verifyEmailNotice", language)}</p>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                    {t("fullName", language)}
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                    {t("yourPhone", language)}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={profilePhoneCountryCode}
                      onChange={(event) => {
                        setProfilePhoneCountryCode(event.target.value);
                        setProfilePhoneNumber("");
                      }}
                      className="w-28 px-2.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                    >
                      {phoneCountries.map((country) => (
                        <option key={`${country.label}-${country.code}`} value={country.code}>
                          {country.label} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="min-w-0 flex-1 flex overflow-hidden bg-surface-50 border border-surface-200 rounded-xl focus-within:border-surface-400 focus-within:ring-1 focus-within:ring-surface-300 transition-all">
                      <span className="flex items-center px-3 border-r border-surface-200 bg-white font-body text-sm font-semibold text-surface-700 select-none">
                        {profilePhoneCountryCode}
                      </span>
                      <input
                        type="tel"
                        value={profilePhoneNumber}
                        onChange={(event) => setProfilePhoneNumber(cleanNationalPhoneInput(event.target.value, profilePhoneCountryCode))}
                        placeholder={t("phonePlaceholder", language)}
                        className="min-w-0 flex-1 px-3.5 py-2.5 bg-transparent font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-body text-sm rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              {info && (
                <div className="bg-green-50 border border-green-200 text-green-700 font-body text-sm rounded-xl px-4 py-2.5">
                  {info}
                </div>
              )}

              <div className="grid gap-2">
                <button
                  onClick={handleProfileSave}
                  disabled={submitting}
                  className="w-full py-3 bg-surface-900 hover:bg-surface-800 disabled:bg-surface-300 text-white text-center font-display text-sm font-semibold rounded-xl transition-all"
                >
                  {t("saveProfile", language)}
                </button>
                {!user.emailVerified && (
                  <>
                    <button
                      onClick={handleResendVerification}
                      disabled={submitting}
                      className="w-full py-3 bg-white border border-surface-200 text-surface-700 text-center font-display text-sm font-semibold rounded-xl transition-all hover:border-surface-400"
                    >
                      {t("resendVerification", language)}
                    </button>
                    <button
                      onClick={handleRefreshStatus}
                      disabled={submitting}
                      className="w-full py-3 bg-white border border-surface-200 text-surface-700 text-center font-display text-sm font-semibold rounded-xl transition-all hover:border-surface-400"
                    >
                      {t("refreshStatus", language)}
                    </button>
                  </>
                )}
                <Link
                  href={redirectTo}
                  className="w-full py-3 bg-white border border-surface-200 text-surface-700 text-center font-display text-sm font-semibold rounded-xl transition-all hover:border-surface-400"
                >
                  {redirectTo === "/payment" ? t("checkout", language) : t("continueShopping", language)}
                </Link>
                <Link
                  href="/orders"
                  className="w-full py-3 bg-white border border-surface-200 text-surface-700 text-center font-display text-sm font-semibold rounded-xl transition-all hover:border-surface-400"
                >
                  {t("viewMyOrders", language)}
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full py-3 bg-white border border-red-200 text-red-600 font-display text-sm font-semibold rounded-xl transition-all hover:bg-red-50"
                >
                  {t("logout", language)}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 rounded-xl border font-display text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-600 border-surface-200"
                }`}
              >
                {t("signIn", language)}
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 rounded-xl border font-display text-sm font-semibold transition-all ${
                  mode === "register"
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-600 border-surface-200"
                }`}
              >
                {t("register", language)}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-surface-200 rounded-2xl p-5 space-y-3">
              {mode === "register" && (
                <>
                  <div>
                    <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                      {t("fullName", language)}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                      {t("yourPhone", language)}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountryCode}
                        onChange={(event) => {
                          setPhoneCountryCode(event.target.value);
                          setPhoneNumber("");
                        }}
                        className="w-28 px-2.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                      >
                        {phoneCountries.map((country) => (
                          <option key={`${country.label}-${country.code}`} value={country.code}>
                            {country.label} {country.code}
                          </option>
                        ))}
                      </select>
                      <div className="min-w-0 flex-1 flex overflow-hidden bg-surface-50 border border-surface-200 rounded-xl focus-within:border-surface-400 focus-within:ring-1 focus-within:ring-surface-300 transition-all">
                        <span className="flex items-center px-3 border-r border-surface-200 bg-white font-body text-sm font-semibold text-surface-700 select-none">
                          {phoneCountryCode}
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(event) => setPhoneNumber(cleanNationalPhoneInput(event.target.value, phoneCountryCode))}
                          placeholder={t("phonePlaceholder", language)}
                          className="min-w-0 flex-1 px-3.5 py-2.5 bg-transparent font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                  {t("yourEmail", language)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                />
              </div>

              <div>
                <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                  {t("password", language)}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-body text-sm rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              {info && (
                <div className="bg-green-50 border border-green-200 text-green-700 font-body text-sm rounded-xl px-4 py-2.5">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-surface-900 hover:bg-surface-800 disabled:bg-surface-300 text-white font-display text-sm font-semibold rounded-xl transition-all"
              >
                {mode === "login" ? t("signIn", language) : t("register", language)}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={submitting}
                className="w-full py-3 bg-white border border-surface-200 hover:border-surface-400 text-surface-800 font-display text-sm font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2"
              >
                <GoogleIcon />
                {t("signInWithGoogle", language)}
              </button>

              <p className="font-body text-xs text-surface-400 text-center">
                {mode === "login" ? t("noAccountYet", language) : t("alreadyHaveAccount", language)}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-surface-700 underline"
                >
                  {mode === "login" ? t("register", language) : t("signIn", language)}
                </button>
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-surface-50">
          <Header />
          <main className="max-w-md mx-auto px-4 pt-20">
            <div className="bg-white border border-surface-200 rounded-2xl p-6 animate-pulse">
              <div className="h-5 w-1/2 rounded bg-surface-100 mb-3" />
              <div className="h-10 rounded-xl bg-surface-100 mb-3" />
              <div className="h-10 rounded-xl bg-surface-100" />
            </div>
          </main>
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}
