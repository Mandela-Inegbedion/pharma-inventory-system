"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface PDFExportProps {
  data: any[]
  filename: string
  title: string
}

export function PDFExport({ data, filename, title }: PDFExportProps) {
  const generatePDF = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PharmaDSS</div>
            <h2>${title}</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {})
                  .map((key) => `<th>${key}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${Object.values(row)
                    .map((value) => `<td>${value}</td>`)
                    .join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>PharmaDSS - Pharmaceutical Decision Support System</p>
            <p>Confidential Business Report</p>
          </div>
        </body>
      </html>
    `

    // Create and download PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  return (
    <Button variant="outline" onClick={generatePDF}>
      <FileText className="w-4 h-4 mr-2" />
      Export PDF
    </Button>
  )
}
