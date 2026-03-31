import { IQuestionType } from '../models/Assignment'

interface PromptInput {
  subject: string
  dueDate: string
  questionTypes: IQuestionType[]
  additionalInstructions: string
  fileContent?: string
}

export function buildPrompt(input: PromptInput): string {
  const totalQuestions = input.questionTypes.reduce((sum, qt) => sum + qt.numQuestions, 0)
  const totalMarks = input.questionTypes.reduce((sum, qt) => sum + (qt.numQuestions * qt.marks), 0)

  const sectionDetails = input.questionTypes.map((qt, i) => {
    const sectionLabel = String.fromCharCode(65 + i)
    return `Section ${sectionLabel}: ${qt.numQuestions} x ${qt.type} questions, ${qt.marks} marks each`
  }).join('\n')

  const contextText = input.fileContent
    ? `\n\nUse the following Job Description context as source material:\n${input.fileContent.substring(0, 3000)}`
    : ''

  return `You are an expert technical hiring manager creating a formal candidate assessment paper.

Skills/Role: ${input.subject || 'General Engineering'}
Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}
Candidate Details (Job Title, Company, Experience, Skills):
${input.additionalInstructions || 'None'}
${contextText}

Create a role-specific technical assessment with these sections:
${sectionDetails}

Rules:
- MCQ must have exactly 4 options labeled (A/B/C/D). Include the options in the question text.
- Coding problems must include problem description, constraints, and sample input/output specs.
- Always include detailed answer keys with explanations.
- Difficulty distribution per section: 30% easy, 50% medium, 20% hard.

Return ONLY valid JSON. No markdown, no explanation, no code blocks. Just raw JSON:

{
  "paperTitle": "Candidate Assessment",
  "subject": "${input.subject || 'General Engineering'}",
  "className": "Candidate Assessment",
  "timeAllowed": "90 Minutes",
  "maximumMarks": ${totalMarks},
  "sections": [
    {
      "id": "A",
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questions": [
        {
          "id": 1,
          "text": "Question text here? A) op1 B) op2 C) op3 D) op4",
          "type": "mcq",
          "difficulty": "easy",
          "marks": 2,
          "answer": "B) op2 - Detailed explanation here"
        }
      ]
    }
  ]
}`
}
