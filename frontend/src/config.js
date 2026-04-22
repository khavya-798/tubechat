// In production, set VITE_API_URL to your Render backend URL in Vercel env vars
// Locally, empty string means Vite proxy handles /api/* → localhost:8000
export const API_BASE = import.meta.env.VITE_API_URL || ''
