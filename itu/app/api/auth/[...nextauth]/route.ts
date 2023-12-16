import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/app/db'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await prisma.user.findUnique({ 
        where:{
          email: session.user.email 
        }
      });
      session.user.username=sessionUser.username
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        const userExists = await prisma.user.findUnique({ 
          where: {
            email: profile.email 
          }
        });

        if (!userExists) {
          await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
            }
          });
        }

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }