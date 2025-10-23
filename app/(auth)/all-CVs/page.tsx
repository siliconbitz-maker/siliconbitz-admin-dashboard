'use client'

import { useEffect, useState } from 'react'
import { FaEye, FaTrash, FaCheckCircle, FaRegCircle, FaTimes } from 'react-icons/fa'

export default function AllCVsPage() {
  const [cvs, setCvs] = useState<any[]>([])
  const [selectedCV, setSelectedCV] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadCVs() {
    try {
      const res = await fetch('/api/cvs')
      if (!res.ok) throw new Error('Failed to fetch CVs')
      const text = await res.text()
      const data = text ? JSON.parse(text) : []
      setCvs(data)
    } catch (err) {
      console.error('Error loading CVs:', err)
      setCvs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCVs()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this CV?')) return
    await fetch('/api/cvs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadCVs()
  }

  async function handleSelect(id: string, selected: boolean) {
    await fetch('/api/cvs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selected }),
    })
    loadCVs()
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-[#0070f3] mb-6 text-center">
        All CVs
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : cvs.length === 0 ? (
        <p className="text-center text-gray-500">No CVs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-[#ddd] rounded-lg text-sm sm:text-base">
            <thead className="bg-[#f5f5f5] text-[#222]">
              <tr>
                <th className="p-3 text-left">Select</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvs.map((cv) => (
                <tr
                  key={cv.id}
                  className={`border-t transition-colors ${
                    cv.selected
                      ? 'bg-[#e6f7ff] hover:bg-[#d6f1ff]'
                      : 'hover:bg-[#f0f8ff]'
                  }`}
                >
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleSelect(cv.id, !cv.selected)}
                      className={`transition ${
                        cv.selected
                          ? 'text-[#28a745]'
                          : 'text-[#999] hover:text-[#28a745]'
                      }`}
                    >
                      {cv.selected ? <FaCheckCircle size={18} /> : <FaRegCircle size={18} />}
                    </button>
                  </td>
                  <td className="p-3 font-medium">{cv.name}</td>
                  <td className="p-3">{cv.email}</td>
                  <td className="p-3">{cv.phone}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedCV(cv)}
                      className="text-[#0070f3] hover:text-[#0051a3] transition"
                      title="View CV"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="text-[#e53e3e] hover:text-[#c53030] transition"
                      title="Delete CV"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedCV && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setSelectedCV(null)}
              className="absolute top-3 right-3 text-[#999] hover:text-[#000]"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-xl font-bold text-[#0070f3] mb-2 flex items-center gap-2">
              {selectedCV.name}
              {selectedCV.selected && (
                <FaCheckCircle className="text-[#28a745]" title="Selected" />
              )}
            </h2>

            <p className="text-[#333] mb-1">
              <b>Email:</b> {selectedCV.email}
            </p>
            <p className="text-[#333] mb-3">
              <b>Phone:</b> {selectedCV.phone}
            </p>
            <p className="text-[#444] text-sm mb-3">{selectedCV.about}</p>

            {selectedCV.pdfUrl && (
              <a
                href={selectedCV.pdfUrl}
                target="_blank"
                className="text-[#0070f3] underline block mb-4"
              >
                View CV (PDF)
              </a>
            )}

            <div className="flex flex-wrap gap-2 justify-between">
              <button
                onClick={() => handleSelect(selectedCV.id, !selectedCV.selected)}
                className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded transition w-[48%] flex items-center justify-center gap-2"
              >
                {selectedCV.selected ? (
                  <>
                    <FaRegCircle /> Unselect
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Select
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(selectedCV.id)}
                className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-2 rounded transition w-[48%] flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
