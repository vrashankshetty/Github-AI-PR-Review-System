/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Book,Star, GitFork} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

import Loading from "../loading";
import { useQueryRepo } from "@/hooks/use-Query";
export default function DarkGitHubLikePage() {

  const {data:session} = useSession();
  const route = useRouter();
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }
  
  const navigate=(owner:string,repo: string)=>{
    route.push(`/github/${owner}66${repo}`)
  }

const {data,isLoading} = useQueryRepo();
 
if(isLoading || !session){
  return <Loading/>;
}

  return (
      <div className="flex h-screen bg-gray-900 text-gray-100 w-full">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image??''} alt={'no Image'} />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-100">{session?.user?.name}</h2>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700" >
                <Book className="mr-2 h-4 w-4" />
                Repositories
              </Button>
            </li>
          </ul>
        </nav>
        <Button 
          variant="outline" 
          className="w-full mt-auto bg-green-600 text-white hover:bg-green-700 border-green-500"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex w-full p-5 overflow-y-auto">
      <div className="grid grid-cols-1 gap-4 w-full mb-[50px]">
        {data?.map((repo: any) => (
          <div key={repo?.id} className="bg-gray-800 p-4 rounded-md shadow-md border border-gray-700 mb-[10px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-400 hover:underline cursor-pointer"  onClick={()=>navigate(repo?.owner?.login,repo?.name)}>
                {repo?.name}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">Public</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{repo?.description}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span>{repo?.stargazers_count}</span>
              </div>
              <div className="flex items-center">
                <GitFork className="w-4 h-4 mr-1" />
                <span>{repo?.forks_count}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}