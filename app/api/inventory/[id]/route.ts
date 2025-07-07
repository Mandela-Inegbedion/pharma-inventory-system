import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock inventory data (same as in inventory/route.ts)
const inventory = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    quantity: 1500,
    expiry_date: "2025-12-31",
    reorder_level: 200,
    supplier_id: 1,
    cost_price: 250.0,
    selling_price: 375.0,
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    quantity: 800,
    expiry_date: "2025-10-15",
    reorder_level: 150,
    supplier_id: 2,
    cost_price: 600.0,
    selling_price: 900.0,
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    quantity: 50,
    expiry_date: "2026-03-20",
    reorder_level: 100,
    supplier_id: 1,
    cost_price: 400.0,
    selling_price: 600.0,
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || (user.role !== "admin" && user.role !== "inventory_manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const data = await request.json()

    const productIndex = inventory.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    inventory[productIndex] = { ...inventory[productIndex], ...data }
    return NextResponse.json(inventory[productIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const productIndex = inventory.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    inventory.splice(productIndex, 1)
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
