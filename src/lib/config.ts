// Base URL for the backend API.
// - Development: empty, so requests are relative (`/api/...`) and Vite's dev
//   proxy forwards them to the backend on port 4000.
// - Production: uses VITE_API_BASE_URL if set, otherwise falls back to the
//   deployed Render backend so the Vercel build works without extra config.
const PROD_FALLBACK_API = 'https://review-backend-jhau.onrender.com';

const raw = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? PROD_FALLBACK_API : '');

// strip a trailing slash so `${API_BASE}/api/...` never doubles up
export const API_BASE = raw.replace(/\/$/, '');
