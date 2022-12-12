import { decode } from "https://deno.land/std/encoding/base64.ts";

export async function fc2processer(data: string) {
  const decode_res =  new TextDecoder().decode(decode(data));
  const re = new RegExp("https?://live.fc2.com/(\\d+)");

  const check_health_resp = await fetch("http://yt.zhixiangtangping.top/check_health")
  await fetch("https://ntfy.sh/yuwenbin", {
    method: "POST",
    body: decode_res.split("\\n")[0]
  });

  if (check_health_resp.status === 200) {
    await fetch("http://ntfy.sh/service_status_check", {
      method:"POST",
      body:"yt-dlp service crashed !"
    })
    throw new Error("video download service crashed")
  }

  if (re.test(decode_res)) {
    const live_url = re.exec(decode_res)![0];
    await fetch("http://yt.zhixiangtangping.top:5555/create", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        url: live_url
      })
    });

    return
  }

  throw new Error("this is not an live starting notifitation")
}
