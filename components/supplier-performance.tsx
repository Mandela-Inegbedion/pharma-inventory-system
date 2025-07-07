"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface SupplierPerformance {
  id: number
  name: string
  totalOrders: number
  onTimeDeliveries: number
  totalValue: number
  performanceScore: number
}

export function SupplierPerformance() {
  const [suppliers, setSuppliers] = useState<SupplierPerformance[]>([
    {
      id: 1,
      name: "MedSupply Co.",
      totalOrders: 45,
      onTimeDeliveries: 42,
      totalValue: 2500000,
      performanceScore: 93.3,
    },
    {
      id: 2,
      name: "PharmaCorp Ltd",
      totalOrders: 38,
      onTimeDeliveries: 35,
      totalValue: 1800000,
      performanceScore: 92.1,
    },
    {
      id: 3,
      name: "HealthDistributors Inc",
      totalOrders: 52,
      onTimeDeliveries: 48,
      totalValue: 3200000,
      performanceScore: 92.3,
    },
  ])

  const getPerformanceBadge = (score: number) => {
    if (score >= 95) return <Badge className="bg-green-500">Excellent</Badge>
    if (score >= 90) return <Badge className="bg-blue-500">Good</Badge>
    if (score >= 80) return <Badge className="bg-yellow-500">Average</Badge>
    return <Badge variant="destructive">Poor</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Overview</CardTitle>
          <CardDescription>Track supplier reliability and delivery performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              performance: {
                label: "Performance Score",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={suppliers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="performanceScore" fill="var(--color-performance)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Supplier Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>On-Time Deliveries</TableHead>
                <TableHead>Total Value (₦)</TableHead>
                <TableHead>Performance Score</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.totalOrders}</TableCell>
                  <TableCell>{supplier.onTimeDeliveries}</TableCell>
                  <TableCell>₦{supplier.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{supplier.performanceScore}%</TableCell>
                  <TableCell>{getPerformanceBadge(supplier.performanceScore)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
