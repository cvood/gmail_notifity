import { connect, Redis } from "https://deno.land/x/redis@v0.26.0/mod.ts";
import { Tokens } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";

const redis: Redis = await connect({
  hostname: "redis-14181.c251.east-us-mz.azure.cloud.redislabs.com",
  port: 14181,
  username: "default",
  password: "92iAjC3IdFrTq0m015Hs7VqaehrQlOpm"
})

export async function save_token(token: Tokens) {
  try {
    if (token.refreshToken) {
      await redis.set("refresh_token", token.refreshToken!);
    }
    await redis.set("tokens", JSON.stringify(token));
  } catch (error) {
    throw error;
  }
}

export async function get_token(): Promise<Tokens> {
  try {
    const tokens: string = await redis.get("tokens").then((bulk) => String(bulk));
    const tokens_obj: Tokens = JSON.parse(tokens);
    return tokens_obj;
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
