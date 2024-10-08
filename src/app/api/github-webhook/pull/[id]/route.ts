/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from '@octokit/rest';
import { cookies } from "next/headers";



export const GET = async (req:NextRequest, { params }: { params: { id: string } })=>{
try
{   const { id } = params;
   const var_data = id.split('66');
   const token = cookies().get('auth-x-token')?.value;
   const octokit = new Octokit({
    auth: token
  })
  const { data: data } = await octokit.rest.pulls.list({
    owner: var_data[0]??'',
    repo: var_data[1]??'',
    state:'all',
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