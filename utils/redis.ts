import { connect, Redis } from "https://deno.land/x/redis@v0.26.0/mod.ts";
import { Tokens } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { refresh_AccessToken } from "./oauth2.ts";

const redis: Redis = await connect({
  hostname: "apn1-picked-poodle-33669.upstash.io",
  port: 33669,
  username: "default",
  password: "94823fab1b964cdb941c551950208dc9"
})

export async function save_token(token: Tokens) {
  try {
    if (token.refreshToken) {
      await redis.set("refresh_token", token.refreshToken!);
    }
    const expire_at = Date.now() + token.expiresIn!;
    await redis.set("tokens", JSON.stringify(token));
    await redis.set("expire_at", expire_at);
  } catch (error) {
    throw error;
  }
}

export async function get_token(): Promise<Tokens> {
  try {
    const expire_at  = await redis.get("expire_at").then((bulk) => Number(bulk));
    if (expire_at && expire_at > Date.now()) {
      const tokens: string = await redis.get("tokens").then((bulk) => String(bulk));
      const tokens_obj: Tokens = JSON.parse(tokens);
      return tokens_obj;
    } else {
      return await refresh_AccessToken()
    }
  } catch (error) {
    throw error;
  }
}

export async function get_refreshtoken(): Promise<string> {
  try {
    const refresh_token = await redis.get("refresh_token").then((bulk) => String(bulk));
    return refresh_token
  } catch (error) {
    throw error;
  }
}

export async function advance_history(historyId: string): Promise<string> {
  try {
    const history = await redis.getset("history_id", historyId).then((bulk) => String(bulk));
    return history;
  } catch (error) {
    await fetch("https://ntfy.sh/yuwenbin", {
      method: "POST",
      body: "gamil notifity: advance history failed! "
    });
    throw error;
  }
}
