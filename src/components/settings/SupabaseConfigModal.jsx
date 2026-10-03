import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { useAuth } from '../../context/AuthContext'
import {
  saveSupabaseConfig,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from '../../lib/supabase'
import { Database, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react'

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  const { isConfigured } = useAuth()
  const [url, setUrl] = useState(SUPABASE_URL)
  const [key, setKey] = useState(SUPABASE_ANON_KEY)
  const [copied, setCopied] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    saveSupabaseConfig(url, key)
  }

  const handleCopySchemaNotice = () => {
    navigator.clipboard.writeText(`See supabase_schema.sql in the root of the project.`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Database Configuration"
      subtitle="Connect your Supabase project or view connection status"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Status indicator */}
        <div
          className={`p-3.5 rounded-lg border flex items-center justify-between text-xs ${
            isConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
            <span className="font-semibold">
              {isConfigured
                ? 'Connected to Live Supabase DB'
                : 'Running in Standalone Local Mode'}
            </span>
          </div>
          <span className="text-[11px] opacity-80">
            {isConfigured ? 'PostgreSQL RLS Active' : 'Offline / Mock Storage'}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Supabase Anon Public Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleCopySchemaNotice}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Schema File (supabase_schema.sql)'}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}
