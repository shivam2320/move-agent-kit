import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Repay SUPRA, tokens or fungible asset from a position
 * @param agent MoveAgentKit instance
 * @param amount Amount to mint
 * @param mint The Move struct ID of the token to repay
 * @param positionId The position ID to repay
 * @param fungibleAssetAddress The address of the fungible asset if the token is fungible (optional)
 * @returns Transaction signature and position ID
 * @example
 * ```ts
 * const transactionHash = await repayToken(agent, amount, SUPRA_COIN, positionId); // For SUPRA
 * const otherTransactionHash = await repayToken(agent, amount, OTHER_TOKEN, positionId); // For another token
 * const fungibleAssetTransactionHash = await repayToken(agent, amount, SUPRA_COIN, positionId, fungibleAssetAddress); // For fungible asset
 */
export async function repayToken(
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
    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      fungibleAsset ? "repay_fa" : "repay",
      [mint as unknown as TxnBuilderTypes.TypeTag],
      fungibleAsset
        ? [
            BCS.bcsSerializeStr(positionId),
            BCS.bcsSerializeStr(mint),
            BCS.bcsSerializeUint64(amount),
          ]
        : [BCS.bcsSerializeStr(positionId), BCS.bcsSerializeUint64(amount)]
    );

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      transaction,
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Token repay failed");
      throw new Error("Token repay failed");
    }

    return {
      hash: txn.txHash,
      positionId,
    };
  } catch (error: any) {
    throw new Error(`Token repay failed: ${error.message}`);
  }
}
