import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock inventory data
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

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(inventory)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || (user.role !== "admin" && user.role !== "inventory_manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const newProduct = {
      id: inventory.length + 1,
      ...data,
    }
    inventory.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
