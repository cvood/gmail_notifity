import { HandlerContext } from "$fresh/server.ts";
import * as defination from "../../utils/defination.ts"
import { get_token } from "../../utils/redis.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
  const watch_api = [defination.GOOGLEAPI_ENDPOINT, defination.WATCH_API_PATH].join("/");
  try {
    const tokens = await get_token();
    const result = await fetch(watch_api, {
      method: "POST",
      headers: { Authorization: `${tokens.tokenType} ${tokens.accessToken}` },
      body: JSON.stringify({
        topicName: "projects/gmail-pubsub-1661310722394/topics/gmail",
        labelIds: ["INBOX"]
      })
    })

    return new Response(await result.text())
  } catch (error) {
    await fetch("https://ntfy.sh/yuwenbin", {
      method: "POST",
      body: "gmail watch api invoked failed"
    });
    throw error;
  }
}
