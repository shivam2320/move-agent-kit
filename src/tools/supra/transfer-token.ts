import { BCS, HexString, TxnBuilderTypes } from "supra-l1-sdk-core";
import type { AgentRuntime } from "../../agent";
import { TypeTag } from "@aptos-labs/ts-sdk";

/**
 * Transfer APT, tokens or fungible asset to a recipient
 * @param agent MoveAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Move struct ID or address of the token / fungible asset to transfer
 * @returns Transaction signature
 * @example
 * ```ts
 * const transactionHash = await transferTokens(agent, recipientAddress, amount, SUPRA_COIN); // For APT
 * const otherTransactionHash = await transferTokens(agent, recipientAddress, amount, OTHER_TOKEN); // For another token
 * const fungibleAssetTransactionHash = await transferTokens(agent, recipientAddress, amount, fungibleAssetAddress); // For fungible asset
 * ```
 */
export async function transferTokens(
  agent: AgentRuntime,
  to: HexString,
  amount: number,
  mint: string
): Promise<string> {
  try {
    const isCoin = mint.split("::").length === 3;

    console.log("is coin", isCoin);
    console.log("Addr", agent.account.getAddress().toString());
    console.log("mint", mint);
    console.log("amount", amount);

    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      isCoin ? "coin" : "primary_fungible_store",
      "transfer",
      isCoin ? [new TxnBuilderTypes.TypeTagParser(mint).parseTypeTag()] : [],
      isCoin
        ? [to.toUint8Array(), BCS.bcsSerializeUint64(amount)]
        : [
            BCS.bcsSerializeStr(mint),
            BCS.bcsSerializeStr(to.toString()),
            BCS.bcsSerializeUint64(amount),
          ]
    );

    console.log("transaction", transaction);

    // let rawTransactionSerializer = new BCS.Serializer();
    // transaction.serialize(rawTransactionSerializer);

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      transaction,
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Token transfer failed");
      throw new Error("Token transfer failed");
    }

    return txn.txHash;
  } catch (error: any) {
    console.log("error", error);
    console.log("error", error.response);
    throw new Error(`Token transfer failed: ${error.message}`);
  }
}
