/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from '@octokit/rest';
import { cookies } from "next/headers";
import { CommentModal } from "@/actions";


export const POST = async (req: NextRequest) => {
 try{
    console.log('\t\t\t\t----------WebHook----Triggered--------\n\n')
    const parsedBody = await req.json();
    const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_TOKEN
    })
    const pull_req = (parsedBody as any)?.pull_request;
    const repo = (parsedBody as any)?.repository;
    if(pull_req?.diff_url && pull_req?.patch_url && pull_req?.state){
    const chatbody= await CommentModal(pull_req?.diff_url,pull_req?.patch_url,pull_req?.state)
    console.log("\t\t\t\t---------MODEL------RESPONSE---------\n\n", chatbody)
    const {data:data} =  await octokit.rest.issues.createComment({
      owner:repo?.owner?.login,
      repo:repo?.name,
      issue_number:pull_req?.number,
      body: chatbody,
    })
    return new NextResponse(
      JSON.stringify({
        data: data
      }),
      {
        status: 200,
      }
    );
  }else{
    throw new Error('Something went wrong')
  }
 }
 catch(e: any){
   return new NextResponse(e?.message,{
    status:500
   })
 }
};



export const GET = async ()=>{
  try
  { const token = cookies().get('auth-x-token')?.value;
   const octokit = new Octokit({
    auth: token
  })
   const { data: data } = await octokit.repos.listForAuthenticatedUser({
    visibility: 'all',
    affiliation: 'owner',
    per_page: 100, 
    sort:"created"
  });
  return new NextResponse(JSON.stringify({
    data:data
  }),{
    status:200
  })}
  catch(error: any){
    return new NextResponse(JSON.stringify({
      data:error?.message
    }),{
      status:500
    })
  }
 }