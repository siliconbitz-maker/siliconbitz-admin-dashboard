'use client'
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import {
    BrushCleaning,
    ChevronDown,
    ClipboardType,
    Component,
    FileType,
    Fingerprint,
    Gauge,
    Gem,
    MessageSquareText,
    Minus,
    PanelLeftDashed,
    Phone,
    PieChart,
    RectangleEllipsis,
    Rocket,
    ScrollText,
    Settings,
    Sheet,
    SquareKanban,
    TableProperties,
    X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import NavLink from '@/components/layout/nav-link'
import { Badge } from '@/components/ui/badge'

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathName = usePathname()

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
            mainContent.style.marginLeft = isSidebarOpen ? '260px' : '60px' // Adjust this value as needed
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
            [
                '/',
                '/crypto-dashboard',
                '/product-card',
                '/add-product',
                '/product-details',
                '/product-checkout',
            ].includes(pathName)
        ) {
            return 'item-1'
        } else if (
            ['/invoice', '/invoice-details', '/create-invoice'].includes(
                pathName,
            )
        ) {
            return 'item-3'
        } else if (
            [
                '/accordion-page',
                '/alert',
                '/alert-dialog',
                '/avatar',
                '/breadcrumbs',
                '/buttons',
                '/calendar-page',
                '/card-page',
                '/carousel',
                '/collapsible-page',
                '/context-menu-page',
                '/date-picker',
                '/dialog',
                '/drawer-page',
                '/dropdown',
                '/empty-stats',
                '/hover-card',
                '/menubar',
                '/pagination',
                '/popover',
                '/progress',
                '/resizable',
                '/scroll-area',
                '/separator',
                '/sheet-page',
                '/skeleton',
                '/slider',
                '/sonner',
                '/tabs',
                '/tag',
                '/toasts',
                '/toggle-group',
                '/tooltip',
            ].includes(pathName)
        ) {
            return 'item-4'
        } else if (
            [
                '/checkbox',
                '/combobox',
                '/command',
                '/form',
                '/inputs',
                '/input-otp',
            ].includes(pathName)
        ) {
            return 'item-5'
        } else {
            return ''
        }
    }

    useEffect(() => {
        if (document?.getElementById('overlay')?.classList?.contains('open')) {
            toggleSidebarResponsive()
        }
    }, [pathName])

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
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="absolute -top-3.5 -right-2.5 hidden size-6 place-content-center rounded-full border border-gray-300 bg-white text-black lg:grid"
                >
                    <ChevronDown
                        className={`h-4 w-4 rotate-90 ${isSidebarOpen ? 'hidden' : ''}`}
                    />
                    <ChevronDown
                        className={`hidden h-4 w-4 -rotate-90 ${isSidebarOpen ? 'block!' : ''}`}
                    />
                </button>
                <div className="flex items-start justify-between border-b border-gray-300 px-4 py-5 lg:hidden">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/"
                            width={145}
                            height={34}
                            alt="Logo"
                            className="h-auto w-auto"
                        />
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
                                    <NavLink href="/" isAccordion={true}>
                                        Sales
                                    </NavLink>
                                </li>
                               
                                <li>
                                    <NavLink
                                        href="/projects-dashboard"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
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

                    <NavLink
                        href="/chat"
                        target="_blank"
                        className={`nav-link ${pathName === '/chat' && 'text-black!'}`}
                        isProfessionalPlanRoute={true}
                    >
                        <MessageSquareText className="size-[18px] shrink-0" />
                        <span>Chat</span>
                    </NavLink>

                    <NavLink
                        href="/scrumboard"
                        target="_blank"
                        isProfessionalPlanRoute={true}
                        className={`nav-link ${pathName === '/scrumboard' && 'text-black!'}`}
                    >
                        <SquareKanban className="size-[18px] shrink-0" />
                        <span>Scrumboard</span>
                    </NavLink>

                    <AccordionItem value="item-2" className="p-0 shadow-none">
                        <AccordionTrigger
                            defaultValue={
                                [
                                    '/blog-list',
                                    '/blog-details',
                                    '/add-blog',
                                ].includes(pathName)
                                    ? 'item-2'
                                    : ''
                            }
                            className="nav-link"
                        >
                            <SquareKanban className="size-[18px] shrink-0 -rotate-90" />
                            <span>Blog</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12">
                                <li>
                                    <NavLink
                                        href="/blog-list"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Blog-list
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/blog-details"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Blog details
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/add-blog"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
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
                                    <NavLink
                                        href="/invoice"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Invoice
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/invoice-details"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Invoice details
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/create-invoice"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Create Invoice
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <h3 className="mt-2.5 rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold whitespace-nowrap text-black uppercase">
                        <span>User Interface</span>
                        <Minus className="text-gray hidden h-4 w-5" />
                    </h3>

                   

                    <NavLink href="/chart" className={`nav-link`}>
                        <PieChart className="size-[18px] shrink-0" />
                        <span>Charts</span>
                    </NavLink>

                   

                  

                    <h3 className="mt-2.5 rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold whitespace-nowrap text-black uppercase">
                        <span>Pages</span>
                        <Minus className="text-gray hidden h-4 w-5" />
                    </h3>

                    <NavLink
                        href="/setting"
                        className={`nav-link ${pathName === '/setting' && 'text-black!'}`}
                    >
                        <Settings className="size-[18px] shrink-0" />
                        <span>Settings</span>
                    </NavLink>

                    <AccordionItem value="item-6" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <Fingerprint className="size-[18px] shrink-0" />
                            <span>Authentication</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12">
                                <li>
                                    <NavLink
                                        href="/login"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/register"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Register
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/forgot"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Forgot
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/password"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Password
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                   
                </Accordion>
               
            </Card>
        </>
    )
}

export default Sidebar
