import { OAuth2Client, Tokens } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { get_refreshtoken, save_token } from "./redis.ts";

export const oauth2_client = new OAuth2Client({
    clientId: "942326127555-op7digt9fohohs8nd2j42a6gem1b9gah.apps.googleusercontent.com",
    clientSecret: "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",
    authorizationEndpointUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    redirectUri: "https://flat-toad-34.deno.dev/callback",
    defaults: {
      scope: "http://mail.google.com",
    },
  });

export async function refresh_AccessToken(): Promise<Tokens> {
  const refresh_token = await get_refreshtoken();
  const tokens: Tokens = await oauth2_client.refreshToken.refresh(refresh_token);
  await save_token(tokens);
  return tokens;
}
