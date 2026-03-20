'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppShellProps {
  children: React.ReactNode
  showBack?: boolean
  title?: string
  mobileTitle?: string
}

export default function AppShell({ children, showBack, title, mobileTitle }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="md:ml-[240px] min-h-screen flex flex-col pt-14 md:pt-0">
        <Topbar showBack={showBack} title={title} mobileTitle={mobileTitle} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}