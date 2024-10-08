import axios from "axios"
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


const base_url = 'http://localhost:3000/api'


export const getRepos = async () => {
    try {
      const data = await axios.get(`${base_url}/github-webhook`, {
        withCredentials: true,
      });
      return data?.data;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      return [];
    }
  };

  
  export const getPulls = async (id: string) => {
    try {
      const data = await axios.get(`${base_url}/github-webhook/pull/${id}`, {
        withCredentials: true,
      });
      return data?.data;
    } catch (error) {
      console.error(`Error fetching pull requests for repo ${id}:`, error);
      return [];
    }
  };
  
  export const getWebhooks = async (id: string) => {
    try {
      const data = await axios.get(`${base_url}/github-webhook/webhook/${id}`, {
        withCredentials: true,
      });
  
      if (data?.status === 200) return data?.data;

      return [];
    } catch (error) {
      console.error(`Error fetching webhooks for repo ${id}:`, error);
      return [];
    }
  };
  
  export const createWebHook = async (name:string,url: string, id: string) => {
    try {
      const data = await axios.post(
        `${base_url}/github-webhook/webhook/${id}`,
        {
          name,
          url,
        },
        {
            headers: {
                'Content-Type': 'application/json',
              },
          withCredentials: true,
        }
      );
      return data?.data;
    } catch {
      return [];
    }
  };


export const CommentModal = async (diff_url: string, patch_url: string, status: string) => {
    try {
        const chatModel = new ChatOpenAI({
            model: "gpt-3.5-turbo",
            temperature: 0.6,
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Fetching diff and patch data
        const diffResponse = await axios.get(diff_url);
        const patchResponse = await axios.get(patch_url);

        const diff_data = diffResponse?.data;
        const patch_data = patchResponse?.data;

        console.log("\t\t\t\t------------MODEL------PROCESSING------DATA------------\n\n");
        // Create user and system prompts
        const userPrompt = `Please write a short comment for the pull request using the following data:
        - Diff Data: ${diff_data}
        - Patch Data: ${patch_data}
        - Pull Request Status: ${status}`;

        const systemPrompt = `
        You are a GitHub Pull Request reviewer. Based on the provided Diff and Patch Data, 
        extract relevant information to comment on the pull request. 
        If the status is "open", write the comment in an encouraging and welcoming tone. 
        If the status is "closed", write the comment in a reflective and concluding tone.`;
        const prompt = ChatPromptTemplate.fromMessages([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ]);
        const outputParser = new StringOutputParser();
        const llmChain = prompt.pipe(chatModel).pipe(outputParser);
        
        const data = await llmChain.invoke({
            input: {
                diff_data: diff_data,
                patch_data: patch_data,
                status: status,
            },
        });
        return data;
    } catch (error) {
        console.error("Error in CommentModal:", error);
        throw new Error("Failed to generate comment for pull request.");
    }
}