import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-2 md:px-10">
        <section className="space-y-5">
          <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Pharmaceutical Wholesale Platform
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Decision Support and Inventory Management System
          </h1>
          <p className="max-w-xl text-slate-600">
            Manage products, suppliers, and sales with role-based access for administrators, inventory managers, and
            sales clerks.
          </p>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-4 text-sm text-slate-700">
            Use the demo accounts in the login panel to access each role quickly.
          </div>
        </section>
        <section className="flex items-center md:justify-end">
        <LoginForm />
        </section>
      </div>
    </div>
  )
}
