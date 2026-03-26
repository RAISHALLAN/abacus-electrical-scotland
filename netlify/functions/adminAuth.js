// Netlify Function to verify admin password
// Note: For production, consider using proper authentication (OAuth, Auth0, etc.)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { password } = JSON.parse(event.body)

    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password is required' }),
      }
    }

    // Get admin password from environment variable
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      console.error('ADMIN_PASSWORD not configured')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Admin authentication not configured' }),
      }
    }

    // Simple password comparison (in production, use proper hashing)
    const isValid = password === correctPassword

    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid password' }),
      }
    }

    // Generate a simple JWT-like token (in production, use proper JWT)
    const token = Buffer.from(
      JSON.stringify({
        authenticated: true,
        timestamp: new Date().toISOString(),
      })
    ).toString('base64')

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token: token,
        expiresIn: 3600, // 1 hour in seconds
      }),
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
