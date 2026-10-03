import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { useAuth } from '../../context/AuthContext'
import { Lock, Mail, User, ArrowRight, Zap, AlertCircle } from 'lucide-react'

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, signUp, signInAsDemo } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          setErrorMsg(error)
        } else {
          onClose()
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name')
          setIsSubmitting(false)
          return
        }
        if (password.length < 6) {
          setErrorMsg('Password should be at least 6 characters')
          setIsSubmitting(false)
          return
        }
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setErrorMsg(error)
        } else {
          onClose()
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setErrorMsg('')
    setIsSubmitting(true)
    try {
      await signInAsDemo()
      onClose()
    } catch (err) {
      setErrorMsg('Failed to login to demo account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Landlord Sign In' : 'Create Landlord Account'}
      subtitle={
        mode === 'login'
          ? 'Enter your credentials to access your properties & rent records'
          : 'Start tracking rental properties, tenants, and monthly rent'
      }
      maxWidth="max-w-md"
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setErrorMsg('')
          }}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition ${
            mode === 'login'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register')
            setErrorMsg('')
          }}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition ${
            mode === 'register'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. David Reynolds"
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="landlord@example.com"
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition shadow-sm disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Option */}
      <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
        <div className="text-center mb-3">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
            Or test instantly
          </span>
        </div>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>One-Click Demo Landlord Login</span>
        </button>
      </div>
    </Modal>
  )
}
