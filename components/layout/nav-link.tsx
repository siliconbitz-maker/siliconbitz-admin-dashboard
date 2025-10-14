'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Crown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface IProp {
    className?: string
    href: string
    active?: string
    target?: string
    targetPath?: string
    rel?: string
    children: React.ReactNode
    onClick?: () => void
    isAccordion?: boolean
    isSubAccordion?: boolean
    isProfessionalPlanRoute?: boolean
    newTag?: boolean
}
export default function NavLink({
    className,
    href,
    active,
    target,
    rel,
    children,
    onClick,
    targetPath,
    isAccordion,
    isSubAccordion,
    isProfessionalPlanRoute = false,
    newTag,
}: IProp) {
    const PROFESSION_PLAN = 'https://nexadash-next.vercel.app/'
    const pathName = usePathname()

    return (
        <Link
            href={href}
            target={target}
            rel={rel}
            className={cn(
                'relative flex items-center',
                {
                    'sub-menu-active':
                        (active ||
                            (!active && pathName === href) ||
                            (targetPath && pathName.startsWith(targetPath))) &&
                        (isAccordion || isSubAccordion),

                    active:
                        (active ||
                            (!active && pathName === href) ||
                            (targetPath && pathName.startsWith(targetPath))) &&
                        !(isAccordion || isSubAccordion),
                },
                'nav-item',
                className,
            )}
            onClick={onClick && onClick}
        >
            {children}
            {isAccordion && (
                <div className="absolute top-3 -left-5 flex flex-col items-center gap-1">
                    <div
                        className={cn(
                            'size-[5px] rounded-full bg-gray-700/50',
                            pathName === href && 'bg-primary',
                        )}
                    ></div>
                    <div className="h-7 w-px rounded-full bg-gray-300"></div>
                </div>
            )}

            {isSubAccordion && (
                <div className="absolute top-3 -left-4 flex flex-col items-center gap-1">
                    <div
                        className={`size-[5px] rounded-full bg-gray-700/50 ${pathName === href && 'bg-primary'}`}
                    ></div>
                    <div className="h-6 w-px rounded-full bg-gray-300"></div>
                </div>
            )}
            {newTag && (
                <Badge
                    variant={'primary'}
                    size={'number'}
                    className="px-1.25 tracking-wide"
                >
                    New
                </Badge>
            )}
            {isProfessionalPlanRoute && (
                <div className="bg-warning/15 absolute top-1/2 right-2 ml-auto -translate-y-1/2 rounded-sm p-0.75">
                    <Crown className="text-warning size-3.5" />
                </div>
            )}
        </Link>
    )
}
