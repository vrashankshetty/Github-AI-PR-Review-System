/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import { useParams } from "next/navigation"
import { useState } from "react";
import { createWebHook} from "@/actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useQueryPulls,useQueryWebHooks } from "@/hooks/use-Query";
interface Comment {
  id: number;
  user: string;
  body: string;
}


function CommentSection({ comments }: { comments: Comment[] }) {
  console.log("comments",comments)
  return (
    <div className="mt-4 space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-700 p-3 rounded">
          <p className="text-sm font-semibold text-gray-300">{comment.user}</p>
          <p className="text-sm text-gray-400">{comment.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function SimpleStaticRepoPullRequestsPage() {
  const {id} = useParams();
  const route = useRouter();
  const [webhook,setWebhook] = useState('');
  const [name,setName] = useState('');
  console.log("id",id)
  const [visibleComments, setVisibleComments] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [commentloading,setCommentloading] = useState(false);  

 const toggleComments = async (prId:number, comment_url:string) => {
  setCommentloading(true);
  console.log("vCom",visibleComments)
  setVisibleComments(prev => ({ ...prev, [prId]: !prev[prId] }));
  if (!comments[prId]) {
    const fetchedComments = (await axios.get(comment_url))?.data?.map((s: any)=>{return {body:s?.body, user:s?.user?.login,id: s?.id}});
    console.log("fetched comment",fetchedComments)
    setComments(prev => ({ ...prev, [prId]: fetchedComments }));
  }
  setCommentloading(false);
};

const addWebHook=async()=>{
  try{
    await createWebHook(name,webhook,id as string);
    setWebhook('');
    setName('');
  }catch(e: any){
    console.log("error",e)
    alert('Error')
  }
}

const {data:webhooks,isLoading:webLoading} = useQueryWebHooks(id as string);
const {data:pullRequests,isLoading:pullLoading} = useQueryPulls(id as string)
if(webLoading || pullLoading){
  return <Loading/>;
}

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={()=>{route.push('/github')}}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Repositories
          </Button>
          <h1 className="text-3xl font-bold mb-2">Repository {(id as string).split('66').join(':')}</h1>
        </header>
        <Tabs defaultValue="webhooks">
        <TabsList className="grid w-full grid-cols-2 mb-10">
        <TabsTrigger value="webhooks" className="p-2 focus:bg-gray-800 focus:border-gray-700">WebHooks</TabsTrigger>
        <TabsTrigger value="pullrequests"  className="p-2">Pull Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="webhooks">
          <div className="space-y-4">
          <Input name='name' value={name} placeholder="Name" className="border-blue-500" onChange={(e)=>setName(e.target.value)}/>
          <Input name='Webhook' value={webhook} placeholder="URL" className="border-blue-500" onChange={(e)=>setWebhook(e.target.value)}/>
          </div>
          <div className="my-3">
          <Button 
            variant="outline" 
            className="w-[200px] mt-auto bg-green-600 text-white hover:bg-green-700 border-green-500"
            onClick={addWebHook}
          >
            Add WebHook
          </Button>
          </div>
          <div className="space-y-4">
          {webhooks?.map((pr:any) => (
            <Card key={pr?.id} className="bg-gray-800 border-gray-700">
              <CardContent>
                <div className="text-sm text-gray-400 mt-2">
                 {pr?.name}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                 {pr?.config?.url}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </TabsContent>
        <TabsContent value="pullrequests">
        <div>
        <h1 className="text-3xl font-bold mb-2">Pull Requests for {(id as string).split('66').join(':')}</h1>
          <p className="text-gray-400 my-5">Viewing all open and closed pull requests</p>
        <div className="space-y-4">
          {pullRequests?.map((pr:any) => (
            <Card key={pr.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <p className="text-blue-400 hover:underline">
                    {pr?.title}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-400 mb-2">
                 opened by {pr?.user?.login}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    pr?.state === 'open' ? 'bg-green-600' : 'bg-purple-600'
                  }`}>
                    {pr?.state}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-start items-start">
                <div className="">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleComments(pr?.id,pr?.comments_url)}
                  className="text-gray-400 hover:text-gray-100 "
                >
                <MessageSquare className="mr-2 h-4 w-4" />
                  Comments
                </Button>
                </div>
              <div className="w-full flex">
              {visibleComments[pr.id] && (
                   commentloading?
                   (
                    <div className="flex w-full justify-center items-center">
                       <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                   )
                   :(
                    <CardContent>
                      <CommentSection comments={comments[pr.id] || []} />
                    </CardContent>
                  )
              )
            }
              </div>
                </CardFooter>
            </Card>
          ))}
        </div>
        </div>
        </TabsContent>
        
        </Tabs>
      </div>
    </div>
  )
}