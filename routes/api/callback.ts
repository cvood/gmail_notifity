import { HandlerContext } from "$fresh/server.ts";
import { oauth2_client } from "../../utils/oauth2.ts";
import { save_token } from "../../utils/redis.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  const tokens = await oauth2_client.code.getToken(req.url);
  await save_token(tokens);
  return new Response(JSON.stringify(tokens), {status: 200})
}
