import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock suppliers data (same as in suppliers/route.ts)
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || (user.role !== "admin" && user.role !== "inventory_manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const data = await request.json()

    const supplierIndex = suppliers.findIndex((s) => s.id === id)
    if (supplierIndex === -1) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
    }

    suppliers[supplierIndex] = { ...suppliers[supplierIndex], ...data }
    return NextResponse.json(suppliers[supplierIndex])
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
    const supplierIndex = suppliers.findIndex((s) => s.id === id)

    if (supplierIndex === -1) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
    }

    suppliers.splice(supplierIndex, 1)
    return NextResponse.json({ message: "Supplier deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
