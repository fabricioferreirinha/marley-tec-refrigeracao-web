import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  // Verificar apenas rotas que começam com /admin, mas não a rota base /admin
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin') {
    try {
      // Verificar se há uma sessão ativa
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erro no middleware:', error.message)
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      // Se não há sessão, redirecionar para login
      if (!session) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      // Usuário autenticado, verificar se tem permissão (isso será verificado pelo React)
      return res
    } catch (error) {
      console.error('Erro inesperado no middleware:', error)
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.svg, tecnico.png (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|tecnico.png).*)',
  ],
} 