import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg" aria-labelledby="auth-error-title">
      <h1 id="auth-error-title" className="text-2xl font-bold text-slate-900">We couldn’t verify that link</h1>
      <p className="mt-3 text-slate-600">The link may have expired, already been used, or the sign-in service may be temporarily unavailable. Request a fresh link and try again.</p>
      <Link href="/" className="mt-6 inline-flex rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800">Return to New Future Bank</Link>
    </section>
  </main>;
}
