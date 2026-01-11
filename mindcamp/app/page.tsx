"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  YesterdayIcon,
  TodayIcon,
  TrackIcon,
  ReflectIcon,
  CheckIcon,
  AppLogo
} from "@/components/JournalIcons";
export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] to-[#06B6D4]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E3A5F]/80 backdrop-blur-lg border-b border-white/10">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <AppLogo className="w-8 h-8" />
              <span className="font-semibold text-xl text-white">Clarity Journal</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/70 hover:text-white transition-colors font-medium"
              >
                Log in
              </Link>
              <Link href="/signup" className="bg-white text-[#1E3A5F] font-semibold py-2.5 px-5 rounded-xl text-sm hover:bg-white/90 transition-colors">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
              <span className="mb-0.5"><ReflectIcon className="w-8 h-8" /></span>
              <span>Build lasting habits</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Build the habit of{" "}
              <span className="text-[#E05C4D]">knowing yourself.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              A simple daily journal that helps you reflect, track patterns, and
              build consistency. 2 minutes a day, real insights over time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup" className="bg-[#E05C4D] hover:bg-[#d04a3b] text-white font-semibold text-lg py-4 px-8 rounded-xl w-full sm:w-auto transition-colors">
                Start Free Trial
              </Link>
              <Link href="#how-it-works" className="bg-white/10 hover:bg-white/20 text-white font-semibold text-lg py-4 px-8 rounded-xl border border-white/20 w-full sm:w-auto transition-colors">
                See how it works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-6 h-6" />
                <span>3 days free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-6 h-6" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-6 h-6" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-6 h-6" />
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<YesterdayIcon className="w-16 h-16" />}
                title="Yesterday's Entry"
                description="Start each session by reading what you wrote yesterday. This builds continuity and self-awareness."
              />
              <FeatureCard
                icon={<TodayIcon className="w-16 h-16" />}
                title="Write today"
                description="Answer a simple prompt with 2-3 sentences. Takes under 2 minutes. Consistency over quantity."
              />
              <FeatureCard
                icon={<TrackIcon className="w-16 h-16" />}
                title="See patterns"
                description="Over time, discover insights from your own words. What themes keep appearing? What's changing?"
              />
            </div>
          </div>

          {/* Progression Preview */}
          <div
            className={`mt-24 bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">
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
            <p className="text-white/70 mb-8">
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
      <footer className="border-t border-white/20 py-8">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AppLogo className="w-6 h-6" />
              <span className="font-semibold text-white">Clarity Journal</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              {/* <Link href="/st-francis/index.html" className="hover:text-white transition-colors opacity-50 text-xs" target="_blank">
                St Francis Demo
              </Link> */}
            </div>
            <p className="text-sm text-white/60">
              © 2026 Clarity Journal
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
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/15 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{description}</p>
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
          ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900"
          : highlight
            ? "bg-orange-400/20 text-orange-300"
            : "bg-white/10 text-white/70"
          }`}
      >
        {rank}
      </div>
      <p className="text-xs text-white/60">{day}</p>
      <p className="text-xs text-white/60 mt-1 hidden md:block">{description}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-[#E05C4D]">{value}</div>
      <div className="text-sm text-white/60 mt-1">{label}</div>
    </div>
  );
}
