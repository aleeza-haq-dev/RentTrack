import React from 'react'
import { LandingNavbar } from './LandingNavbar'
import {
  Building2,
  Users,
  CreditCard,
  Bell,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react'

export const LandingPage = ({ onOpenAuth, onQuickDemo }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <LandingNavbar onOpenAuth={onOpenAuth} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built exclusively for independent landlords</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto leading-[1.15]">
            Simple rental property & rent management without the clutter.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            RentTrack gives small landlords a clean, minimalist system to organize properties, units, tenants, and monthly rent payments. Never wonder who owes rent again.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm hover:shadow"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onQuickDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition shadow-sm"
            >
              <span>Explore Live Demo</span>
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            No credit card required • Instant setup • Supabase PostgreSQL ready
          </p>

          {/* Interactive Preview Dashboard Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-5 shadow-2xl text-left">
            {/* Window chrome bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                <span className="ml-2 text-xs font-medium text-zinc-400">app.renttrack.io/dashboard</span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live Portfolio
              </span>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] uppercase font-medium text-zinc-400">Total Units</span>
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">6</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">83% Occupied</p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] uppercase font-medium text-zinc-400">Expected Rent</span>
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">$9,900</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Monthly Total</p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] uppercase font-medium text-zinc-400">Collected</span>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">$5,850</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">3 Payments</p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] uppercase font-medium text-zinc-400">Overdue Rent</span>
                <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">$2,100</p>
                <p className="text-[11px] text-rose-500 mt-0.5">1 Tenant Overdue</p>
              </div>
            </div>

            {/* Quick table sample inside mockup */}
            <div className="overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
              <div className="bg-zinc-100/70 dark:bg-zinc-800/60 px-4 py-2 text-xs font-semibold text-zinc-500 flex justify-between items-center">
                <span>Recent Rent Transactions</span>
                <span className="text-[10px] text-emerald-600">Updated today</span>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Sarah Jenkins</span>
                    <span className="text-zinc-400 ml-2">Highland Oak • Apt 101</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">$1,450.00</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">Paid</span>
                  </div>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Elena Rostova</span>
                    <span className="text-zinc-400 ml-2">Maple Street • Unit A</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">$2,100.00</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">Overdue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Everything you need, nothing you don't.
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Designed specifically for landlords with 1 to 50 units who want clear visibility without enterprise bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Properties & Units
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Add single-family homes, duplexes, or multi-unit apartments. Set rent amounts and instantly track occupied versus vacant units.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Tenants & Leases
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Store tenant contact info, lease dates, monthly rent, and designated rent due days. View individual tenant payment records in one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Rent Collection Tracking
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Record monthly payments via Bank Transfer, Cash, Check, or Zelle. Track Paid, Pending, and Overdue balances automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Automated In-App Reminders
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Identify rent due soon, uncollected rent, and leases expiring within 60 days directly from your dashboard alerts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Supabase & PostgreSQL RLS
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Data isolation guaranteed by PostgreSQL Row Level Security. Connect your own Supabase project in seconds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Clear Portfolio Metrics
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Expected revenue, collected cash flow, pending dues, and real-time occupancy percentages at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to streamline your rental properties?
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto">
            Take control of your units, leases, and payments today. Free to get started with no complex setup.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition"
            >
              Create Landlord Account
            </button>
            <button
              onClick={onQuickDemo}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition"
            >
              Try Instant Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} RentTrack. Minimalist Landlord SaaS.</p>
      </footer>
    </div>
  )
}
