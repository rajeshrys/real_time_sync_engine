import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  Lock,
  Share2,
  Trash2,
  Users,
  Sparkles,
  Zap,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

const HomePage = () => {
  const { user } = useAuth();
  const signedIn = Boolean(user);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="h-4 w-4" />
            </div>
            <span>CollabDocs</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-400">
            <a href="#features" className="transition hover:text-slate-900 dark:hover:text-slate-100">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-slate-900 dark:hover:text-slate-100">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {signedIn ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-500 hover:shadow-md"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-500 hover:shadow-md"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 sm:pt-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 -z-10 h-72 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />

        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50/80 px-3.5 py-1 text-xs font-medium text-blue-600 backdrop-blur-sm dark:bg-blue-950/40 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-gen Real-Time Document Synchronization</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1]">
            Write together, in the same document,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              at the same time.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
            CollabDocs gives your team one focused space to create, edit, and share
            documents. Experience instant live sync without conflict.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={signedIn ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/35 active:scale-95"
            >
              <span>{signedIn ? "Open dashboard" : "Start writing for free"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {!signedIn && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign in to existing account
              </Link>
            )}
          </div>
        </div>

        {/* Product preview */}
        <ProductPreview />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Zap className="h-4 w-4" />
              <span>Features</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to collaborate without friction
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
              A distraction-free minimalist workspace designed for speed, clarity, and team alignment.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            <Feature
              icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              title="Live collaborative editing"
              description="See other contributors and watch edits sync instantly across web sockets as keystrokes happen."
            />
            <Feature
              icon={<FolderOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
              title="Organized workspace library"
              description="Keep personal notes, shared project docs, and recently opened files accessible in an instant."
            />
            <Feature
              icon={<Share2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />}
              title="Team Connections"
              description="Search for colleagues, send connection requests, and build an integrated network inside your workspace."
            />
            <Feature
              icon={<Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              title="Secure JWT authentication"
              description="Token-based session management keeps your documents private and protected."
            />
            <Feature
              icon={<Trash2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
              title="Safe recovery & trash bin"
              description="Restore accidentally deleted work anytime, or permanently remove files when ready."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Up and running in minutes
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
            No complex setup or training required. Jump straight into writing.
          </p>

          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            <Step
              number={1}
              title="Create an account"
              description="Sign up with your email in seconds to access your private workspace."
            />
            <Step
              number={2}
              title="Start a document"
              description="Create a blank canvas and format your thoughts with our rich markdown-friendly editor."
            />
            <Step
              number={3}
              title="Invite & sync live"
              description="Connect with teammates and watch documents sync in real-time."
            />
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-tr from-white to-blue-50/50 p-8 sm:p-12 md:flex md:items-center md:justify-between dark:border-slate-800 dark:from-slate-900 dark:to-blue-950/20">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Elevate your team&apos;s writing workflow
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Create a free account today and experience real-time sync with effortless simplicity.
            </p>
          </div>

          <Link
            to={signedIn ? "/dashboard" : "/register"}
            className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-500 md:mt-0"
          >
            <span>{signedIn ? "Open dashboard" : "Get started free"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-slate-500 sm:flex-row dark:text-slate-400">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="h-4 w-4 text-blue-600" />
            CollabDocs
          </span>
          <span>&copy; {new Date().getFullYear()} CollabDocs. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

/* Mini Product preview */
const ProductPreview = () => (
  <div
    className="mt-14 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/90 dark:bg-slate-900/95 dark:shadow-black/60"
    aria-hidden="true"
  >
    {/* Window Header */}
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-rose-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
      </div>
      <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
        CollabDocs — Q4 Launch Strategy
      </div>
      <div className="w-12" />
    </div>

    <div className="flex">
      {/* Mini sidebar */}
      <div className="hidden w-56 shrink-0 border-r border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-600 md:block dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>CollabDocs</span>
        </div>
        <div className="mt-4 rounded-lg bg-blue-50 px-2.5 py-1.5 font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          My documents
        </div>
        <div className="mt-1 rounded-lg px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          Shared with me
        </div>
        <div className="mt-1 rounded-lg px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          Trash
        </div>
        <div className="mt-5 text-[10px] uppercase tracking-wider text-slate-400">Recents</div>
        <div className="mt-1 truncate rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200">
          Q4 Launch Strategy
        </div>
        <div className="truncate rounded-lg px-2.5 py-1 text-slate-500">
          Engineering Architecture
        </div>
      </div>

      {/* Mini document body */}
      <div className="min-w-0 flex-1 p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Q4 Launch Strategy & Engine Specs
          </h3>

          <div className="flex shrink-0 -space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white dark:border-slate-900">
              PR
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-bold text-white dark:border-slate-900">
              AK
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white dark:border-slate-900">
              You
            </span>
          </div>
        </div>

        <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The real-time synchronization engine is now ready for production testing.{" "}
            <span className="relative bg-blue-100/80 px-1 py-0.5 rounded text-blue-900 dark:bg-blue-950/80 dark:text-blue-200">
              WebSocket channels support concurrent edits
              <span className="pointer-events-none absolute -right-1 top-0 h-full">
                <span className="block h-full w-0.5 animate-pulse bg-blue-600" />
                <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-medium text-white shadow-xs">
                  Priya
                </span>
              </span>
            </span>{" "}
            with automatic delta propagation.
          </p>

          <p>
            Teammates can accept connection requests and collaborate seamlessly without page refreshes.
          </p>

          <div className="h-2.5 w-3/4 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-2.5 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  </div>
);

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex gap-4 py-6">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  </div>
);

const Step = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <li className="list-none">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-xs">
      {number}
    </span>
    <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
  </li>
);

export default HomePage;
