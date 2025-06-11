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
    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "router",
      "register_pool",
      [
        new TxnBuilderTypes.TypeTagParser(mintX).parseTypeTag(),
        new TxnBuilderTypes.TypeTagParser(mintY).parseTypeTag(),
        new TxnBuilderTypes.TypeTagParser(
          "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8::curves::Uncorrelated"
        ).parseTypeTag(),
      ],
      []
    );

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      transaction,
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
