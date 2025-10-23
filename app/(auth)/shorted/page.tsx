'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'
import {
  FaTrash,
  FaEnvelope,
  FaUserTie,
  FaPhoneAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
} from 'react-icons/fa'

export default function ShortedCVsPage() {
  const [cvs, setCvs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalCV, setModalCV] = useState<any | null>(null)
  const [interviewDate, setInterviewDate] = useState('')
  const [title, setTitle] = useState('')
  const [interviewers, setInterviewers] = useState<any[]>([])
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([])
  const [meetingLink, setMeetingLink] = useState('')

  // Load shortlisted CVs
  async function loadCVs() {
    try {
      const res = await fetch('/api/cvs')
      const data = await res.json()
      setCvs(data.filter((cv: any) => cv.selected))
    } catch (err) {
      console.error(err)
      toast.error('Failed to load CVs')
    } finally {
      setLoading(false)
    }
  }

  // Load users for interviewer dropdown
  async function loadInterviewers() {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setInterviewers(Array.isArray(data.users) ? data.users : [])
    } catch (err) {
      console.error(err)
      setInterviewers([])
      toast.error('Failed to load interviewers')
    }
  }

  useEffect(() => {
    loadCVs()
  }, [])

  // Delete CV
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this CV?')) return
    try {
      const res = await fetch('/api/cvs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('CV deleted successfully!')
      loadCVs()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete CV')
    }
  }

  // Handle checkbox change
  function handleCheckboxChange(id: string) {
    setSelectedInterviewers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Save interview
async function handleSaveInterview() {
  if (!interviewDate || !title || selectedInterviewers.length === 0)
    return toast.error('All fields are required!')

  try {
    const res = await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvId: modalCV.id,
        title,
        dateTime: interviewDate,
        interviewers: selectedInterviewers, // array of IDs
        meetingLink,
      }),
    })

    if (!res.ok) throw new Error('Failed to schedule interview')

    toast.success('Interview scheduled successfully!')
    setModalCV(null)
    setTitle('')
    setInterviewDate('')
    setSelectedInterviewers([])
    setMeetingLink('')
  } catch (err: any) {
    console.error(err)
    toast.error('Failed to schedule interview: ' + err.message)
  }
}


  // Load interviewers when modal opens
  useEffect(() => {
    if (modalCV) loadInterviewers()
  }, [modalCV])

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-extrabold text-[#0070f3] flex items-center gap-2 mb-8">
        <FaUserTie className="text-[#28a745]" /> Shortlisted Candidates
      </h1>

      {loading ? (
        <p className="text-center text-[#999] py-10">Loading shortlisted CVs...</p>
      ) : cvs.length === 0 ? (
        <p className="text-center text-[#999] py-10">No shortlisted CVs found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md border border-[#eee] rounded-2xl">
          <table className="w-full text-sm sm:text-base table-auto border-collapse">
            <thead className="bg-[#0070f3] text-white uppercase text-left">
              <tr>
                <th className="p-4 min-w-[150px]">Name</th>
                <th className="p-4 min-w-[200px]">Email</th>
                <th className="p-4 min-w-[150px]">Phone</th>
                <th className="p-4 min-w-[180px]">Schedule Interview</th>
                <th className="p-4 text-center min-w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {cvs.map((cv) => (
                <tr key={cv.id} className="border-t hover:bg-[#f9f9f9] transition-all duration-200">
                  <td className="p-4 flex items-center gap-2 font-semibold text-[#333] whitespace-normal break-words">
                    <FaUserTie className="text-[#0070f3]" /> {cv.name}
                  </td>
                  <td className="p-4 text-[#0070f3] hover:underline whitespace-normal break-words">
                    <a href={`mailto:${cv.email}`} className="flex items-center gap-2">
                      <FaEnvelope /> {cv.email}
                    </a>
                  </td>
                  <td className="p-4 text-[#555] flex items-center gap-2 whitespace-normal break-words">
                    <FaPhoneAlt className="text-[#28a745]" /> {cv.phone}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setModalCV(cv)}
                      className="bg-[#0070f3] hover:bg-[#0051a3] text-white px-3 py-1 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FaCalendarAlt /> Schedule
                    </button>
                  </td>
                  <td className="p-4 text-center whitespace-normal break-words">
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto transition duration-150"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalCV && (
        <div className="fixed inset-0 bg-[#DBDBDB] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setModalCV(null)}
              className="absolute top-4 right-4 text-[#e53e3e] hover:text-[#c53030] text-xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#0070f3] flex items-center gap-2">
              <FaCalendarAlt /> Schedule Interview
            </h2>
            <p className="mb-2 font-semibold">{modalCV.name}</p>
            <p className="mb-4 text-[#555]">{modalCV.email}</p>

            <input
              type="text"
              placeholder="Interview Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg p-2 mb-4"
            />

            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg p-2 mb-4"
            />

            {/* Multiple Interviewers using checkboxes */}
            <div className="border border-[#ddd] rounded-lg p-2 mb-4 max-h-48 overflow-y-auto">
              {interviewers.map((user) => (
                <label key={user.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedInterviewers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                  {user.name} ({user.email})
                </label>
              ))}
            </div>

            <input
              type="url"
              placeholder="Google Meet / Zoom Link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg p-2 mb-4"
            />

            <button
              onClick={handleSaveInterview}
              className="w-full bg-[#28a745] hover:bg-[#218838] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <FaCheckCircle /> Save Interview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
