import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  Menu,
  Sun,
  Moon,
  PlusCircle,
  Database,
  CheckCircle2,
  LogOut,
  User,
} from 'lucide-react'

export const Header = ({
  currentTab,
  onOpenMobileMenu,
  onOpenRecordPayment,
  onOpenSupabaseConfig,
}) => {
  const { user, profile, isConfigured, isDemoUser, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const pageTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your rental portfolio and monthly performance' },
    properties: { title: 'Properties & Units', subtitle: 'Manage your rental properties, buildings, and unit details' },
    tenants: { title: 'Tenants & Leases', subtitle: 'Active tenants, lease terms, and contact records' },
    payments: { title: 'Rent Management', subtitle: 'Track monthly collections, record payments, and filter records' },
    reminders: { title: 'Reminders & Due Dates', subtitle: 'Upcoming rent, pending payments, and lease expiration alerts' },
    settings: { title: 'Settings', subtitle: 'Account preferences, currency, and Supabase database connection' },
  }

  const currentMeta = pageTitles[currentTab] || { title: 'RentTrack', subtitle: '' }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {currentMeta.title}
          </h1>
          <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick actions, connection status, theme toggle, profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase status indicator badge */}
        <button
          type="button"
          onClick={onOpenSupabaseConfig}
          title={isConfigured ? 'Connected to live Supabase database' : 'Running in local standalone mode. Click to configure Supabase.'}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
        >
          {isConfigured ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Supabase Cloud</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Local Mode</span>
              {isDemoUser && <span className="text-[10px] text-zinc-400">(Demo)</span>}
            </>
          )}
        </button>

        {/* Quick Action: Record Payment */}
        <button
          type="button"
          onClick={onOpenRecordPayment}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Record Payment</span>
          <span className="sm:hidden">Pay</span>
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User preview */}
        <div className="hidden sm:flex items-center pl-2 border-l border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="text-right mr-2.5">
            <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
              {profile?.full_name || user?.user_metadata?.full_name || 'Landlord'}
            </p>
            <p className="text-[11px] text-zinc-400 truncate max-w-[130px]">
              {user?.email}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-semibold text-zinc-700 dark:text-zinc-200 text-xs border border-zinc-300 dark:border-zinc-600">
            {(profile?.full_name || user?.email || 'L').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
