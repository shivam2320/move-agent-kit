import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Add liquidity in Dexlyn
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the first token
 * @param mintY MoveStructId of the second token
 * @param mintXAmount Amount of the first token to add
 * @param mintYAmount Amount of the second token to add
 * @returns Transaction signature
 */
export async function addLiquidity(
  agent: AgentRuntime,
  mintX: string,
  mintY: string,
  mintXAmount: number,
  mintYAmount: number
): Promise<string> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "router",
      "add_liquidity",
      [
        mintX as unknown as TxnBuilderTypes.TypeTag,
        mintY as unknown as TxnBuilderTypes.TypeTag,
        "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8::curves::Uncorrelated" as unknown as TxnBuilderTypes.TypeTag,
      ],
      [
        BCS.bcsSerializeUint64(mintXAmount),
        BCS.bcsSerializeUint64(0), //coin_x_min,
        BCS.bcsSerializeUint64(mintYAmount),
        BCS.bcsSerializeUint64(0), // coin_y_min,
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
      console.error(txn, "Add liquidity failed");
      throw new Error("Add liquidity failed");
    }

    return txn.txHash;
  } catch (error: any) {
    throw new Error(`Add liquidity failed: ${error.message}`);
  }
}
