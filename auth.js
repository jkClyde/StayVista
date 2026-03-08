import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from '@/config/database';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ profile }) {
      await connectDB();
      const userExists = await User.findOne({ email: profile.email });
      if (!userExists) {
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
          isAdmin: false,
        });
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        await connectDB();
        const dbUser = await User.findOne({ email: profile.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.isAdmin = dbUser.isAdmin;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});