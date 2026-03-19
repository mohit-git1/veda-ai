'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import AppShell from '@/components/layout/AppShell'
import { useAssignmentStore } from '@/store/assignmentStore'
import { assignmentsApi } from '@/lib/api'

interface QuestionTypeRow {
  id: string
  type: string
  numQuestions: number
  marks: number
}

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks',
]

export default function CreateAssignmentPage() {
  const router = useRouter()
  const { addAssignment } = useAssignmentStore()

  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const [questionTypes, setQuestionTypes] = useState<QuestionTypeRow[]>([
    { id: '1', type: 'Multiple Choice Questions', numQuestions: 4, marks: 1 },
    { id: '2', type: 'Short Questions', numQuestions: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', numQuestions: 5, marks: 5 },
    { id: '4', type: 'Numerical Problems', numQuestions: 5, marks: 5 },
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  const addQuestionType = () => {
    setQuestionTypes([...questionTypes, {
      id: Date.now().toString(),
      type: 'Multiple Choice Questions',
      numQuestions: 1,
      marks: 1,
    }])
  }

  const removeQuestionType = (id: string) => {
    setQuestionTypes(questionTypes.filter((q) => q.id !== id))
  }

  const updateRow = (id: string, field: keyof QuestionTypeRow, value: any) => {
    setQuestionTypes(questionTypes.map((q) => q.id === id ? { ...q, [field]: value } : q))
  }

  const totalQuestions = questionTypes.reduce((s, q) => s + q.numQuestions, 0)
  const totalMarks = questionTypes.reduce((s, q) => s + q.numQuestions * q.marks, 0)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!dueDate) e.dueDate = 'Due date is required'
    if (questionTypes.length === 0) e.questionTypes = 'Add at least one question type'
    questionTypes.forEach((q, i) => {
      if (q.numQuestions < 1) e[`q_${i}_num`] = 'Min 1'
      if (q.marks < 1) e[`q_${i}_marks`] = 'Min 1'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('subject', subject || 'General')
      formData.append('dueDate', dueDate)
      formData.append('questionTypes', JSON.stringify(questionTypes.map(q => ({
        type: q.type, numQuestions: q.numQuestions, marks: q.marks
      }))))
      formData.append('additionalInstructions', additionalInstructions)
      if (file) formData.append('file', file)

      const res = await assignmentsApi.create(formData)
      addAssignment(res.data.data)
      router.push(`/assignments/${res.data.data._id}`)
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.error || 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell showBack title="Assignment">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h1 className="text-lg font-semibold text-gray-900">Create Assignment</h1>
          </div>
          <p className="text-sm text-gray-500 ml-4">Set up a new assignment for your students</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <div className="h-1 rounded-full" style={{ background: '#111111', width: '50%' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Quiz on Electricity"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Subject</label>
            <input
              type="text"
              placeholder="e.g. Science, Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Section heading */}
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">Assignment Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">Basic information about your assignment</p>
          </div>

          {/* File Upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-2 ${
              isDragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
            } ${file ? 'bg-green-50 border-green-300' : ''}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {isDragActive ? 'Drop file here...' : 'Choose a file or drag & drop it here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, up to 10MB</p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 text-center mb-6">Upload images of your preferred document/image</p>

          {/* Due Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Due Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Choose a chapter"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none ${errors.dueDate ? 'border-red-300' : 'border-gray-200'}`}
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>

          {/* Question Types */}
          <div className="mb-6">
            <div className="grid grid-cols-12 gap-2 mb-2 px-1">
              <div className="col-span-6 text-xs font-medium text-gray-600">Question Type</div>
              <div className="col-span-3 text-xs font-medium text-gray-600 text-center">No. of Questions</div>
              <div className="col-span-2 text-xs font-medium text-gray-600 text-center">Marks</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-2">
              {questionTypes.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={row.type}
                        onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none bg-white pr-8"
                      >
                        {QUESTION_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <svg className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center gap-1">
                    <button
                      onClick={() => updateRow(row.id, 'numQuestions', Math.max(1, row.numQuestions - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm font-medium"
                    >−</button>
                    <div className="flex-1 text-center text-sm font-medium text-gray-800 border border-gray-200 rounded-lg py-1.5">
                      {row.numQuestions}
                    </div>
                    <button
                      onClick={() => updateRow(row.id, 'numQuestions', row.numQuestions + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm font-medium"
                    >+</button>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <button
                      onClick={() => updateRow(row.id, 'marks', Math.max(1, row.marks - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm font-medium"
                    >−</button>
                    <div className="flex-1 text-center text-sm font-medium text-gray-800 border border-gray-200 rounded-lg py-1.5">
                      {row.marks}
                    </div>
                    <button
                      onClick={() => updateRow(row.id, 'marks', row.marks + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm font-medium"
                    >+</button>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeQuestionType(row.id)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.questionTypes && <p className="text-xs text-red-500 mt-2">{errors.questionTypes}</p>}

            <button
              onClick={addQuestionType}
              className="flex items-center gap-2 mt-4 text-sm text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              <span className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm">+</span>
              Add Question Type
            </button>

            <div className="flex justify-end gap-6 mt-4 text-sm text-gray-700">
              <span>Total Questions : <strong>{totalQuestions}</strong></span>
              <span>Total Marks : <strong>{totalMarks}</strong></span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Additional Information <span className="text-gray-400 font-normal">(For better output)</span>
            </label>
            <div className="relative">
              <textarea
                placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              />
              <svg className="absolute right-3 bottom-3 text-gray-400" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-medium text-white transition-all disabled:opacity-60"
            style={{ background: '#111111' }}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Next
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </AppShell>
  )
}