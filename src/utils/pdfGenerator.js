import jsPDF from 'jspdf'

export const generateQuotePDF = (quoteData, logoUrl) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    workDescription,
    materials = [],
    labour = [],
    totalCost,
    notes,
    quoteDate = new Date().toLocaleDateString(),
  } = quoteData

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let yPosition = margin

  // Set colors for dark theme style
  doc.setFillColor(0, 0, 0) // Black background
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Add logo if available
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, 'JPEG', margin, yPosition, 40, 30)
      yPosition += 35
    } catch (e) {
      console.warn('Could not add logo:', e)
    }
  }

  // Company header
  doc.setTextColor(255, 255, 255) // White text
  doc.setFontSize(20)
  doc.text('ABACUS ELECTRICAL SCOTLAND', margin + 45, yPosition)
  yPosition += 10

  // Quote header
  doc.setFontSize(16)
  doc.text('QUOTE', pageWidth - margin - 40, yPosition)
  yPosition += 15

  // Company details
  doc.setFontSize(10)
  doc.text(`Phone: ${import.meta.env.VITE_COMPANY_PHONE || '+44 (0) XXX'}`, margin, yPosition)
  yPosition += 5
  doc.text(`Email: ${import.meta.env.VITE_COMPANY_EMAIL || 'info@abacuselectrical.co.uk'}`, margin, yPosition)
  yPosition += 5
  doc.text(`Address: ${import.meta.env.VITE_COMPANY_ADDRESS || 'Scotland'}`, margin, yPosition)
  yPosition += 10

  // Customer details section
  doc.setFontSize(12)
  doc.text('CUSTOMER DETAILS', margin, yPosition)
  yPosition += 5
  doc.setFontSize(10)
  doc.text(`Name: ${customerName}`, margin, yPosition)
  yPosition += 5
  doc.text(`Email: ${customerEmail}`, margin, yPosition)
  yPosition += 5
  doc.text(`Phone: ${customerPhone}`, margin, yPosition)
  yPosition += 5
  doc.text(`Address: ${customerAddress}`, margin, yPosition)
  yPosition += 10

  // Work description
  doc.setFontSize(12)
  doc.text('WORK DESCRIPTION', margin, yPosition)
  yPosition += 5
  doc.setFontSize(10)
  const wrappedDescription = doc.splitTextToSize(workDescription, pageWidth - margin * 2)
  doc.text(wrappedDescription, margin, yPosition)
  yPosition += wrappedDescription.length * 5 + 5

  // Materials section
  if (materials.length > 0) {
    doc.setFontSize(12)
    doc.text('MATERIALS', margin, yPosition)
    yPosition += 5
    doc.setFontSize(9)

    materials.forEach(item => {
      const itemText = `${item.name}: £${item.cost.toFixed(2)} ${item.quantity ? `x ${item.quantity}` : ''}`
      doc.text(itemText, margin + 5, yPosition)
      yPosition += 4
    })
    yPosition += 3
  }

  // Labour section
  if (labour.length > 0) {
    doc.setFontSize(12)
    doc.text('LABOUR', margin, yPosition)
    yPosition += 5
    doc.setFontSize(9)

    labour.forEach(item => {
      const itemText = `${item.name}: £${item.cost.toFixed(2)} ${item.quantity ? `x ${item.quantity}` : ''}`
      doc.text(itemText, margin + 5, yPosition)
      yPosition += 4
    })
    yPosition += 5
  }

  // Total cost
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(`TOTAL: £${totalCost.toFixed(2)}`, margin, yPosition)
  yPosition += 10

  // Notes
  if (notes) {
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.text('NOTES', margin, yPosition)
    yPosition += 4
    const wrappedNotes = doc.splitTextToSize(notes, pageWidth - margin * 2)
    doc.setFontSize(9)
    doc.text(wrappedNotes, margin, yPosition)
  }

  // Footer
  doc.setFontSize(8)
  doc.text(
    `Quote Date: ${quoteDate} | This quote is valid for 14 days`,
    margin,
    pageHeight - margin
  )

  return doc
}

export const downloadPDF = (doc, filename = 'quote.pdf') => {
  doc.save(filename)
}

export const getPDFAsBase64 = (doc) => {
  return doc.output('datauristring')
}
