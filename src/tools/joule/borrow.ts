import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Borrow SUPRA, tokens or fungible asset from a position
 * @param agent MoveAgentKit instance
 * @param amount Amount to mint
 * @param mint The Move struct ID of the token to borrow
 * @param positionId The position ID to borrow from
 * @param fungibleAsset boolean value for fungible asset
 * @returns Transaction signature and position ID
 * @example
 * ```ts
 * const transactionHash = await borrowToken(agent, amount, SUPRA_COIN, positionId); // For SUPRA
 * const otherTransactionHash = await borrowToken(agent, amount, OTHER_TOKEN, positionId); // For another token
 * const fungibleAssetTransactionHash = await borrowToken(agent, amount, SUPRA_COIN, positionId, fungibleAssetAddress); // For fungible asset
 */
export async function borrowToken(
  agent: AgentRuntime,
  amount: number,
  mint: string,
  positionId: string,
  fungibleAsset: boolean
): Promise<{
  hash: string;
  positionId: string;
}> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      fungibleAsset ? "borrow_fa" : "borrow",
      [mint as unknown as TxnBuilderTypes.TypeTag],
      fungibleAsset
        ? [
            BCS.bcsSerializeStr(positionId),
            BCS.bcsSerializeStr(mint.toString()),
            BCS.bcsSerializeUint64(amount),
          ]
        : [BCS.bcsSerializeStr(positionId), BCS.bcsSerializeUint64(amount)]
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
      console.error(txn, "Token borrow failed");
      throw new Error("Token borrow failed");
    }

    return {
      hash: txn.txHash,
      positionId,
    };
  } catch (error: any) {
    throw new Error(`Token borrow failed: ${error.message}`);
  }
}
