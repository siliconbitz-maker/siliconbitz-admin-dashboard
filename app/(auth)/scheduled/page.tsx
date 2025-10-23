'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function CVAndInterviewsTable() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  async function loadData() {
    try {
      setLoading(true)

      // ✅ Only fetch interviews (which automatically include CV + interviewers)
      const res = await fetch('/api/interviews')
      if (!res.ok) throw new Error('Failed to load interviews')
      const interviews = await res.json()

      // Filter out invalid ones (just in case)
      const valid = interviews.filter((i: any) => i.cv)

      setData(valid)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ✅ Search by candidate info or interviewer
  const filteredData = data.filter(
    (item) =>
      item.cv?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cv?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cv?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.interviewers?.some((intv: any) =>
        intv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Scheduled Interviews</h1>
        <button
          onClick={loadData}
          className="px-3 py-1 border border-gray-400 rounded text-gray-800 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, or interviewer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full sm:w-1/3 text-gray-800"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-600">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 border-collapse text-gray-800 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Candidate Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Interview Title</th>
                <th className="border p-2 text-left">Time</th>
                <th className="border p-2 text-left">Interviewer(s)</th>
                <th className="border p-2 text-left">Meeting Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border p-4 text-center text-gray-500">
                    No scheduled interviews found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border p-2">{item.cv?.name || '-'}</td>
                    <td className="border p-2">{item.cv?.email || '-'}</td>
                    <td className="border p-2">{item.cv?.phone || '-'}</td>
                    <td className="border p-2">{item.title || '-'}</td>
                    <td className="border p-2">
                      {item.dateTime ? new Date(item.dateTime).toLocaleString() : '-'}
                    </td>
                    <td className="border p-2">
                      {item.interviewers?.length
                        ? item.interviewers.map((intv: any) => intv.user.name).join(', ')
                        : item.interviewer?.name || '-'}
                    </td>
                    <td className="border p-2">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          Join
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
