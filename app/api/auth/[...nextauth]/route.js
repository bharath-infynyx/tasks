import NextAuth from 'next-auth'
import AzureADProvider from "next-auth/providers/azure-ad"

const env = process.env;

async function refreshAccessToken(token) {
  try {
    const url = `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;

    const body = new URLSearchParams({
      client_id:
        process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || 'azure-ad-client-id',
      client_secret:
        process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET ||
        'azure-ad-client-secret',
      scope: 'email openid profile User.Read offline_access',
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body,
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.id_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}



const handler = NextAuth({
  providers: [
    // OAuth authentication providers...
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the id_token, expires_at &refresh_token to the token right after signin
      if (account && user) {
        return {
          accessToken: account.id_token,
      
          refreshToken: account.refresh_token,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires - 100000 || 0) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session) {
        session.user = token.user;
        session.error = token.error;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  }
})

export {handler as GET, handler as POST}