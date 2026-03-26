// Netlify Function to send emails using Resend API

export default async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { to, subject, html, text } = JSON.parse(event.body)

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' }),
      }
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@abacuselectrical.co.uk',
        to: to,
        subject: subject,
        html: html || null,
        text: text || null,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', data)
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to send email', details: data }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: data.id,
      }),
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
