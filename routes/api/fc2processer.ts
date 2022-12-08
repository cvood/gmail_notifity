import { HandlerContext } from "$fresh/server.ts";
import { decode } from "https://deno.land/std/encoding/base64.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  const data = await req.text().then((base64) => new TextDecoder().decode(decode(base64)));
  const re = new RegExp("https?://live.fc2.com/(\\d+)");
  const check_health_resp = await fetch("http://yt.zhixiangtangping.top/check_health")
  await fetch("https://ntfy.sh/yuwenbin", {
    method: "POST",
    body: data.split("\\n")[0]
  });
  if (check_health_resp.status === 200) {
    await fetch("http://ntfy.sh/service_status_check", {
      method:"POST",
      body:"yt-dlp service crashed !"
    })
    return new Response("video download services crashed")
  }
  if (re.test(data)) {
    const live_url = re.exec(data)![0];
    const resp = await fetch("http://yt.zhixiangtangping.top:5555/create", {
      method: "POST",
      body: JSON.stringify({
        url: live_url
      })
    });
    return resp
  }
  return new Response("this is not a live starting notifity")
}
