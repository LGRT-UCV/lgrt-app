import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash } from "crypto";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email", placeholder: "test@email.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Error de credenciales");
        const password = createHash('sha256').update(credentials?.password).digest("hex").toString();

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await res.json();
          
          if (user.error) throw user;
          
          const coockies = await res.headers.getSetCookie();
          const token = coockies[0]?.split(";")[0]?.replace("accessToken=", "");

          if (!token ) throw new Error("CredentialsSignin");

          user.token = token;

          return user;
        } catch (error) {
          console.log("ERROR: ", error)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  }
});

export { handler as GET, handler as POST };
