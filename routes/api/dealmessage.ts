
import { HandlerContext } from "$fresh/server.ts";

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

function get_header(payload: MessagePart, headername:string) {
  for (const header of payload.headers) {
    if(header.name === headername){
      return header.value
    }
  }
  return ""
}

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  const payload: MessagePart = await req.json().then((message) => message.payload);
  const strategies_resp = await fetch("http://postgrest.domcloud.io/strategies", {
    headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXN0In0.6iN8feEXAPqIV_MnJDeJi-X0begyR_PtgXkB8Ddk-Z0"}
  });
  const strategies: Strategy[] = await strategies_resp.json();
  for (const st of strategies) {
    const re = new RegExp(st.regexp);
    switch (st.field) {
      case "From":{
        if (!re.test(get_header(payload, "From"))) {
          return new Response('don\'t found header "From"', {status: 500})
        }
        const resp = await fetch("https://cvood-gmail-notifity.deno.dev" + st.url, {
          method: "POST",
          body: payload.body.data,
        })
        return resp
      }

      case "Subject": {
        if (!re.test(get_header(payload, "Subject"))) {
          return new Response('don\'t found header "Subject"', {status: 500})
        }
        const resp = await fetch("https://cvood-gmail-notifity.deno.dev" + st.url, {
          method: "POST",
          body: payload.body.data,
        })
        return resp
      }

      default:
        return new Response("no strategy match")
    }
  }

  return new Response("ok", {status: 200, headers: {'content-type': 'text/plain'}});
}
