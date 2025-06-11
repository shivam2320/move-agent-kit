import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Lend SUPRA, tokens or fungible asset to a position
 * @param agent MoveAgentKit instance
 * @param amount Amount to mint
 * @param mint The Move struct ID of the token to lend
 * @param positionId The position ID to lend to
 * @param newPosition Whether to create a new position or not
 * @param fungibleAsset Whether the token is a fungible asset
 * @returns Transaction signature and position ID
 * @example
 * ```ts
 * const transactionHash = await lendToken(agent, amount, SUPRA_COIN, positionId, false); // For SUPRA
 * const otherTransactionHash = await lendToken(agent, amount, OTHER_TOKEN, positionId, false); // For another token
 * const fungibleAssetTransactionHash = await lendToken(agent, amount, SUPRA_COIN, positionId, false, fungibleAssetAddress); // For fungible asset
 */
export async function lendToken(
  agent: AgentRuntime,
  amount: number,
  mint: string,
  positionId: string,
  newPosition: boolean,
  fungibleAsset: boolean
): Promise<{ hash: string; positionId: string }> {
  try {
    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      fungibleAsset ? "lend_fa" : "lend",
      fungibleAsset ? [] : [mint as unknown as TxnBuilderTypes.TypeTag],
      fungibleAsset
        ? [
            BCS.bcsSerializeStr(positionId),
            BCS.bcsSerializeStr(mint.toString()),
            BCS.bcsSerializeUint64(newPosition ? 1 : 0),
            BCS.bcsSerializeUint64(amount),
          ]
        : [
            BCS.bcsSerializeStr(positionId),
            BCS.bcsSerializeUint64(amount),
            BCS.bcsSerializeUint64(newPosition ? 1 : 0),
          ]
    );

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      transaction,
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Token lend failed");
      throw new Error("Token lend failed");
    }

    return {
      hash: txn.txHash,
      positionId,
    };
  } catch (error: any) {
    throw new Error(`Token lend failed: ${error.message}`);
  }
}
