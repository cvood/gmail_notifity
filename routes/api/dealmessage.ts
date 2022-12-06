import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  const message = await req.json();
  console.log(message)
  return new Response("ok", {status: 200, headers: {'content-type': 'text/plain'}});
}
