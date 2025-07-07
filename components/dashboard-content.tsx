"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, AlertTriangle, TrendingUp } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Product {
  id: number
  name: string
  quantity: number
  expiry_date: string
  reorder_level: number
  cost_price: number
  selling_price: number
}

interface Sale {
  id: number
  product_name: string
  quantity: number
  total_amount: number
  date_sold: string
}

export function DashboardContent() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        const [inventoryRes, salesRes] = await Promise.all([
          fetch("/api/inventory", { headers }),
          fetch("/api/sales", { headers }),
        ])

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json()
          setInventory(inventoryData)
        }

        if (salesRes.ok) {
          const salesData = await salesRes.json()
          setSales(salesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalProducts = inventory.length

  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => item.quantity <= item.reorder_level)
  }, [inventory])

  const nearExpiryItems = useMemo(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return inventory.filter((item) => {
      const expiryDate = new Date(item.expiry_date)
      return expiryDate <= thirtyDaysFromNow
    })
  }, [inventory])

  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + sale.total_amount, 0)
  }, [sales])

  const totalInventoryValue = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.quantity * item.cost_price, 0)
  }, [inventory])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Products</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need reordering</p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground font-bold text-xs sm:text-sm">₦</div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold">₦{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From recent sales</p>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xl sm:text-2xl font-bold">₦{totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert className="border-l-4 border-l-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{lowStockItems.length} items</strong> are running low on stock and need reordering.
          </AlertDescription>
        </Alert>
      )}

      {nearExpiryItems.length > 0 && (
        <Alert className="border-l-4 border-l-orange-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{nearExpiryItems.length} items</strong> are expiring within 30 days.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {item.quantity} | Reorder at: {item.reorder_level}
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
              {lowStockItems.length === 0 && <p className="text-muted-foreground">All items are well stocked</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{sale.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {sale.quantity} | {sale.date_sold}
                    </p>
                  </div>
                  <Badge variant="secondary">₦{sale.total_amount.toFixed(2)}</Badge>
                </div>
              ))}
              {sales.length === 0 && <p className="text-muted-foreground">No recent sales</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
