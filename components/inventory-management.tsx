"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  quantity: number
  expiry_date: string
  reorder_level: number
  supplier_id: number
  cost_price: number
  selling_price: number
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    expiry_date: "",
    reorder_level: 0,
    supplier_id: 1,
    cost_price: 0,
    selling_price: 0,
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        const addedProduct = await response.json()
        setInventory([...inventory, addedProduct])
        setIsAddDialogOpen(false)
        setNewProduct({
          name: "",
          quantity: 0,
          expiry_date: "",
          reorder_level: 0,
          supplier_id: 1,
          cost_price: 0,
          selling_price: 0,
        })
        toast({
          title: "Success",
          description: "Product added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/inventory/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProduct),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setInventory(inventory.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setInventory(inventory.filter((p) => p.id !== id))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= reorderLevel) {
      return <Badge variant="destructive">Low Stock</Badge>
    } else if (quantity <= reorderLevel * 1.5) {
      return <Badge variant="secondary">Medium Stock</Badge>
    }
    return <Badge variant="default">Good Stock</Badge>
  }

  const isNearExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiry <= thirtyDaysFromNow
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your pharmaceutical inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter the details for the new product</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={newProduct.expiry_date}
                      onChange={(e) => setNewProduct({ ...newProduct, expiry_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reorder_level">Reorder Level</Label>
                    <Input
                      id="reorder_level"
                      type="number"
                      value={newProduct.reorder_level}
                      onChange={(e) => setNewProduct({ ...newProduct, reorder_level: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price (₦)</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={newProduct.cost_price}
                      onChange={(e) => setNewProduct({ ...newProduct, cost_price: Number.parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="selling_price">Selling Price (₦)</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      value={newProduct.selling_price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, selling_price: Number.parseFloat(e.target.value) })
                      }
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Overview of all products in stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {product.name}
                        {isNearExpiry(product.expiry_date) && (
                          <AlertTriangle className="w-4 h-4 ml-2 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <span className={isNearExpiry(product.expiry_date) ? "text-orange-600 font-medium" : ""}>
                        {product.expiry_date}
                      </span>
                    </TableCell>
                    <TableCell>{product.reorder_level}</TableCell>
                    <TableCell>₦{product.cost_price.toFixed(2)}</TableCell>
                    <TableCell>₦{product.selling_price.toFixed(2)}</TableCell>
                    <TableCell>{getStockStatus(product.quantity, product.reorder_level)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsEditDialogOpen(true)
                          }}
                          className="w-full sm:w-auto"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-full sm:w-auto"
                        >
                          Delete
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
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Edit the details for the product</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={editingProduct?.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value } as Product)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={editingProduct?.quantity || 0}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, quantity: Number.parseInt(e.target.value) } as Product)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={editingProduct?.expiry_date || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, expiry_date: e.target.value } as Product)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reorder_level">Reorder Level</Label>
                <Input
                  id="reorder_level"
                  type="number"
                  value={editingProduct?.reorder_level || 0}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      reorder_level: Number.parseInt(e.target.value),
                    } as Product)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="cost_price">Cost Price (₦)</Label>
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  value={editingProduct?.cost_price || 0}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, cost_price: Number.parseFloat(e.target.value) } as Product)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="selling_price">Selling Price (₦)</Label>
                <Input
                  id="selling_price"
                  type="number"
                  step="0.01"
                  value={editingProduct?.selling_price || 0}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      selling_price: Number.parseFloat(e.target.value),
                    } as Product)
                  }
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Update Product
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
