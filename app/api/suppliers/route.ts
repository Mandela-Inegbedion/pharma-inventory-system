import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock suppliers data
const suppliers = [
  {
    id: 1,
    name: "MedSupply Co.",
    contact_person: "John Smith",
    phone: "+1-555-0123",
    email: "john@medsupply.com",
    address: "123 Medical St, Healthcare City",
  },
  {
    id: 2,
    name: "PharmaCorp Ltd",
    contact_person: "Sarah Johnson",
    phone: "+1-555-0456",
    email: "sarah@pharmacorp.com",
    address: "456 Pharma Ave, Medicine Town",
  },
]

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(suppliers)
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
    const newSupplier = {
      id: suppliers.length + 1,
      ...data,
    }
    suppliers.push(newSupplier)

    return NextResponse.json(newSupplier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
