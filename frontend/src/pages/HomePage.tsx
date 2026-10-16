import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  Lock,
  Share2,
  Trash2,
  Users,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();
  const signedIn = Boolean(user);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            CollabDocs
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
            <a href="#features" className="transition hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-gray-900">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">
            Write together, in the same document, at the same time.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            CollabDocs gives your team one place to create, edit and share
            documents. Everyone sees every change the moment it happens.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={signedIn ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
            >
              {signedIn ? "Open dashboard" : "Create a free account"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            {!signedIn && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-50"
              >
                Sign in
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
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything your team needs to write together
            </h2>
            <p className="mt-4 max-w-md text-gray-600">
              A focused workspace for documents, without the clutter.
            </p>
          </div>

          <div className="divide-y divide-gray-200 border-y border-gray-200">
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Edit with your team live"
              description="See who is in a document and watch their changes appear as they type. No more merging copies or waiting for someone to finish."
            />
            <Feature
              icon={<FolderOpen className="h-5 w-5" />}
              title="Find your work fast"
              description="Your documents live in one sidebar, with recent files always at hand and a dedicated place for everything shared with you."
            />
            <Feature
              icon={<Share2 className="h-5 w-5" />}
              title="Share with the right people"
              description="Invite teammates to a document and decide who can read it and who can edit it."
            />
            <Feature
              icon={<Lock className="h-5 w-5" />}
              title="Private by default"
              description="Only you and the people you invite can open your documents. Sign-in is protected with secure, token-based sessions."
            />
            <Feature
              icon={<Trash2 className="h-5 w-5" />}
              title="Recover deleted documents"
              description="Deleted something by mistake? It waits in Trash until you restore it or remove it for good."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-gray-200 bg-gray-50"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">
            Up and running in three steps
          </h2>

          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            <Step
              number={1}
              title="Create an account"
              description="Sign up with your email. It takes less than a minute."
            />
            <Step
              number={2}
              title="Start a document"
              description="Open a blank document from the sidebar and start writing."
            />
            <Step
              number={3}
              title="Invite your team"
              description="Share the document and edit it together in real time."
            />
          </ol>
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-gray-200 p-8 sm:p-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Bring your next document to CollabDocs
            </h2>
            <p className="mt-3 text-gray-600">
              Create an account and write your first document with your team.
            </p>
          </div>

          <Link
            to={signedIn ? "/dashboard" : "/register"}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
          >
            {signedIn ? "Open dashboard" : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row">
          <span className="inline-flex items-center gap-2 font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            CollabDocs
          </span>
          <span>© 2026 CollabDocs. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

/* ---------- Product preview: a miniature of the real app ---------- */

const ProductPreview = () => (
  <div
    className="mt-16 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    aria-hidden="true"
  >
    {/* Window bar */}
    <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
    </div>

    <div className="flex">
      {/* Mini sidebar (same structure as the real one) */}
      <div className="hidden w-56 shrink-0 border-r border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 md:block">
        <p className="px-3 py-2 font-semibold text-gray-900">CollabDocs</p>
        <p className="rounded-lg px-3 py-2">New document</p>
        <p className="rounded-lg bg-gray-200/70 px-3 py-2 font-medium text-gray-900">
          My documents
        </p>
        <p className="rounded-lg px-3 py-2">Shared with me</p>
        <p className="rounded-lg px-3 py-2">Trash</p>
        <p className="mt-5 px-3 pb-1 text-xs text-gray-500">Recents</p>
        <p className="truncate rounded-lg px-3 py-2">Q4 launch plan</p>
        <p className="truncate rounded-lg px-3 py-2">Sprint planning notes</p>
        <p className="truncate rounded-lg px-3 py-2">API design draft</p>
      </div>

      {/* Mini document */}
      <div className="min-w-0 flex-1 p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold sm:text-2xl">Q4 launch plan</h3>

          <div className="flex shrink-0 -space-x-2">
            <Avatar label="PR" className="bg-blue-600" />
            <Avatar label="AK" className="bg-emerald-600" />
            <Avatar label="You" className="bg-gray-900" />
          </div>
        </div>

        <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-7 text-gray-700">
          <p>
            The launch is scheduled for the first week of November. Before
            then, we need to confirm the{" "}
            <span className="relative bg-blue-100 px-0.5">
              final feature list with product
              <Caret label="Priya" className="bg-blue-600" />
            </span>{" "}
            and agree on the support plan for launch day.
          </p>

          <p>
            Marketing will share the announcement draft on Monday.{" "}
            <span className="relative">
              Arjun is reviewing the pricing page copy
              <Caret label="Arjun" className="bg-emerald-600" />
            </span>
            , and we expect feedback by Wednesday.
          </p>

          <div className="h-3 w-2/3 rounded bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  </div>
);

const Avatar = ({ label, className }: { label: string; className: string }) => (
  <span
    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-medium text-white ${className}`}
  >
    {label}
  </span>
);

const Caret = ({ label, className }: { label: string; className: string }) => (
  <span className="pointer-events-none absolute -right-px top-0 h-full">
    <span className={`block h-full w-0.5 motion-safe:animate-pulse ${className}`} />
    <span
      className={`absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${className}`}
    >
      {label}
    </span>
  </span>
);

/* ---------- Small building blocks ---------- */

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="flex gap-5 py-7">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-lg text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  </div>
);

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <li>
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
      {number}
    </span>
    <h3 className="mt-4 font-semibold">{title}</h3>
    <p className="mt-1.5 max-w-xs text-sm leading-6 text-gray-600">
      {description}
    </p>
  </li>
);

export default HomePage;