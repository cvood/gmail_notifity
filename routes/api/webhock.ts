import { HandlerContext } from "$fresh/server.ts";
import { decode } from "https://deno.land/std@0.150.0/encoding/base64.ts";
import { advance_history, get_token } from "../../utils/redis.ts";
import * as defination  from "../../utils/defination.ts";
import { Tokens } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  const data = await req.json().then((json) => json.message.data);
  const decode_data = new TextDecoder().decode(decode(data));
  const historyId: string = JSON.parse(decode_data).historyId;
  const pre_historyId: string = await advance_history(historyId);
  console.log(decode_data);

  let token: Tokens;
  try {
    token = await get_token();
  } catch (error) {
    throw error;
  }

  const search_param = {
    historyTypes: "messagesAdded",
    labelId: "INBOX",
    startHistoryId: pre_historyId,
  }
  const url = new URL(defination.GOOGLEAPI_ENDPOINT);
  url.pathname = defination.LIST_HISTORIES_API;
  for (const key in search_param) {
    url.searchParams.set(key, search_param[key]);
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: {Authorization: `${token.tokenType} ${token.accessToken}`}
  })

  const histories = await resp.json().then((json) => json.history);
  if (histories){

    for (const history of histories) {
      if(history['messagesAdded']) {
        
        for (const message of history['messagesAdded']){
          const resp = await fetch('https://cvood-gmail-notifity.deno.dev/api/dealmessage', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(message)
          });
          console.log(await resp.text());
        }

      }
    }

  }
  
  return new Response('', {status: 200});
}
