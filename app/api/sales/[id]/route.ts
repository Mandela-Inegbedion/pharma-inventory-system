import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock sales data (same as in sales/route.ts)
const sales = [
  {
    id: 1,
    product_id: 1,
    product_name: "Paracetamol 500mg",
    quantity: 100,
    unit_price: 375.0,
    total_amount: 37500.0,
    date_sold: "2025-01-15",
    sold_by: "clerk",
  },
  {
    id: 2,
    product_id: 2,
    product_name: "Amoxicillin 250mg",
    quantity: 50,
    unit_price: 900.0,
    total_amount: 45000.0,
    date_sold: "2025-01-14",
    sold_by: "clerk",
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const data = await request.json()

    const saleIndex = sales.findIndex((s) => s.id === id)
    if (saleIndex === -1) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    // Only allow editing if user is admin or the one who made the sale
    if (user.role !== "admin" && sales[saleIndex].sold_by !== user.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    sales[saleIndex] = { ...sales[saleIndex], ...data }
    return NextResponse.json(sales[saleIndex])
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
    const saleIndex = sales.findIndex((s) => s.id === id)

    if (saleIndex === -1) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    sales.splice(saleIndex, 1)
    return NextResponse.json({ message: "Sale deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
