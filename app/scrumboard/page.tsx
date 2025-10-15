'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Person = {
  name: string
  img: string
}

type Task = {
  id: number
  difficulty: 'Primary' | 'Medium' | 'Hard'
  detail: string
  person: Person
  deadline: number
  projectId: number
}

type TaskColumns = {
  todo: Task[]
  inprocess: Task[]
  review: Task[]
  done: Task[]
}

const projects = [
  { id: 1, name: 'AI Chat System' },
  { id: 2, name: 'E-Commerce Platform' },
  { id: 3, name: 'Portfolio Redesign' },
]

// Empty initial tasks
const initialTasks: TaskColumns = {
  todo: [],
  inprocess: [],
  review: [],
  done: [],
}

export default function ScrumBoardPage() {
  const [tasks, setTasks] = useState<TaskColumns>(initialTasks)
  const [showModal, setShowModal] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<'Primary' | 'Medium' | 'Hard'>('Primary')
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [newTaskProject, setNewTaskProject] = useState<number>(projects[0].id)

  // Move task between columns
  const moveTask = (from: keyof TaskColumns, to: keyof TaskColumns, taskId: number) => {
    const task = tasks[from].find((t) => t.id === taskId)
    if (!task) return
    setTasks({
      ...tasks,
      [from]: tasks[from].filter((t) => t.id !== taskId),
      [to]: [...tasks[to], task],
    })
  }

  // Delete task permanently
  const deleteTask = (column: keyof TaskColumns, taskId: number) => {
    setTasks({
      ...tasks,
      [column]: tasks[column].filter((t) => t.id !== taskId),
    })
  }

  // Handlers for transitions
  const handleAssign = (taskId: number) => moveTask('todo', 'inprocess', taskId)
  const handleInProcessDelete = (taskId: number) => moveTask('inprocess', 'review', taskId)
  const handleReviewDelete = (taskId: number) => moveTask('review', 'done', taskId)

  // Countdown component
  const Countdown = ({ deadline }: { deadline: number }) => {
    const [timeLeft, setTimeLeft] = useState(deadline - Date.now())

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(deadline - Date.now())
      }, 1000)
      return () => clearInterval(timer)
    }, [deadline])

    if (timeLeft <= 0)
      return (
        <p className="text-red-600 text-xs font-semibold bg-red-100 px-2 py-1 rounded-full inline-block">
          ⏰ Expired
        </p>
      )

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60)
    const seconds = Math.floor((timeLeft / 1000) % 60)

    let bgColor = 'bg-green-100 text-green-800'
    if (timeLeft < 1000 * 60 * 60) bgColor = 'bg-yellow-100 text-yellow-800'
    if (timeLeft < 1000 * 60 * 10) bgColor = 'bg-red-100 text-red-600'

    return (
      <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${bgColor}`}>
        ⏳ {hours}h {minutes}m {seconds}s
      </p>
    )
  }

  const columns: { key: keyof TaskColumns; title: string }[] = [
    { key: 'todo', title: 'To Do' },
    { key: 'inprocess', title: 'In Process' },
    { key: 'review', title: 'Review' },
    { key: 'done', title: 'Done' },
  ]

  const getDifficultyColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'Primary':
        return { bg: '#BFDBFE', text: '#1E3A8A' }
      case 'Medium':
        return { bg: '#BBF7D0', text: '#166534' }
      case 'Hard':
        return { bg: '#FCA5A5', text: '#991B1B' }
      default:
        return { bg: '#E5E7EB', text: '#1F2937' }
    }
  }

  const handleNewTaskSubmit = () => {
    const newTask: Task = {
      id: Date.now(),
      difficulty: newTaskDifficulty,
      detail: newTaskDescription,
      person: { name: newTaskName, img: '/user1.png' },
      deadline: new Date(newTaskDeadline).getTime(),
      projectId: newTaskProject,
    }
    setTasks((prev) => ({ ...prev, todo: [...prev.todo, newTask] }))
    setShowModal(false)
    setNewTaskName('')
    setNewTaskDescription('')
    setNewTaskDeadline('')
    setNewTaskDifficulty('Primary')
    setNewTaskProject(projects[0].id)
  }

  const allPersons = Array.from(
    new Set([
      ...tasks.todo.map(t => t.person.name),
      ...tasks.inprocess.map(t => t.person.name),
      ...tasks.review.map(t => t.person.name),
      ...tasks.done.map(t => t.person.name),
    ])
  )

  const filteredTasks: TaskColumns = selectedPerson
    ? {
      todo: tasks.todo.filter(t => t.person.name === selectedPerson),
      inprocess: tasks.inprocess.filter(t => t.person.name === selectedPerson),
      review: tasks.review.filter(t => t.person.name === selectedPerson),
      done: tasks.done.filter(t => t.person.name === selectedPerson),
    }
    : tasks

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Unknown Project'
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#CBD2D9] font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#F3F4F6] border-r border-[#D1D5DB] flex flex-col">
        <div className="p-5 border-b border-[#D1D5DB]">
          <h1 style={{ color: '#111827', fontWeight: '700', fontSize: '20px' }}>Scrum Projects</h1>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Separator />

          <div className="mt-4">
            <h2 style={{ color: '#374151', fontWeight: '600', fontSize: '14px' }} className="mb-2">Filter by Person</h2>

            <button
              onClick={() => setSelectedPerson(null)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1',
                !selectedPerson
                  ? 'bg-[#E5E7EB] text-[#1D4ED8]'
                  : 'hover:bg-[#E5E7EB] text-[#111827]'
              )}
            >
              All Tasks
            </button>

            {allPersons.map((person) => (
              <button
                key={person}
                onClick={() => setSelectedPerson(selectedPerson === person ? null : person)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1',
                  selectedPerson === person
                    ? 'bg-[#E5E7EB] text-[#1D4ED8]'
                    : 'hover:bg-[#E5E7EB] text-[#111827]'
                )}
              >
                {person}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Board */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8 flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-[#9CA3AF] hover:bg-[#E5E7EB] text-[#111827]"
            onClick={() => setShowModal(true)}
          >
            <PlusCircle className="w-5 h-5" /> New Task
          </Button>
        </div>
        <hr className="border-[##1F2933]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
          {columns.map(({ key, title }) => (
            <div key={key} className="bg-[#1F2933] border border-[#E5E7EB] rounded-2xl shadow-sm p-4 flex flex-col">
              <div className="flex items-center bg-[#3E4C59] justify-between py-1 px-4 rounded-sm ">
                <h3 style={{ color: '#E4E7EB', fontWeight: '600', fontSize: '16px' }}>{title}</h3>
                <Badge style={{ backgroundColor: '#CBD2D9', color: '#1F2933', fontWeight: '600', fontSize: '12px', borderRadius: '2px' }}>
                  {filteredTasks[key].length}
                </Badge>
              </div>
              <Separator className="mb-3" />

              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#9CA3AF]">
                {filteredTasks[key].length === 0 && (
                  <p style={{ color: '#6B7280', fontStyle: 'italic', textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>No tasks</p>
                )}

                {filteredTasks[key].map((task) => {
                  const colors = getDifficultyColor(task.difficulty)
                  return (
                    <Card key={task.id} className='bg-[#3E4C59] p-4'>
                      <CardHeader className="pb-4 items-center">
                        <CardTitle className="text-sm items-center w-full">
                          <div className="flex items-center justify-between">
                            <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '2px 6px', borderRadius: '9999px', fontSize: '10px', fontWeight: '700' }}>
                              {task.difficulty}
                            </span>
                            <span style={{ color: '#E4E7EB', fontSize: '10px', fontWeight: '500' }}>{getProjectName(task.projectId)}</span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='my-3'>
                        <div className='mb-4'>
                          <p style={{ color: '#E4E7EB' }}>Short Details:</p>
                          <p style={{ color: '#E4E7EB' }}>{task.detail}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Image
                            src={'/images/avatar.svg'}
                            alt={task.person.name}
                            width={28}
                            height={28}
                            className="rounded-full border border-[#D1D5DB]"
                          />
                          <span style={{ color: '#E4E7EB', fontSize: '12px', fontWeight: '500' }}>
                            {task.person.name}
                          </span>
                        </div>

                        {/* Flex row for Countdown + buttons */}
                        <div className="flex items-center justify-between flex-wrap  text-[#E4E7EB]">
                          <div>
                            <Countdown deadline={task.deadline} />
                          </div>

                          <div className="flex gap-1 flex-wrap">
                            {key === 'todo' && (
                              <>
                                <Button
                                  onClick={() => handleAssign(task.id)}
                                  style={{
                                    border: 'none',
                                    backgroundColor: '#D1FAE5',
                                    color: '#166534',
                                    fontSize: '10px',
                                    fontWeight: '500',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  Assign +
                                </Button>
                              </>
                            )}
                            {key === 'inprocess' && (
                              <Button
                                onClick={() => handleInProcessDelete(task.id)}
                                style={{
                                  border: 'none',
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                }}
                              >
                                Mark as Done +
                              </Button>
                            )}
                            {key === 'review' && (
                              <Button
                                onClick={() => handleReviewDelete(task.id)}
                                style={{
                                  border: 'none',
                                  backgroundColor: '#FEE2E2',
                                  color: '#991B1B',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                }}
                              >
                                Mark as Done +
                              </Button>
                            )}
                          
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 style={{ color: '#111827', fontWeight: '700', fontSize: '18px' }} className="mb-4">New Task</h2>
            <input
              type="text"
              placeholder="Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-md px-3 py-2 mb-3"
            />
            <textarea
              placeholder="Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-md px-3 py-2 mb-3"
            />
            <input
              type="datetime-local"
              value={newTaskDeadline}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
              className="w-full border border-[#D1D5DB] rounded-md px-3 py-2 mb-3"
            />
            <select
              value={newTaskDifficulty}
              onChange={(e) => setNewTaskDifficulty(e.target.value as 'Primary' | 'Medium' | 'Hard')}
              className="w-full border border-[#D1D5DB] rounded-md px-3 py-2 mb-3"
            >
              <option value="Primary">Primary</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(Number(e.target.value))}
              className="w-full border border-[#D1D5DB] rounded-md px-3 py-2 mb-3"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)} style={{ border: '1px solid #D1D5DB', color: '#111827' }}>Cancel</Button>
              <Button onClick={handleNewTaskSubmit} style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}>Add Task</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
