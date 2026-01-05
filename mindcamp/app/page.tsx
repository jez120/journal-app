"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen radial-glow grid-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-t-0">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎖️</span>
              <span className="font-bold text-xl tracking-tight">MindCamp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary !py-3 !px-6 text-sm">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 relative z-10">
        <div className="container-app">
          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-sm font-medium mb-8">
              <span className="animate-pulse">🔥</span>
              <span>Build habits that stick</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Bootcamp for{" "}
              <span className="gradient-text">your brain.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Journal daily or lose your rank. Build lasting habits with bootcamp
              structure, streaks, and insights from your own data.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/signup" className="btn-primary text-lg w-full sm:w-auto">
                Start Free Trial
              </Link>
              <button className="btn-secondary text-lg w-full sm:w-auto">
                See how it works
              </button>
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
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div
            className={`grid md:grid-cols-3 gap-6 mt-24 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <FeatureCard
              icon="📖"
              title="Forced Reflection"
              description="Read yesterday's entry before writing today's. Build a continuous narrative of your life."
            />
            <FeatureCard
              icon="🎖️"
              title="Rank Progression"
              description="Advance through ranks: Recruit → Soldier → Officer → Commander. Miss days? Lose your progress."
            />
            <FeatureCard
              icon="🔍"
              title="Discovery Engine"
              description="Surface patterns from your own data. See what words you use most and how your writing changes over time."
            />
          </div>

          {/* Progression Preview */}
          <div
            className={`mt-24 glass-card p-8 md:p-12 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Your 63-Day Journey
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
              <ProgressStep
                day="Day 0-3"
                rank="Guest"
                description="Free trial"
                active={false}
              />
              <ProgressArrow />
              <ProgressStep
                day="Day 4-14"
                rank="Recruit"
                description="Build foundation"
                active={false}
              />
              <ProgressArrow />
              <ProgressStep
                day="Day 15-30"
                rank="Soldier"
                description="Unlock insights"
                active={false}
              />
              <ProgressArrow />
              <ProgressStep
                day="Day 31-56"
                rank="Officer"
                description="Advanced features"
                active={false}
              />
              <ProgressArrow />
              <ProgressStep
                day="Day 57-63"
                rank="Hell Week"
                description="Final test"
                active={false}
                hellWeek
              />
              <ProgressArrow />
              <ProgressStep
                day="Day 64+"
                rank="Commander"
                description="Full access forever"
                active={false}
                commander
              />
            </div>
          </div>

          {/* Social Proof */}
          <div
            className={`mt-24 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <p className="text-[var(--foreground-muted)] mb-8">
              Join thousands building unbreakable journaling habits
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <Stat value="10,000+" label="Active users" />
              <Stat value="2.5M" label="Entries written" />
              <Stat value="68%" label="Complete training" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] py-8 relative z-10">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎖️</span>
              <span className="font-bold">MindCamp</span>
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
              © 2026 MindCamp. All rights reserved.
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
    <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-[var(--foreground-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

function ProgressStep({
  day,
  rank,
  description,
  active,
  hellWeek,
  commander,
}: {
  day: string;
  rank: string;
  description: string;
  active: boolean;
  hellWeek?: boolean;
  commander?: boolean;
}) {
  return (
    <div className={`text-center flex-1 ${active ? "opacity-100" : "opacity-70"}`}>
      <div
        className={`inline-block px-4 py-2 rounded-lg text-sm font-bold mb-2 ${commander
            ? "bg-[var(--accent-muted)] text-[var(--accent)]"
            : hellWeek
              ? "bg-[var(--primary-muted)] text-[var(--primary)]"
              : "bg-[var(--glass-bg)] text-[var(--foreground)]"
          }`}
      >
        {rank}
      </div>
      <p className="text-xs text-[var(--foreground-muted)] mb-1">{day}</p>
      <p className="text-xs text-[var(--foreground-muted)] hidden md:block">{description}</p>
    </div>
  );
}

function ProgressArrow() {
  return (
    <div className="hidden md:flex items-center justify-center text-[var(--foreground-muted)]">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold gradient-text">{value}</div>
      <div className="text-sm text-[var(--foreground-muted)] mt-1">{label}</div>
    </div>
  );
}
