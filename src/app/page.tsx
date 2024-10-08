'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl: "/github" })
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
        <Card className="w-[350px] bg-gray-900 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">
            Log in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white"
            onClick={handleGitHubLogin}
          >
            <Github className="mr-2 h-4 w-4" />
            Connect with GitHub
          </Button>
        </CardContent>
      </Card>
</div>
  )
}
