"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ShoppingCart, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Sale {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_amount: number
  date_sold: string
  sold_by: string
}

interface Product {
  id: number
  name: string
  quantity: number
  selling_price: number
}

export function SalesManagement() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newSale, setNewSale] = useState({
    product_id: 0,
    quantity: 1,
  })

  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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

      const [salesRes, inventoryRes] = await Promise.all([
        fetch("/api/sales", { headers }),
        fetch("/api/inventory", { headers }),
      ])

      if (salesRes.ok) {
        const salesData = await salesRes.json()
        setSales(salesData)
      }

      if (inventoryRes.ok) {
        const inventoryData = await inventoryRes.json()
        setProducts(inventoryData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSale) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/sales/${editingSale.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSale),
      })

      if (response.ok) {
        const updatedSale = await response.json()
        setSales(sales.map((s) => (s.id === updatedSale.id ? updatedSale : s)))
        setIsEditDialogOpen(false)
        setEditingSale(null)
        toast({
          title: "Success",
          description: "Sale updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sale",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSale = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sale record?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/sales/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSales(sales.filter((s) => s.id !== id))
        toast({
          title: "Success",
          description: "Sale deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sale",
        variant: "destructive",
      })
    }
  }

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedProduct = products.find((p) => p.id === newSale.product_id)
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      })
      return
    }

    if (newSale.quantity > selectedProduct.quantity) {
      toast({
        title: "Error",
        description: "Insufficient stock available",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const saleData = {
        product_id: newSale.product_id,
        product_name: selectedProduct.name,
        quantity: newSale.quantity,
        unit_price: selectedProduct.selling_price,
        total_amount: newSale.quantity * selectedProduct.selling_price,
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      })

      if (response.ok) {
        const addedSale = await response.json()
        setSales([addedSale, ...sales])
        setIsAddDialogOpen(false)
        setNewSale({
          product_id: 0,
          quantity: 1,
        })

        // Update product quantity locally
        setProducts(
          products.map((p) => (p.id === newSale.product_id ? { ...p, quantity: p.quantity - newSale.quantity } : p)),
        )

        toast({
          title: "Success",
          description: "Sale recorded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      })
    }
  }

  const selectedProduct = products.find((p) => p.id === newSale.product_id)
  const totalAmount = selectedProduct ? newSale.quantity * selectedProduct.selling_price : 0

  if (loading) {
    return <div>Loading sales data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-muted-foreground">Record and track pharmaceutical sales</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>Enter the details for the new sale transaction</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  value={newSale.product_id.toString()}
                  onValueChange={(value) => setNewSale({ ...newSale, product_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products
                      .filter((p) => p.quantity > 0)
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} (Stock: {product.quantity})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <strong>Unit Price:</strong> ₦{selectedProduct.selling_price.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Available Stock:</strong> {selectedProduct.quantity}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct?.quantity || 1}
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({ ...newSale, quantity: Number.parseInt(e.target.value) })}
                  required
                />
              </div>

              {selectedProduct && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold">Total Amount: ₦{totalAmount.toFixed(2)}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!selectedProduct}>
                Record Sale
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales.filter((sale) => sale.date_sold === new Date().toISOString().split("T")[0]).length}
            </div>
            <p className="text-sm text-muted-foreground">transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦
              {sales
                .filter((sale) => sale.date_sold === new Date().toISOString().split("T")[0])
                .reduce((sum, sale) => sum + sale.total_amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-sm text-muted-foreground">all time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>Complete record of all sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Sold By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date_sold}</TableCell>
                    <TableCell className="font-medium">{sale.product_name}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>₦{sale.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">₦{sale.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{sale.sold_by}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSale(sale)
                            setIsEditDialogOpen(true)
                          }}
                          className="p-1 sm:p-2"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSale(sale.id)}
                          className="p-1 sm:p-2"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>Edit the details for the sale transaction</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSale} className="space-y-4">
            <div>
              <Label htmlFor="product">Product</Label>
              <Input id="product" type="text" value={editingSale?.product_name || ""} disabled />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={editingSale?.quantity || 1}
                onChange={(e) => setEditingSale({ ...editingSale!, quantity: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                value={editingSale?.unit_price || 0}
                onChange={(e) => setEditingSale({ ...editingSale!, unit_price: Number(e.target.value) })}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Update Sale
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
