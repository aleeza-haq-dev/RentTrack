import React from 'react'
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  X,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { cn } from '../../lib/utils'

export const Sidebar = ({ currentTab, onSelectTab, isMobileOpen, onCloseMobile }) => {
  const { signOut, user, profile, isDemoUser } = useAuth()
  const { stats } = useData()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2, count: stats.totalProperties },
    { id: 'tenants', label: 'Tenants', icon: Users, count: stats.totalTenants },
    { id: 'payments', label: 'Rent Payments', icon: CreditCard },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      badge: stats.overdueCount > 0 ? stats.overdueCount : stats.dueSoonCount > 0 ? stats.dueSoonCount : null,
      badgeColor: stats.overdueCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleNavClick = (id) => {
    onSelectTab(id)
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile()
    }
  }

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              RentTrack
            </span>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
              Landlord SaaS
            </span>
          </div>
        </div>

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Demo Mode Notice if active */}
      {isDemoUser && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Demo mode active. Data saved locally.</span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition duration-150',
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4',
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge !== null ? (
                <span
                  className={cn(
                    'px-2 py-0.5 text-[11px] font-bold rounded-full leading-none',
                    item.badgeColor
                  )}
                >
                  {item.badge}
                </span>
              ) : item.count !== undefined ? (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
                  {item.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Landlord Profile & Logout */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
              {(profile?.full_name || user?.email || 'L').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 truncate">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {profile?.full_name || user?.user_metadata?.full_name || 'Landlord'}
              </p>
              <p className="text-[11px] text-zinc-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            title="Log Out"
            className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-40">
        {content}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
