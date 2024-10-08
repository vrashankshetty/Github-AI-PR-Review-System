/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from '@octokit/rest';
// import { cookies } from "next/headers";


export const GET = async (req:NextRequest, { params }: { params: { id: string } })=>{
  try{
    const { id } = params;
    const var_data = id.split('66');
    const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_TOKEN
   })
   const { data: data } = await octokit.repos.listWebhooks({
     owner: var_data[0]??'',
     repo: var_data[1]??'',
   });
   return new NextResponse(JSON.stringify({
     data:data
   }),{
     status:200
   })
  }
  catch (error: any) {
    return new NextResponse(JSON.stringify({
      data:error?.message
    }),{
      status:500
    })
  }
}

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
       const { id } = params;
       const body: any = await req.json();
       const var_data = id.split('66');
       const octokit = new Octokit({
        auth: process.env.GITHUB_PERSONAL_TOKEN
      })
        const owner = var_data[0]; 
        const repo = var_data[1];      
        const webhookConfig = {
          owner: owner,
          repo: repo,
          name:body?.name,
          config: {
            url: body?.url,  
            content_type: 'json',                           
            insecure_ssl: '0',                       
          },
          events: ['pull_request'],          
          active: true,                            
        };
        const response = await octokit.repos.createWebhook(webhookConfig);
        console.log('Webhook created successfully:', response?.data);
        return new NextResponse(JSON.stringify({
          data:response?.data
        }),{
          status:201
        })
      } catch (error: any) {
        console.log("error",error)
        return new NextResponse(JSON.stringify({
          data:error?.message
        }),{
          status:500
        })
      }
};
