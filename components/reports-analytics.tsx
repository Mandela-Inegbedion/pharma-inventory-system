"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { FileText, AlertTriangle } from "lucide-react"
// import { LoadingSkeleton } from "@/components/loading-skeleton"

interface Sale {
  id: number
  product_name: string
  quantity: number
  total_amount: number
  date_sold: string
}

interface Product {
  id: number
  name: string
  quantity: number
  reorder_level: number
  expiry_date: string
  cost_price: number
  selling_price: number
}

interface Supplier {
  id: number
  name: string
}

export function ReportsAndAnalytics() {
  const [sales, setSales] = useState<Sale[]>([])
  const [inventory, setInventory] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const [salesRes, inventoryRes, suppliersRes] = await Promise.all([
        fetch("/api/sales", { headers }),
        fetch("/api/inventory", { headers }),
        fetch("/api/suppliers", { headers }),
      ])

      if (salesRes.ok) {
        const salesData = await salesRes.json()
        setSales(salesData)
      }

      if (inventoryRes.ok) {
        const inventoryData = await inventoryRes.json()
        setInventory(inventoryData)
      }

      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json()
        setSuppliers(suppliersData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const monthlySalesData = sales.reduce(
    (acc, sale) => {
      const month = new Date(sale.date_sold).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + sale.total_amount
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(monthlySalesData).map(([month, revenue]) => ({
    month,
    revenue,
  }))

  const lowStockItems = inventory.filter((item) => item.quantity <= item.reorder_level)
  const nearExpiryItems = inventory.filter((item) => {
    const expiryDate = new Date(item.expiry_date)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow
  })

  const topSellingProducts = sales.reduce(
    (acc, sale) => {
      acc[sale.product_name] = (acc[sale.product_name] || 0) + sale.quantity
      return acc
    },
    {} as Record<string, number>,
  )

  const topProducts = Object.entries(topSellingProducts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }))

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-0">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Decision support system with comprehensive reports</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-0">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-4 w-4 text-muted-foreground font-bold">₦</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{sales.reduce((sum, sale) => sum + sale.total_amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All time sales</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{nearExpiryItems.length}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-4 sm:mt-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Monthly Sales Revenue</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <Badge variant="secondary">{product.quantity} sold</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Low Stock Report</CardTitle>
            <CardDescription>Products requiring immediate reorder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.reorder_level}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Reorder Now</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {lowStockItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        All products are well stocked
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Expiry Alert Report</CardTitle>
            <CardDescription>Products expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Days Left</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nearExpiryItems.map((item) => {
                    const daysLeft = Math.ceil(
                      (new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.expiry_date}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={daysLeft <= 7 ? "destructive" : "secondary"}>{daysLeft} days</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {nearExpiryItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No products expiring soon
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
