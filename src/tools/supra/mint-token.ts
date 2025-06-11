import { BCS, HexString, SupraClient } from "supra-l1-sdk";
import type { AgentRuntime } from "../../agent";

/**
 * Burn fungible asset token
 * @param agent MoveAgentKit instance
 * @param amount Amount to burn
 * @param mint Fungible asset address to burn
 * @returns Transaction signature
 */
export async function mintToken(
  agent: AgentRuntime,
  to: HexString,
  mint: string,
  amount: number
): Promise<string> {
  try {
    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x67c8564aee3799e9ac669553fdef3a3828d4626f24786b6a5642152fa09469dd",
      "launchpad",
      "mint_to_address",
      [],
      [
        to.toUint8Array(),
        BCS.bcsSerializeStr(mint),
        BCS.bcsSerializeUint64(amount),
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
      console.error(txn, "Token mint failed");
      throw new Error("Token mint failed");
    }

    return txn.txHash;
  } catch (error: any) {
    throw new Error(`Token mint failed: ${error.message}`);
  }
}
