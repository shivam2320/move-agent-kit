import type { AgentRuntime } from "../../agent";
import { HexString } from "supra-l1-sdk-core";

/**
 * Transfer NFT
 * @param agent MoveAgentKit instance
 * @param to Recipient's public key
 * @param mint NFT mint address
 * @returns Transaction signature
 */
export async function transferNFT(
  agent: AgentRuntime, // Replace with the actual type of the move-agent
  to: HexString,
  mint: HexString
): Promise<string> {
  return "";
  //  try {
  //    const transaction = await agent.supra.transferDigitalAssetTransaction({
  //      sender: agent.account.getAccount(),
  //      digitalAssetAddress: mint,
  //      recipient: to,
  //    });

  //    const committedTransaction = await agent.supra.signAndSubmitTransaction({
  //      signer: agent.account.getAccount(),
  //      transaction,
  //    });

  //    const signedTransaction = await agent.supra.waitForTransaction({
  //      transactionHash: committedTransaction.hash,
  //    });

  //    if (!signedTransaction.success) {
  //      console.error(signedTransaction, "NFT transfer failed");
  //      throw new Error("NFT transfer failed");
  //    }

  //    return signedTransaction.hash;
  //  } catch (error: any) {
  //    throw new Error(`NFT transfer failed: ${error.message}`);
  //  }
}
