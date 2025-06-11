import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Remove liquidity from Dexlyn
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the first token
 * @param mintY MoveStructId of the second token
 * @param lpAmount Amount of Liquidity Provider tokens to remove
 * @param minMintX Minimum amount of first token to receive (default 0)
 * @param minMintY Minimum amount of second token to receive (default 0)
 * @returns Transaction signature
 */
export async function removeLiquidity(
  agent: AgentRuntime,
  mintX: string,
  mintY: string,
  lpAmount: number,
  minMintX = 0,
  minMintY = 0
): Promise<string> {
  try {
    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "router",
      "remove_liquidity",
      [
        new TxnBuilderTypes.TypeTagParser(mintX).parseTypeTag(),
        new TxnBuilderTypes.TypeTagParser(mintY).parseTypeTag(),
        new TxnBuilderTypes.TypeTagParser(
          "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8::curves::Uncorrelated"
        ).parseTypeTag(),
      ],
      [
        BCS.bcsSerializeUint64(lpAmount),
        BCS.bcsSerializeUint64(minMintX),
        BCS.bcsSerializeUint64(minMintY),
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
      console.error(txn, "Remove liquidity failed");
      throw new Error("Remove liquidity failed");
    }

    return txn.txHash;
  } catch (error: any) {
    throw new Error(`Remove liquidity failed: ${error.message}`);
  }
}
