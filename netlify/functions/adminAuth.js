// Netlify Function to verify admin password
// Note: For production, consider using proper authentication (OAuth, Auth0, etc.)

export default async (event) => {
  if (event.httpMethod !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const { password } = JSON.parse(event.body)

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get admin password from environment variable
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      console.error('ADMIN_PASSWORD not configured')
      return new Response(
        JSON.stringify({ error: 'Admin authentication not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Simple password comparison (in production, use proper hashing)
    const isValid = password === correctPassword

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate a simple JWT-like token (in production, use proper JWT)
    const token = Buffer.from(
      JSON.stringify({
        authenticated: true,
        timestamp: new Date().toISOString(),
      })
    ).toString('base64')

    return new Response(
      JSON.stringify({
        success: true,
        token: token,
        expiresIn: 3600, // 1 hour in seconds
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
