"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter } from "lucide-react"
import { format } from "date-fns"

interface FilterProps {
  onFilterChange: (filters: any) => void
}

export function AdvancedFilters({ onFilterChange }: FilterProps) {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedSupplier, setSelectedSupplier] = useState<string>("")

  const handleApplyFilters = () => {
    onFilterChange({
      dateFrom,
      dateTo,
      product: selectedProduct,
      supplier: selectedSupplier,
    })
  }

  const handleClearFilters = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    setSelectedProduct("")
    setSelectedSupplier("")
    onFilterChange({})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <div>
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div>
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Product Filter */}
          <div>
            <Label>Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paracetamol">Paracetamol 500mg</SelectItem>
                <SelectItem value="amoxicillin">Amoxicillin 250mg</SelectItem>
                <SelectItem value="ibuprofen">Ibuprofen 400mg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Supplier Filter */}
          <div>
            <Label>Supplier</Label>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medsupply">MedSupply Co.</SelectItem>
                <SelectItem value="pharmacorp">PharmaCorp Ltd</SelectItem>
                <SelectItem value="healthdist">HealthDistributors Inc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
