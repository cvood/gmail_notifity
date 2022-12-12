import { HandlerContext } from "$fresh/server.ts";
import { decode } from "https://deno.land/std@0.150.0/encoding/base64.ts";
import { advance_history, get_token } from "../../utils/redis.ts";
import * as defination  from "../../utils/defination.ts";
import { Tokens } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { retry } from "https://deno.land/x/retry@v2.0.0/mod.ts";
import { processers } from "../../processer/mod.ts";

interface MessagePart  {
  "partId": string,
  "mimeType": string,
  "filename"?: string,
  "headers": Header[],
  "body": MessagePartBody,
  "parts"?: MessagePart[],
}

interface Header {
  name: string,
  value: string
}

interface MessagePartBody {
  "attachmentId": string,
  "size": number,
  "data": string
}

interface Strategy {
  field: string,
  regexp: string,
  url: string
}

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  const data = await req.json().then((json) => json.message.data);
  const decode_data = new TextDecoder().decode(decode(data));
  const historyId: string = JSON.parse(decode_data).historyId;
  const pre_historyId: string = await advance_history(historyId);

  let token: Tokens;
  try {
    token = await get_token();
  } catch (error) {
    throw error;
  }

  const search_param = {
    historyTypes: "messageAdded",
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

    console.log("has new history!");
    
    for (const history of histories) {
      if(history['messagesAdded']) {

        console.log("has new message");
        
        for (const message of history['messagesAdded']){
          await deal_message(message);
        }

      }
    }

  }
  
  return new Response('', {status: 200});
}

async function deal_message(message:Record<string, unknown>) {
  const payload: MessagePart = message.payload as MessagePart;


  try {
    const strategies: Strategy[] = await retry(async () => {
      const strategies_resp = await fetch("http://postgrest.domcloud.io/strategies", {
        headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXN0In0.6iN8feEXAPqIV_MnJDeJi-X0begyR_PtgXkB8Ddk-Z0"}
      });
      return await strategies_resp.json();
    }, {delay: 100, maxTry: 3});

    for (const st of strategies) {
      const re = new RegExp(st.regexp);
      switch (st.field) {
        case "From":{
          if (!re.test(get_header(payload, "From"))) {
            return new Response('don\'t found header "From"', {status: 500})
          }
          await process(payload.body.data, st.url);
          break;
        }

        case "Subject": {
          if (!re.test(get_header(payload, "Subject"))) {
            return new Response('don\'t found header "Subject"', {status: 500})
          }

          await process(payload.body.data, st.url);
          break;
        }

        default: throw new Error("HeaderNotMatch")
      }
    }
  } catch (error) {
    console.log(error)
  }

  return
}

function get_header(payload: MessagePart, headername:string) {
  for (const header of payload.headers) {
    if(header.name === headername){
      return header.value
    }
  }
  throw new Error("HeaderNotExist");
}

async function process(data: string, processer_name: string) {
  await processers[processer_name as keyof typeof processers](data);
}
