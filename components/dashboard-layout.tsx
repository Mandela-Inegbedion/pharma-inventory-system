"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  Building2,
  Menu,
} from "lucide-react"
import Link from "next/link"

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  roles: string[]
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  if (!user) return null

  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "inventory_manager", "sales_clerk"],
    },
    {
      name: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
      roles: ["admin", "inventory_manager"],
    },
    {
      name: "Suppliers",
      href: "/dashboard/suppliers",
      icon: Building2,
      roles: ["admin", "inventory_manager"],
    },
    {
      name: "Sales",
      href: "/dashboard/sales",
      icon: ShoppingCart,
      roles: ["admin", "inventory_manager", "sales_clerk"],
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["admin", "inventory_manager"],
    },
  ]

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role)
  )

  const formattedRole =
    user.role.replace("_", " ").charAt(0).toUpperCase() +
    user.role.replace("_", " ").slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-blue-900 text-white border-blue-700 shadow-lg"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">₦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PharmaDSS</h1>
              <p className="text-xs text-blue-200">Inventory System</p>
            </div>
          </div>
          <p className="text-sm text-blue-200 mt-3 px-2 py-1 bg-blue-800 rounded">
            {user.role.replace("_", " ").toUpperCase()}
          </p>
        </div>

        <nav className="mt-6">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-white"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-blue-700">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-20 sm:pt-16 lg:pt-8">
          <div className="mb-4 sm:mb-6 mt-6 sm:mt-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome, {user.username}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Role: {formattedRole}
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
