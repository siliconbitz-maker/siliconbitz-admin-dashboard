'use client'

import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10 sm:px-6 lg:px-8">
      <Loader2 className="w-10 h-10 animate-spin text-[#6366F1] mb-3" />
      <p className="text-base sm:text-lg font-medium text-[#1F2937]">{text}</p>
    </div>
  )
}
