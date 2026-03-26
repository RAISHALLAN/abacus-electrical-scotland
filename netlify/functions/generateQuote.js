// Netlify Function to generate and send quote PDFs

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const {
      customerEmail,
      customerName,
      customerPhone,
      customerAddress,
      workDescription,
      materials = [],
      labour = [],
      totalCost,
      notes,
      sendEmail = true,
    } = JSON.parse(event.body)

    // Validate required fields
    if (!customerEmail || !customerName || !workDescription || !totalCost) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Generate quote PDF content (HTML format for email)
    const quoteDate = new Date().toLocaleDateString()
    const validUntilDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()

    let materialsHtml = ''
    if (materials.length > 0) {
      materialsHtml = `
        <h4 style="color: #ff6b35; margin-top: 20px;">MATERIALS</h4>
        <table style="width: 100%; border-collapse: collapse;">
          ${materials.map(m => `
            <tr style="border-bottom: 1px solid #333;">
              <td style="padding: 8px;">${m.name}</td>
              <td style="text-align: right; padding: 8px;">£${m.cost.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
      `
    }

    let labourHtml = ''
    if (labour.length > 0) {
      labourHtml = `
        <h4 style="color: #ff6b35; margin-top: 20px;">LABOUR</h4>
        <table style="width: 100%; border-collapse: collapse;">
          ${labour.map(l => `
            <tr style="border-bottom: 1px solid #333;">
              <td style="padding: 8px;">${l.name}</td>
              <td style="text-align: right; padding: 8px;">£${l.cost.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
      `
    }

    const quoteHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #fff; background-color: #000; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; padding: 30px; border-radius: 8px; }
          .header { margin-bottom: 30px; border-bottom: 2px solid #ff6b35; padding-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; color: #fff; }
          .quote-title { font-size: 18px; color: #ff6b35; margin-top: 10px; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; color: #ff6b35; margin-bottom: 10px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          tr { border-bottom: 1px solid #333; }
          td { padding: 8px; }
          .label { font-weight: bold; color: #ff8c42; }
          .total { font-size: 18px; font-weight: bold; color: #ff6b35; margin: 20px 0; padding: 15px; background-color: rgba(255, 107, 53, 0.1); border-left: 3px solid #ff6b35; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; opacity: 0.8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-name">ABACUS ELECTRICAL SCOTLAND</div>
            <div class="quote-title">QUOTATION</div>
          </div>

          <div class="section">
            <div class="section-title">QUOTE DATE</div>
            <p>${quoteDate}</p>
          </div>

          <div class="section">
            <div class="section-title">CUSTOMER DETAILS</div>
            <table>
              <tr>
                <td class="label">Name:</td>
                <td>${customerName}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td>${customerEmail}</td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td>${customerPhone}</td>
              </tr>
              <tr>
                <td class="label">Address:</td>
                <td>${customerAddress}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">WORK DESCRIPTION</div>
            <p>${workDescription.replace(/\n/g, '<br>')}</p>
          </div>

          ${materialsHtml}
          ${labourHtml}

          <div class="total">
            TOTAL: £${totalCost.toFixed(2)}
          </div>

          ${notes ? `
            <div class="section">
              <div class="section-title">NOTES</div>
              <p>${notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>This quotation is valid until ${validUntilDate}.</p>
            <p>To proceed with this work, please contact us to confirm.</p>
            <p>© ${new Date().getFullYear()} Abacus Electrical Scotland. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // If sendEmail is true, send the quote to customer
    if (sendEmail) {
      const sendEmailResponse = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        body: JSON.stringify({
          to: customerEmail,
          subject: `Your Quote from Abacus Electrical Scotland`,
          html: quoteHtml,
          text: `Your quotation from Abacus Electrical Scotland has been generated. Total: £${totalCost.toFixed(2)}`,
        }),
      })

      if (!sendEmailResponse.ok) {
        console.error('Failed to send quote email')
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to send quote email' }),
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Quote generated successfully',
        quoteHtml: quoteHtml,
      }),
    }
  } catch (error) {
    console.error('Quote generation error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
