'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAssignmentStore } from '@/store/assignmentStore'

interface TopbarProps {
  showBack?: boolean
  title?: string
  onMenuClick?: () => void
}

export default function Topbar({ showBack = false, title = 'Assignment', onMenuClick }: TopbarProps) {
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const { assignments } = useAssignmentStore()

  const pendingAssignments = assignments.filter(
    (a) => a.status === 'pending' || a.status === 'processing'
  )

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-2">
          <img
            src="/VedaAI.png"
            alt="VedaAI"
            width={32}
            height={32}
            style={{ borderRadius: '22%' }}
          />
          <span className="font-bold text-[15px] text-gray-900">VedaAI</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2"
            >
              <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {pendingAssignments.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-10 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                {pendingAssignments.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <svg className="mx-auto mb-2" width="32" height="32" fill="none" stroke="#D1D5DB" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <p className="text-sm text-gray-500">No pending assignments</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {pendingAssignments.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => {
                          router.push(`/assignments/${a._id}`)
                          setNotifOpen(false)
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {a.status === 'processing' ? (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {a.status === 'processing' ? 'Generating question paper...' : 'Waiting to generate...'}
                          </p>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: a.status === 'processing' ? '#DBEAFE' : '#FEF3C7',
                            color: a.status === 'processing' ? '#2563EB' : '#D97706',
                          }}
                        >
                          {a.status === 'processing' ? 'Generating' : 'Pending'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">J</span>
          </div>
          <button onClick={onMenuClick} className="p-2 ml-1">
            <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Desktop Topbar */}
      <header className="hidden md:flex h-14 bg-white border-b border-gray-100 items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <span className="font-medium text-gray-800">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {pendingAssignments.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#E8431C' }}></span>
              )}
            </button>

            {/* Desktop Dropdown */}
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    {pendingAssignments.length > 0 && (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: '#E8431C' }}
                      >
                        {pendingAssignments.length}
                      </span>
                    )}
                  </div>
                  {pendingAssignments.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <svg className="mx-auto mb-3" width="36" height="36" fill="none" stroke="#D1D5DB" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700">No pending assignments</p>
                      <p className="text-xs text-gray-400 mt-1">All caught up!</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {pendingAssignments.map((a) => (
                        <button
                          key={a._id}
                          onClick={() => {
                            router.push(`/assignments/${a._id}`)
                            setNotifOpen(false)
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                        >
                          <div className="flex-shrink-0 mt-2">
                            {a.status === 'processing' ? (
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {a.status === 'processing'
                                ? 'Generating question paper...'
                                : 'Waiting to generate...'}
                            </p>
                          </div>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-1"
                            style={{
                              background: a.status === 'processing' ? '#DBEAFE' : '#FEF3C7',
                              color: a.status === 'processing' ? '#2563EB' : '#D97706',
                            }}
                          >
                            {a.status === 'processing' ? 'Generating' : 'Pending'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">J</span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Close notif on outside click for mobile */}
      {notifOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setNotifOpen(false)}
        />
      )}
    </>
  )
}