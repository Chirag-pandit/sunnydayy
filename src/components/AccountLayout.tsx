"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ReactNode } from "react"

interface AccountLayoutProps {
  children: ReactNode
  title: string
}

export default function AccountLayout({ children, title }: AccountLayoutProps) {
  const pathname = usePathname()

  const tabItems = [
    { id: "overview", label: "Overview", href: "/account/profile" },
    { id: "orders", label: "Orders", href: "/account/orders" },
    { id: "wishlist", label: "Wishlist", href: "/account/wishlist" },
    { id: "settings", label: "Settings", href: "/account/settings" },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-2xl p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-6 text-white">Account</h3>
              <nav className="space-y-2">
                {tabItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-white text-black shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 