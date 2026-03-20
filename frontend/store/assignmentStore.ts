import { create } from 'zustand'
import { Assignment, Result } from '@/lib/api'

interface AssignmentStore {
  assignments: Assignment[]
  currentAssignment: Assignment | null
  currentResult: Result | null
  isLoading: boolean
  isGenerating: boolean
  error: string | null

  setAssignments: (a: Assignment[]) => void
  addAssignment: (a: Assignment) => void
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void
  removeAssignment: (id: string) => void
  setCurrentAssignment: (a: Assignment | null) => void
  setCurrentResult: (r: Result | null) => void
  setLoading: (v: boolean) => void
  setGenerating: (v: boolean) => void
  setError: (e: string | null) => void
}

import { persist } from 'zustand/middleware'

export const useAssignmentStore = create<AssignmentStore>()(
  persist(
    (set) => ({
      assignments: [],
      currentAssignment: null,
      currentResult: null,
      isLoading: false,
      isGenerating: false,
      error: null,

      setAssignments: (assignments) => set({ assignments }),
      addAssignment: (assignment) =>
        set((state) => ({ assignments: [assignment, ...state.assignments] })),
      updateAssignmentStatus: (id, status) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a._id === id ? { ...a, status } : a
          ),
          currentAssignment:
            state.currentAssignment?._id === id
              ? { ...state.currentAssignment, status }
              : state.currentAssignment,
        })),
      removeAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a._id !== id),
        })),
      setCurrentAssignment: (currentAssignment) => set({ currentAssignment }),
      setCurrentResult: (currentResult) => set({ currentResult }),
      setLoading: (isLoading) => set({ isLoading }),
      setGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'veda-assignment-store',
      partialize: (state) => ({ assignments: state.assignments }),
    }
  )
)