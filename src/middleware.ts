import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    {path: "/login",  whenAuthenticated: 'redirect'},
    {path: "/cadatro",  whenAuthenticated: 'redirect'},
] as const

const REDIRECT_WHEN_NOT_AUTHENTICADED_ROUTE = '/login'



export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('token')


    if(!authToken && publicRoute){
        return NextResponse.next();
    }

    if(!authToken && !publicRoute){
        const redirectUrl = request.nextUrl.clone()

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICADED_ROUTE

        return NextResponse.redirect(redirectUrl)
    }

    if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect'){
        const redirectUrl = request.nextUrl.clone()

        redirectUrl.pathname = '/'

        return NextResponse.redirect(redirectUrl)
    }


    if(authToken && !publicRoute) {
        //VERIFICAR SE O JWT TÁ EXPIRADO
        //SE SIM, REMOVE O TOKEN DOS COKIES
        //PODE APLICAR UMA ESTRÁTEGIA DE REFRESH TOKEN 
        return NextResponse.next();
    }

    return NextResponse.next();
}


export const config: MiddlewareConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      ],
}