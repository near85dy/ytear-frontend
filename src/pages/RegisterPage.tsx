import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../lib/http";
import { useAuth } from "../auth/AuthProvider";
import { t } from "../i18n/t";

const PASSWORD_MIN_LENGTH = 8;

function getPasswordChecks(password: string) {
  return [
    {
      key: "length",
      label: t.auth.passwordMinLength,
      passed: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      key: "digit",
      label: t.auth.passwordNeedDigit,
      passed: /\d/.test(password),
    },
    {
      key: "symbol",
      label: t.auth.passwordNeedSymbol,
      passed: /[^\p{L}\p{N}\s]/u.test(password),
    },
  ];
}

export function RegisterPage() {
  const auth = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordChecks = getPasswordChecks(password);
  const passwordError =
    passwordChecks.find((check) => !check.passed)?.label ?? null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);
    try {
      await auth.register({ email, username, password });
      nav("/feed");
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError(t.common.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-semibold">{t.auth.registerTitle}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {t.auth.registerSubtitle}
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block">
          <div className="mb-1 text-sm font-medium">{t.auth.email}</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-100"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">{t.auth.username}</div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-100"
            autoComplete="username"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">{t.auth.password}</div>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            type="password"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-100"
            autoComplete="new-password"
          />
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t.auth.passwordHint}
          </div>
          <ul className="mt-2 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {passwordChecks.map((check) => (
              <li
                key={check.key}
                className={
                  check.passed ? "text-emerald-600 dark:text-emerald-400" : ""
                }
              >
                • {check.label}
              </li>
            ))}
          </ul>
        </label>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <button
          disabled={isSubmitting || Boolean(passwordError)}
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isSubmitting ? t.auth.creating : t.auth.createAccount}
        </button>

        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          {t.auth.haveAccount}{" "}
          <Link
            to="/login"
            className="text-zinc-900 underline dark:text-zinc-100"
          >
            {t.auth.login}
          </Link>
        </div>
      </form>
    </div>
  );
}
