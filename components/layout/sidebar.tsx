'use client'
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import {
    ChevronDown,
    LogOut,
    Minus,
    SquareKanban,
    ScrollText,
    Gauge,
    PieChart,
    Settings,
    X,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import NavLink from '@/components/layout/nav-link'

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathName = usePathname()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
            mainContent.style.marginLeft = isSidebarOpen ? '260px' : '60px'
        }
    }

    const toggleSidebarResponsive = () => {
        document.getElementById('sidebar')?.classList.remove('open')
        document.getElementById('overlay')?.classList.toggle('open')
    }

    const isOpen = () => {
        if (['/blog-list', '/blog-details', '/add-blog'].includes(pathName)) {
            return 'item-2'
        } else if (
            ['/', '/crypto-dashboard', '/product-card', '/add-product', '/product-details', '/product-checkout'].includes(pathName)
        ) {
            return 'item-1'
        } else if (['/invoice', '/invoiceDetails'].includes(pathName)) {
            return 'item-3'
        } else {
            return ''
        }
    }

    const isAdmin = userEmail === 'admin@siliconbitz.com'

    const handleSignOut = async () => {
        try {
            setIsLoading(true)
            await fetch('/api/logout', { method: 'POST' })
            router.push('/')
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (document?.getElementById('overlay')?.classList?.contains('open')) {
            toggleSidebarResponsive()
        }
    }, [pathName])

    useEffect(() => {
        fetch('/api/me')
            .then(res => res.json())
            .then(data => setUserEmail(data.user?.email || null))
    }, [])

    return (
        <>
            <div
                id="overlay"
                className="fixed inset-0 z-30 hidden bg-black/50"
                onClick={toggleSidebarResponsive}
            ></div>

            <Card
                id="sidebar"
                className={`sidebar fixed top-0 -left-[260px] z-40 flex h-screen w-[260px] flex-col rounded-none transition-all duration-300 lg:top-16 lg:left-0 lg:h-[calc(100vh-64px)] ${isSidebarOpen ? 'closed' : ''}`}
            >
                <div className="flex items-start justify-between border-b border-gray-300 px-4 py-5 lg:hidden">
                    <Link href="/" className="inline-block">
                        Siliconbitz
                    </Link>
                    <button type="button" onClick={toggleSidebarResponsive}>
                        <X className="-mt-2 -mr-2 ml-auto size-4 hover:text-black" />
                    </button>
                </div>

                <Accordion
                    type="single"
                    defaultValue={isOpen()}
                    collapsible
                    className="sidemenu grow overflow-x-hidden overflow-y-auto px-2.5 pt-2.5 pb-10 transition-all"
                    key={pathName}
                >
                    <AccordionItem value="item-1" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <Gauge className="size-[18px] shrink-0" />
                            <span>Dashboard</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pr-0 pl-12">
                                <li>
                                    <NavLink href="/dashboard" isAccordion={true}>
                                        Overview
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href="/projects" isAccordion={true}>
                                        Projects
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <h3 className="mt-2.5 rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold whitespace-nowrap text-black uppercase">
                        <span>Apps</span>
                        <Minus className="text-gray hidden h-4 w-5" />
                    </h3>

                    <NavLink href="/scrumboard" className={`nav-link ${pathName === '/scrumboard' && 'text-black!'}`}>
                        <SquareKanban className="size-[18px] shrink-0" />
                        <span>Scrumboard</span>
                    </NavLink>

                    <AccordionItem value="item-2" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <SquareKanban className="size-[18px] shrink-0 -rotate-90" />
                            <span>Blog</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12">
                                <li>
                                    <NavLink href="/blog" isAccordion={true}>
                                        Blog details
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href="/blog/new" isAccordion={true}>
                                        Add New Blog
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <ScrollText className="size-[18px] shrink-0" />
                            <span>Invoice</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12">
                                <li>
                                    <NavLink href="/invoice" isAccordion={true}>
                                        Invoice
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href="/invoiceDetails" isAccordion={true}>
                                        Invoice details
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <h3 className="mt-2.5 rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold whitespace-nowrap text-black uppercase">
                        <span>User Interface</span>
                        <Minus className="text-gray hidden h-4 w-5" />
                    </h3>

                    <NavLink href="/users" className={`nav-link`}>
                        <PieChart className="size-[18px] shrink-0" />
                        <span>Users</span>
                    </NavLink>

                    {isAdmin && (
                        <NavLink href="/register" className={`nav-link ${pathName === '/register' ? 'text-black' : ''}`}>
                            <Settings className="size-[18px] shrink-0" />
                            <span>User Register</span>
                        </NavLink>
                    )}

                    {/* ✅ Sign out button with loading spinner */}
                    <button
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-danger hover:bg-red-50 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-red-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                <span>Signing out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="size-[18px] shrink-0" />
                                <span>Sign out</span>
                            </>
                        )}
                    </button>
                </Accordion>
            </Card>
        </>
    )
}

export default Sidebar
