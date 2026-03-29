import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Format a number as currency with thousand separators, e.g. 1234.5 → "1,234.50"
const fmt = (n) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export async function generateQuotePDF(quoteData, filename = 'quote.pdf') {
  try {
    // Fetch and convert logo to data URL
    let logoDataUrl = ''
    const logoPaths = [
      window.location.origin + '/ABACUS%20%20PDF.jpeg',
      window.location.origin + '/ABACUS  PDF.jpeg',
      window.location.origin + '/ABACUS%20PDF.jpeg',
      window.location.origin + '/Abacus%20PDF.jpeg',
    ]
    for (const logoPath of logoPaths) {
      try {
        console.log('Trying logo from:', logoPath)
        const logoResponse = await fetch(logoPath)
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob()
          logoDataUrl = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(logoBlob)
          })
          console.log('Logo loaded from:', logoPath)
          break
        }
      } catch (err) {
        console.warn('Failed to load from:', logoPath)
      }
    }

    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '210mm'
    container.style.backgroundColor = '#fff'
    container.style.padding = '20px'
    container.style.fontFamily = 'Arial, sans-serif'

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <!-- HEADER -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 3px solid #2563eb; padding-bottom: 15px;">
          <div style="flex: 1;">
            ${logoDataUrl
              ? `<img src="${logoDataUrl}" style="height: 106px; width: auto; object-fit: contain; display: block;" alt="Abacus Electrical" />`
              : `<p style="font-size: 20px; font-weight: bold; color: #2563eb; margin: 0;">ABACUS ELECTRICAL<br/><span style="font-size: 10px; font-weight: normal;">Scotland</span></p>`
            }
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #2563eb; font-size: 22px;">FREE QUOTATION</h2>
            <p style="margin: 3px 0; font-size: 10px;">Date: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 3px 0; font-size: 10px;">Quote ID: ${quoteData.id?.slice(0, 8).toUpperCase() || 'QT001'}</p>
          </div>
        </div>

        <!-- QUOTE TO -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 12px; text-transform: uppercase;">Quote To:</h3>
          <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; display: flex; gap: 20px;">
            <!-- Left: name + address -->
            <div style="flex: 1;">
              <p style="margin: 3px 0; font-weight: bold; font-size: 10px;">${quoteData.customerName}</p>
              <p style="margin: 3px 0; font-size: 10px;">${quoteData.customerAddress}</p>
              ${quoteData.customerCity ? `<p style="margin: 3px 0; font-size: 10px;">${quoteData.customerCity}</p>` : ''}
              ${quoteData.customerPostcode ? `<p style="margin: 3px 0; font-size: 10px;">${quoteData.customerPostcode}</p>` : ''}
            </div>
            <!-- Right: email + phone -->
            <div style="text-align: right;">
              <p style="margin: 3px 0; font-size: 10px;">${quoteData.customerEmail}</p>
              <p style="margin: 3px 0; font-size: 10px;">${quoteData.customerPhone}</p>
            </div>
          </div>
        </div>

        <!-- WORK DESCRIPTION -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 12px; text-transform: uppercase;">Work Description:</h3>
          <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; font-weight: bold; font-size: 10px;">Type: ${quoteData.workType}</p>
            <p style="margin: 6px 0 0 0; font-size: 10px; line-height: 1.4; white-space: pre-wrap;">${quoteData.workDescription}</p>
          </div>
        </div>

        <!-- QUOTE ITEMS -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 12px; text-transform: uppercase;">Quote Items:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr style="background: #2563eb; color: white;">
                <th style="padding: 9px 8px; text-align: center; font-weight: bold; border: 1px solid #ddd; width: 36px; font-size: 10px;">#</th>
                <th style="padding: 9px 8px; text-align: left; font-weight: bold; border: 1px solid #ddd; font-size: 10px;">Description</th>
                <th style="padding: 9px 8px; text-align: center; font-weight: bold; border: 1px solid #ddd; width: 55px; font-size: 10px;">Qty</th>
                <th style="padding: 9px 8px; text-align: right; font-weight: bold; border: 1px solid #ddd; width: 85px; font-size: 10px;">Unit Cost</th>
                <th style="padding: 9px 8px; text-align: right; font-weight: bold; border: 1px solid #ddd; width: 85px; font-size: 10px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(quoteData.items || []).map((item, idx) => `
                <tr style="background: ${idx % 2 === 0 ? '#fff' : '#f8f9fa'};">
                  <td style="padding: 5px 7px; border: 1px solid #ddd; text-align: center; font-size: 10px; font-weight: bold;">${idx + 1}</td>
                  <td style="padding: 5px 7px; border: 1px solid #ddd; font-size: 10px;">${item.description || 'Item'}</td>
                  <td style="padding: 5px 7px; border: 1px solid #ddd; text-align: center; font-size: 10px;">${item.quantity || 1}</td>
                  <td style="padding: 5px 7px; border: 1px solid #ddd; text-align: right; font-size: 10px;">£${fmt(item.unitCost || 0)}</td>
                  <td style="padding: 5px 7px; border: 1px solid #ddd; text-align: right; font-weight: bold; font-size: 10px;">£${fmt((item.quantity || 1) * (item.unitCost || 0))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- TOTALS -->
        <div id="pdf-totals-section" style="margin-bottom: 20px; text-align: right;">
          <div style="display: inline-block; width: 280px;">
            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #ddd; font-size: 10px;">
              <span>Subtotal:</span>
              <span>£${fmt(quoteData.subtotal || 0)}</span>
            </div>
            ${quoteData.discount ? `
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #ddd; font-size: 10px; color: #16a34a;">
                <span>Discount (${quoteData.discountPercent || 0}%):</span>
                <span>-£${fmt(quoteData.discount || 0)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 10px 8px; background: #2563eb; color: white; font-weight: bold; font-size: 13px; margin-top: 8px;">
              <span>TOTAL:</span>
              <span>£${fmt(quoteData.total || 0)}</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 11px; text-transform: uppercase;">Notes:</h3>
          ${quoteData.notes ? `<p style="margin: 0 0 6px 0; font-size: 10px; line-height: 1.4; white-space: pre-wrap; color: #666;">${quoteData.notes}</p>` : ''}
          <p style="margin: 0; font-size: 10px; line-height: 1.4; color: #999; font-style: italic;">If you are happy with your free quote and would like to proceed - please feel free to phone or email us as noted below.</p>
        </div>

        <!-- FOOTER -->
        <div id="pdf-footer-section" style="margin-top: 30px; padding-top: 12px; border-top: 1px solid #ddd; color: #666; text-align: center;">
          <p style="margin: 1px 0; font-size: 9px; line-height: 1.2;">Abacus Electrical Scotland</p>
          <p style="margin: 1px 0; font-size: 9px; line-height: 1.2;">Phone: +44 7931768138 | Email: info@abacuselectricalscotland.co.uk</p>
          <p style="margin: 1px 0; font-size: 9px; line-height: 1.2; font-style: italic;">This quote is valid for 30 days from the date shown above.</p>
          <p style="margin: 2px 0 0 0; font-size: 9px; line-height: 1.2; color: #999;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    container.innerHTML = html
    document.body.appendChild(container)

    // Measure protected sections (totals + footer) before canvas render.
    // These sections must never be split across a page break.
    const canvasScale = 1.5
    const containerRect = container.getBoundingClientRect()
    const protectedSections = []

    for (const id of ['pdf-totals-section', 'pdf-footer-section']) {
      const el = container.querySelector(`#${id}`)
      if (el) {
        const rect = el.getBoundingClientRect()
        const startPx = (rect.top - containerRect.top) * canvasScale
        const endPx = (rect.bottom - containerRect.top) * canvasScale
        if (endPx > startPx) {
          protectedSections.push({ start: startPx, end: endPx })
        }
      }
    }

    const canvas = await html2canvas(container, {
      scale: canvasScale,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    const imgWidth = 210  // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const canvasHeight = canvas.height
    const imgHeight = (canvasHeight * imgWidth) / canvas.width
    const pixelsPerPage = (pageHeight / imgHeight) * canvasHeight

    // Build page break pixel positions, pulling breaks back to avoid
    // splitting any protected section across two pages.
    const pageBreaks = [0]
    let nextBreak = pixelsPerPage

    while (nextBreak < canvasHeight) {
      let adjusted = nextBreak

      for (const section of protectedSections) {
        // If this break falls inside a protected section, move it to just
        // before the section starts so the whole section lands on the next page.
        if (adjusted > section.start && adjusted < section.end) {
          adjusted = section.start
          break
        }
      }

      pageBreaks.push(adjusted)
      nextBreak = adjusted + pixelsPerPage
    }

    pageBreaks.push(canvasHeight)

    // Render each page slice
    for (let i = 0; i < pageBreaks.length - 1; i++) {
      if (i > 0) pdf.addPage()

      const startPixel = pageBreaks[i]
      const endPixel = pageBreaks[i + 1]
      const pagePixelHeight = endPixel - startPixel

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = pagePixelHeight
      const ctx = tempCanvas.getContext('2d')

      ctx.drawImage(
        canvas,
        0, startPixel,
        canvas.width, pagePixelHeight,
        0, 0,
        canvas.width, pagePixelHeight
      )

      const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.8)
      const pageImgHeight = (pagePixelHeight * imgWidth) / canvas.width

      pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight)
    }

    pdf.save(filename)

    document.body.removeChild(container)

    return true
  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw error
  }
}
