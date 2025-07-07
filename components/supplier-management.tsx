"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Building2, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Supplier {
  id: number
  name: string
  contact_person: string
  phone: string
  email: string
  address: string
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
  })

  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSuppliers(data)
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupplier),
      })

      if (response.ok) {
        const addedSupplier = await response.json()
        setSuppliers([...suppliers, addedSupplier])
        setIsAddDialogOpen(false)
        setNewSupplier({
          name: "",
          contact_person: "",
          phone: "",
          email: "",
          address: "",
        })
        toast({
          title: "Success",
          description: "Supplier added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive",
      })
    }
  }

  const handleEditSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSupplier) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/suppliers/${editingSupplier.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSupplier),
      })

      if (response.ok) {
        const updatedSupplier = await response.json()
        setSuppliers(suppliers.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s)))
        setIsEditDialogOpen(false)
        setEditingSupplier(null)
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSuppliers(suppliers.filter((s) => s.id !== id))
        toast({
          title: "Success",
          description: "Supplier deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading suppliers...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supplier Management</h1>
          <p className="text-muted-foreground">Manage your pharmaceutical suppliers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>Enter the details for the new supplier</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={newSupplier.contact_person}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact_person: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Supplier
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Supplier</DialogTitle>
                <DialogDescription>Update the supplier details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSupplier} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Company Name</Label>
                  <Input
                    id="edit-name"
                    value={editingSupplier?.name || ""}
                    onChange={(e) => setEditingSupplier((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contact">Contact Person</Label>
                  <Input
                    id="edit-contact"
                    value={editingSupplier?.contact_person || ""}
                    onChange={(e) =>
                      setEditingSupplier((prev) => (prev ? { ...prev, contact_person: e.target.value } : null))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingSupplier?.phone || ""}
                    onChange={(e) => setEditingSupplier((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingSupplier?.email || ""}
                    onChange={(e) => setEditingSupplier((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={editingSupplier?.address || ""}
                    onChange={(e) => setEditingSupplier((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Supplier
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {supplier.name}
              </CardTitle>
              <CardDescription>Contact: {supplier.contact_person}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2" />
                {supplier.phone}
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2" />
                {supplier.email}
              </div>
              <div className="text-sm text-muted-foreground">{supplier.address}</div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingSupplier(supplier)
                    setIsEditDialogOpen(true)
                  }}
                  className="w-full sm:w-auto"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>Complete list of registered suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact_person}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
