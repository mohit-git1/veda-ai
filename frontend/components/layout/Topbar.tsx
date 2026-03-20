'use client'
import { useRouter } from 'next/navigation'

interface TopbarProps {
  showBack?: boolean
  title?: string
}

export default function Topbar({ showBack = false, title = 'Assignment' }: TopbarProps) {
  const router = useRouter()

  return (
    <header className="h-[56px] bg-white border-b border-[#F0F0F0] flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Desktop Left */}
      <div className="hidden md:flex items-center gap-3">
        {showBack && (
          <button onClick={() => router.back()} className="text-[#6B7280] hover:text-[#111111] transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2 text-[#374151]">
          {/* Grid Icon */}
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span className="text-[14px] font-medium">{title}</span>
        </div>
      </div>

      {/* Mobile Left */}
      <div className="flex md:hidden items-center gap-2.5">
        <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8431C, #FF6B35)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <span className="font-semibold text-[15px] text-[#111111]">VedaAI</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Bell Icon */}
        <button className="relative p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors text-[#374151]">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {/* Red dot badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white" style={{ background: '#EF4444' }}></span>
        </button>

        {/* Desktop Profile */}
        <button className="hidden md:flex items-center gap-2 hover:bg-[#F9FAFB] rounded-xl px-2 py-1.5 transition-colors">
          <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
            <span className="text-[12px] font-semibold text-[#374151]">J</span>
          </div>
          <span className="text-[14px] font-medium text-[#374151]">John Doe</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-[#6B7280]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Mobile Profile & Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
            <span className="text-[12px] font-semibold text-[#374151]">J</span>
          </div>
          <button className="p-1 hover:bg-[#F9FAFB] rounded-lg transition-colors text-[#374151]">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}