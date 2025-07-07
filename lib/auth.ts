import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    return {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}
