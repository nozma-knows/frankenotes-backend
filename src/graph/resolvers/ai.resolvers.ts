import { QueryResolvers } from "./../../__generated__/resolvers-types";
import { OpenAI } from "langchain/llms";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

export const aiQueryResolvers: QueryResolvers = {
  chatBotResponse: async (parents: any, args: { query: string }) => {
    const { query } = args;

    if (!query) {
      throw new Error("Required parameter is missing.");
    }

    // Initalize the wrapper
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.9,
    });

    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: model, memory: memory });

    try {
      const result = await chain.call({ input: prompt });
      return result;
    } catch (error) {
      throw new Error("Issue grabbing response.");
    }
  },
};
