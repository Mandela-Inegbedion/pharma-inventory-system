import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock sales data
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

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(sales)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const newSale = {
      id: sales.length + 1,
      ...data,
      date_sold: new Date().toISOString().split("T")[0],
      sold_by: user.username,
    }
    sales.push(newSale)

    return NextResponse.json(newSale, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
