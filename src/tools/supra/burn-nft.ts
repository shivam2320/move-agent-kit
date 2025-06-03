import type { AgentRuntime } from "../../agent";
import { HexString } from "supra-l1-sdk-core";

/**
 * Burn NFT
 * @param agent MoveAgentKit instance
 * @param mint NFT mint address
 * @returns Transaction signature
 */
export async function burnNFT(
  agent: AgentRuntime,
  mint: HexString
): Promise<string> {
  return "";
  //  try {
  //    const transaction = await agent.supra.burnDigitalAssetTransaction({
  //      creator: agent.account.getAccount(),
  //      digitalAssetAddress: mint,
  //    });

  //    const committedTransactionHash = await agent.account.sendTransaction(transaction);

  //    const signedTransaction = await agent.supra.waitForTransaction({
  //      transactionHash: committedTransactionHash,
  //    });

  //    if (!signedTransaction.success) {
  //      console.error(signedTransaction, "NFT burn failed");
  //      throw new Error("NFT burn failed");
  //    }

  //    return signedTransaction.hash;
  //  } catch (error: any) {
  //    throw new Error(`NFT burn failed: ${error.message}`);
  //  }
}
