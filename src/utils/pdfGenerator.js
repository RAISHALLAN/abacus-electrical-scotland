import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generateQuotePDF(quoteData, filename = 'quote.pdf') {
  try {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '210mm'
    container.style.backgroundColor = '#fff'
    container.style.padding = '20px'
    container.style.fontFamily = 'Arial, sans-serif'

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
          <div>
            <h1 style="margin: 0; color: #2563eb; font-size: 28px;">ABACUS ELECTRICAL</h1>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">Scotland</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #2563eb; font-size: 24px;">QUOTE</h2>
            <p style="margin: 5px 0; font-size: 12px;">Date: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0; font-size: 12px;">Quote ID: ${quoteData.id?.slice(0, 8).toUpperCase() || 'QT001'}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 14px; text-transform: uppercase;">Bill To:</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 4px;">
            <p style="margin: 5px 0; font-weight: bold;">${quoteData.customerName}</p>
            <p style="margin: 5px 0; font-size: 12px;">${quoteData.customerEmail}</p>
            <p style="margin: 5px 0; font-size: 12px;">${quoteData.customerPhone}</p>
            <p style="margin: 5px 0; font-size: 12px;">${quoteData.customerAddress}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 14px; text-transform: uppercase;">Work Description:</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; font-weight: bold;">Type: ${quoteData.workType}</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap;">${quoteData.workDescription}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #2563eb; font-size: 14px; text-transform: uppercase;">Quote Items:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <thead>
              <tr style="background: #2563eb; color: white;">
                <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #ddd;">Description</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border: 1px solid #ddd; width: 80px;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #ddd; width: 100px;">Unit Cost</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; border: 1px solid #ddd; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(quoteData.items || []).map((item, idx) => `
                <tr style="background: ${idx % 2 === 0 ? '#fff' : '#f8f9fa'};">
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.description || 'Item'}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity || 1}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">£${(item.unitCost || 0).toFixed(2)}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">£${((item.quantity || 1) * (item.unitCost || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 30px; text-align: right;">
          <div style="display: inline-block; width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; font-size: 12px;">
              <span>Subtotal:</span>
              <span>£${(quoteData.subtotal || 0).toFixed(2)}</span>
            </div>
            ${quoteData.discount ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; font-size: 12px; color: #16a34a;">
                <span>Discount (${quoteData.discountPercent || 0}%):</span>
                <span>-£${(quoteData.discount || 0).toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; background: #2563eb; color: white; font-weight: bold; font-size: 16px; margin-top: 10px;">
              <span>TOTAL:</span>
              <span>£${(quoteData.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${quoteData.notes ? `
          <div style="margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 12px; text-transform: uppercase;">Notes:</h3>
            <p style="margin: 0; font-size: 11px; line-height: 1.6; white-space: pre-wrap; color: #666;">${quoteData.notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #666; text-align: center;">
          <p style="margin: 5px 0;">Abacus Electrical Scotland</p>
          <p style="margin: 5px 0;">Phone: +44 7931768138 | Email: info@abacuselectrical.co.uk</p>
          <p style="margin: 5px 0; font-style: italic;">This quote is valid for 30 days from the date shown above.</p>
          <p style="margin: 15px 0 0 0; color: #999;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    container.innerHTML = html
    document.body.appendChild(container)

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(filename)

    document.body.removeChild(container)

    return true
  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw error
  }
}
