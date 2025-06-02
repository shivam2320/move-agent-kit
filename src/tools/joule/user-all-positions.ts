import type { MoveStructId } from "@aptos-labs/ts-sdk";
import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Get all user positions in joule
 * @param agent MoveAgentKit instance
 * @returns All user positions data
 */
export async function getAllUserPositions(agent: AgentRuntime): Promise<any> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      "get_all_user_positions",
      [],
      []
    );

    let rawTransactionSerializer = new BCS.Serializer();
    transaction.serialize(rawTransactionSerializer);

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      rawTransactionSerializer.getBytes(),
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Get all user positions failed");
      throw new Error("Get all user positions failed");
    }

    return txn.result;
  } catch (error: any) {
    throw new Error(`Get all user positions failed: ${error.message}`);
  }
}
