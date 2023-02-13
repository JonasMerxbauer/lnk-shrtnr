import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {

  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const hello = api.url.getUrl.useQuery({ slug: req.nextUrl.pathname });
  // console.log(hello)

  const slugFetch = await fetch(`${req.nextUrl.origin}/api/get-url?slug=${req.nextUrl.pathname.replace('/', '')}`);
  

  if (slugFetch.status === 404 || slugFetch.status === 400) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  const { url } = await slugFetch.json() as { url: string };

  if (url) {
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',],
}