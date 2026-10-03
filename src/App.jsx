import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useData } from './context/DataContext'
import { LandingPage } from './components/landing/LandingPage'
import { AuthModal } from './components/auth/AuthModal'
import { Sidebar } from './components/common/Sidebar'
import { Header } from './components/common/Header'
import { ToastContainer } from './components/common/Toast'
import { DashboardView } from './components/dashboard/DashboardView'
import { PropertiesView } from './components/properties/PropertiesView'
import { TenantsView } from './components/tenants/TenantsView'
import { PaymentsView } from './components/payments/PaymentsView'
import { RemindersView } from './components/reminders/RemindersView'
import { SettingsView } from './components/settings/SettingsView'
import { RecordPaymentModal } from './components/payments/RecordPaymentModal'
import { PropertyModal } from './components/properties/PropertyModal'
import { TenantModal } from './components/tenants/TenantModal'
import { SupabaseConfigModal } from './components/settings/SupabaseConfigModal'
import { Loader2 } from 'lucide-react'

export function App() {
  const { isAuthenticated, isLoading, signInAsDemo } = useAuth()
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Auth modal state (when on landing page)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  // Global modals
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false)
  const [recordInitialData, setRecordInitialData] = useState(null)
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false)
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false)

  // Handle opening record payment with optional initial tenant info
  const handleOpenRecordPayment = (initialData = null) => {
    setRecordInitialData(initialData)
    setIsRecordPaymentOpen(true)
  }

  // Handle landing page auth triggers
  const handleOpenLandingAuth = (mode = 'login') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  // Initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Loading RentTrack...
        </p>
      </div>
    )
  }

  // If not authenticated, show modern SaaS Landing Page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenAuth={handleOpenLandingAuth}
          onQuickDemo={() => signInAsDemo()}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      </>
    )
  }

  // Authenticated Landlord Dashboard Shell
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenRecordPayment={() => handleOpenRecordPayment()}
          onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentTab}
              onOpenAddProperty={() => setIsAddPropertyOpen(true)}
              onOpenAddTenant={() => setIsAddTenantOpen(true)}
              onOpenRecordPayment={handleOpenRecordPayment}
            />
          )}

          {currentTab === 'properties' && (
            <PropertiesView
              isAddPropertyModalOpen={isAddPropertyOpen}
              setIsAddPropertyModalOpen={setIsAddPropertyOpen}
            />
          )}

          {currentTab === 'tenants' && (
            <TenantsView
              isAddTenantModalOpen={isAddTenantOpen}
              setIsAddTenantModalOpen={setIsAddTenantOpen}
              onOpenRecordPayment={handleOpenRecordPayment}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsView
              isRecordModalOpen={isRecordPaymentOpen}
              setIsRecordModalOpen={setIsRecordPaymentOpen}
              recordInitialData={recordInitialData}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersView onOpenRecordPayment={handleOpenRecordPayment} />
          )}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Quick Modals */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false)
          setRecordInitialData(null)
        }}
        initialData={recordInitialData}
      />

      <PropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
      />

      <TenantModal
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}
export default App
