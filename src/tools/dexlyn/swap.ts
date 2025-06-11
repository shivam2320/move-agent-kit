import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Swap tokens in Dexlyn
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the token to swap from
 * @param mintY MoveStructId of the token to swap to
 * @param swapAmount Amount of tokens to swap
 * @param minCoinOut Minimum amount of tokens to receive (default 0)
 * @returns Transaction signature
 */
export async function swap(
  agent: AgentRuntime,
  mintX: string,
  mintY: string,
  swapAmount: number,
  minCoinOut = 0
): Promise<string> {
  try {
    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "router",
      "swap_exact_coin_for_coin",
      [
        new TxnBuilderTypes.TypeTagParser(mintX).parseTypeTag(),
        new TxnBuilderTypes.TypeTagParser(mintY).parseTypeTag(),
        new TxnBuilderTypes.TypeTagParser(
          "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8::curves::Uncorrelated"
        ).parseTypeTag(),
      ],
      [BCS.bcsSerializeUint64(swapAmount), BCS.bcsSerializeUint64(minCoinOut)]
    );

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      transaction,
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Swap failed");
      throw new Error("Swap failed");
    }

    return txn.txHash;
  } catch (error: any) {
    throw new Error(`Swap failed: ${error.message}`);
  }
}
