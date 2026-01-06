"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--card-border)]">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📔</span>
              <span className="font-semibold text-xl">MindCamp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary !py-2.5 !px-5 text-sm">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-28 pb-20">
        <div className="container-app">
          <div
            className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-sm font-medium mb-6">
              <span>✨</span>
              <span>Build lasting habits</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[var(--foreground)]">
              Build the habit of{" "}
              <span className="text-[var(--primary)]">knowing yourself.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[var(--foreground-muted)] mb-10 max-w-xl mx-auto leading-relaxed">
              A simple daily journal that helps you reflect, track patterns, and
              build consistency. 2 minutes a day, real insights over time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup" className="btn-primary text-lg w-full sm:w-auto">
                Start Free Trial
              </Link>
              <Link href="#how-it-works" className="btn-secondary text-lg w-full sm:w-auto">
                See how it works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--foreground-muted)]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>3 days free</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2 minutes per day</span>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div
            id="how-it-works"
            className={`mt-24 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon="📖"
                title="Read yesterday"
                description="Start each session by reading what you wrote yesterday. This builds continuity and self-awareness."
              />
              <FeatureCard
                icon="✏️"
                title="Write today"
                description="Answer a simple prompt with 2-3 sentences. Takes under 2 minutes. Consistency over quantity."
              />
              <FeatureCard
                icon="💡"
                title="See patterns"
                description="Over time, discover insights from your own words. What themes keep appearing? What's changing?"
              />
            </div>
          </div>

          {/* Progression Preview */}
          <div
            className={`mt-24 card p-8 md:p-10 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Your 63-Day Journey
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <ProgressStep
                day="Day 0-3"
                rank="Guest"
                description="Free trial"
              />
              <ProgressStep
                day="Day 4-14"
                rank="Member"
                description="Week view"
              />
              <ProgressStep
                day="Day 15-30"
                rank="Regular"
                description="Keyword tracking"
              />
              <ProgressStep
                day="Day 31-56"
                rank="Veteran"
                description="Month compare"
              />
              <ProgressStep
                day="Day 57-63"
                rank="Final Week"
                description="The challenge"
                highlight
              />
              <ProgressStep
                day="Day 64+"
                rank="Master"
                description="Full access"
                master
              />
            </div>
          </div>

          {/* Social Proof */}
          <div
            className={`mt-24 text-center transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <p className="text-[var(--foreground-muted)] mb-8">
              Join thousands building lasting journaling habits
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <Stat value="10K+" label="Active users" />
              <Stat value="2.5M" label="Entries written" />
              <Stat value="68%" label="Complete journey" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📔</span>
              <span className="font-semibold">MindCamp</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
              <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              © 2026 MindCamp
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ProgressStep({
  day,
  rank,
  description,
  highlight,
  master,
}: {
  day: string;
  rank: string;
  description: string;
  highlight?: boolean;
  master?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-2 ${master
            ? "rank-master"
            : highlight
              ? "rank-finalweek"
              : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
          }`}
      >
        {rank}
      </div>
      <p className="text-xs text-[var(--foreground-muted)]">{day}</p>
      <p className="text-xs text-[var(--foreground-muted)] mt-1 hidden md:block">{description}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">{value}</div>
      <div className="text-sm text-[var(--foreground-muted)] mt-1">{label}</div>
    </div>
  );
}
