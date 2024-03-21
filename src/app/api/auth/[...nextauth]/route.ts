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
        const password = createHash('sha256').update(credentials?.password).digest('base64');
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
          console.log("USER: ", user);
          console.log("TOKEN: ", res.headers.getSetCookie())
  
          if (user.error) throw user;
  
          return user;
          
        } catch (error) {
          console.log("ERROR: ", error)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("jwt", token, user)
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log("session: ", session, token)
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  }
});

export { handler as GET, handler as POST };
