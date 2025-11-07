import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/store-page',
  '/product-page(.*)',
  '/cart-page',
  '/checkout-page',
  '/inquiry-form',
  '/api(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const normalizeRoleString = (value) => {
  if (typeof value !== 'string') return null
  const lower = value.trim().toLowerCase()
  if (!lower) return null
  if (lower === 'admin') return 'admin'
  if (lower.endsWith(':admin') || lower.includes('admin')) return 'admin'
  return lower
}

const collectRoles = (value) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map(normalizeRoleString)
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    const normalized = normalizeRoleString(value)
    return normalized ? [normalized] : []
  }
  if (typeof value === 'boolean' && value) {
    return ['admin']
  }
  if (typeof value === 'object') {
    return Object.values(value)
      .map(normalizeRoleString)
      .filter(Boolean)
  }
  return []
}

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/admin') && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};