import NextAuth, { CallbacksOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "../../../config/spotify";
import { ExtendedToken, TokenError } from "../../../types";

const refreshAccessToken = async (
  token: ExtendedToken
): Promise<ExtendedToken> => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    // request spotify refresh token!
    const { body: refreshedTokens } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKENS ARE: ", refreshedTokens);
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.log("ERROR");
    return {
      ...token,
      error: TokenError.refreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  let extendedToken: ExtendedToken;

  // User login for the first time
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpiresAt: (account.expires_at as number) * 1000, // convert s to ms
    };
    console.log("FIRST TIME LOGIN, EXTENTED TOKEN", extendedToken);
    return extendedToken;
  }

  // Subsequent request to check auth sessions
  // token just can be return when it not expired
  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
    console.log("ACCESS TOKEN STILL VALID, RETURNING EXTENTED TOKEN: ", token);
    return token;
  }

  // Access token has expired, refresh it!
  console.log("ACCESS TOKEN EXPIRED, REFRESHING NOW!...");
  return await refreshAccessToken(token as ExtendedToken);
};
export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: jwtCallback,
  },
});
