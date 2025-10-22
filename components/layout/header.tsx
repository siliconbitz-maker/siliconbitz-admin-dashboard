'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  CircleX,
  LogOut,
  Menu,
  UserCog,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


type UserType = { id: string; name: string; email: string }

const Header = () => {
  const [user, setUser] = useState<UserType | null>(null)
  
  const pathName = usePathname()
  const router = useRouter()

  useEffect(() => {
    // fetch current user
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
  }




  const toggleSidebar = () => {
    document.getElementById('sidebar')?.classList.toggle('open')
    document.getElementById('overlay')?.classList.toggle('open')
  }



  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white px-4 py-[15px] shadow-sm lg:px-5">
      <div className="flex items-center justify-between gap-5">
        
          <p>Siliconbitz</p>
        

        <div className="inline-flex items-center gap-3 sm:gap-5">
          {/* Notifications + Calendar same as before */}

          {/* User Dropdown */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="group flex cursor-pointer items-center gap-2.5 rounded-lg">
                  <div className="size-8 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/contact-us.svg"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                      alt="Profile Img"
                    />
                  </div>
                  <div className="hidden space-y-1 lg:block">
                    <h5 className="line-clamp-1 text-[10px]/3 font-semibold">
                      Welcome back 👋
                    </h5>
                    <h2 className="line-clamp-1 text-xs font-bold text-black">
                      {user ? user.name : 'Guest'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="-ml-1 mt-auto text-black transition group-hover:opacity-70"
                  >
                    <ChevronDown className="h-4 w-4 shrink-0 duration-300" />
                  </button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="min-w-[200px] space-y-1 rounded-lg p-1.5 text-sm font-medium"
              >
                
                <DropdownMenuItem className="p-0">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-1.5 text-danger rounded-lg px-3 py-2"
                  >
                    <LogOut className="size-[18px] shrink-0" />
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            type="button"
            className="order-3 duration-300 hover:opacity-80 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
