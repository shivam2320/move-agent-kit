import type { MoveStructId } from "@aptos-labs/ts-sdk";
import type { AgentRuntime } from "../../agent";
import { BCS, HexString, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Get user position in joule
 * @param agent MoveAgentKit instance
 * @param mint MoveStructId of the token
 * @returns User position data
 */
export async function getUserPosition(
  agent: AgentRuntime,
  userAddress: HexString,
  positionId: string
): Promise<any> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      "get_user_position",
      [],
      [
        BCS.bcsSerializeStr(userAddress.toString()),
        BCS.bcsSerializeStr(positionId),
      ]
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
      console.error(txn, "Get user position failed");
      throw new Error("Get user position failed");
    }

    return txn.result;
  } catch (error: any) {
    throw new Error(`Get user position failed: ${error.message}`);
  }
}
