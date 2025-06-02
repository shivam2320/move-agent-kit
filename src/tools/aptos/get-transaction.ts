import type { TransactionResponse } from "@aptos-labs/ts-sdk";
import type { AgentRuntime } from "../../agent";
import { TransactionDetail } from "supra-l1-sdk";

/**
 * Fetches transaction from aptos
 * @param agent MoveAgentKit instance
 * @param hash Transaction Hash
 * @returns Transaction signature
 * @example
 * ```ts
 * const transaction = await getTransaction(agent, "HASH")
 * ```
 */
export async function getTransaction(
  agent: AgentRuntime,
  hash: string
): Promise<TransactionDetail> {
  try {
    const transaction = await agent.supra.getTransactionDetail(
      agent.account.getAddress(),
      hash
    );

    return transaction as TransactionDetail;
  } catch (error: any) {
    throw new Error(`Token transfer failed: ${error.message}`);
  }
}
