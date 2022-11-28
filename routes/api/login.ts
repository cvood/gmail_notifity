import { HandlerContext } from "$fresh/server.ts";

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const url = new URL("https://accounts.google.com");
  url.pathname = 'o/oauth2/auth'
  const searchParams = {
    client_id: "942326127555-op7digt9fohohs8nd2j42a6gem1b9gah.apps.googleusercontent.com",
    redirect_uri: "https://cvood-gmail-notifity.deno.dev/api/callback",
    response_type: "code",
    scope: "https://mail.google.com",
    access_type: "offline",
  };
  
  for (const k in searchParams) {
    url.searchParams.set(k, searchParams[k])
  }

  return new Response("redict", {
    status: 302,
    statusText: "redict",
    headers: new Headers({
      location: url.href,
    })
  });
}
