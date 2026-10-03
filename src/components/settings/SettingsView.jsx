import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  saveSupabaseConfig,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from '../../lib/supabase'
import {
  User,
  Mail,
  Phone,
  Building,
  DollarSign,
  Database,
  Copy,
  Check,
  RotateCcw,
  Download,
  ShieldCheck,
  HardDrive,
  Info,
} from 'lucide-react'

export const SettingsView = () => {
  const { user, profile, isConfigured, isDemoUser } = useAuth()
  const { updateLandlordProfile, resetToSampleData, properties, units, tenants, payments } = useData()

  // Profile form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [currency, setCurrency] = useState('$')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Supabase keys state
  const [supabaseUrl, setSupabaseUrl] = useState(SUPABASE_URL)
  const [supabaseKey, setSupabaseKey] = useState(SUPABASE_ANON_KEY)
  const [copiedSql, setCopiedSql] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.user_metadata?.full_name || '')
      setEmail(profile.email || user?.email || '')
      setPhone(profile.phone || '')
      setCompanyName(profile.company_name || '')
      setCurrency(profile.currency || '$')
    }
  }, [profile, user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await updateLandlordProfile({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company_name: companyName.trim(),
        currency: currency,
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveSupabaseConfig = (e) => {
    e.preventDefault()
    saveSupabaseConfig(supabaseUrl, supabaseKey)
  }

  const handleCopySchemaNotice = () => {
    navigator.clipboard.writeText(`-- Open supabase_schema.sql in the root of your project and paste into Supabase SQL Editor.`)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 3000)
  }

  const handleExportAllJSON = () => {
    const fullBackup = {
      profile,
      properties,
      units,
      tenants,
      payments,
      exportedAt: new Date().toISOString(),
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2))
    const dl = document.createElement('a')
    dl.setAttribute('href', dataStr)
    dl.setAttribute('download', `renttrack_backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(dl)
    dl.click()
    document.body.removeChild(dl)
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Landlord Profile Settings Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Landlord Profile
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Your personal contact information and default currency settings
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. David Reynolds"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  disabled
                  title="Email cannot be changed directly"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Property Management / Company Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Reynolds Properties LLC"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="$">USD ($) - US Dollar</option>
                <option value="€">EUR (€) - Euro</option>
                <option value="£">GBP (£) - British Pound</option>
                <option value="CA$">CAD ($) - Canadian Dollar</option>
                <option value="AU$">AUD ($) - Australian Dollar</option>
                <option value="₹">INR (₹) - Indian Rupee</option>
                <option value="¥">JPY/CNY (¥) - Yen / Yuan</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Supabase PostgreSQL Configuration Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Supabase PostgreSQL Connection
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Connect your own Supabase database for persistent cloud data & Row Level Security
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${
              isConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}
            ></span>
            {isConfigured ? 'Supabase Live' : 'Standalone Local Mode'}
          </span>
        </div>

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Anon Public Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Database Setup Instructions</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-zinc-500 dark:text-zinc-400">
              <li>Open your project on Supabase and navigate to the <strong>SQL Editor</strong>.</li>
              <li>Execute the SQL commands in the included <code>supabase_schema.sql</code> file.</li>
              <li>Copy your Project URL and Anon Public Key from <strong>Settings &gt; API</strong> and save them above.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySchemaNotice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Schema Info Copied!' : 'Database Schema Guide'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSupabaseUrl('')
                  setSupabaseKey('')
                  saveSupabaseConfig('', '')
                }}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600"
              >
                Clear Keys (Use Local Mode)
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Backup and Demo Reset Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Data Backup & Maintenance
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Export all records as JSON or restore realistic sample data
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleExportAllJSON}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export All Portfolio Data (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset portfolio to realistic sample demo data? Your existing local records will be replaced.')) {
                resetToSampleData()
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>Reset Demo Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  )
}
