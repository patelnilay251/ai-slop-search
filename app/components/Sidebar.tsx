'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
    Home,
    Search,
    Bookmark,
    Settings,
    Menu as MenuIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItem {
    name: string
    href: string
    icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    // Define the tabs or links you want in the sidebar
    const navItems: SidebarItem[] = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Search', href: '/search', icon: Search },
        { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
        { name: 'Settings', href: '/settings', icon: Settings },
    ]

    return (
        <motion.aside
            // Animate width between collapsed/expanded
            animate={{ width: isCollapsed ? 60 : 240 }}
            className="bg-white/10 backdrop-blur-md h-screen flex flex-col shadow-md font-sans"
            transition={{ duration: 0.4 }}
        >
            {/* Header / Logo / Collapse Button */}
            <div className="p-4 flex items-center justify-between border-b border-white/20">
                {!isCollapsed && (
                    <span className="text-xl font-bold text-primary-foreground">
                        AI-Slop
                    </span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-primary-foreground hover:text-white transition-colors duration-300 ml-auto"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-auto py-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center mx-2 px-3 py-2 text-sm rounded-md
                transition-colors duration-300
                ${isActive
                                    ? 'bg-white/20 text-primary-foreground'
                                    : 'text-primary-foreground/80 hover:text-white hover:bg-white/20'
                                }
              `}
                        >
                            <Icon className="h-5 w-5 mr-2" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    )
                })}
            </nav>
        </motion.aside>
    )
}