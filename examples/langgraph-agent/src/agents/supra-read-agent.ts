import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  SupraAccountAddressTool,
  SupraBalanceTool,
  SupraGetTokenDetailTool,
  SupraGetTokenPriceTool,
  SupraTransactionTool,
  JouleGetPoolDetails,
} from "move-agent-kit";
import { setupAgentKit } from "../agent";
import { StateAnnotation } from "../state";

export const createSupraReadAgent = async () => {
  const { agentRuntime, llm } = await setupAgentKit();

  const readAgentTools = [
    new SupraBalanceTool(agentRuntime),
    new SupraGetTokenDetailTool(agentRuntime),
    new SupraAccountAddressTool(agentRuntime),
    new SupraTransactionTool(agentRuntime),
    new SupraGetTokenPriceTool(agentRuntime),
    new JouleGetPoolDetails(agentRuntime),
  ];

  const readAgent = createReactAgent({
    tools: readAgentTools,
    llm: llm,
  });

  return readAgent;
};

export const supraReadNode = async (state: typeof StateAnnotation.State) => {
  const { messages } = state;

  const readAgent = await createSupraReadAgent();

  const result = await readAgent.invoke({ messages });

  return {
    messages: [...result.messages],
  };
};
