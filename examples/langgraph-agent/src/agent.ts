import { ChatAnthropic } from "@langchain/anthropic";
import { config } from "dotenv";
import { AgentRuntime, LocalSigner } from "move-agent-kit";
import { SupraAccount, SupraClient } from "supra-l1-sdk";
config();

export const llm = new ChatAnthropic({
  model: "claude-3-5-sonnet-latest",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

export const setupAgentKit = async () => {
  const supra = new SupraClient("https://rpc-mainnet.supra.com/", 8);

  const privateKeyStr = process.env.SUPRA_PRIVATE_KEY;
  if (!privateKeyStr) {
    throw new Error("Missing SUPRA_PRIVATE_KEY environment variable");
  }

  const account = new SupraAccount(
    Uint8Array.from(Buffer.from(privateKeyStr, "hex"))
  );
  const signer = new LocalSigner(account, supra);
  const agentRuntime = new AgentRuntime(signer, supra);

  return {
    agentRuntime,
    llm,
  };
};
