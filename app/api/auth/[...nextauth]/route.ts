import { joinDiscordServer } from "@/app/lib/discord";
import { userLoggedIn } from "@/app/lib/user";
import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    accessToken?: string;
  }
}

type DiscordProfile = {
  id: string;
  username: string;
  avatar: string | null;
  email?: string;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,

      authorization: {
        params: {
          scope: "identify guilds guilds.join",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.discordId = account.providerAccountId;
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.discordId as string;
      }

      session.accessToken = token.accessToken;

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "discord") {
        const discordProfile = profile as DiscordProfile;

        const discordId = account.providerAccountId;
        const accessToken = account.access_token;

        if (!discordId || !accessToken) {
          return false;
        }

        await userLoggedIn({
          discordId,
          name: user.name,
          avatar: discordProfile.avatar
            ? `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.png`
            : null,
        });

        await joinDiscordServer(
          discordId,
          accessToken
        );
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };