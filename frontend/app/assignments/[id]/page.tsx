'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useAssignmentStore } from '@/store/assignmentStore'
import { assignmentsApi, Assignment, Result } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const map: Record<string, string> = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-orange-100 text-orange-700',
    hard: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${map[difficulty] || 'bg-gray-100 text-gray-600'}`}>
      {difficulty}
    </span>
  )
}

export default function AssignmentOutputPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { currentAssignment, currentResult, setCurrentAssignment, setCurrentResult, isGenerating, setGenerating } = useAssignmentStore()
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const paperRef = useRef<HTMLDivElement>(null)

  useWebSocket(id)

  const fetchData = async () => {
    try {
      const res = await assignmentsApi.getOne(id)
      setCurrentAssignment(res.data.data.assignment)
      setCurrentResult(res.data.data.result)
      if (['pending', 'processing'].includes(res.data.data.assignment.status)) {
        setGenerating(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  // Poll when generating
  useEffect(() => {
    if (!isGenerating) return
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [isGenerating])

  // Listen for WS complete
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail.assignmentId === id) fetchData()
    }
    window.addEventListener('generation:complete', handler as any)
    return () => window.removeEventListener('generation:complete', handler as any)
  }, [id])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      await assignmentsApi.regenerate(id)
      setCurrentResult(null)
      setGenerating(true)
    } catch (err) {
      console.error(err)
    } finally {
      setRegenerating(false)
    }
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <AppShell showBack title="Create New">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBack title="Create New">
      <div className="max-w-3xl mx-auto">

        {/* AI Message Bubble */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E8431C, #FF6B35)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <p className="text-sm text-gray-500">Generating your question paper, please wait...</p>
              </div>
            ) : currentResult ? (
              <>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  Certainly, Lakshya! Here are customized Question Paper for your <strong>{currentAssignment?.subject || 'CBSE'}</strong> classes on the NCERT chapters:
                </p>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ background: '#16a34a' }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download as PDF
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                {currentAssignment?.status === 'failed'
                  ? 'Generation failed. Please try regenerating.'
                  : 'Starting generation...'}
              </p>
            )}
          </div>
        </div>

        {/* Question Paper */}
        {currentResult && (
          <div ref={paperRef} className="bg-white rounded-2xl border border-gray-100 p-8 print:shadow-none print:rounded-none">
            {/* School Header */}
            <div className="text-center mb-6 pb-4 border-b border-gray-200">
              <h1 className="text-[17px] font-bold text-gray-900">{currentResult.schoolName}</h1>
              <p className="text-sm text-gray-700 mt-1">Subject: {currentResult.subject}</p>
              <p className="text-sm text-gray-700">Class: {currentResult.className}</p>
            </div>

            {/* Meta row */}
            <div className="flex justify-between text-sm text-gray-700 mb-4">
              <span>Time Allowed: {currentResult.timeAllowed}</span>
              <span>Maximum Marks: {currentResult.maximumMarks}</span>
            </div>

            <p className="text-xs text-gray-500 italic mb-6">All questions are compulsory unless stated otherwise.</p>

            {/* Student Info */}
            <div className="mb-6 space-y-2">
              {['Name', 'Roll Number', 'Class & Section'].map((label) => (
                <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-32 flex-shrink-0">{label}:</span>
                  <div className="flex-1 border-b border-gray-400 min-h-[20px]" />
                </div>
              ))}
            </div>

            {/* Sections */}
            {currentResult.sections.map((section) => (
              <div key={section.id} className="mb-8">
                <h2 className="text-center font-bold text-gray-900 text-base mb-1">{section.title}</h2>
                <p className="text-center text-xs text-gray-500 italic mb-5">{section.instruction}</p>

                <div className="space-y-4">
                  {section.questions.map((q, qi) => (
                    <div key={q.id} className="flex gap-3">
                      <span className="text-sm font-medium text-gray-700 flex-shrink-0 w-7">{qi + 1}.</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-gray-800 leading-relaxed flex-1">{q.text}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <DifficultyBadge difficulty={q.difficulty} />
                            <span className="text-xs text-gray-500 whitespace-nowrap">[{q.marks} Mark{q.marks !== 1 ? 's' : ''}]</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-sm font-semibold text-gray-700 mt-8 pt-4 border-t border-gray-200">
              — End of Question Paper —
            </p>

            {/* Answer Key */}
            {currentResult.sections.some((s) => s.questions.some((q) => q.answer)) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-4">Answer Key</h2>
                {currentResult.sections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">{section.title}</h3>
                    <div className="space-y-2">
                      {section.questions.filter((q) => q.answer).map((q, qi) => (
                        <div key={q.id} className="flex gap-3 text-sm">
                          <span className="text-gray-500 flex-shrink-0">{qi + 1}.</span>
                          <p className="text-gray-700 leading-relaxed">{q.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generating skeleton */}
        {isGenerating && !currentResult && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-gray-100 rounded w-40 mx-auto mb-6" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${85 - i * 5}%` }} />
              ))}
            </div>
          </div>
        )}

        {/* Action bar */}
        {currentResult && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:shadow-none, .print\\:shadow-none * { visibility: visible; }
          .print\\:shadow-none { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </AppShell>
  )
}