import { HandlerContext } from "$fresh/server.ts";
import { oauth2_client } from "../../utils/oauth2.ts"

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const url = new URL("https://accounts.google.com");
  url.pathname = 'o/oauth2/auth'
  const searchParams = {
    access_type:"offline",
    response_type:"code",
    client_id:"942326127555-op7digt9fohohs8nd2j42a6gem1b9gah.apps.googleusercontent.com",
    redirect_uri:"https://cvood-gmail-notifity.deno.dev/api/callback",
    scope:"https://mail.google.com/",
    state:"CWJBjJIJajgVB4C41iGuOWIPvqOrx0",
    include_granted_scopes:"true",
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
