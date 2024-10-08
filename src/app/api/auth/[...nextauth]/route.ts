'use server';

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { cookies } from "next/headers";


const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID ?? '',
        clientSecret: process.env.GITHUB_SECRET ?? '',
      }),
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        if (user && account && account.provider === 'github') {
          token.username = user.name;
          token.githubAccessToken = account.access_token; 
          console.log("setting cookie",account.access_token)
          cookies().set('auth-x-token',account.access_token??'');
          token.randomStuff = 'anything you want';
        }
        return token;
      },
    },
  });

export { handler as GET, handler as POST }