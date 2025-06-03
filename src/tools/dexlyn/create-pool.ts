import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Create a new pool in Dexlyn
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the first token
 * @param mintY MoveStructId of the second token
 * @returns Transaction signature
 */
export async function createPool(
  agent: AgentRuntime,
  mintX: string,
  mintY: string
): Promise<string> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "router",
      "register_pool",
      [
        mintX as unknown as TxnBuilderTypes.TypeTag,
        mintY as unknown as TxnBuilderTypes.TypeTag,
        "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8::curves::Uncorrelated" as unknown as TxnBuilderTypes.TypeTag,
      ],
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
      console.error(txn, "Create pool failed");
      throw new Error("Create pool failed");
    }

    return txn.txHash;
  } catch (error: any) {
    throw new Error(`Create pool failed: ${error.message}`);
  }
}
