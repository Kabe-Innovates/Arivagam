import { signIn } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            L
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Learner
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Access your academic portal and institutional services.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("saveetha-sso", { redirectTo: "/dashboard/schedule" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign in with Saveetha SSO
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Secure authentication via institutional SSO
        </p>
      </div>
    </div>
  );
}
