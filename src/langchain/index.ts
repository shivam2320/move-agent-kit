import type { AgentRuntime } from "../agent";
import { SupraAccountAddressTool } from "./account";
import {
  SupraBalanceTool,
  SupraBurnTokenTool,
  SupraCreateTokenTool,
  SupraGetTokenPriceTool,
  SupraMintTokenTool,
  SupraTransactionTool,
  SupraTransferTokenTool,
} from "./supra";
import {
  JouleBorrowTokenTool,
  JouleClaimRewardTool,
  JouleGetPoolDetails,
  JouleGetUserAllPositions,
  JouleGetUserPosition,
  JouleLendTokenTool,
  JouleRepayTokenTool,
  JouleWithdrawTokenTool,
} from "./joule";
import {
  DexlynAddLiquidityTool,
  DexlynCreatePoolTool,
  DexlynRemoveLiquidityTool,
  DexlynSwapTool,
} from "./dexlyn";

import type { ToolsNameList } from "../types";
import { OpenAICreateImageTool } from "./openai";

export const createSupraTools = (
  agent: AgentRuntime,
  config: { filter?: ToolsNameList[] } = {}
) => {
  const tools = [
    // Supra tools
    new SupraBalanceTool(agent),
    new SupraAccountAddressTool(agent),
    new SupraTransferTokenTool(agent),
    // new SupraBurnNFTTool(agent),
    new SupraBurnTokenTool(agent),
    // new SupraTransferNFTTool(agent),
    new SupraTransactionTool(agent),
    new SupraMintTokenTool(agent),
    new SupraCreateTokenTool(agent),
    new SupraGetTokenPriceTool(agent),
    // Joule tools
    new JouleLendTokenTool(agent),
    new JouleWithdrawTokenTool(agent),
    new JouleBorrowTokenTool(agent),
    new JouleRepayTokenTool(agent),
    new JouleGetPoolDetails(agent),
    new JouleGetUserPosition(agent),
    new JouleGetUserAllPositions(agent),
    new JouleClaimRewardTool(agent),
    // Dexlyn tools
    new DexlynCreatePoolTool(agent),
    new DexlynAddLiquidityTool(agent),
    new DexlynRemoveLiquidityTool(agent),
    new DexlynSwapTool(agent),
    // OpenAI tools
    new OpenAICreateImageTool(agent),
  ];

  return config.filter
    ? tools.filter((tool) =>
        config?.filter?.includes(tool.name as ToolsNameList)
      )
    : tools;
};

export * from "./account";
export * from "./supra";
export * from "./joule";
export * from "./dexlyn";
export * from "./openai";
