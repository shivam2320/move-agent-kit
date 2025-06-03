import { AgentRuntime, LocalSigner } from "../../src";
import { SupraAccount, SupraClient } from "supra-l1-sdk";

export const main = async () => {
  const supra = new SupraClient("https://rpc-mainnet.supra.com/", 6);

  // Validate and get private key from environment
  const privateKeyStr = process.env.SUPRA_PRIVATE_KEY;
  if (!privateKeyStr) {
    throw new Error("Missing SUPRA_PRIVATE_KEY environment variable");
  }

  const account = new SupraAccount(
    Uint8Array.from(Buffer.from(privateKeyStr, "hex"))
  );

  const signer = new LocalSigner(account);
  const agentRuntime = new AgentRuntime(signer, supra);

  const balance = await agentRuntime.getBalance();

  console.log(balance);
};

main()
  .then((x) => console.log(x))
  .catch((e) => console.log("error", e));
