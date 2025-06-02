import type { MoveStructId } from "@aptos-labs/ts-sdk";
import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Get pool details in joule
 * @param agent MoveAgentKit instance
 * @param mint MoveStructId of the token
 * @returns Pool details data
 */
export async function getPoolDetail(
  agent: AgentRuntime,
  mint: string
): Promise<any> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      "get_pool_detail",
      [mint as unknown as TxnBuilderTypes.TypeTag],
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
      console.error(txn, "Get pool detail failed");
      throw new Error("Get pool detail failed");
    }

    return txn.result;
  } catch (error: any) {
    throw new Error(`Get pool detail failed: ${error.message}`);
  }
}
